import { URL } from 'url';
import IPluginTypes, { PluginTypes } from './IPluginTypes';
import ICorePluginCreateOptions from './ICorePluginCreateOptions';
import { IInteractionGroups, IInteractionStep } from './IInteractions';
import IInteractionsHelper from './IInteractionsHelper';
import IPoint from './IPoint';
import IBrowserEngine from './IBrowserEngine';
import IUserAgentOption, { IVersion } from './IUserAgentOption';
import IDnsSettings from './IDnsSettings';
import ITcpSettings from './ITcpSettings';
import ITlsSettings from './ITlsSettings';
import IHttpResourceLoadDetails from './IHttpResourceLoadDetails';
import { IPuppetPage } from './IPuppetPage';
import { IPuppetWorker } from './IPuppetWorker';
import IDeviceProfile from './IDeviceProfile';
import IHttp2ConnectSettings from './IHttp2ConnectSettings';
import IHttpSocketAgent from './IHttpSocketAgent';
import ISessionCreateOptions from './ISessionCreateOptions';
import { IPuppetFrame } from './IPuppetFrame';
import IPuppetContext from './IPuppetContext';

export default interface ICorePlugin
  extends ICorePluginMethods,
    IBrowserEmulatorMethods,
    IHumanEmulatorMethods {
  id: string;
}

export interface ICorePluginClass {
  id: string;
  type: IPluginTypes;
  new (createOptions: ICorePluginCreateOptions): ICorePlugin;
}

export interface ICorePluginMethods {
  onClientCommand?(meta: IOnClientCommandMeta, ...args: any[]): Promise<any>;
}

export interface IOnClientCommandMeta {
  puppetPage: IPuppetPage;
  puppetFrame: IPuppetFrame;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CorePluginClassDecorator(constructor: ICorePluginClass): void {}

// HUMAN EMULATORS ///////////////////////////////////////////////////////////////////////////////////////////////////

export interface IHumanEmulatorClass {
  id: string;
  type: PluginTypes.HumanEmulator;
  new (createOptions: ICorePluginCreateOptions): IHumanEmulator;
}

export interface IHumanEmulator extends ICorePlugin {
  id: string;
}

export interface IHumanEmulatorMethods {
  playInteractions?(
    interactions: IInteractionGroups,
    runFn: (interaction: IInteractionStep) => Promise<void>,
    helper?: IInteractionsHelper,
  ): Promise<void>;
  getStartingMousePoint?(helper?: IInteractionsHelper): Promise<IPoint>;
}

// decorator for human emulator classes. hacky way to check the class implements statics we need
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HumanEmulatorClassDecorator(constructor: IHumanEmulatorClass): void {}

// BROWSER EMULATORS ///////////////////////////////////////////////////////////////////////////////////////////////////

export interface IBrowserEmulatorClass {
  id: string;
  type: PluginTypes.BrowserEmulator;
  selectBrowserMeta(userAgentSelector: string): ISelectBrowserMeta;
  onBrowserWillLaunch?(
    browserEngine: IBrowserEngine,
    launchSettings: {
      showBrowser?: boolean;
      disableGpu?: boolean;
      disableDevtools?: boolean;
    },
  ): Promise<any> | void;
  new (createOptions: ICorePluginCreateOptions): IBrowserEmulator;
}

export interface ISelectBrowserMeta {
  userAgentOption: IUserAgentOption;
  browserEngine: IBrowserEngine;
}

export interface IBrowserEmulator extends ICorePlugin {
  id: string;

  browserName: string;
  browserVersion: IVersion;

  operatingSystemPlatform: string;
  operatingSystemName: string;
  operatingSystemVersion: IVersion;

  userAgentString: string;
  deviceProfile: IDeviceProfile;
}

export interface IBrowserEmulatorMethods {
  configure?(options: IBrowserEmulatorConfig): Promise<any> | void;

  onDnsConfiguration?(settings: IDnsSettings): Promise<any> | void;
  onTcpConfiguration?(settings: ITcpSettings): Promise<any> | void;
  onTlsConfiguration?(settings: ITlsSettings): Promise<any> | void;
  onHttpAgentInitialized?(agent: IHttpSocketAgent): Promise<any> | void;

  onHttp2SessionConnect?(
    request: IHttpResourceLoadDetails,
    settings: IHttp2ConnectSettings,
  ): Promise<any> | void;
  beforeHttpRequest?(request: IHttpResourceLoadDetails): Promise<any> | void;
  beforeHttpResponse?(resource: IHttpResourceLoadDetails): Promise<any> | void;

  onNewPuppetContext?(context: IPuppetContext): Promise<any>;
  onNewPuppetPage?(page: IPuppetPage): Promise<any>;
  onNewPuppetWorker?(worker: IPuppetWorker): Promise<any>;

  websiteHasFirstPartyInteraction?(url: URL): Promise<any> | void; // needed for implementing first-party cookies
}

export type IBrowserEmulatorConfig = Pick<
  ISessionCreateOptions,
  'viewport' | 'geolocation' | 'timezoneId' | 'locale' | 'upstreamProxyIpMask' | 'upstreamProxyUrl'
>;

// decorator for browser emulator classes. hacky way to check the class implements statics we need
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BrowserEmulatorClassDecorator(constructor: IBrowserEmulatorClass): void {}
