/**
 * Copyright 2018 Google Inc. All rights reserved.
 * Modifications copyright (c) Data Liberation Foundation Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import EventSubscriber from '@secret-agent/commons/EventSubscriber';
import Protocol from 'devtools-protocol';
import { IPuppetPage, IPuppetPageEvents } from '@secret-agent/interfaces/IPuppetPage';
import { TypedEventEmitter } from '@secret-agent/commons/eventUtils';
import IRegisteredEventListener from '@secret-agent/interfaces/IRegisteredEventListener';
import { assert, createPromise } from '@secret-agent/commons/utils';
import { IBoundLog } from '@secret-agent/interfaces/ILog';
import { CanceledPromiseError } from '@secret-agent/commons/interfaces/IPendingWaitEvent';
import IRect from '@secret-agent/interfaces/IRect';
import * as Path from 'path';
import { DevtoolsSession } from './DevtoolsSession';
import { NetworkManager } from './NetworkManager';
import { Keyboard } from './Keyboard';
import Mouse from './Mouse';
import FramesManager from './FramesManager';
import { BrowserContext } from './BrowserContext';
import { Worker } from './Worker';
import ConsoleMessage from './ConsoleMessage';
import Frame from './Frame';
import ConsoleAPICalledEvent = Protocol.Runtime.ConsoleAPICalledEvent;
import ExceptionThrownEvent = Protocol.Runtime.ExceptionThrownEvent;
import WindowOpenEvent = Protocol.Page.WindowOpenEvent;
import TargetInfo = Protocol.Target.TargetInfo;
import JavascriptDialogOpeningEvent = Protocol.Page.JavascriptDialogOpeningEvent;
import FileChooserOpenedEvent = Protocol.Page.FileChooserOpenedEvent;

export class Page extends TypedEventEmitter<IPuppetPageEvents> implements IPuppetPage {
  public keyboard: Keyboard;
  public mouse: Mouse;
  public workersById = new Map<string, Worker>();
  public readonly browserContext: BrowserContext;
  public readonly opener: Page | null;
  public networkManager: NetworkManager;
  public framesManager: FramesManager;

  public popupInitializeFn?: (
    page: IPuppetPage,
    openParams: { url: string; windowName: string },
  ) => Promise<void>;

  public devtoolsSession: DevtoolsSession;
  public targetId: string;
  public isClosed = false;
  public readonly isReady: Promise<void>;
  public windowOpenParams: Protocol.Page.WindowOpenEvent;

  public get id(): string {
    return this.targetId;
  }

  public get mainFrame(): Frame {
    return this.framesManager.main;
  }

  public get frames(): Frame[] {
    return this.framesManager.activeFrames;
  }

  public get workers(): Worker[] {
    return [...this.workersById.values()];
  }

  protected readonly logger: IBoundLog;
  private closePromise = createPromise();
  private readonly eventSubscriber = new EventSubscriber();
  private downloadsByGuid = new Map<string, { emitOnOpener: boolean; url: string }>();
  private readonly registeredEvents: IRegisteredEventListener[];

  constructor(
    devtoolsSession: DevtoolsSession,
    targetId: string,
    browserContext: BrowserContext,
    logger: IBoundLog,
    opener: Page | null,
  ) {
    super();

    this.logger = logger.createChild(module, {
      targetId,
    });
    this.logger.info('Page.created');
    this.storeEventsWithoutListeners = true;
    this.devtoolsSession = devtoolsSession;
    this.targetId = targetId;
    this.browserContext = browserContext;
    this.keyboard = new Keyboard(devtoolsSession);
    this.mouse = new Mouse(devtoolsSession, this.keyboard);
    this.networkManager = new NetworkManager(
      devtoolsSession,
      this.logger,
      this.browserContext.proxy,
    );
    this.framesManager = new FramesManager(devtoolsSession, this.logger);
    this.opener = opener;

    this.setEventsToLog([
      'frame-created',
      'websocket-frame',
      'websocket-handshake',
      'navigation-response',
      'worker',
    ]);

    this.framesManager.addEventEmitter(this, ['frame-created']);

    this.networkManager.addEventEmitter(this, [
      'navigation-response',
      'websocket-frame',
      'websocket-handshake',
      'resource-will-be-requested',
      'resource-was-requested',
      'resource-loaded',
      'resource-failed',
    ]);

    this.devtoolsSession.once('disconnected', this.emit.bind(this, 'close'));

    const events = this.eventSubscriber;

    events.on(devtoolsSession, 'Inspector.targetCrashed', this.onTargetCrashed.bind(this));
    events.on(devtoolsSession, 'Runtime.exceptionThrown', this.onRuntimeException.bind(this));
    events.on(devtoolsSession, 'Runtime.consoleAPICalled', this.onRuntimeConsole.bind(this));
    events.on(devtoolsSession, 'Target.attachedToTarget', this.onAttachedToTarget.bind(this));
    events.on(
      devtoolsSession,
      'Page.javascriptDialogOpening',
      this.onJavascriptDialogOpening.bind(this),
    );
    events.on(devtoolsSession, 'Page.fileChooserOpened', this.onFileChooserOpened.bind(this));
    events.on(devtoolsSession, 'Page.windowOpen', this.onWindowOpen.bind(this));
    events.on(devtoolsSession, 'Page.downloadWillBegin', this.onDownloadWillBegin.bind(this));
    events.on(devtoolsSession, 'Page.downloadProgress', this.onDownloadProgress.bind(this));

    this.isReady = this.initialize().catch(error => {
      this.logger.error('Page.initializationError', {
        error,
      });
      throw error;
    });
  }

  async setNetworkRequestInterceptor(
    networkRequestsFn: (
      request: Protocol.Fetch.RequestPausedEvent,
    ) => Promise<Protocol.Fetch.FulfillRequestRequest>,
  ): Promise<void> {
    return await this.networkManager.setNetworkInterceptor(networkRequestsFn, true);
  }

  addNewDocumentScript(script: string, isolatedEnvironment: boolean): Promise<void> {
    return this.framesManager.addNewDocumentScript(script, isolatedEnvironment);
  }

  addPageCallback(
    name: string,
    onCallback: (payload: any, frameId: string) => any,
  ): Promise<IRegisteredEventListener> {
    return this.framesManager.addPageCallback(name, (payload, frameId) => {
      if (onCallback) onCallback(payload, frameId);

      this.emit('page-callback-triggered', {
        name,
        payload,
        frameId,
      });
    });
  }

  async getIndexedDbDatabaseNames(): Promise<
    { frameId: string; origin: string; databases: string[] }[]
  > {
    const dbs: { frameId: string; origin: string; databases: string[] }[] = [];
    for (const { origin, frameId } of this.framesManager.getSecurityOrigins()) {
      try {
        const { databaseNames } = await this.devtoolsSession.send(
          'IndexedDB.requestDatabaseNames',
          {
            securityOrigin: origin,
          },
        );
        dbs.push({ origin, frameId, databases: databaseNames });
      } catch (err) {
        // can throw if document not found in page
      }
    }
    return dbs;
  }

  async setJavaScriptEnabled(enabled: boolean): Promise<void> {
    await this.devtoolsSession.send('Emulation.setScriptExecutionDisabled', {
      value: !enabled,
    });
  }

  evaluate<T>(expression: string): Promise<T> {
    return this.mainFrame.evaluate<T>(expression, false);
  }

  async navigate(
    url: string,
    options: { referrer?: string } = {},
  ): Promise<{ loaderId: string; loaderType: 'download' | 'page' }> {
    const navigationResponse = await this.devtoolsSession.send('Page.navigate', {
      url,
      referrer: options.referrer,
      frameId: this.mainFrame.id,
    });

    const { errorText, loaderId } = navigationResponse;

    let didInitiateDownload = false;
    if (errorText) {
      didInitiateDownload = await this.waitForPossibleDownloadPrompt(url, loaderId);

      if (!didInitiateDownload) {
        throw new Error(errorText);
      }
    }
    if (!didInitiateDownload) {
      await this.framesManager.waitForFrame(navigationResponse, url, true);
    }

    return { loaderId, loaderType: didInitiateDownload ? 'download' : 'page' };
  }

  dismissDialog(accept: boolean, promptText?: string): Promise<void> {
    return this.devtoolsSession.send('Page.handleJavaScriptDialog', {
      accept,
      promptText,
    });
  }

  goBack(): Promise<string> {
    return this.navigateToHistory(-1);
  }

  goForward(): Promise<string> {
    return this.navigateToHistory(+1);
  }

  reload(): Promise<void> {
    return this.devtoolsSession.send('Page.reload');
  }

  async bringToFront(): Promise<void> {
    await this.devtoolsSession.send('Page.bringToFront');
  }

  async screenshot(
    format: 'jpeg' | 'png' = 'jpeg',
    clipRect?: IRect & { scale: number },
    quality = 100,
  ): Promise<Buffer> {
    assert(
      quality >= 0 && quality <= 100,
      `Expected options.quality to be between 0 and 100 (inclusive), got ${quality}`,
    );
    await this.devtoolsSession.send('Target.activateTarget', {
      targetId: this.targetId,
    });

    const clip: Protocol.Page.Viewport = clipRect;

    if (clip) {
      clip.x = Math.round(clip.x);
      clip.y = Math.round(clip.y);
      clip.width = Math.round(clip.width);
      clip.height = Math.round(clip.height);
    }
    const result = await this.devtoolsSession.send('Page.captureScreenshot', {
      format,
      quality,
      clip,
      captureBeyondViewport: true, // added in chrome 87
    } as Protocol.Page.CaptureScreenshotRequest);

    return Buffer.from(result.data, 'base64');
  }

  onWorkerAttached(
    devtoolsSession: DevtoolsSession,
    targetInfo: TargetInfo,
  ): Promise<Error | void> {
    const targetId = targetInfo.targetId;

    this.browserContext.beforeWorkerAttached(devtoolsSession, targetId, this.targetId);

    const worker = new Worker(
      this.browserContext,
      this.networkManager,
      devtoolsSession,
      this.logger,
      targetInfo,
    );
    if (worker.type !== 'shared_worker') this.workersById.set(targetId, worker);
    this.browserContext.onWorkerAttached(worker);

    worker.on('console', this.emit.bind(this, 'console'));
    worker.on('page-error', this.emit.bind(this, 'page-error'));
    worker.on('close', () => this.workersById.delete(targetId));

    this.emit('worker', { worker });
    return worker.isReady;
  }

  async close(timeoutMs = 5e3): Promise<void> {
    if (this.devtoolsSession.isConnected() && !this.isClosed) {
      // trigger beforeUnload
      try {
        await this.devtoolsSession.send('Page.close');
      } catch (err) {
        if (!err.message.includes('Target closed') && !(err instanceof CanceledPromiseError)) {
          throw err;
        }
      }
    }
    const timeout = setTimeout(() => this.didClose(), timeoutMs);
    await this.closePromise.promise;
    clearTimeout(timeout);
  }

  onTargetKilled(errorCode: number): void {
    this.emit('crashed', {
      error: new Error(`Page crashed - killed by Chrome with code ${errorCode}`),
      fatal: true,
    });
    this.didClose();
  }

  didClose(closeError?: Error): void {
    this.isClosed = true;
    try {
      this.framesManager.close(closeError);
      this.networkManager.close();
      this.eventSubscriber.close();
      this.cancelPendingEvents('Page closed', ['close']);
      for (const worker of this.workersById.values()) {
        worker.close();
      }
    } catch (error) {
      this.logger.error('Page.closeWorkersError', {
        error,
      });
    } finally {
      this.closePromise.resolve();
      this.emit('close');
    }
  }

  private async navigateToHistory(delta: number): Promise<string> {
    const history = await this.devtoolsSession.send('Page.getNavigationHistory');
    const entry = history.entries[history.currentIndex + delta];
    if (!entry) return null;
    await Promise.all([
      this.devtoolsSession.send('Page.navigateToHistoryEntry', { entryId: entry.id }),
      this.mainFrame.waitOn('frame-navigated'),
    ]);
    return entry.url;
  }

  private async initialize(): Promise<void> {
    const promises = [
      this.networkManager.initialize().catch(err => err),
      this.framesManager.initialize().catch(err => err),
      this.devtoolsSession
        .send('Target.setAutoAttach', {
          autoAttach: true,
          waitForDebuggerOnStart: true,
          flatten: true,
        })
        .catch(err => err),
      this.browserContext.initializePage(this),
      this.devtoolsSession
        .send('Page.setInterceptFileChooserDialog', { enabled: true })
        .catch(err => err),
      this.devtoolsSession.send('Runtime.runIfWaitingForDebugger').catch(err => err),
    ];

    for (const error of await Promise.all(promises)) {
      if (error && error instanceof Error) throw error;
    }

    if (this.opener && this.opener.popupInitializeFn) {
      this.logger.stats('Popup triggered', {
        targetId: this.targetId,
        opener: this.opener.targetId,
      });
      await this.opener.isReady;
      if (this.opener.isClosed) {
        this.logger.stats('Popup canceled', {
          targetId: this.targetId,
        });
        return;
      }
      if (this.mainFrame.isDefaultUrl) {
        // if we're on the default page, wait for a loader to be created before telling the page it's ready
        await Promise.race([
          this.waitOn('download-started', null, 2e3).catch(() => null),
          this.mainFrame.waitOn('frame-loader-created', null, 2e3).catch(() => null),
        ]);
        if (this.isClosed) return;
      }
      await this.opener.popupInitializeFn(this, this.opener.windowOpenParams);
      this.logger.stats('Popup initialized', {
        targetId: this.targetId,
        windowOpenParams: this.opener.windowOpenParams,
      });
    }
  }

  private onAttachedToTarget(event: Protocol.Target.AttachedToTargetEvent): Promise<any> {
    const { sessionId, targetInfo, waitingForDebugger } = event;

    const devtoolsSession = this.devtoolsSession.connection.getSession(sessionId);
    if (
      targetInfo.type === 'service_worker' ||
      targetInfo.type === 'shared_worker' ||
      targetInfo.type === 'worker'
    ) {
      return this.onWorkerAttached(devtoolsSession, targetInfo);
    }

    if (waitingForDebugger) {
      return devtoolsSession
        .send('Runtime.runIfWaitingForDebugger')
        .catch(error => {
          this.logger.error('Runtime.runIfWaitingForDebugger.Error', {
            error,
            devtoolsSessionId: sessionId,
          });
        })
        .then(() =>
          // detach from page session
          this.devtoolsSession.send('Target.detachFromTarget', { sessionId }),
        )
        .catch(error => {
          this.logger.error('Target.detachFromTarget', {
            error,
            devtoolsSessionId: sessionId,
          });
        });
    }
  }

  private onRuntimeException(msg: ExceptionThrownEvent): void {
    const error = ConsoleMessage.exceptionToError(msg.exceptionDetails);
    const frameId = this.framesManager.getFrameIdForExecutionContext(
      msg.exceptionDetails.executionContextId,
    );
    this.emit('page-error', {
      frameId,
      error,
    });
  }

  private onRuntimeConsole(event: ConsoleAPICalledEvent): void {
    const message = ConsoleMessage.create(this.devtoolsSession, event);
    const frameId = this.framesManager.getFrameIdForExecutionContext(event.executionContextId);

    this.emit('console', {
      frameId,
      ...message,
    });
  }

  private onTargetCrashed(): void {
    this.emit('crashed', { error: new Error('Target Crashed') });
  }

  private onWindowOpen(event: WindowOpenEvent): void {
    this.windowOpenParams = event;
  }

  private async waitForPossibleDownloadPrompt(url: string, loaderId: string): Promise<boolean> {
    const canceledNavigation = this.networkManager
      .getCanceledNavigationRequests()
      .find(x => x.loaderId === loaderId);

    let isDownloadPrompted = this.didUrlPromptDownload(url);
    if (!isDownloadPrompted && canceledNavigation) {
      try {
        // if we get this
        await this.waitOn('download-started', x => x.url === url, 5e3);
        isDownloadPrompted = true;
      } catch (err) {
        return false;
      }
    }

    // if the url prompted a download
    if (isDownloadPrompted) {
      this.mainFrame.onDownloadNavigation(url, loaderId);
    }
    return isDownloadPrompted;
  }

  private didUrlPromptDownload(url: string): boolean {
    return [...this.downloadsByGuid.values()].some(x => x.url === url);
  }

  private onDownloadWillBegin(payload: Protocol.Page.DownloadWillBeginEvent) {
    let originPage: Page;
    const isCanceledNavigation = this.networkManager
      .getCanceledNavigationRequests()
      .find(x => x.url === payload.url);

    let shouldEmitOnOpener = false;
    if (this.mainFrame?.activeLoader?.isNavigationComplete) {
      originPage = this;
    } else if (!this.mainFrame || isCanceledNavigation) {
      originPage = this.opener;
      shouldEmitOnOpener = true;
    }

    if (!originPage) return;
    this.downloadsByGuid.set(payload.guid, { emitOnOpener: shouldEmitOnOpener, url: payload.url });

    originPage.emit('download-started', {
      id: payload.guid,
      suggestedFilename: payload.suggestedFilename,
      path: Path.join(this.browserContext.downloadsPath, payload.guid),
      url: payload.url,
    });
  }

  private onDownloadProgress(event: Protocol.Page.DownloadProgressEvent) {
    const download = <IPuppetPageEvents['download-finished']>{
      id: event.guid,
      totalBytes: event.totalBytes,
      canceled: event.state === Protocol.Page.DownloadProgressEventState.Canceled,
    };

    const isFinished = event.state !== Protocol.Page.DownloadProgressEventState.InProgress;

    const emitter = this.downloadsByGuid.get(download.id)?.emitOnOpener ? this.opener : this;

    if (isFinished) {
      emitter.emit('download-finished', download);
    } else {
      const progress = <IPuppetPageEvents['download-progress']>{
        ...download,
        progress: 0,
      };
      if (event.totalBytes) {
        progress.progress = Math.round((event.receivedBytes * 100) / event.totalBytes);
      }
      emitter.emit('download-progress', progress);
    }
  }

  private onJavascriptDialogOpening(dialog: JavascriptDialogOpeningEvent): void {
    this.emit('dialog-opening', { dialog });
  }

  private onFileChooserOpened(event: FileChooserOpenedEvent): void {
    this.framesManager.framesById
      .get(event.frameId)
      .resolveNodeId(event.backendNodeId)
      .then(objectId =>
        this.emit('filechooser', {
          objectId,
          frameId: event.frameId,
          selectMultiple: event.mode === 'selectMultiple',
        }),
      )
      .catch(() => null);
  }
}
