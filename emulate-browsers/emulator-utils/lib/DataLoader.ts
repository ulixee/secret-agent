import * as Fs from 'fs';
import {
  IDataCore,
  IDataBasic,
  IDataHeaders,
  IDataUserAgentOptions,
  IDataWindowFraming,
} from '../interfaces/IBrowserData';
import BrowserData from './BrowserData';

export default class DataLoader implements IDataCore {
  public readonly baseDir: string;
  public readonly dataDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.dataDir = `${baseDir}/data`;
  }

  public get pkg(): any {
    return loadData(`${this.baseDir}/package.json`);
  }

  public get basic(): IDataBasic {
    return loadData(`${this.dataDir}/basic.json`);
  }

  public get headers(): IDataHeaders {
    return loadData(`${this.dataDir}/headers.json`);
  }

  public get userAgentOptions(): IDataUserAgentOptions {
    return loadData(`${this.dataDir}/user-agent-options.json`);
  }

  public get windowBaseFraming(): IDataWindowFraming {
    return loadData(`${this.dataDir}/window-base-framing.json`);
  }

  public as(operatingSystemId: string) {
    return new BrowserData(this, operatingSystemId);
  }
}

const cacheMap: { [path: string]: any } = {};

export function loadData(path: string) {
  cacheMap[path] = cacheMap[path] || JSON.parse(Fs.readFileSync(path, 'utf8'));
  return cacheMap[path];
}
