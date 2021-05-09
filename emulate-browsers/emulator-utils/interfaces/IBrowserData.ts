export default interface IBrowserData extends IDataCore {
  clienthello: IDataClienthello;
  codecs: IDataCodecs;
  windowChrome: IDataWindowChrome;
  windowFraming: IDataWindowFraming;
  windowNavigator: IDataWindowNavigator;
  domPolyfill: IDataDomPolyfill;
}

export interface IDataWindowNavigator {
  navigator: any;
}

export interface IDataDomPolyfill {
  add: any[];
  remove: any[];
  modify: any[];
  reorder: any[];
}

export interface IDataWindowChrome {
  chrome: any;
  prevProperty: string;
}

export interface IDataClienthello {
  version: string;
  ciphers: any[];
  compressionMethods: any[];
  extensions: any[];
}

export interface IDataCodecs {
  audioSupport: any;
  videoSupport: any;
  webRtcAudioCodecs: any;
  webRtcVideoCodecs: any;
}

export interface IDataCore {
  basic: IDataBasic;
  headers: IDataHeaders;
  userAgentOptions: IDataUserAgentOptions;
  windowBaseFraming: IDataWindowFraming;
  pkg: any;
}

export type IDataUserAgentOptions = IDataUserAgentOption[];

export interface IDataHeaders {
  [resourceType: string]: {
    originTypes: string[];
    method: string;
    secureDomain: boolean;
    order: string[];
    defaults: { [header: string]: string[] };
  }[];
}

export interface IDataUserAgentOption {
  operatingSystemId: string;
  browserId: string;
  osPlatform: string;
  version: {
    major: string;
    minor: string;
    patch?: string;
  };
  string: string;
}

export interface IDataWindowFraming {
  screenGapLeft: number;
  screenGapTop: number;
  screenGapRight: number;
  screenGapBottom: number;
  frameBorderWidth: number;
  frameBorderHeight: number;
}

export interface IDataBasic {
  browserEngine: IDataBrowserEngine,
  browserMatcher: {
    name: string;
    versionRange: number[]
  },
  marketshare: number,
  defaultLocale: string;
}

export interface IDataBrowserEngine {
  id: string;
  name: string;
  fullVersion: string;
  features: string[];
  executablePathEnvVar: string;
}
