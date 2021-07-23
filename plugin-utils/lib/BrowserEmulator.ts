import { IBoundLog } from '@ulixee/commons/interfaces/ILog';
import {
  BrowserEmulatorClassDecorator,
  IBrowserEmulator,
  IBrowserEmulatorClass,
  ISelectBrowserMeta,
} from '@ulixee/hero-interfaces/ICorePlugin';
import { PluginTypes } from '@ulixee/hero-interfaces/IPluginTypes';
import ICorePluginCreateOptions from '@ulixee/hero-interfaces/ICorePluginCreateOptions';
import IBrowserEngine from '@ulixee/hero-interfaces/IBrowserEngine';
import ICorePlugins from '@ulixee/hero-interfaces/ICorePlugins';
import { IVersion } from '@ulixee/hero-interfaces/IUserAgentOption';
import IDeviceProfile from '@ulixee/hero-interfaces/IDeviceProfile';

@BrowserEmulatorClassDecorator
export default class BrowserEmulator implements IBrowserEmulator {
  public static readonly id: string;
  public static readonly type = PluginTypes.BrowserEmulator;

  public readonly id: string;

  public readonly browserName: string;
  public readonly browserVersion: IVersion;

  public readonly operatingSystemName: string;
  public readonly operatingSystemVersion: IVersion;
  public readonly operatingSystemPlatform: string;

  public readonly userAgentString: string;
  public readonly browserEngine: IBrowserEngine;
  public readonly logger: IBoundLog;
  public readonly deviceProfile: IDeviceProfile;

  protected readonly corePlugins: ICorePlugins;

  constructor({
    userAgentOption,
    browserEngine,
    corePlugins,
    logger,
    deviceProfile,
  }: ICorePluginCreateOptions) {
    this.id = (this.constructor as IBrowserEmulatorClass).id;
    this.browserName = userAgentOption.browserName;
    this.browserVersion = userAgentOption.browserVersion;

    this.operatingSystemPlatform = userAgentOption.operatingSystemPlatform;
    this.operatingSystemName = userAgentOption.operatingSystemName;
    this.operatingSystemVersion = userAgentOption.operatingSystemVersion;

    this.userAgentString = userAgentOption.string;
    this.browserEngine = browserEngine;

    this.corePlugins = corePlugins;
    this.logger = logger;
    this.deviceProfile = deviceProfile ?? {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static selectBrowserMeta(userAgentSelector: string): ISelectBrowserMeta {
    throw new Error('selectBrowserMeta() is missing implementation');
  }
}
