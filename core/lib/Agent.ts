import { RequestSession } from '@secret-agent/mitm';
import BrowserContext from './BrowserContext';
import Log from '@ulixee/commons/lib/Logger';
import MitmProxy from '@secret-agent/mitm/lib/MitmProxy';
import { IBoundLog } from '@ulixee/commons/interfaces/ILog';
import env from '../env';
import IProxyConnectionOptions from '../interfaces/IProxyConnectionOptions';
import Pool from './Pool';
import Browser from './Browser';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import { nanoid } from 'nanoid';
import Page from './Page';
import { IBrowserContextHooks, IHooksProvider } from '@unblocked/emulator-spec/IHooks';
import ICommandMarker from '../interfaces/ICommandMarker';
import IBrowserEngine from '@unblocked/emulator-spec/IBrowserEngine';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import BasicHooksProvider from './BasicHooksProvider';
import IBrowserLaunchArgs from '@unblocked/emulator-spec/IBrowserLaunchArgs';

const { log } = Log(module);

export interface IAgentCreateOptions extends IBrowserLaunchArgs {
  browserEngine?: IBrowserEngine;
  hooks?: IHooksProvider;
  id?: string;
  logger?: IBoundLog;
  upstreamProxyUrl?: string;
  commandMarker?: ICommandMarker;
}

export default class Agent extends TypedEventEmitter<{ close: void }> {
  public readonly id: string;
  public browserContext: BrowserContext;
  public mitmRequestSession: RequestSession;
  public logger: IBoundLog;
  public hooksProvider = new BasicHooksProvider();

  private isClosing: Resolvable<void>;
  public get isIncognito(): boolean {
    return this.options.disableIncognito !== true;
  }

  private events = new EventSubscriber();
  private readonly enableMitm: boolean = true;
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

  constructor(private options: IAgentCreateOptions) {
    super();
    this.id = options.id ?? nanoid();

    this.logger =
      options.logger?.createChild(module) ??
      log.createChild(module, {
        sessionId: this.id,
      });
    if (options.hooks) this.hooksProvider.add(options.hooks);
    this.mitmRequestSession = new RequestSession(
      this.id,
      this.hooksProvider,
      this.logger,
      options.upstreamProxyUrl,
    );
    this.enableMitm = !env.disableMitm && !options.disableMitm;
  }

  // opens outside a pool. NOTE: will shut down browser after use
  public async open(browser?: Browser): Promise<BrowserContext> {
    let mitmProxy: MitmProxy;
    if (this.enableMitm) {
      mitmProxy = await MitmProxy.start();
    }

    browser ??= await this.createSingleUseBrowser(mitmProxy);

    if (mitmProxy) {
      const isIsolatedMitm = browser.supportsBrowserContextProxy && this.isIncognito;

      if (isIsolatedMitm) {
        this.isolatedMitm = mitmProxy;
      }
      mitmProxy.registerSession(this.mitmRequestSession, isIsolatedMitm);
    }

    return await this.createBrowserContext(browser);
  }

  public async openInPool(pool: Pool): Promise<BrowserContext> {
    const browser = await pool.getBrowser(
      this.options.browserEngine,
      this.hooksProvider,
      this.options,
    );

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

    return await this.createBrowserContext(browser);
  }

  public newPage(): Promise<Page> {
    return this.browserContext.newPage();
  }

  public hook(hooks: IHooksProvider): void {
    this.hooksProvider.add(hooks);
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

  protected async createSingleUseBrowser(mitm: MitmProxy): Promise<Browser> {
    const browser = new Browser(this.options.browserEngine, this.hooksProvider, {
      proxyPort: mitm?.port,
    });
    this.events.once(this, 'close', () => browser.close());
    this.events.once(browser, 'close', () => this.close());
    await browser.launch();
    return browser;
  }

  protected async createBrowserContext(browser: Browser): Promise<BrowserContext> {
    this.browserContext = await browser.newContext({
      logger: this.logger,
      proxy: this.mitmProxyConnectionInfo,
      isIncognito: this.isIncognito,
      commandMarker: this.options.commandMarker,
    });
    this.browserContext.hook(this.hooksProvider as IBrowserContextHooks);
    this.events.once(browser, 'close', () => this.close());

    if (this.enableMitm) {
      // hook request session to browserContext (this is how RequestSession subscribes to new page creations)
      this.browserContext.hook(this.mitmRequestSession);
      const requestSession = this.mitmRequestSession;
      this.browserContext.resources.connectToMitm(requestSession);
      await this.hooksProvider.onHttpAgentInitialized?.(requestSession.requestAgent);
    }

    return this.browserContext;
  }
}
