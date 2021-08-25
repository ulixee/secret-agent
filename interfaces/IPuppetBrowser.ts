import { IBoundLog } from './ILog';
import IPuppetContext from './IPuppetContext';
import IProxyConnectionOptions from './IProxyConnectionOptions';
import ICorePlugins from './ICorePlugins';
import IDevtoolsSession from './IDevtoolsSession';

export default interface IPuppetBrowser {
  onDevtoolsAttached?: (devtoolsSession: IDevtoolsSession) => Promise<any>;
  name: string;
  fullVersion: string;
  majorVersion: number;
  newContext(
    plugins: ICorePlugins,
    logger: IBoundLog,
    proxy?: IProxyConnectionOptions,
  ): Promise<IPuppetContext>;
  close(): Promise<void>;
}
