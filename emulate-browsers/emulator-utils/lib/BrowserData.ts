import * as Fs from 'fs';
import IBrowserData, {
  IDataBasic,
  IDataClienthello,
  IDataCodecs,
  IDataDomPolyfill,
  IDataHeaders,
  IDataUserAgentOptions,
  IDataWindowChrome,
  IDataWindowFraming,
  IDataWindowNavigator,
} from '../interfaces/IBrowserData';
import DataLoader, { loadData } from './DataLoader';
import getLocalOperatingSystemMeta from './getLocalOperatingSystemMeta';
import { findClosestVersionMatch } from './VersionUtils';

const localOsMeta = getLocalOperatingSystemMeta();

export default class BrowserData implements IBrowserData {
  private readonly dataLoader: DataLoader;
  private readonly dataDir: string;
  private domPolyfillFilename: string;

  constructor(dataLoader: DataLoader, operatingSystemById: string) {
    this.dataLoader = dataLoader;
    this.dataDir = `${dataLoader.dataDir}/as-${operatingSystemById}`;
  }

  public get pkg(): any {
    return this.dataLoader.pkg;
  }

  public get basic(): IDataBasic {
    return this.dataLoader.basic;
  }

  public get headers(): IDataHeaders {
    return this.dataLoader.headers;
  }

  public get userAgentOptions(): IDataUserAgentOptions {
    return this.dataLoader.userAgentOptions;
  }

  public get windowBaseFraming(): IDataWindowFraming {
    return this.dataLoader.windowBaseFraming;
  }

  public get clienthello(): IDataClienthello {
    return loadData(`${this.dataDir}/clienthello.json`);
  }

  public get codecs(): IDataCodecs {
    return loadData(`${this.dataDir}/codecs.json`);
  }

  public get windowChrome(): IDataWindowChrome {
    try {
      return loadData(`${this.dataDir}/window-chrome.json`);
    } catch(e) {
      return undefined;
    }
  }

  public get windowFraming(): IDataWindowFraming {
    return loadData(`${this.dataDir}/window-framing.json`);
  }

  public get windowNavigator(): IDataWindowNavigator {
    return loadData(`${this.dataDir}/window-navigator.json`);
  }

  public get domPolyfill(): IDataDomPolyfill {
    try {
      this.domPolyfillFilename = this.domPolyfillFilename || extractPolyfillFilename(this.dataDir);
      return loadData(`${this.dataDir}/${this.domPolyfillFilename}`);
    } catch (e) {
      return undefined;
    }
  }
}

function extractPolyfillFilename(dataDir: string) {
  const filenames: string[] = Fs.readdirSync(dataDir);
  const filenameMap = {};
  for (const filename of filenames) {
    const matches = filename.match(/^dom-polyfill-when-runtime-([a-z-]+)(-([0-9-]+))?.json$/);
    if (!matches) continue;

    const [osName, _, osVersion] = matches.slice(1); // eslint-disable-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
    filenameMap[osName] = filenameMap[osName] || {};
    filenameMap[osName][osVersion || 'ALL'] = filename;
  }

  if (!filenameMap[localOsMeta.name]) {
    throw new Error(`Your OS (${localOsMeta.name}) is not supported by this emulator.`);
  }

  const versionMatch = findClosestVersionMatch(
    localOsMeta.version,
    Object.keys(filenameMap[localOsMeta.name]),
  );

  if (!versionMatch) {
    throw new Error(
      `Emulator could not find a version match for ${localOsMeta.name} ${localOsMeta.version}`,
    );
  }

  return filenameMap[localOsMeta.name][versionMatch];
}
