import BrowserEmulator from '@secret-agent/plugin-utils/lib/BrowserEmulator';
import IHttpResourceLoadDetails from '@secret-agent/interfaces/IHttpResourceLoadDetails';
import IDnsSettings from '@secret-agent/interfaces/IDnsSettings';
import ITcpSettings from '@secret-agent/interfaces/ITcpSettings';
import ITlsSettings from '@secret-agent/interfaces/ITlsSettings';
import { IPuppetPage } from '@secret-agent/interfaces/IPuppetPage';
import IPuppetContext from '@secret-agent/interfaces/IPuppetContext';
import {
  BrowserEmulatorClassDecorator,
  IBrowserEmulatorConfig,
} from '@secret-agent/interfaces/ICorePlugin';
import { IPuppetWorker } from '@secret-agent/interfaces/IPuppetWorker';
import IViewport from '@secret-agent/interfaces/IViewport';
import ICorePluginCreateOptions from '@secret-agent/interfaces/ICorePluginCreateOptions';
import IUserAgentOption from '@secret-agent/interfaces/IUserAgentOption';
import BrowserEngine from '@secret-agent/plugin-utils/lib/BrowserEngine';
import IGeolocation from '@secret-agent/interfaces/IGeolocation';
import IHttp2ConnectSettings from '@secret-agent/interfaces/IHttp2ConnectSettings';
import IHttpSocketAgent from '@secret-agent/interfaces/IHttpSocketAgent';
import * as Fs from 'fs';
import Viewports from './lib/Viewports';
import setWorkerDomOverrides from './lib/setWorkerDomOverrides';
import setPageDomOverrides from './lib/setPageDomOverrides';
import setUserAgent from './lib/helpers/setUserAgent';
import setScreensize from './lib/helpers/setScreensize';
import setTimezone from './lib/helpers/setTimezone';
import setLocale from './lib/helpers/setLocale';
import setActiveAndFocused from './lib/helpers/setActiveAndFocused';
import selectUserAgentOption from './lib/helpers/selectUserAgentOption';
import modifyHeaders from './lib/helpers/modifyHeaders';
import configureSessionDns from './lib/helpers/configureSessionDns';
import configureSessionTcp from './lib/helpers/configureSessionTcp';
import configureSessionTls from './lib/helpers/configureSessionTls';
import FirstPartyCookiesPlugin from './lib/plugins/FirstPartyCookiesPlugin';
import DataLoader from './lib/DataLoader';
import IBrowserData from './interfaces/IBrowserData';
import selectBrowserEngineOption from './lib/helpers/selectBrowserEngineOption';
import setGeolocation from './lib/helpers/setGeolocation';
import { configureBrowserLaunchArgs } from './lib/helpers/configureBrowserLaunchArgs';
import loadDomOverrides from './lib/loadDomOverrides';
import DomOverridesBuilder from './lib/DomOverridesBuilder';
import configureDeviceProfile from './lib/helpers/configureDeviceProfile';
import configureHttp2Session from './lib/helpers/configureHttp2Session';
import lookupPublicIp, { IpLookupServices } from './lib/helpers/lookupPublicIp';

const dataLoader = new DataLoader(__dirname);
export const latestBrowserEngineId = 'chrome-88-0';
export const latestChromeBrowserVersion = { major: '88', minor: '0' };

@BrowserEmulatorClassDecorator
export default class DefaultBrowserEmulator extends BrowserEmulator {
  public static id = dataLoader.pkg.name.replace('@secret-agent/', '');

  public timezoneId: string;
  public locale: string;
  public viewport: IViewport;
  public geolocation: IGeolocation;
  public upstreamProxyIpMask: IBrowserEmulatorConfig['upstreamProxyIpMask'];
  public upstreamProxyUrl: string;

  protected readonly data: IBrowserData;
  private readonly domOverridesBuilder: DomOverridesBuilder;

  constructor(createOptions: ICorePluginCreateOptions) {
    super(createOptions);
    this.data = dataLoader.as(createOptions.userAgentOption) as any;

    // set default device profile options
    configureDeviceProfile(this.deviceProfile);

    if (this.data.browserConfig.features.includes('FirstPartyCookies')) {
      createOptions.corePlugins.use(FirstPartyCookiesPlugin);
    }
    this.domOverridesBuilder = loadDomOverrides(this, this.data);
  }

  configure(config: IBrowserEmulatorConfig): void {
    if (!config) return;

    config.locale = config.locale || this.locale || this.data.browserConfig.defaultLocale;
    config.viewport =
      config.viewport ||
      this.viewport ||
      Viewports.getDefault(this.data.windowBaseFraming, this.data.windowFraming);
    config.timezoneId =
      config.timezoneId || this.timezoneId || Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.geolocation = config.geolocation || this.geolocation;

    if (config.upstreamProxyUrl) {
      config.upstreamProxyIpMask ??= {};
      config.upstreamProxyIpMask.ipLookupService ??= IpLookupServices.ipify;
    }

    this.locale = config.locale;
    this.viewport = config.viewport;
    this.timezoneId = config.timezoneId;
    this.geolocation = config.geolocation;
    this.upstreamProxyIpMask = config.upstreamProxyIpMask;
    this.upstreamProxyUrl = config.upstreamProxyUrl;
  }

  public onDnsConfiguration(settings: IDnsSettings): void {
    configureSessionDns(this, settings);
  }

  public onTcpConfiguration(settings: ITcpSettings): void {
    configureSessionTcp(this, settings);
  }

  public onTlsConfiguration(settings: ITlsSettings): void {
    configureSessionTls(this, settings);
  }

  public beforeHttpRequest(resource: IHttpResourceLoadDetails): void {
    modifyHeaders(this, this.data, resource);
  }

  public async onHttpAgentInitialized(agent: IHttpSocketAgent): Promise<void> {
    if (this.upstreamProxyIpMask) {
      this.upstreamProxyIpMask.publicIp ??= await lookupPublicIp(
        this.upstreamProxyIpMask.ipLookupService,
      );
      this.upstreamProxyIpMask.proxyIp ??= await lookupPublicIp(
        this.upstreamProxyIpMask.ipLookupService,
        agent,
        this.upstreamProxyUrl,
      );
      this.logger.info('PublicIp Lookup', {
        ...this.upstreamProxyIpMask,
      });
      this.domOverridesBuilder.add('webrtc', {
        localIp: this.upstreamProxyIpMask.publicIp,
        proxyIp: this.upstreamProxyIpMask.proxyIp,
      });
    }
  }

  public onHttp2SessionConnect(
    request: IHttpResourceLoadDetails,
    settings: IHttp2ConnectSettings,
  ): void {
    configureHttp2Session(this, this.data, request, settings);
  }

  public async onNewPuppetContext(context: IPuppetContext): Promise<any> {
    const userDataDir = this.browserEngine.userDataDir;
    await Fs.promises.mkdir(`${userDataDir}/downloads`, { recursive: true });
    await context.enableDownloads(`${userDataDir}/downloads`);
  }

  public onNewPuppetPage(page: IPuppetPage): Promise<any> {
    // Don't await here! we want to queue all these up to run before the debugger resumes
    const devtools = page.devtoolsSession;
    return Promise.all([
      setUserAgent(this, devtools),
      setTimezone(this, devtools),
      setLocale(this, devtools),
      setScreensize(this, page, devtools),
      setActiveAndFocused(this, devtools),
      setPageDomOverrides(this.domOverridesBuilder, this.data, page),
      setGeolocation(this, page),
    ]);
  }

  public onNewPuppetWorker(worker: IPuppetWorker): Promise<any> {
    const devtools = worker.devtoolsSession;
    return Promise.all([
      setUserAgent(this, devtools),
      setWorkerDomOverrides(this.domOverridesBuilder, this.data, worker),
    ]);
  }

  public static selectBrowserMeta(userAgentSelector?: string): {
    browserEngine: BrowserEngine;
    userAgentOption: IUserAgentOption;
  } {
    const userAgentOption = selectUserAgentOption(userAgentSelector, dataLoader.userAgentOptions);

    const { browserName, browserVersion } = userAgentOption;
    const browserEngineId = `${browserName}-${browserVersion.major}-${browserVersion.minor}`;
    const browserEngineOption = selectBrowserEngineOption(
      browserEngineId,
      dataLoader.browserEngineOptions,
    );
    const browserEngine = new BrowserEngine(this, browserEngineOption);
    return { browserEngine, userAgentOption };
  }

  public static onBrowserWillLaunch(
    browserEngine: BrowserEngine,
    options: {
      showBrowser?: boolean;
      disableGpu?: boolean;
      disableDevtools?: boolean;
    },
  ): void {
    configureBrowserLaunchArgs(browserEngine, options);
  }
}
