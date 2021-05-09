import ILog from '@secret-agent/interfaces/ILog';
import { IBrowserData } from '../index';
import { IDataUserAgentOption } from '../interfaces/IBrowserData';

export default abstract class BrowserEmulatorPlugin {
  protected readonly userAgentOption: IDataUserAgentOption;
  protected readonly data: IBrowserData;
  protected readonly log: ILog;

  constructor(userAgentOption: IDataUserAgentOption, data: IBrowserData, log: ILog) {
    this.userAgentOption = userAgentOption;
    this.data = data;
    this.log = log;
  }
}
