import { URL } from 'url';
import ILog from '@secret-agent/interfaces/ILog';
import IBrowserEmulator from '@secret-agent/interfaces/IBrowserEmulator';
import IBrowserEmulatorConfig from '@secret-agent/interfaces/IBrowserEmulatorConfig';
import IViewport from '@secret-agent/interfaces/IViewport';
import { IPuppetPage } from '@secret-agent/interfaces/IPuppetPage';
import { IPuppetWorker } from '@secret-agent/interfaces/IPuppetWorker';
import IHttpResourceLoadDetails from '@secret-agent/interfaces/IHttpResourceLoadDetails';
import IDnsSettings from '@secret-agent/interfaces/IDnsSettings';
import ITcpSettings from '@secret-agent/interfaces/ITcpSettings';
import ITlsSettings from '@secret-agent/interfaces/ITlsSettings';
import { IDataUserAgentOption } from '../interfaces/IBrowserData';
import BrowserEmulatorPlugin from './BrowserEmulatorPlugin';
import BrowserEngine from './BrowserEngine';
import { IBrowserData } from '../index';

const promiseFns = new Set([
  'onNewPuppetPage',
  'onNewPuppetWorker',
  'beforeHttpRequest',
  'beforeHttpResponse',
]);

// @BrowserEmulatorClassDecorator
export default abstract class BrowserEmulatorBase implements IBrowserEmulator {
  public static readonly id: string;
  public static readonly engine: BrowserEngine;

  public readonly id: string;
  public readonly engine: BrowserEngine;
  public readonly userAgentOption: IDataUserAgentOption;
  public readonly userAgentString: string;
  public readonly osPlatform: string;
  public readonly log: ILog;

  public timezoneId: string;
  public locale: string;
  public viewport: IViewport;

  protected readonly data: IBrowserData;

  private _plugins: BrowserEmulatorPlugin[];
  private _fns: {
    configure: ((options: IBrowserEmulatorConfig) => void)[];
    onNewPuppetPage: ((page: IPuppetPage) => Promise<any>)[];
    onNewPuppetWorker: ((worker: IPuppetWorker) => Promise<any>)[];
    onDnsConfiguration: ((settings: IDnsSettings) => void)[];
    onTcpConfiguration: ((settings: ITcpSettings) => void)[];
    onTlsConfiguration: ((settings: ITlsSettings) => void)[];
    beforeHttpRequest: ((request: IHttpResourceLoadDetails) => Promise<any>)[];
    beforeHttpResponse: ((resource: IHttpResourceLoadDetails) => Promise<any>)[];
    websiteHasFirstPartyInteraction: ((url: URL) => void)[];
  } = {
    configure: [],
    onNewPuppetPage: [],
    onNewPuppetWorker: [],
    onDnsConfiguration: [],
    onTcpConfiguration: [],
    onTlsConfiguration: [],
    beforeHttpRequest: [],
    beforeHttpResponse: [],
    websiteHasFirstPartyInteraction: [],
  };

  protected constructor(userAgentOption: IDataUserAgentOption, log: ILog) {
    // @ts-ignore
    const { id, engine } = this.constructor;
    this.id = id;
    this.engine = engine;

    this.userAgentOption = userAgentOption;
    this.userAgentString = userAgentOption.string;
    this.osPlatform = userAgentOption.osPlatform;
    this.log = log;
  }

  public abstract configure(options: IBrowserEmulatorConfig): void;

  protected use(Plugin) {
    const plugin = new Plugin(this.userAgentOption, this.data, this.log);

    for (const fnName of Object.keys(this._fns)) {
      if (!plugin[fnName]) continue;

      const fns = this._fns[fnName];

      if (!fns.length) {
        if (this[fnName]) fns.push(this[fnName]);
        if (promiseFns.has(fnName)) {
          this[fnName] = (...args) => Promise.all(fns.map(fn => fn(...args)));
        } else {
          this[fnName] = (...args) => fns.map(fn => fn(...args));
        }
      }
    }

    this._plugins.push(plugin);
  }
}
