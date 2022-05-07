import Protocol from 'devtools-protocol';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import IRegisteredEventListener from '@ulixee/commons/interfaces/IRegisteredEventListener';
import { IFrameManagerEvents } from '@unblocked/emulator-spec/IFrame';
import { bindFunctions } from '@ulixee/commons/lib/utils';
import { IBoundLog } from '@ulixee/commons/interfaces/ILog';
import { CanceledPromiseError } from '@ulixee/commons/interfaces/IPendingWaitEvent';
import DevtoolsSession from './DevtoolsSession';
import Frame from './Frame';
import NetworkManager from './NetworkManager';
import DomStorageTracker from './DomStorageTracker';
import InjectedScripts from './InjectedScripts';
import Page from './Page';
import IResourceMeta from '@unblocked/emulator-spec/IResourceMeta';
import { IPageEvents } from '@unblocked/emulator-spec/IPage';
import { IDomPaintEvent } from '@unblocked/emulator-spec/Location';
import Resources from './Resources';
import FrameNavigatedEvent = Protocol.Page.FrameNavigatedEvent;
import FrameTree = Protocol.Page.FrameTree;
import FrameDetachedEvent = Protocol.Page.FrameDetachedEvent;
import FrameAttachedEvent = Protocol.Page.FrameAttachedEvent;
import ExecutionContextDestroyedEvent = Protocol.Runtime.ExecutionContextDestroyedEvent;
import ExecutionContextCreatedEvent = Protocol.Runtime.ExecutionContextCreatedEvent;
import NavigatedWithinDocumentEvent = Protocol.Page.NavigatedWithinDocumentEvent;
import FrameStoppedLoadingEvent = Protocol.Page.FrameStoppedLoadingEvent;
import LifecycleEventEvent = Protocol.Page.LifecycleEventEvent;
import FrameRequestedNavigationEvent = Protocol.Page.FrameRequestedNavigationEvent;

export const DEFAULT_PAGE = 'about:blank';
export const ISOLATED_WORLD = '__agent_world__';

export default class FramesManager extends TypedEventEmitter<IFrameManagerEvents> {
  public readonly framesById = new Map<string, Frame>();
  public readonly page: Page;
  public readonly pendingNewDocumentScripts: { script: string; isolated: boolean }[] = [];

  public get mainFrameId(): string {
    return Array.from(this.attachedFrameIds).find(id => !this.framesById.get(id).parentId);
  }

  public get main(): Frame {
    return this.framesById.get(this.mainFrameId);
  }

  public get activeFrames(): Frame[] {
    return Array.from(this.attachedFrameIds).map(x => this.framesById.get(x));
  }

  protected readonly logger: IBoundLog;

  private onFrameCreatedResourceEventsByFrameId: {
    [frameId: string]: {
      type: keyof IPageEvents;
      event: IPageEvents[keyof IPageEvents];
    }[];
  } = {};

  private get resources(): Resources {
    return this.page.browserContext.resources;
  }

  private attachedFrameIds = new Set<string>();
  private activeContextIds = new Set<number>();
  private readonly events = new EventSubscriber();
  private readonly devtoolsSession: DevtoolsSession;
  private readonly networkManager: NetworkManager;
  private readonly domStorageTracker: DomStorageTracker;

  private isReady: Promise<void>;

  constructor(page: Page, devtoolsSession: DevtoolsSession) {
    super();
    this.page = page;
    this.devtoolsSession = devtoolsSession;
    this.networkManager = page.networkManager;
    this.domStorageTracker = page.domStorageTracker;
    this.logger = page.logger.createChild(module);

    bindFunctions(this);

    const session = this.devtoolsSession;
    this.events.on(session, 'Page.frameNavigated', this.onFrameNavigated);
    this.events.on(session, 'Page.navigatedWithinDocument', this.onFrameNavigatedWithinDocument);
    this.events.on(session, 'Page.frameRequestedNavigation', this.onFrameRequestedNavigation);
    this.events.on(session, 'Page.frameDetached', this.onFrameDetached);
    this.events.on(session, 'Page.frameAttached', this.onFrameAttached);
    this.events.on(session, 'Page.frameStoppedLoading', this.onFrameStoppedLoading);
    this.events.on(session, 'Page.lifecycleEvent', this.onLifecycleEvent);
    this.events.on(session, 'Runtime.executionContextsCleared', this.onExecutionContextsCleared);
    this.events.on(session, 'Runtime.executionContextDestroyed', this.onExecutionContextDestroyed);
    this.events.on(session, 'Runtime.executionContextCreated', this.onExecutionContextCreated);

    this.events.on(page, 'resource-will-be-requested', this.onResourceWillBeRequested);
    this.events.on(page, 'resource-was-requested', this.onResourceWasRequested);
    this.events.on(page, 'resource-loaded', this.onResourceLoaded);
    this.events.on(page, 'resource-failed', this.onResourceFailed);
    this.events.on(page, 'navigation-response', this.onNavigationResourceResponse);
  }

  public initialize(): Promise<void> {
    this.isReady = new Promise<void>(async (resolve, reject) => {
      try {
        const [framesResponse, , readyStateResult] = await Promise.all([
          this.devtoolsSession.send('Page.getFrameTree'),
          this.devtoolsSession.send('Page.enable'),
          this.devtoolsSession.send('Runtime.evaluate', {
            expression: 'document.readyState',
          }),
          this.devtoolsSession.send('Page.setLifecycleEventsEnabled', { enabled: true }),
          this.devtoolsSession.send('Runtime.enable'),
          InjectedScripts.install(this, this.onDomPaintEvent),
        ]);
        this.recurseFrameTree(framesResponse.frameTree);
        resolve();

        if (this.main.securityOrigin && !this.main.activeLoader?.lifecycle?.load) {
          // sometimes we get a new anchor link that already has an initiated frame. If that's the case, newDocumentScripts won't trigger.
          // NOTE: we DON'T want this to trigger for internal pages (':', 'about:blank')
          await this.main.runPendingNewDocumentScripts();
          const readyState = readyStateResult.result?.value;
          const loaderId = this.main.activeLoaderId;
          let loadName: string;
          if (readyState === 'interactive') loadName = 'DOMContentLoaded';
          else if (readyState === 'complete') loadName = 'load';
          if (loadName) setImmediate(() => this.main.onLifecycleEvent(loadName, null, loaderId));
        }
      } catch (error) {
        if (error instanceof CanceledPromiseError) {
          resolve();
          return;
        }
        reject(error);
      }
    });
    return this.isReady;
  }

  public close(error?: Error): void {
    this.events.close();
    this.cancelPendingEvents('FramesManager closed');
    for (const frame of this.framesById.values()) {
      frame.close(error);
    }
  }

  public async addPageCallback(
    name: string,
    onCallback: (payload: any, frameId: string) => any,
    isolateFromWebPageEnvironment?: boolean,
  ): Promise<IRegisteredEventListener> {
    const params: Protocol.Runtime.AddBindingRequest = {
      name,
    };
    if (isolateFromWebPageEnvironment) {
      (params as any).executionContextName = ISOLATED_WORLD;
    }
    // add binding to every new context automatically
    await this.devtoolsSession.send('Runtime.addBinding', params);
    return this.events.on(this.devtoolsSession, 'Runtime.bindingCalled', async event => {
      if (event.name === name) {
        await this.isReady;
        const frameId = this.getFrameIdForExecutionContext(event.executionContextId);
        onCallback(event.payload, frameId);
      }
    });
  }

  public async addNewDocumentScript(
    script: string,
    installInIsolatedScope = true,
  ): Promise<{ identifier: string }> {
    const installedScript = await this.devtoolsSession.send(
      'Page.addScriptToEvaluateOnNewDocument',
      {
        source: script,
        worldName: installInIsolatedScope ? ISOLATED_WORLD : undefined,
      },
    );
    this.pendingNewDocumentScripts.push({ script, isolated: installInIsolatedScope });
    // sometimes we get a new anchor link that already has an initiated frame. If that's the case, newDocumentScripts won't trigger.
    // NOTE: we DON'T want this to trigger for internal pages (':', 'about:blank')
    if (this.main?.url?.startsWith('http')) {
      await this.main.runPendingNewDocumentScripts();
    }
    return installedScript;
  }

  public checkForResolvedNavigation(
    browserRequestId: string,
    resource: IResourceMeta,
    error?: Error,
  ): boolean {
    if (resource.type !== 'Document') return;

    const frame = this.frameWithPendingNavigation(
      browserRequestId,
      resource.request?.url,
      resource.response?.url,
    );
    if (frame && !resource.isRedirect) {
      frame.navigations.onResourceLoaded(resource.id, resource.response?.statusCode, error);
      return true;
    }
    return false;
  }

  public frameWithPendingNavigation(
    browserRequestId: string,
    requestedUrl: string,
    finalUrl: string,
  ): Frame | null {
    for (const frame of this.framesById.values()) {
      const isMatch = frame.navigations.doesMatchPending(browserRequestId, requestedUrl, finalUrl);
      if (isMatch) return frame;
    }
  }

  /////// EXECUTION CONTEXT ////////////////////////////////////////////////////

  public getSecurityOrigins(): { origin: string; frameId: string }[] {
    const origins: { origin: string; frameId: string }[] = [];
    for (const frame of this.framesById.values()) {
      if (this.attachedFrameIds.has(frame.id)) {
        const origin = frame.securityOrigin;
        if (origin && !origins.some(x => x.origin === origin)) {
          origins.push({ origin, frameId: frame.id });
        }
      }
    }
    return origins;
  }

  public async waitForFrame(
    frameDetails: { frameId: string; loaderId?: string },
    url: string,
    isInitiatingNavigation = false,
  ): Promise<void> {
    await this.isReady;
    const { frameId, loaderId } = frameDetails;
    const frame = this.framesById.get(frameId);
    if (isInitiatingNavigation) {
      frame.initiateNavigation(url, loaderId);
    }
    await frame.waitForNavigationLoader(loaderId);
  }

  public getFrameIdForExecutionContext(executionContextId: number): string | undefined {
    for (const frame of this.framesById.values()) {
      if (frame.hasContextId(executionContextId)) return frame.id;
    }
  }

  private async onExecutionContextDestroyed(event: ExecutionContextDestroyedEvent): Promise<void> {
    await this.isReady;
    this.activeContextIds.delete(event.executionContextId);
    for (const frame of this.framesById.values()) {
      frame.removeContextId(event.executionContextId);
    }
  }

  private async onExecutionContextsCleared(): Promise<void> {
    await this.isReady;
    this.activeContextIds.clear();
    for (const frame of this.framesById.values()) {
      frame.clearContextIds();
    }
  }

  private async onExecutionContextCreated(event: ExecutionContextCreatedEvent): Promise<void> {
    await this.isReady;
    const { context } = event;
    const frameId = context.auxData.frameId as string;
    const type = context.auxData.type as string;

    this.activeContextIds.add(context.id);
    const frame = this.framesById.get(frameId);
    if (!frame) {
      this.logger.warn('No frame for active context!', {
        frameId,
        executionContextId: context.id,
      });
    }

    const isDefault =
      context.name === '' && context.auxData.isDefault === true && type === 'default';
    const isIsolatedWorld = context.name === ISOLATED_WORLD && type === 'isolated';
    if (isDefault || isIsolatedWorld) {
      frame?.addContextId(context.id, isDefault);
    }
  }

  /////// FRAMES ///////////////////////////////////////////////////////////////

  private async onFrameNavigated(navigatedEvent: FrameNavigatedEvent): Promise<void> {
    await this.isReady;
    const frame = this.recordFrame(navigatedEvent.frame);
    frame.onNavigated(navigatedEvent.frame);
    if (!frame.isDefaultUrl && !frame.parentId) {
      this.pendingNewDocumentScripts.length = 0;
    }
    this.domStorageTracker.track(frame.securityOrigin);
  }

  private async onFrameStoppedLoading(event: FrameStoppedLoadingEvent): Promise<void> {
    await this.isReady;
    const { frameId } = event;

    this.framesById.get(frameId).onStoppedLoading();
  }

  private async onFrameRequestedNavigation(
    navigatedEvent: FrameRequestedNavigationEvent,
  ): Promise<void> {
    await this.isReady;
    const { frameId, url, reason, disposition } = navigatedEvent;
    this.framesById.get(frameId).requestedNavigation(url, reason, disposition);
  }

  private async onFrameNavigatedWithinDocument(
    navigatedEvent: NavigatedWithinDocumentEvent,
  ): Promise<void> {
    await this.isReady;
    const { frameId, url } = navigatedEvent;
    this.framesById.get(frameId).onNavigatedWithinDocument(url);
  }

  private async onFrameDetached(frameDetachedEvent: FrameDetachedEvent): Promise<void> {
    await this.isReady;
    const { frameId } = frameDetachedEvent;
    this.attachedFrameIds.delete(frameId);
  }

  private async onFrameAttached(frameAttachedEvent: FrameAttachedEvent): Promise<void> {
    await this.isReady;
    const { frameId, parentFrameId } = frameAttachedEvent;

    this.recordFrame({ id: frameId, parentId: parentFrameId } as any);
    this.attachedFrameIds.add(frameId);
  }

  private async onLifecycleEvent(event: LifecycleEventEvent): Promise<void> {
    await this.isReady;
    const { frameId, name, loaderId, timestamp } = event;
    const eventTime = this.networkManager.monotonicTimeToUnix(timestamp);
    const frame = this.recordFrame({ id: frameId, loaderId } as any);
    frame.onLifecycleEvent(name, eventTime, loaderId);
    this.domStorageTracker.track(frame.securityOrigin);
  }

  private onDomPaintEvent(
    frameId: string,
    paintEvent: { event: IDomPaintEvent; timestamp: number; url: string },
  ): void {
    const { event, timestamp, url } = paintEvent;
    void this.isReady.then(() => {
      const frame = this.framesById.get(frameId);
      frame.navigations.onDomPaintEvent(event, url, timestamp);
      return null;
    });
  }

  private recurseFrameTree(frameTree: FrameTree): void {
    const { frame, childFrames } = frameTree;
    this.recordFrame(frame, true);

    this.attachedFrameIds.add(frame.id);

    if (!childFrames) return;
    for (const childFrame of childFrames) {
      this.recurseFrameTree(childFrame);
    }
  }

  private recordFrame(newFrame: Protocol.Page.Frame, isFrameTreeRecurse = false): Frame {
    const { id, parentId } = newFrame;
    if (this.framesById.has(id)) {
      const frame = this.framesById.get(id);
      if (isFrameTreeRecurse) frame.onAttached(newFrame);
      this.domStorageTracker.track(frame.securityOrigin);
      return frame;
    }

    const parentFrame = parentId ? this.framesById.get(parentId) : null;
    const frame = new Frame(
      this,
      newFrame,
      this.activeContextIds,
      this.devtoolsSession,
      this.logger,
      () => this.attachedFrameIds.has(id),
      parentFrame,
    );
    this.framesById.set(id, frame);

    if (!parentId && this.page.opener?.windowOpenParams) {
      const { url } = this.page.opener?.windowOpenParams;
      frame.navigations.onNavigationRequested(
        'newFrame',
        url,
        this.page.lastActivityId,
        newFrame.loaderId,
      );
    }

    this.emit('frame-created', { frame, loaderId: newFrame.loaderId });

    this.replayMissedResourceEventsAfterFrameAttached(frame);

    this.domStorageTracker.track(frame.securityOrigin);

    return frame;
  }

  // MERGE FROM Tab.ts. Needs to be sorted out

  private replayMissedResourceEventsAfterFrameAttached(frame: Frame): void {
    const resourceEvents = this.onFrameCreatedResourceEventsByFrameId[frame.id];
    if (resourceEvents) {
      for (const { event: resourceEvent, type } of resourceEvents) {
        if (type === 'resource-will-be-requested')
          this.onResourceWillBeRequested(resourceEvent as any);
        else if (type === 'navigation-response')
          this.onNavigationResourceResponse(resourceEvent as any);
        else if (type === 'resource-loaded') this.onResourceLoaded(resourceEvent as any);
      }
    }
    delete this.onFrameCreatedResourceEventsByFrameId[frame.id];
  }

  private getFrameForEventOrQueueForReady(
    type: keyof IPageEvents,
    event: IPageEvents[keyof IPageEvents] & { frameId: string },
  ): Frame {
    const frame = this.framesById.get(event.frameId);
    if (event.frameId && !frame) {
      this.onFrameCreatedResourceEventsByFrameId[event.frameId] ??= [];
      const events = this.onFrameCreatedResourceEventsByFrameId[event.frameId];
      if (!events.some(x => x.event === event)) {
        events.push({ event, type });
      }
    }
    return frame;
  }

  private onResourceWillBeRequested(event: IPageEvents['resource-will-be-requested']): void {
    const lastCommandId = this.page.browserContext.commandMarker.lastId;
    const { resource, isDocumentNavigation, frameId, redirectedFromUrl } = event;
    const url = resource.url.href;

    const frame = frameId
      ? this.getFrameForEventOrQueueForReady('resource-will-be-requested', event)
      : this.main;

    if (!frame) return;

    const navigations = frame.navigations;

    if (isDocumentNavigation && !navigations.top) {
      navigations.onNavigationRequested(
        'newFrame',
        url,
        lastCommandId,
        resource.browserRequestId,
        event.loaderId,
      );
    }
    resource.hasUserGesture ||= navigations.didGotoUrl(url);

    this.resources.onBrowserWillRequest(this.page.tabId, frame.frameId, resource);

    if (isDocumentNavigation && !event.resource.browserCanceled) {
      navigations.onHttpRequested(
        url,
        lastCommandId,
        redirectedFromUrl,
        resource.browserRequestId,
        event.loaderId,
      );
    }
  }

  private onResourceWasRequested(event: IPageEvents['resource-was-requested']): void {
    const frameId = this.framesById.get(event.frameId).frameId;
    this.resources.onBrowserDidRequest(this.page.tabId, frameId, event.resource);
  }

  private onResourceLoaded(event: IPageEvents['resource-loaded']): void {
    const { resource, frameId, loaderId } = event;

    const frame = frameId
      ? this.getFrameForEventOrQueueForReady('resource-loaded', event as any)
      : this.main;
    this.resources.onBrowserDidRequest(this.page.tabId, frame?.frameId, resource);

    // if we didn't get a frame, don't keep going
    if (!frame) return;

    const isPending = frame.navigations.doesMatchPending(
      resource.browserRequestId,
      resource.url?.href,
      resource.responseUrl,
      event.loaderId,
    );
    if (isPending) {
      if (resource.browserServedFromCache) {
        frame.navigations.onHttpResponded(
          resource.browserRequestId,
          resource.responseUrl ?? resource.url?.href,
          loaderId,
          resource.browserLoadedTime,
        );
      }
      const existingResource = this.resources.getBrowserRequestLatestResource(
        resource.browserRequestId,
      );
      if (existingResource) {
        frame.navigations.onResourceLoaded(existingResource.id, resource.status);
      }
    }

    const isKnownResource = this.resources.onBrowserResourceLoaded(this.page.tabId, resource);

    if (
      !isKnownResource &&
      (resource.browserServedFromCache ||
        resource.url?.protocol === 'blob:' ||
        !this.resources.hasRegisteredMitm)
    ) {
      this.resources
        .createNewResourceIfUnseen(this.page.tabId, frame.frameId, resource, event.body)
        .then(meta => meta && this.checkForResolvedNavigation(resource.browserRequestId, meta))
        .catch(() => null);
    }
  }

  private onResourceFailed(event: IPageEvents['resource-failed']): void {
    const { resource } = event;
    const loadError = Resources.translateResourceError(resource);

    const frame = this.framesById.get(resource.frameId);

    const resourceMeta = this.resources.onBrowserRequestFailed(
      this.page.tabId,
      frame?.frameId,
      resource,
      loadError,
    );

    if (resourceMeta) {
      const browserRequestId = resource.browserRequestId;
      this.checkForResolvedNavigation(browserRequestId, resourceMeta, loadError);
    }
  }

  private onNavigationResourceResponse(event: IPageEvents['navigation-response']): void {
    const frame = event.frameId
      ? this.getFrameForEventOrQueueForReady('navigation-response', event)
      : this.main;

    if (!frame) {
      return;
    }

    frame.navigations.onHttpResponded(
      event.browserRequestId,
      event.url,
      event.loaderId,
      event.timestamp,
    );
  }
}
