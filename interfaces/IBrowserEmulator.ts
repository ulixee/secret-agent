import { IPuppetPage } from '@secret-agent/interfaces/IPuppetPage';
import { IPuppetWorker } from '@secret-agent/interfaces/IPuppetWorker';
import INetworkEmulation from './INetworkEmulation';
import IBrowserEmulatorConfig from './IBrowserEmulatorConfig';

export default interface IBrowserEmulator extends INetworkEmulation, IBrowserEmulatorConfig {
  readonly userAgentString: string;
  readonly osPlatform: string;

  configure(options: IBrowserEmulatorConfig): void;

  onNewPuppetPage?(page: IPuppetPage): Promise<any>;
  onNewPuppetWorker?(worker: IPuppetWorker): Promise<any>;
}
