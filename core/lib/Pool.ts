import * as Fs from 'fs';
import * as Path from 'path';
import IResolvablePromise from '@secret-agent/interfaces/IResolvablePromise';
import { createPromise } from '@secret-agent/commons/utils';
import Log from '@secret-agent/commons/Logger';
import { MitmProxy } from '@secret-agent/mitm';
import ISessionCreateOptions from '@secret-agent/interfaces/ISessionCreateOptions';
import Puppet from '@secret-agent/puppet';
import * as Os from 'os';
import { TypedEventEmitter } from '@secret-agent/commons/eventUtils';
import IBrowserEngine from '@secret-agent/interfaces/IBrowserEngine';
import { CanceledPromiseError } from '@secret-agent/commons/interfaces/IPendingWaitEvent';
import IPuppetLaunchArgs from '@secret-agent/interfaces/IPuppetLaunchArgs';
import SessionsDb from '../dbs/SessionsDb';
import Session from './Session';
import DevtoolsPreferences from './DevtoolsPreferences';

const { log } = Log(module);
let sessionsDir = process.env.SA_SESSIONS_DIR || Path.join(Os.tmpdir(), '.secret-agent'); // transferred to GlobalPool below class definition
const disableMitm = Boolean(JSON.parse(process.env.SA_DISABLE_MITM ?? 'false'));

export default class GlobalPool {
  public static maxConcurrentAgentsCount = 10;
  public static localProxyPortStart = 0;
  public static get activeSessionCount() {
    return this._activeSessionCount;
  }

  public static get hasAvailability() {
    return this.activeSessionCount < GlobalPool.maxConcurrentAgentsCount;
  }

  public static events = new TypedEventEmitter<{
    'browser-has-no-open-windows': { puppet: Puppet };
    'all-browsers-closed': void;
  }>();

  private static isClosing = false;
  private static defaultLaunchArgs: IPuppetLaunchArgs;
  private static _activeSessionCount = 0;
  private static puppets: Puppet[] = [];
  private static mitmServer: MitmProxy;
  private static mitmStartPromise: Promise<MitmProxy>;
  private static waitingForAvailability: {
    options: ISessionCreateOptions;
    promise: IResolvablePromise<Session>;
  }[] = [];

  public static async start(): Promise<void> {
    this.isClosing = false;
    log.info('StartingGlobalPool', {
      sessionId: null,
    });
    await this.startMitm();
  }

  public static createSession(options: ISessionCreateOptions): Promise<Session> {
    log.info('AcquiringChrome', {
      sessionId: null,
      activeSessionCount: this.activeSessionCount,
      waitingForAvailability: this.waitingForAvailability.length,
      maxConcurrentAgentsCount: this.maxConcurrentAgentsCount,
    });

    if (!this.hasAvailability) {
      const resolvablePromise = createPromise<Session>();
      this.waitingForAvailability.push({ options, promise: resolvablePromise });
      return resolvablePromise.promise;
    }
    return this.createSessionNow(options);
  }

  public static close(): Promise<void> {
    if (this.isClosing) return Promise.resolve();
    this.isClosing = true;
    const logId = log.stats('GlobalPool.Closing');

    for (const { promise } of this.waitingForAvailability) {
      promise.reject(new CanceledPromiseError('Puppet pool shutting down'));
    }
    this.waitingForAvailability.length = 0;
    const closePromises: Promise<any>[] = [];
    while (this.puppets.length) {
      const puppetBrowser = this.puppets.shift();
      closePromises.push(puppetBrowser.close().catch(err => err));
    }
    MitmProxy.close();
    if (this.mitmServer) {
      this.mitmServer.close();
      this.mitmServer = null;
    }
    SessionsDb.shutdown();
    return Promise.all(closePromises)
      .then(() => {
        log.stats('GlobalPool.Closed', { parentLogId: logId, sessionId: null });
        return null;
      })
      .catch(error => {
        log.error('Error in GlobalPoolShutdown', { parentLogId: logId, sessionId: null, error });
      });
  }

  private static getPuppet(browserEngine: IBrowserEngine): Promise<Puppet> {
    const args = this.getPuppetLaunchArgs();
    const puppet = new Puppet(browserEngine, args);

    const existing = this.puppets.find(x =>
      this.isSameEngine(puppet.browserEngine, x.browserEngine),
    );
    if (existing) return Promise.resolve(existing);

    this.puppets.push(puppet);
    puppet.once('close', this.onEngineClosed.bind(this, browserEngine));
    const browserDir = browserEngine.executablePath.split(browserEngine.fullVersion).shift();

    const preferencesInterceptor = new DevtoolsPreferences(
      `${browserDir}/devtoolsPreferences.json`,
    );

    return puppet.start(preferencesInterceptor.installOnConnect);
  }

  private static async startMitm(): Promise<void> {
    if (this.mitmServer || disableMitm === true) return;
    if (this.mitmStartPromise) await this.mitmStartPromise;
    else {
      this.mitmStartPromise = MitmProxy.start(this.localProxyPortStart, this.sessionsDir);
      this.mitmServer = await this.mitmStartPromise;
    }
  }

  private static async createSessionNow(options: ISessionCreateOptions): Promise<Session> {
    await this.startMitm();

    this._activeSessionCount += 1;
    try {
      const session = new Session(options);

      const puppet = await this.getPuppet(session.browserEngine);

      if (disableMitm !== true) {
        await session.registerWithMitm(this.mitmServer, puppet.supportsBrowserContextProxy);
      }

      const browserContext = await puppet.newContext(
        session.plugins,
        log.createChild(module, {
          sessionId: session.id,
        }),
        session.getMitmProxy(),
      );
      await session.initialize(browserContext);

      session.on('all-tabs-closed', this.checkForInactiveBrowserEngine.bind(this, session));

      session.once('closing', this.releaseConnection.bind(this));
      return session;
    } catch (err) {
      this._activeSessionCount -= 1;

      throw err;
    }
  }

  private static async onEngineClosed(engine: IBrowserEngine): Promise<void> {
    if (this.isClosing) return;
    for (const session of Session.sessionsWithBrowserEngine(this.isSameEngine.bind(this, engine))) {
      await session.close();
    }
    log.info('PuppetEngine.closed', {
      engine,
      sessionId: null,
    });
    const idx = this.puppets.findIndex(x => this.isSameEngine(engine, x.browserEngine));
    if (idx >= 0) this.puppets.splice(idx, 1);
    if (this.puppets.length === 0) {
      this.events.emit('all-browsers-closed');
    }
  }

  private static checkForInactiveBrowserEngine(session: Session): void {
    const sessionsUsingEngine = Session.sessionsWithBrowserEngine(
      this.isSameEngine.bind(this, session.browserEngine),
    );
    const hasWindows = sessionsUsingEngine.some(x => x.tabsById.size > 0);

    log.info('Session.allTabsClosed', {
      sessionId: session.id,
      engineHasOtherOpenTabs: hasWindows,
    });
    if (hasWindows) return;

    const puppet = this.puppets.find(x =>
      this.isSameEngine(session.browserEngine, x.browserEngine),
    );

    if (puppet) {
      this.events.emit('browser-has-no-open-windows', { puppet });
    }
  }

  private static releaseConnection(): void {
    this._activeSessionCount -= 1;

    const wasTransferred = this.resolveWaitingConnection();
    if (wasTransferred) {
      log.info('ReleasingChrome', {
        sessionId: null,
        activeSessionCount: this.activeSessionCount,
        waitingForAvailability: this.waitingForAvailability.length,
      });
    }
  }

  private static resolveWaitingConnection(): boolean {
    if (!this.waitingForAvailability.length) {
      return false;
    }
    const { options, promise } = this.waitingForAvailability.shift();

    // NOTE: we want this to blow up if an exception occurs inside the promise
    // eslint-disable-next-line promise/catch-or-return
    this.createSessionNow(options).then(session => promise.resolve(session));

    log.info('TransferredChromeToWaitingAcquirer');
    return true;
  }

  private static getPuppetLaunchArgs(): IPuppetLaunchArgs {
    this.defaultLaunchArgs ??= {
      showBrowser: Boolean(
        JSON.parse(process.env.SA_SHOW_BROWSER ?? process.env.SHOW_BROWSER ?? 'false'),
      ),
      disableDevtools: Boolean(JSON.parse(process.env.SA_DISABLE_DEVTOOLS ?? 'true')),
      noChromeSandbox: Boolean(JSON.parse(process.env.SA_NO_CHROME_SANDBOX ?? 'false')),
      disableGpu: Boolean(JSON.parse(process.env.SA_DISABLE_GPU ?? 'false')),
      enableMitm: !disableMitm,
    };
    return {
      ...this.defaultLaunchArgs,
      proxyPort: this.mitmServer?.port,
    };
  }

  private static isSameEngine(engineA: IBrowserEngine, engineB: IBrowserEngine): boolean {
    return (
      engineA.executablePath === engineB.executablePath &&
      engineA.launchArguments.toString() === engineB.launchArguments.toString()
    );
  }

  public static get sessionsDir(): string {
    return sessionsDir;
  }

  public static set sessionsDir(dir: string) {
    const absoluteDir = Path.isAbsolute(dir) ? dir : Path.join(process.cwd(), dir);
    if (!Fs.existsSync(`${absoluteDir}`)) {
      Fs.mkdirSync(`${absoluteDir}`, { recursive: true });
    }
    sessionsDir = absoluteDir;
  }
}

GlobalPool.sessionsDir = sessionsDir;
