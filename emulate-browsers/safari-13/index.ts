import { DataLoader, IBrowserData } from '@secret-agent/browser-emulator-utils';
import BrowserEmulatorBase from '@secret-agent/browser-emulator-utils/lib/BrowserEmulatorBase';
import IUserAgentMatchMeta from '@secret-agent/interfaces/IUserAgentMatchMeta';
import IHttpResourceLoadDetails from '@secret-agent/interfaces/IHttpResourceLoadDetails';
import IDnsSettings from '@secret-agent/interfaces/IDnsSettings';
import ITcpSettings from '@secret-agent/interfaces/ITcpSettings';
import ITlsSettings from '@secret-agent/interfaces/ITlsSettings';
import { IPuppetPage } from '@secret-agent/interfaces/IPuppetPage';
import IBrowserEmulatorConfig from '@secret-agent/interfaces/IBrowserEmulatorConfig';
import { IPuppetWorker } from '@secret-agent/interfaces/IPuppetWorker';
import IViewport from '@secret-agent/interfaces/IViewport';
import BrowserEngine from '@secret-agent/browser-emulator-utils/lib/BrowserEngine';
import Viewports from '@secret-agent/browser-emulator-utils/lib/Viewports';
import ILog from '@secret-agent/interfaces/ILog';
import setWorkerDomOverrides from './lib/setWorkerDomOverrides';
import setPageDomOverrides from './lib/setPageDomOverrides';
import setUserAgent from './lib/helpers/setUserAgent';
import setScreensize from './lib/helpers/setScreensize';
import setTimezone from './lib/helpers/setTimezone';
import setLocale from './lib/helpers/setLocale';
import setActiveAndFocused from './lib/helpers/setActiveAndFocused';
import selectUserAgentOption from './lib/helpers/selectUserAgentOption';
import modifyHeaders from './lib/helpers/modifyHeaders';
import isUserAgentMatch from './lib/helpers/isUserAgentMatch';
import configureSessionDns from './lib/helpers/configureSessionDns';
import configureSessionTcp from './lib/helpers/configureSessionTcp';
import configureSessionTls from './lib/helpers/configureSessionTls';
import FirstPartyCookiesPlugin from './lib/plugins/FirstPartyCookiesPlugin';

const dataLoader = new DataLoader(__dirname);

// @BrowserEmulatorClassDecorator
export default class Safari13 extends BrowserEmulatorBase {
  public static id = dataLoader.pkg.name;
  public static engine = new BrowserEngine(dataLoader.pkg, dataLoader.basic.browserEngine);

  public timezoneId: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public locale = dataLoader.basic.defaultLocale;
  public viewport: IViewport;

  protected readonly data: IBrowserData;

  constructor(config: IBrowserEmulatorConfig, log: ILog, matchMeta?: IUserAgentMatchMeta) {
    super(selectUserAgentOption(dataLoader.userAgentOptions, matchMeta), log);
    this.data = dataLoader.as(this.userAgentOption.operatingSystemId);

    config = { ...config };
    config.viewport ??= Viewports.getDefault(dataLoader.windowBaseFraming, this.data.windowFraming);
    this.configure(config);

    this.use(FirstPartyCookiesPlugin);
  }

  configure(config: IBrowserEmulatorConfig) {
    if (!config) return;
    const { locale, viewport, timezoneId } = config;

    if (locale) this.locale = locale;
    if (viewport) this.viewport = viewport;
    if (timezoneId) this.timezoneId = timezoneId;
  }

  public async onDnsConfiguration(settings: IDnsSettings): Promise<void> {
    configureSessionDns(this, settings);
  }

  public async onTcpConfiguration(settings: ITcpSettings): Promise<void> {
    configureSessionTcp(this, settings);
  }

  public async onTlsConfiguration(settings: ITlsSettings): Promise<void> {
    configureSessionTls(this, settings);
  }

  public async beforeHttpRequest(resource: IHttpResourceLoadDetails): Promise<void> {
    modifyHeaders(this, this.data, resource);
  }

  public onNewPuppetPage(page: IPuppetPage): Promise<any> {
    // Don't await here! we want to queue all these up to run before the debugger resumes
    const devtools = page.devtoolsSession;
    return Promise.all([
      setUserAgent(this, devtools),
      setTimezone(this, devtools),
      setLocale(this, devtools),
      setScreensize(this, devtools),
      setActiveAndFocused(this, devtools),
      setPageDomOverrides(this, this.data, page),
    ]);
  }

  public onNewPuppetWorker(worker: IPuppetWorker): Promise<any> {
    const devtools = worker.devtoolsSession;
    return Promise.all([
      setUserAgent(this, devtools),
      setWorkerDomOverrides(this, this.data, worker),
    ]);
  }

  public static isMatch(meta: IUserAgentMatchMeta): boolean {
    return isUserAgentMatch(dataLoader.basic, meta);
  }
}
