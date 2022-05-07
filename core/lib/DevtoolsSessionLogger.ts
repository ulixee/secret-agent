import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import DevtoolsSession from './DevtoolsSession';
import { Protocol } from '@unblocked/emulator-spec/IDevtoolsSession';
import Frame from './Frame';
import BrowserContext from './BrowserContext';
import TargetInfo = Protocol.Target.TargetInfo;

interface IMessageDetails {
  sessionType: IDevtoolsLogEvents['devtools-message']['sessionType'];
  workerTargetId?: string;
  pageTargetId?: string;
}

export default class DevtoolsSessionLogger extends TypedEventEmitter<IDevtoolsLogEvents> {
  public static defaultTruncateMessageResponses: DevtoolsSessionLogger['truncateMessageResponses'] =
    new Set(['Page.captureScreenshot', 'Network.getResponseBody']);

  public static defaultTruncateParams: DevtoolsSessionLogger['truncateParams'] = new Map([
    ['Fetch.fulfillRequest', { maxLength: 50, path: 'body' }],
    ['Page.screencastFrame', { maxLength: 0, path: 'data' }],
    ['Page.addScriptToEvaluateOnNewDocument', { maxLength: 50, path: 'source' }],
    ['Runtime.bindingCalled', { maxLength: 250, path: 'payload' }],
    ['Runtime.evaluate', { maxLength: 250, path: 'expression' }],
  ]);

  public readonly truncateMessageResponses: Set<string>;
  public readonly truncateParams: Map<string, { maxLength: number; path: string }>;

  private events = new EventSubscriber();
  private fetchRequestIdToNetworkId = new Map<string, string>();
  private devtoolsSessions = new WeakSet<DevtoolsSession>();
  private browserContextInitiatedMessageIds = new Set<number>();
  private sentMessagesById: {
    [id: number]: {
      method: string;
      frameId?: string;
      requestId?: string;
    };
  } = {};

  constructor(readonly browserContext: BrowserContext) {
    super();
    this.truncateMessageResponses = DevtoolsSessionLogger.defaultTruncateMessageResponses;
    this.truncateParams = DevtoolsSessionLogger.defaultTruncateParams;
    this.logger = browserContext.logger.createChild(module);
    this.onEventReceive = this.onEventReceive.bind(this);
  }

  public close(): void {
    this.events.close();
    this.browserContextInitiatedMessageIds.clear();
    this.sentMessagesById = {};
  }

  public subscribeToDevtoolsMessages(
    devtoolsSession: DevtoolsSession,
    details: IMessageDetails,
  ): void {
    if (this.devtoolsSessions.has(devtoolsSession)) return;

    this.devtoolsSessions.add(devtoolsSession);

    this.events.on(
      devtoolsSession.messageEvents,
      'receive',
      this.onEventReceive.bind(this, details),
    );
    this.events.on(devtoolsSession.messageEvents, 'send', this.onEventSend.bind(this, details));
  }

  private onEventSend(
    details: IMessageDetails,
    event: DevtoolsSession['messageEvents']['EventTypes']['send'],
    initiator: any,
  ): void {
    // if sent from browser, only include when matching context id
    if (details.sessionType === 'browser') {
      if (initiator && initiator !== this.browserContext) return;
      this.browserContextInitiatedMessageIds.add(event.id);
    }
    if (initiator && initiator instanceof Frame) {
      (event as any).frameId = initiator.id;
    }
    this.filterAndSendMessage({
      direction: 'send',
      ...details,
      ...event,
    });
  }

  private onEventReceive(
    details: IMessageDetails,
    event: DevtoolsSession['messageEvents']['EventTypes']['receive'],
  ): void {
    if (details.sessionType === 'browser') {
      // see if this was initiated by this browser context
      if ('id' in event && !this.browserContextInitiatedMessageIds.has(event.id)) return;

      if ('params' in event) {
        const isOtherContext = this.isOtherBrowserContextTarget(event.params.targetInfo);
        if (isOtherContext) return;
      }
    }
    this.filterAndSendMessage({
      direction: 'receive',
      ...details,
      ...event,
    });
  }

  private isOtherBrowserContextTarget(target: TargetInfo): boolean {
    if (!target?.browserContextId) return false;
    return target.browserContextId !== this.browserContext.id;
  }

  private filterAndSendMessage(event: IDevtoolsLogEvents['devtools-message']): void {
    const params = event.params;
    let frameId = event.frameId;
    let requestId: string;
    let pageId = event.pageTargetId;
    if (params) {
      frameId = frameId ?? params.frame?.id ?? params.frameId ?? params.context?.auxData?.frameId;

      // translate Fetch.requestPaused networkId (which is what we use in other parts of the app
      requestId =
        this.fetchRequestIdToNetworkId.get(params.requestId) ??
        params.networkId ??
        params.requestId;
      if (params.networkId) this.fetchRequestIdToNetworkId.set(params.requestId, params.networkId);

      if (!pageId && params.targetInfo && params.targetInfo?.type === 'page') {
        pageId = params.targetInfo.targetId;
        event.pageTargetId = pageId;
      }
    }

    if (event.direction === 'send') {
      this.sentMessagesById[event.id] = {
        method: event.method,
        frameId,
        requestId,
      };
    } else if (event.id) {
      const sentMessage = this.sentMessagesById[event.id];
      delete this.sentMessagesById[event.id];
      if (sentMessage) {
        event.method = sentMessage.method;
        frameId ??= sentMessage.frameId;
        requestId ??= sentMessage.requestId;
      }
    }

    event.frameId = frameId;
    event.requestId = requestId;

    const method = event.method;
    const result = event.result;
    if (result) {
      if (this.truncateMessageResponses.has(method)) {
        let extras = '';
        if ('data' in result) {
          extras = ` ${result.data.length} chars`;
        }
        event.result = { ...result, data: `[truncated${extras}]` };
      }
    }

    if (params) {
      const truncateLength = this.truncateParams.get(method);
      if (truncateLength) {
        event.params = { ...params };
        const { maxLength, path } = truncateLength;
        const value = params[path];
        if (value && typeof value === 'string' && value.length > maxLength) {
          event.params[path] = `${value.substr(0, maxLength)}... [truncated ${
            value.length - maxLength
          } chars]`;
        }
      }
    }
    this.emit('devtools-message', event);

    this.logger.stats(`${event.direction}:${event.method}`, {
      pageId: event.pageTargetId,
      frameId: event.frameId,
      requestId: event.requestId,
      messageId: event.id,
      params: event.params,
      result: event.result,
      error: event.error,
    });
  }
}

interface IDevtoolsLogEvents {
  'devtools-message': {
    direction: 'send' | 'receive';
    timestamp: Date;
    pageTargetId?: string;
    workerTargetId?: string;
    frameId?: string;
    requestId?: string;
    sessionType: 'page' | 'worker' | 'browser';
    sessionId: string;
    method?: string;
    id?: number;
    params?: any;
    error?: any;
    result?: any;
  };
}
