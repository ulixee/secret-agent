import IEmulationProfile from '@unblocked-web/specifications/plugin/IEmulationProfile';
import IAgentPlugins from '@unblocked-web/specifications/plugin/IAgentPlugins';
import IAgentPlugin, {
  IAgentPluginClass,
} from '@unblocked-web/specifications/plugin/IAgentPlugin';
import { URL } from 'url';
import {
  IInteractionGroups,
  IInteractionStep,
} from '@unblocked-web/specifications/agent/interact/IInteractions';
import IInteractionsHelper from '@unblocked-web/specifications/agent/interact/IInteractionsHelper';
import IHttpResourceLoadDetails from '@unblocked-web/specifications/agent/net/IHttpResourceLoadDetails';
import IHttp2ConnectSettings from '@unblocked-web/specifications/agent/net/IHttp2ConnectSettings';
import IBrowserContext from '@unblocked-web/specifications/agent/browser/IBrowserContext';
import { IWorker } from '@unblocked-web/specifications/agent/browser/IWorker';
import { IPage } from '@unblocked-web/specifications/agent/browser/IPage';
import IBrowser from '@unblocked-web/specifications/agent/browser/IBrowser';
import IBrowserLaunchArgs from '@unblocked-web/specifications/agent/browser/IBrowserLaunchArgs';
import IHttpSocketAgent from '@unblocked-web/specifications/agent/net/IHttpSocketAgent';
import ITlsSettings from '@unblocked-web/specifications/agent/net/ITlsSettings';
import ITcpSettings from '@unblocked-web/specifications/agent/net/ITcpSettings';
import IDnsSettings from '@unblocked-web/specifications/agent/net/IDnsSettings';
import IPoint from '@unblocked-web/specifications/agent/browser/IPoint';
import IDevtoolsSession from '@unblocked-web/specifications/agent/browser/IDevtoolsSession';
import ChromeApp from '@ulixee/chrome-app';
import ChromeEngine from './ChromeEngine';
import { IHooksProvider } from '@unblocked-web/specifications/agent/hooks/IHooks';
import Interactor from './Interactor';

type ICallbackFn = (...[]) => Promise<void> | void;

export default class AgentPlugins implements IAgentPlugins {
  public profile: IEmulationProfile = {};
  public isStarted = false;

  public get hasHooks(): boolean {
    for (const list of Object.values(this.hooksByName)) if (list.length) return true;
    return false;
  }

  public readonly plugins: IAgentPlugin[] = [];

  private hooksByName: Record<keyof IAgentPlugin, ICallbackFn[]> = {
    configure: [],
    playInteractions: [],
    adjustStartingMousePoint: [],
    onNewBrowser: [],
    onNewBrowserContext: [],
    onDevtoolsPanelAttached: [],
    onNewPage: [],
    onNewWorker: [],
    onDevtoolsPanelDetached: [],
    onDnsConfiguration: [],
    onTcpConfiguration: [],
    onTlsConfiguration: [],
    onHttpAgentInitialized: [],
    onHttp2SessionConnect: [],
    beforeHttpRequest: [],
    beforeHttpResponse: [],
    websiteHasFirstPartyInteraction: [],
  };

  constructor(emulationProfile: IEmulationProfile, pluginClasses: IAgentPluginClass[]) {
    this.profile = emulationProfile ?? {};
    this.profile.options ??= {};
    Object.assign(this.profile, this.profile.options);

    if (this.profile.browserEngine instanceof ChromeApp) {
      this.profile.browserEngine = new ChromeEngine(this.profile.browserEngine);
    }

    if (pluginClasses?.length) {
      const Plugins = pluginClasses.filter(x => x.shouldActivate?.(this.profile) ?? true);
      for (const Plugin of Plugins) {
        const plugin = new Plugin(this.profile);
        this.plugins.push(plugin);
        this.hook(plugin, false);
      }
    }

    if (!this.profile.browserEngine && !pluginClasses?.length) {
      try {
        this.profile.browserEngine = ChromeEngine.default();
      } catch (e) {
        this.profile.logger?.warn('Default Chrome Browser could not be found', {
          packageId: ChromeEngine.defaultPackageName,
        });
      }
    }

    void this.configure(this.profile).catch(() => null);
  }

  public hook(hooksToAdd: IHooksProvider, runConfigure = true): void {
    for (const name in this.hooksByName) {
      if (!(name in hooksToAdd)) {
        continue;
      }
      const callbackFn = hooksToAdd[name].bind(hooksToAdd);
      this.hooksByName[name].push(callbackFn);
      if (runConfigure && name === 'configure' && !this.isStarted) {
        callbackFn(this.profile);
      }
    }
  }

  // INTERACTIONS

  public async playInteractions(
    interactionGroups: IInteractionGroups,
    runFn: (interaction: IInteractionStep) => Promise<void>,
    helper: IInteractionsHelper,
  ): Promise<void> {
    if (this.hooksByName.playInteractions.length) {
      const playFn =
        this.hooksByName.playInteractions[this.hooksByName.playInteractions.length - 1];
      await playFn(interactionGroups, runFn, helper);
    } else {
      await Interactor.defaultPlayInteractions(interactionGroups, runFn);
    }
  }

  public async adjustStartingMousePoint(point: IPoint, helper: IInteractionsHelper): Promise<void> {
    for (const fn of this.hooksByName.adjustStartingMousePoint) {
      await fn(point, helper);
    }
  }

  // BROWSER EMULATORS

  public async configure(profile: IEmulationProfile): Promise<void> {
    await Promise.all(this.hooksByName.configure.map(fn => fn(profile)));
  }

  public async onNewBrowser(browser: IBrowser, launchArgs: IBrowserLaunchArgs): Promise<void> {
    this.isStarted = true;
    await Promise.all(this.hooksByName.onNewBrowser.map(fn => fn(browser, launchArgs)));
  }

  public async onNewPage(page: IPage): Promise<void> {
    await Promise.all(this.hooksByName.onNewPage.map(fn => fn(page)));
  }

  public async onNewWorker(worker: IWorker): Promise<void> {
    await Promise.all(this.hooksByName.onNewWorker.map(fn => fn(worker)));
  }

  public async onNewBrowserContext(context: IBrowserContext): Promise<void> {
    this.isStarted = true;
    await Promise.all(this.hooksByName.onNewBrowserContext.map(fn => fn(context)));
  }

  public async onDevtoolsPanelAttached(devtoolsSession: IDevtoolsSession): Promise<any> {
    await Promise.all(this.hooksByName.onDevtoolsPanelAttached.map(fn => fn(devtoolsSession)));
  }

  public async onDevtoolsPanelDetached(devtoolsSession: IDevtoolsSession): Promise<any> {
    await Promise.all(this.hooksByName.onDevtoolsPanelDetached.map(fn => fn(devtoolsSession)));
  }

  // NETWORK

  public onDnsConfiguration(settings: IDnsSettings): void {
    for (const fn of this.hooksByName.onDnsConfiguration) void fn(settings);
  }

  public onTcpConfiguration(settings: ITcpSettings): void {
    for (const fn of this.hooksByName.onTcpConfiguration) void fn(settings);
  }

  public onTlsConfiguration(settings: ITlsSettings): void {
    for (const fn of this.hooksByName.onTlsConfiguration) void fn(settings);
  }

  public async onHttpAgentInitialized(agent: IHttpSocketAgent): Promise<void> {
    await Promise.all(this.hooksByName.onHttpAgentInitialized.map(fn => fn(agent)));
  }

  public async onHttp2SessionConnect(
    resource: IHttpResourceLoadDetails,
    settings: IHttp2ConnectSettings,
  ): Promise<void> {
    await Promise.all(this.hooksByName.onHttp2SessionConnect.map(fn => fn(resource, settings)));
  }

  public async beforeHttpRequest(resource: IHttpResourceLoadDetails): Promise<void> {
    await Promise.all(this.hooksByName.beforeHttpRequest.map(fn => fn(resource)));
  }

  public async beforeHttpResponse(resource: IHttpResourceLoadDetails): Promise<any> {
    await Promise.all(this.hooksByName.beforeHttpResponse.map(fn => fn(resource)));
  }

  public websiteHasFirstPartyInteraction(url: URL): void {
    for (const fn of this.hooksByName.websiteHasFirstPartyInteraction) void fn(url);
  }
}
