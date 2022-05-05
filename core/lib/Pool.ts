import Log from '@ulixee/commons/lib/Logger';
import { MitmProxy } from '@secret-agent/mitm';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import IBrowserEngine from '@unblocked/emulator-spec/IBrowserEngine';
import { CanceledPromiseError } from '@ulixee/commons/interfaces/IPendingWaitEvent';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import env from '../env';
import DevtoolsPreferences from './DevtoolsPreferences';
import Queue from '@ulixee/commons/lib/Queue';
import ICertificateGenerator, {
  ICertificateStore,
} from '@secret-agent/mitm/interfaces/ICertificateGenerator';
import Agent, { IAgentCreateOptions } from './Agent';
import { IBoundLog } from '@ulixee/commons/interfaces/ILog';
import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import Browser from './Browser';
import IResolvablePromise from '@ulixee/commons/interfaces/IResolvablePromise';
import IBrowserLaunchArgs from '@unblocked/emulator-spec/IBrowserLaunchArgs';
import { IHooksProvider } from '@unblocked/emulator-spec/IHooks';

const { log } = Log(module);

interface ICreatePoolOptions {
  maxConcurrentAgents?: number;
  certificateStore?: ICertificateStore;
  defaultBrowserEngine?: IBrowserEngine;
  dataDir?: string;
  logger?: IBoundLog;
}

export default class Pool extends TypedEventEmitter<{
  'agent-created': { agent: Agent };
  'browser-launched': { browser: Browser };
  'browser-has-no-open-windows': { browser: Browser };
  'all-browsers-closed': void;
}> {
  public get hasAvailability(): boolean {
    return this.activeAgentsCount < this.maxConcurrentAgents;
  }

  public get activeAgentsCount(): number {
    return this.#activeAgentsCount;
  }

  public maxConcurrentAgents = 10;
  public readonly browsersById = new Map<string, Browser>();
  public readonly agentsById = new Map<string, Agent>();
  public sharedMitmProxy: MitmProxy;

  #activeAgentsCount = 0;
  #waitingForAvailability: {
    options: IAgentCreateOptions;
    promise: IResolvablePromise<Agent>;
  }[] = [];

  private isClosing: Resolvable<void>;
  private mitmStartPromise: Promise<MitmProxy>;

  private browserCreationQueue = new Queue(`BROWSER_CREATION_Q`, 1);
  private events = new EventSubscriber();
  private certificateGenerator: ICertificateGenerator;

  constructor(readonly options: ICreatePoolOptions = {}) {
    super();
    this.maxConcurrentAgents = options.maxConcurrentAgents ?? 10;
    this.logger = options.logger?.createChild(module) ?? log.createChild(module, {});
  }

  public async start(): Promise<void> {
    if (this.isClosing) await this.isClosing;
    this.isClosing = null;
    this.logger.info('Pool.start');
    await this.startSharedMitm();
  }

  public createAgent(options?: IAgentCreateOptions): Promise<Agent> {
    options ??= {};
    options.browserEngine ??= this.options.defaultBrowserEngine;

    if (!options.browserEngine)
      throw new Error('A browserEngine is required create a new Agent instance.');

    this.logger.info('Pool.createAgent', {
      maxConcurrentAgents: this.maxConcurrentAgents,
      activeAgentsCount: this.activeAgentsCount,
      waitingForAvailability: this.#waitingForAvailability.length,
    });

    if (!this.hasAvailability) {
      const resolvablePromise = new Resolvable<Agent>();
      this.#waitingForAvailability.push({
        options,
        promise: resolvablePromise,
      });
      return resolvablePromise.promise;
    }
    return this.createAgentNow(options);
  }

  public async createMitmProxy(): Promise<MitmProxy> {
    if (!this.certificateGenerator) {
      this.certificateGenerator = MitmProxy.createCertificateGenerator(
        this.options.certificateStore,
        this.options.dataDir,
      );
    }
    return await MitmProxy.start(this.certificateGenerator);
  }

  public async getBrowser(
    engine: IBrowserEngine,
    hooks: IHooksProvider,
    launchArgs?: IBrowserLaunchArgs,
  ): Promise<Browser> {
    return await this.browserCreationQueue.run(async () => {
      if (!this.sharedMitmProxy) await this.start();

      launchArgs ??= {};
      launchArgs.proxyPort ??= this.sharedMitmProxy?.port;
      const browser = new Browser(engine, hooks, launchArgs);

      const existing = this.browserWithEngine(browser.engine);
      if (existing) return existing;

      this.browsersById.set(browser.id, browser);
      this.events.once(browser, 'close', this.onBrowserClosed.bind(this, browser.id));
      DevtoolsPreferences.install(browser);

      await browser.launch();
      this.emit('browser-launched', { browser });

      return browser;
    });
  }

  public async close(): Promise<void> {
    if (this.isClosing) return this.isClosing.promise;
    this.isClosing = new Resolvable<void>();
    try {
      const logId = log.stats('Pool.Closing', {
        sessionId: null,
        browsers: this.browsersById.size,
      });
      for (const { promise } of this.#waitingForAvailability) {
        promise.reject(new CanceledPromiseError('Agent pool shutting down'));
      }
      this.#waitingForAvailability.length = 0;
      this.browserCreationQueue.stop(new CanceledPromiseError('Browser pool shutting down'));

      const closePromises: Promise<Error | void>[] = [];

      for (const agent of this.agentsById.values()) {
        closePromises.push(agent.close().catch(err => err));
      }
      for (const browser of this.browsersById.values()) {
        closePromises.push(browser.close().catch(err => err));
      }
      this.browsersById.clear();

      if (this.certificateGenerator) this.certificateGenerator.close();

      if (this.mitmStartPromise) {
        this.mitmStartPromise.then(x => x.close()).catch(err => err);
        this.mitmStartPromise = null;
      }
      if (this.sharedMitmProxy) {
        this.sharedMitmProxy.close();
        this.sharedMitmProxy = null;
      }
      try {
        const errors = await Promise.all(closePromises);
        this.events.close();
        log.stats('Pool.Closed', {
          parentLogId: logId,
          sessionId: null,
          errors: errors.filter(Boolean),
        });
      } catch (error) {
        log.error('Error in Pool.Close', { parentLogId: logId, sessionId: null, error });
      }
    } finally {
      this.isClosing.resolve();
    }
  }

  protected async createAgentNow(options: IAgentCreateOptions): Promise<Agent> {
    this.#activeAgentsCount += 1;
    try {
      const agent = new Agent(options);
      this.agentsById.set(agent.id, agent);
      this.emit('agent-created', { agent });

      await agent.openInPool(this);
      this.events.on(
        agent.browserContext,
        'all-pages-closed',
        this.checkForInactiveBrowserEngine.bind(this, agent.browserContext.browser.id),
      );
      this.events.once(agent, 'close', this.onAgentClosed.bind(this, agent));
      return agent;
    } catch (err) {
      this.#activeAgentsCount -= 1;

      throw err;
    }
  }

  private onAgentClosed(agent: Agent): void {
    this.#activeAgentsCount -= 1;
    this.agentsById.delete(agent.id);

    this.logger.info('ReleasingChrome', {
      maxConcurrentAgents: this.maxConcurrentAgents,
      activeAgentsCount: this.activeAgentsCount,
      waitingForAvailability: this.#waitingForAvailability.length,
    });
    if (!this.#waitingForAvailability.length || !this.hasAvailability) {
      return;
    }
    const { options, promise } = this.#waitingForAvailability.shift();

    // NOTE: we want this to blow up if an exception occurs inside the promise
    // eslint-disable-next-line promise/catch-or-return, @typescript-eslint/no-floating-promises
    this.createAgentNow(options).then(session => promise.resolve(session));
  }

  private async startSharedMitm(): Promise<void> {
    if (this.sharedMitmProxy || env.disableMitm === true) return;
    if (this.mitmStartPromise) {
      await this.mitmStartPromise;
    } else {
      this.mitmStartPromise = this.createMitmProxy();
      this.certificateGenerator ??= MitmProxy.createCertificateGenerator(
        this.options.certificateStore,
        this.options.dataDir,
      );
      this.sharedMitmProxy = await this.mitmStartPromise;
    }
  }

  private async onBrowserClosed(browserId: string): Promise<void> {
    if (this.isClosing) return;
    for (const agent of this.agentsById.values()) {
      if (agent.browserContext?.browserId === browserId) await agent.close();
    }

    this.logger.info('BrowserEngine.closed', {
      engine: this.browsersById.get(browserId)?.engine,
      browserId,
    });
    this.browsersById.delete(browserId);
    if (this.browsersById.size === 0) {
      this.emit('all-browsers-closed');
    }
  }

  private checkForInactiveBrowserEngine(browserId: string): void {
    let hasWindows = false;
    for (const agent of this.agentsById.values()) {
      if (agent.browserContext?.browserId === browserId) {
        hasWindows = agent.browserContext.pagesById.size > 0;
        if (hasWindows) break;
      }
    }

    this.logger.info('Browser.allTabsClosed', {
      browserId,
      engineHasOtherOpenTabs: hasWindows,
    });
    if (hasWindows) return;

    const browser = this.browsersById.get(browserId);
    if (browser) {
      this.emit('browser-has-no-open-windows', { browser });
    }
  }

  private browserWithEngine(engine: IBrowserEngine): Browser {
    for (const existingBrowser of this.browsersById.values()) {
      if (existingBrowser.isEqualEngine(engine)) {
        return existingBrowser;
      }
    }
  }
}
