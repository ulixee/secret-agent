import { URL } from 'url';
import ProtocolMapping from 'devtools-protocol/types/protocol-mapping';
import { ICookie } from './ICookie';
import ITypedEventEmitter from './ITypedEventEmitter';
import { IPuppetPage } from './IPuppetPage';
import { IPuppetWorker } from './IPuppetWorker';

export default interface IPuppetContext extends ITypedEventEmitter<IPuppetContextEvents> {
  id: string;
  workersById: Map<string, IPuppetWorker>;
  defaultPageInitializationFn: (page: IPuppetPage) => Promise<any>;
  sendWithBrowserDevtoolsSession<T extends keyof ProtocolMapping.Commands>(
    method: T,
    params?: ProtocolMapping.Commands[T]['paramsType'][0],
  ): Promise<ProtocolMapping.Commands[T]['returnType']>;

  newPage(options?: IPuppetPageOptions): Promise<IPuppetPage>;
  close(): Promise<void>;

  getCookies(url?: URL): Promise<ICookie[]>;
  addCookies(
    cookies: (Omit<ICookie, 'expires'> & { expires?: string | Date | number })[],
    origins?: string[],
  ): Promise<void>;

  enableDownloads(downloadsPath: string): Promise<void>;
}

export interface IPuppetPageOptions {
  runPageScripts: boolean;
  triggerPopupOnPageId?: string;
}

export interface IPuppetContextEvents {
  page: { page: IPuppetPage };
  worker: { worker: IPuppetWorker };
  'devtools-message': {
    direction: 'send' | 'receive';
    timestamp: Date;
    pageTargetId?: string;
    workerTargetId?: string;
    frameId?: string;
    sessionType: 'page' | 'worker' | 'browser';
    sessionId: string;
    method?: string;
    id?: number;
    params?: any;
    error?: any;
    result?: any;
  };
}
