import fs from 'fs';
import { EventEmitter } from 'events';
import { IRequestSessionResponseEvent } from '@secret-agent/mitm/handlers/RequestSession';
import IWebsocketMessage from '@secret-agent/core-interfaces/IWebsocketMessage';
import SessionDb from './lib/SessionDb';
import SessionsDb from './lib/SessionsDb';
import IResourceMeta from '@secret-agent/core-interfaces/IResourceMeta';
import ICommandMeta from '@secret-agent/core-interfaces/ICommandMeta';
import IWebsocketResourceMessage from './interfaces/IWebsocketResourceMessage';
import Log from '@secret-agent/commons/Logger';
import PageEventsListener from './lib/PageEventsListener';
import { IDomChangeEvent } from '@secret-agent/injected-scripts/interfaces/IDomChangeEvent';
import { IFrameRecord } from './models/FramesTable';
import IDevtoolsClient from '@secret-agent/core/interfaces/IDevtoolsClient';
import PageHistory from './lib/PageHistory';
import { LocationStatus } from '@secret-agent/core-interfaces/Location';
import IViewport from '@secret-agent/core-interfaces/IViewport';
import IPage from '@secret-agent/core-interfaces/IPage';
import { IMouseEvent } from '@secret-agent/injected-scripts/interfaces/IMouseEvent';
import { IFocusEvent } from '@secret-agent/injected-scripts/interfaces/IFocusEvent';
import { IScrollEvent } from '@secret-agent/injected-scripts/interfaces/IScrollEvent';
import IScriptInstanceMeta from '@secret-agent/core-interfaces/IScriptInstanceMeta';
import FrameTracker from '@secret-agent/core/lib/FrameTracker';

const { log } = Log(module);

// ToDo: need to add mouse events

export default class SessionState {
  public emitter: EventEmitter;
  public readonly commands: ICommandMeta[] = [];
  public get lastCommand() {
    if (this.commands.length === 0) return;
    return this.commands[this.commands.length - 1];
  }

  public viewport: IViewport;
  public readonly pages: PageHistory;
  public readonly db: SessionDb;

  private readonly sessionId: string;
  private readonly sessionName: string;
  private readonly scriptInstanceMeta: IScriptInstanceMeta;
  private readonly createDate: Date;
  private readonly frames: { [frameId: number]: IFrameRecord } = {};
  private readonly resources: IResourceMeta[] = [];
  private readonly websocketMessages: IWebsocketResourceMessage[] = [];
  private readonly browserRequestIdToResourceId: { [browserRequestId: string]: number } = {};
  private resourceIdCounter = 0;
  private websocketMessageIdCounter = 0;
  private pageEventsListener: PageEventsListener;

  private websocketListeners: {
    [resourceId: string]: ((msg: IWebsocketResourceMessage) => any)[];
  } = {};

  constructor(
    sessionsDirectory: string,
    sessionId: string,
    sessionName: string | null,
    scriptInstanceMeta: IScriptInstanceMeta,
  ) {
    this.createDate = new Date();
    this.sessionId = sessionId;
    this.sessionName = sessionName;
    this.scriptInstanceMeta = scriptInstanceMeta;

    fs.mkdirSync(sessionsDirectory, { recursive: true });

    this.db = new SessionDb(sessionsDirectory, sessionId);
    this.pages = new PageHistory(this.db);
    this.emitter = new EventEmitter();

    if (scriptInstanceMeta) {
      const sessionsTable = SessionsDb.find(sessionsDirectory).sessions;
      sessionsTable.insert(
        sessionId,
        sessionName,
        this.createDate.toISOString(),
        scriptInstanceMeta.id,
        scriptInstanceMeta.entrypoint,
        scriptInstanceMeta.startDate,
      );
    }

    this.db.session.insert(
      sessionId,
      sessionName,
      this.createDate,
      scriptInstanceMeta?.id,
      scriptInstanceMeta?.entrypoint,
      scriptInstanceMeta?.startDate,
    );

    this.emitter.on('websocket-message', (msg: IWebsocketResourceMessage) => {
      const listeners = this.websocketListeners[msg.resourceId];
      if (!listeners) return;
      for (const listener of listeners) {
        listener(msg);
      }
    });
  }

  public async listenForPageEvents(devtoolsClient: IDevtoolsClient, frameTracker: FrameTracker) {
    this.pageEventsListener = new PageEventsListener(
      devtoolsClient,
      frameTracker,
      this.onPageEvents.bind(this),
    );
    this.pageEventsListener.onNewContext = contextId => {
      if (!this.lastCommand) return;
      return this.pageEventsListener.setCommandIdInContext(this.lastCommand.id, contextId);
    };
    await this.pageEventsListener.listen();
  }

  public async runCommand<T>(commandFn: () => Promise<T>, commandMeta: ICommandMeta) {
    this.commands.push(commandMeta);

    try {
      await this.pageEventsListener.setCommandIdForPage(commandMeta.id);

      commandMeta.startDate = new Date().toISOString();
      return await commandFn();
    } finally {
      commandMeta.endDate = new Date().toISOString();
      this.db.commands.insert(commandMeta);
    }
  }

  public onWebsocketMessages(resourceId: number, listenerFn: (message: IWebsocketMessage) => any) {
    if (!this.websocketListeners[resourceId]) {
      this.websocketListeners[resourceId] = [];
    }
    this.websocketListeners[resourceId].push(listenerFn);
    // push all existing
    for (const message of this.websocketMessages) {
      if (message.resourceId === resourceId) {
        listenerFn(message);
      }
    }
  }

  public stopWebsocketMessages(
    resourceId: string,
    listenerFn: (message: IWebsocketMessage) => any,
  ) {
    const listeners = this.websocketListeners[resourceId];
    if (!listeners) return;
    const idx = listeners.indexOf(listenerFn);
    if (idx >= 0) listeners.splice(idx, 1);
  }

  public captureWebsocketMessage(
    browserRequestId: string,
    isFromServer: boolean,
    message: string | Buffer,
  ) {
    const resourceId = this.browserRequestIdToResourceId[browserRequestId];
    if (!resourceId) {
      throw new Error(
        `Websocket Message broadcast for unknown request id: (browserRequestId: ${browserRequestId})`,
      );
    }

    const resourceMessage = {
      resourceId,
      message,
      messageId: this.websocketMessageIdCounter += 1,
      source: isFromServer ? 'server' : 'client',
    } as IWebsocketResourceMessage;

    this.websocketMessages.push(resourceMessage);
    this.db.websocketMessages.insert(this.lastCommand?.id, resourceMessage);

    this.emitter.emit('websocket-message', resourceMessage);
  }

  public captureResource(responseEvent: IRequestSessionResponseEvent): IResourceMeta {
    const {
      request,
      response,
      resourceType,
      remoteAddress,
      requestTime,
      body,
      redirectedToUrl,
    } = responseEvent;
    const responseHeaders: { [key: string]: string } = {};
    for (let i = 0; i <= response.rawHeaders.length; i += 2) {
      const name = response.rawHeaders[i];
      const value = response.rawHeaders[i + 1];
      if (name && value) {
        if (responseHeaders[name]) responseHeaders[name] += `\n${value}`;
        responseHeaders[name] = value;
      }
    }

    const meta = {
      id: this.resourceIdCounter += 1,
      url: response.url || request.url,
      receivedAtCommandId: this.lastCommand?.id,
      type: resourceType,
      isRedirect: !!redirectedToUrl,
      request: {
        url: request.url,
        timestamp: requestTime.toISOString(),
        headers: request.headers,
        method: request.method,
        postData: request.postData?.toString(),
      },
      response: {
        url: response.url || request.url, // if response was aborted, won't have a url
        timestamp: response.responseTime.toISOString(),
        headers: responseHeaders,
        remoteAddress: remoteAddress,
        statusCode: response.statusCode,
        statusText: response.statusMessage,
      },
    } as IResourceMeta;

    this.browserRequestIdToResourceId[responseEvent.browserRequestId] = meta.id;

    this.db.resources.insert(redirectedToUrl, meta, body);

    this.resources.push(meta);
    this.emitter.emit('resource', meta);
    return meta;
  }

  public async forEachResource(onResourceFn: (resourceMeta: IResourceMeta) => Promise<any>) {
    for (const resource of this.resources) {
      await onResourceFn(resource);
    }
  }

  public async getResourceData(id: number) {
    return this.db.getResourceData(id);
  }

  public getResourceMeta(id: number) {
    return this.resources.find(x => x.id === id);
  }

  //////// FRAMES ///////

  public captureFrameCreated(frameId: string, parentFrameId: string | null) {
    const frame = {
      id: frameId,
      parentId: parentFrameId,
      startCommandId: this.lastCommand?.id,
      url: null,
      createdTime: new Date().toISOString(),
    } as IFrameRecord;
    this.frames[frameId] = frame;
    this.db.frames.insert(frame);
  }

  public captureError(frameId: string, source: string, error) {
    log.error('Window.error', { source, error });
    this.db.logs.insert(frameId, source, error.stack ?? String(error), new Date());
  }

  public captureLog(frameId: string, type: string, message: string, location?: string) {
    log.info('Window.console', { type, message });
    this.db.logs.insert(frameId, type, message, new Date(), location);
  }

  public async saveBeforeWindowClose() {
    this.pageEventsListener.close();
    await this.flush();
    this.db.session.update(this.sessionId, {
      closeDate: new Date(),
      viewport: this.viewport,
    });
    this.db.close();
  }

  public async flush() {
    await this.pageEventsListener?.flush();
    await this.db.flush();
  }

  public async getPageDomChanges(pages: IPage[], flush: boolean = false, sinceCommandId?: number) {
    if (flush) {
      await this.flush();
    }
    return this.db.getDomChanges(
      pages.map(x => x.frameId),
      sinceCommandId,
    );
  }

  private async onPageEvents(
    frameId: string,
    domChanges: IDomChangeEvent[],
    mouseEvents: IMouseEvent[],
    focusEvents: IFocusEvent[],
    scrollEvents: IScrollEvent[],
  ) {
    const maxCommandId = domChanges.reduce((max, change) => {
      if (max > change[0]) return max;
      return change[0];
    }, -1);

    let startCommandId = maxCommandId;
    // find last page load
    for (let i = this.pages.history.length - 1; i >= 0; i -= 1) {
      const page = this.pages.history[i];
      if (page.stateChanges.has(LocationStatus.HttpResponded)) {
        startCommandId = page.startCommandId;
        break;
      }
    }

    for (const domChange of domChanges) {
      if (domChange[0] === -1) domChange[0] = startCommandId;
      await this.db.domChanges.insert(frameId, domChange);
    }

    for (const mouseEvent of mouseEvents) {
      if (mouseEvent[0] === -1) mouseEvent[0] = startCommandId;
      await this.db.mouseEvents.insert(mouseEvent);
    }

    for (const focusEvent of focusEvents) {
      if (focusEvent[0] === -1) focusEvent[0] = startCommandId;
      await this.db.focusEvents.insert(focusEvent);
    }

    for (const scrollEvent of scrollEvents) {
      if (scrollEvent[0] === -1) scrollEvent[0] = startCommandId;
      await this.db.scrollEvents.insert(scrollEvent);
    }
  }
}
