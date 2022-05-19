import '@ulixee/commons/lib/SourceMapSupport';
import { RequestSession } from '@unblocked-web/agent-mitm';
import BrowserContext from './BrowserContext';
import Log from '@ulixee/commons/lib/Logger';
import MitmProxy from '@unblocked-web/agent-mitm/lib/MitmProxy';
import { IBoundLog } from '@ulixee/commons/interfaces/ILog';
import env from '../env';
import IProxyConnectionOptions from '../interfaces/IProxyConnectionOptions';
import Pool from './Pool';
import Browser from './Browser';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import { nanoid } from 'nanoid';
import Page from './Page';
import { IHooksProvider } from '@unblocked-web/specifications/agent/hooks/IHooks';
import ICommandMarker from '../interfaces/ICommandMarker';
import IBrowserEngine from '@unblocked-web/specifications/agent/browser/IBrowserEngine';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import IEmulationProfile, {
  IEmulationOptions,
} from '@unblocked-web/specifications/plugin/IEmulationProfile';
import AgentPlugins from './AgentPlugins';
import { IAgentPluginClass } from '@unblocked-web/specifications/plugin/IAgentPlugin';

const { log } = Log(module);

export interface IAgentCreateOptions extends Omit<IEmulationProfile, keyof IEmulationOptions> {
  id?: string;
  agentPlugins?: IAgentPluginClass[];
  commandMarker?: ICommandMarker;
}

export default class Agent extends TypedEventEmitter<{ close: void }> {
  public readonly id: string;
  public browserContext: BrowserContext;
  public readonly mitmRequestSession: RequestSession;
  public readonly logger: IBoundLog;

  public get emulationProfile(): IEmulationProfile {
    return this.plugins.profile;
  }

  public get isIncognito(): boolean {
    return this.plugins.profile.options.disableIncognito !== true;
  }

  private isOpen: Resolvable<BrowserContext>;
  private readonly plugins: AgentPlugins;
  private isClosing: Resolvable<void>;
  private events = new EventSubscriber();
  private readonly enableMitm: boolean = true;
  private readonly closeBrowserOnClose: boolean = false;
  private isolatedMitm: MitmProxy;

  private get mitmProxyConnectionInfo(): IProxyConnectionOptions {
    if (!this.enableMitm) return null;
    if (this.isolatedMitm) {
      // don't use password for an isolated mitm proxy
      return { address: `localhost:${this.isolatedMitm.port}` };
    } else {
      return { address: null, password: this.id };
    }
  }

  constructor(private readonly options: IAgentCreateOptions = {}, readonly pool?: Pool) {
    super();
    this.id = options.id ?? nanoid();
    if (!this.pool) {
      this.pool = new Pool({ maxConcurrentAgents: 1 });
      this.events.once(this, 'close', () => this.pool.close());
      this.closeBrowserOnClose = true;
    }

    this.logger =
      options.logger?.createChild(module) ??
      log.createChild(module, {
        sessionId: this.id,
      });

    this.plugins = new AgentPlugins(options, options.agentPlugins);
    this.mitmRequestSession = new RequestSession(
      this.id,
      this.plugins,
      this.logger,
      this.plugins.profile.upstreamProxyUrl,
    );
    this.enableMitm = !env.disableMitm && !this.plugins.profile.options.disableMitm;

    this.logger.info('Agent created', {
      id: this.id,
      incognito: this.isIncognito,
      hasHooks: !!this.plugins.hasHooks,
      browserEngine: this.plugins.profile.browserEngine
        ? { fullVersion: this.plugins.profile.browserEngine.fullVersion }
        : 'unassigned',
    });
  }

  public async open(): Promise<BrowserContext> {
    if (this.isOpen) return this.isOpen.promise;
    this.isOpen = new Resolvable();
    try {
      if (!this.options.browserEngine)
        throw new Error('A browserEngine is required create a new Agent instance.');

      const pool = this.pool;
      await pool.waitForAvailability(this);
      const browser = await pool.getBrowser(
        this.options.browserEngine as IBrowserEngine,
        this.plugins,
        this.plugins.profile.options,
      );
      if (this.closeBrowserOnClose) {
        this.events.once(this, 'close', () => browser.close());
        this.events.once(browser, 'close', () => this.close());
      }

      if (this.enableMitm) {
        if (browser.supportsBrowserContextProxy && this.isIncognito) {
          const mitmProxy = await pool.createMitmProxy();
          this.isolatedMitm = mitmProxy;
          // register session will automatically close with the request session
          mitmProxy.registerSession(this.mitmRequestSession, true);
        } else {
          pool.sharedMitmProxy.registerSession(this.mitmRequestSession, false);
        }
      }

      this.logger.info('Agent Opening in Pool', {
        id: this.id,
        browserId: browser.id,
        mitmEnabled: this.enableMitm,
        usingIsolatedMitm: !!this.isolatedMitm,
        isIncognito: this.isIncognito,
      });

      return await this.createBrowserContext(browser);
    } catch (err) {
      this.isOpen.reject(err);
    } finally {
      this.isOpen.resolve(this.browserContext);
    }
    return this.isOpen;
  }

  public async newPage(): Promise<Page> {
    if (!this.browserContext) await this.open();
    return this.browserContext.newPage();
  }

  public hook(hooks: IHooksProvider): this {
    this.plugins.hook(hooks);
    return this;
  }

  public async close(): Promise<void> {
    if (this.isClosing) return this.isClosing;

    const id = this.logger.info('Agent.Closing');
    this.isClosing = new Resolvable();
    try {
      await this.browserContext?.close();
      this.browserContext = null;
      try {
        this.mitmRequestSession.close();
      } catch (error) {
        this.logger.error('Agent.CloseMitmRequestSessionError', { error, sessionId: this.id });
      }

      this.emit('close');
      this.events.close();
    } finally {
      this.logger.stats('Agent.Closed', { parentLogId: id });
      this.isClosing.resolve();
    }
    return this.isClosing;
  }

  protected async createBrowserContext(browser: Browser): Promise<BrowserContext> {
    this.browserContext = await browser.newContext({
      logger: this.logger,
      proxy: this.mitmProxyConnectionInfo,
      hooks: this.plugins,
      isIncognito: this.isIncognito,
      commandMarker: this.options.commandMarker,
    });
    this.events.once(browser, 'close', () => this.close());

    if (this.enableMitm) {
      // hook request session to browserContext (this is how RequestSession subscribes to new page creations)
      this.plugins.hook(this.mitmRequestSession);
      const requestSession = this.mitmRequestSession;
      this.browserContext.resources.connectToMitm(requestSession);
      await this.plugins.onHttpAgentInitialized(requestSession.requestAgent);
    }

    return this.browserContext;
  }
}
