import { IBrowserHooks, IHooksProvider, INetworkHooks } from '@bureau/interfaces/IHooks';

type ICallbackFn = (...[]) => Promise<void> | void;

export default class BasicHooksProvider implements IHooksProvider {
  // place holders to convince typescript we've implemented the interfaces (they're implemented dynamically)
  public onNewBrowser?: IBrowserHooks['onNewBrowser'];
  public onHttpAgentInitialized?: INetworkHooks['onHttpAgentInitialized'];

  private hooksByName: Record<keyof IHooksProvider, ICallbackFn[]> = {
    playInteractions: undefined,
    beforeEachInteractionStep: undefined,
    afterInteractionGroups: undefined,
    adjustStartingMousePoint: undefined,
    onNewBrowser: undefined,
    onNewBrowserContext: undefined,
    onDevtoolsPanelAttached: undefined,
    onNewPage: undefined,
    onNewWorker: undefined,
    onDevtoolsPanelDetached: undefined,
    onDnsConfiguration: undefined,
    onTcpConfiguration: undefined,
    onTlsConfiguration: undefined,
    onHttpAgentInitialized: undefined,
    onHttp2SessionConnect: undefined,
    beforeHttpRequest: undefined,
    beforeHttpResponse: undefined,
    websiteHasFirstPartyInteraction: undefined,
  };

  private syncMethods = new Set<keyof IHooksProvider>([
    'onNewBrowser',
    'onTcpConfiguration',
    'onTlsConfiguration',
    'onDnsConfiguration',
  ]);

  public add(hooks: IHooksProvider): void {
    for (const hook in this.hooksByName) {
      if (hook in hooks) {
        const callbackFn = hooks[hook].bind(hooks);
        if (!this.hooksByName[hook]) {
          this.hooksByName[hook] = [];
          if (this.syncMethods.has(hook as any)) {
            this[hook] = this.apply.bind(this, hook);
          } else {
            this[hook] = this.applyAsync.bind(this, hook);
          }
        }
        this.hooksByName[hook].push(callbackFn);
      }
    }
  }

  public close(): void {
    for (const hooks of Object.values(this.hooksByName)) {
      hooks.length = 0;
    }
  }

  private apply(name: keyof IHooksProvider, ...args: any[]): void {
    for (const hook of this.hooksByName[name]) {
      void hook(...args);
    }
  }

  private async applyAsync(name: keyof IHooksProvider, ...args: any[]): Promise<void> {
    await Promise.all(this.hooksByName[name].map(x => x(...args)));
  }
}
