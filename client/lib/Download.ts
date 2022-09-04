import StateMachine from 'awaited-dom/base/StateMachine';
import Resolvable from '@secret-agent/commons/Resolvable';
import IDownload, { IDownloadState } from '@secret-agent/interfaces/IDownload';
import { httpGet } from '@secret-agent/commons/downloadFile';
import CoreTab from './CoreTab';

const { getState, setState } = StateMachine<Download, IState>();

interface IState {
  coreTab: CoreTab;
  downloadPromise: Resolvable<void>;
  complete: boolean;
}

export default class Download {
  id: string;
  url: string;
  path: string;
  suggestedFilename: string;

  progress = 0;
  totalBytes = 0;
  canceled = false;

  #downloadUrl: Promise<string>;

  get complete(): boolean {
    return getState(this).complete;
  }

  set complete(value) {
    setState(this, { complete: value });
    if (value) {
      getState(this).downloadPromise.resolve();
    }
  }

  waitForFinished(): Promise<void> {
    return getState(this).downloadPromise.promise;
  }

  set downloadUrl(value: Promise<string>) {
    this.#downloadUrl = value;
  }

  async delete(): Promise<void> {
    const coreTab = await getState(this).coreTab;
    await coreTab.deleteDownload(this.id);
  }

  async data(): Promise<Buffer> {
    await this.waitForFinished();
    const url = await this.#downloadUrl;
    const downloaderPromise = new Resolvable<Buffer>();
    const request = httpGet(url, async response => {
      if (response.statusCode !== 200) {
        const error = new Error(
          `Download failed: server returned code ${response.statusCode}. URL: ${url}`,
        );
        // consume response data to free up memory
        response.resume();
        downloaderPromise.reject(error);
        return;
      }
      const buffer: Buffer[] = [];
      for await (const chunk of response) {
        buffer.push(chunk);
      }
      downloaderPromise.resolve(Buffer.concat(buffer));
    });
    request.once('error', downloaderPromise.reject);
    return downloaderPromise.promise;
  }
}

export function createDownload(coreTab: CoreTab, data: IDownload): Download {
  const download = new Download();
  Object.assign(download, data);
  setState(download, {
    coreTab,
    downloadPromise: new Resolvable<void>(),
  });

  function onDownloadProgress(progress: IDownloadState): void {
    if (progress.complete) {
      coreTab
        .removeEventListener(['downloads', progress.id], 'download-progress', onDownloadProgress)
        .catch(() => null);
    }
    Object.assign(download, progress);
  }

  coreTab
    .addEventListener(['downloads', download.id], 'download-progress', onDownloadProgress)
    .catch(() => null);

  return download;
}
