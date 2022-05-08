import * as http from 'http';
import IResolvablePromise from '@ulixee/commons/interfaces/IResolvablePromise';
import { createPromise } from '@ulixee/commons/lib/utils';
import IResourceType from '@unblocked-web/emulator-spec/net/IResourceType';
import IHttpResourceLoadDetails from '@unblocked-web/emulator-spec/net/IHttpResourceLoadDetails';
import IResourceRequest from '@unblocked-web/emulator-spec/net/IResourceRequest';
import IHttpHeaders from '@unblocked-web/emulator-spec/net/IHttpHeaders';
import * as http2 from 'http2';
import IResourceResponse from '@unblocked-web/emulator-spec/net/IResourceResponse';
import * as net from 'net';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import MitmSocket from '@unblocked-web/sa-mitm-socket/index';
import { URL } from 'url';
import MitmRequestAgent from '../lib/MitmRequestAgent';
import IMitmRequestContext from '../interfaces/IMitmRequestContext';
import { Dns } from '../lib/Dns';
import ResourceState from '../interfaces/ResourceState';
import IBrowserRequestMatcher from '../interfaces/IBrowserRequestMatcher';
import { IBrowserContextHooks, INetworkHooks } from '@unblocked-web/emulator-spec/hooks/IHooks';
import { IPage } from '@unblocked-web/emulator-spec/browser/IPage';
import EventSubscriber from '@ulixee/commons/lib/EventSubscriber';
import { IBoundLog } from '@ulixee/commons/interfaces/ILog';

export default class RequestSession
  extends TypedEventEmitter<IRequestSessionEvents>
  implements IBrowserContextHooks
{
  public websocketBrowserResourceIds: {
    [headersHash: string]: IResolvablePromise<string>;
  } = {};

  public isClosing = false;
  public interceptorHandlers: {
    types?: IResourceType[];
    urls?: string[];
    handlerFn?: (
      url: URL,
      type: IResourceType,
      request: http.IncomingMessage | http2.Http2ServerRequest,
      response: http.ServerResponse | http2.Http2ServerResponse,
    ) => boolean | Promise<boolean>;
  }[] = [];

  public requestAgent: MitmRequestAgent;
  public requestedUrls: {
    url: string;
    redirectedToUrl: string;
    redirectChain: string[];
    responseTime: number;
  }[] = [];

  public respondWithHttpErrorStacks = true;

  // use this to bypass the mitm and just return a dummy response (ie for UserProfile setup)
  public bypassAllWithEmptyResponse: boolean;
  public bypassResourceRegistrationForHost: URL;
  public browserRequestMatcher?: IBrowserRequestMatcher;
  public logger: IBoundLog;

  public readonly hooks: INetworkHooks[] = [];

  private readonly dns: Dns;
  private events = new EventSubscriber();

  constructor(
    readonly sessionId: string,
    hooks: INetworkHooks,
    logger: IBoundLog,
    public upstreamProxyUrl?: string,
  ) {
    super();
    this.logger = logger.createChild(module);
    this.requestAgent = new MitmRequestAgent(this);
    this.dns = new Dns(this);
    if (hooks) this.hook(hooks);
  }

  public hook(hooks: INetworkHooks): void {
    this.hooks.push(hooks);
  }

  public trackResourceRedirects(resource: IHttpResourceLoadDetails): void {
    const resourceRedirect = {
      url: resource.url.href,
      redirectedToUrl: resource.redirectedToUrl,
      responseTime: resource.responseTime,
      redirectChain: [],
    };
    this.requestedUrls.push(resourceRedirect);

    const redirect = this.requestedUrls.find(
      x =>
        x.redirectedToUrl === resourceRedirect.url && resource.requestTime - x.responseTime < 5e3,
    );
    resource.isFromRedirect = !!redirect;
    if (redirect) {
      const redirectChain = [redirect.url, ...redirect.redirectChain];
      resource.previousUrl = redirectChain[0];
      resource.firstRedirectingUrl = redirectChain[redirectChain.length - 1];
      resourceRedirect.redirectChain = redirectChain;
    }
  }

  public async willSendResponse(context: IMitmRequestContext): Promise<void> {
    context.setState(ResourceState.EmulationWillSendResponse);

    if (context.resourceType === 'Document' && context.status === 200) {
      for (const hook of this.hooks) {
        await hook.websiteHasFirstPartyInteraction?.(context.url);
      }
    }
    for (const hook of this.hooks) {
      await hook.beforeHttpResponse?.(context);
    }
  }

  public async lookupDns(host: string): Promise<string> {
    if (this.dns) {
      try {
        return await this.dns.lookupIp(host);
      } catch (error) {
        this.logger.info('DnsLookup.Error', {
          error,
        });
        // if fails, pass through to returning host untouched
      }
    }
    return Promise.resolve(host);
  }

  public getProxyCredentials(): string {
    return `ulixee:${this.sessionId}`;
  }

  public close(): void {
    if (this.isClosing) return;
    const logid = this.logger.stats('MitmRequestSession.Closing');
    this.isClosing = true;
    const errors: Error[] = [];
    this.events.close();
    this.browserRequestMatcher?.cancelPending();
    this.browserRequestMatcher = null;
    try {
      this.requestAgent.close();
    } catch (err) {
      errors.push(err);
    }
    try {
      this.dns.close();
    } catch (err) {
      errors.push(err);
    }
    this.logger.stats('MitmRequestSession.Closed', { parentLogId: logid, errors });

    setImmediate(() => {
      this.emit('close');
      this.removeAllListeners();
    });
  }

  public shouldInterceptRequest(url: string): boolean {
    for (const handler of this.interceptorHandlers) {
      if (!handler.urls) continue;
      for (const blockedUrlFragment of handler.urls) {
        if (url.includes(blockedUrlFragment) || url.match(blockedUrlFragment)) {
          return true;
        }
      }
    }
    return false;
  }

  public async didHandleInterceptResponse(
    ctx: IMitmRequestContext,
    request: http.IncomingMessage | http2.Http2ServerRequest,
    response: http.ServerResponse | http2.Http2ServerResponse,
  ): Promise<boolean> {
    const url = ctx.url.href;
    for (const handler of this.interceptorHandlers) {
      const isMatch =
        handler.types?.includes(ctx.resourceType) ||
        handler.urls?.some(x => url.includes(x) || url.match(x));
      if (
        isMatch &&
        handler.handlerFn &&
        (await handler.handlerFn(ctx.url, ctx.resourceType, request, response))
      ) {
        return true;
      }
    }
    return false;
  }

  /////// / BROWSER HOOKS ///////////////////////////////////////////////////////////////////////////////////////////////

  public onNewPage(page: IPage): Promise<void> {
    this.events.on(page, 'websocket-handshake', this.registerWebsocketHeaders.bind(this));
    this.events.on(page, 'navigation-response', this.recordDocumentUserActivity.bind(this));
    return Promise.resolve();
  }

  public recordDocumentUserActivity(event: { url: string }): void {
    for (const hook of this.hooks) {
      void hook.websiteHasFirstPartyInteraction?.(new URL(event.url));
    }
  }

  /////// Websockets ///////////////////////////////////////////////////////////

  public getWebsocketUpgradeRequestId(headers: IHttpHeaders): Promise<string> {
    const key = this.getWebsocketHeadersKey(headers);

    this.websocketBrowserResourceIds[key] ??= createPromise<string>(30e3);
    return this.websocketBrowserResourceIds[key].promise;
  }

  public registerWebsocketHeaders(message: {
    browserRequestId: string;
    headers: IHttpHeaders;
  }): void {
    const key = this.getWebsocketHeadersKey(message.headers);

    this.websocketBrowserResourceIds[key] ??= createPromise<string>();
    this.websocketBrowserResourceIds[key].resolve(message.browserRequestId);
  }

  private getWebsocketHeadersKey(headers: IHttpHeaders): string {
    let websocketKey: string;
    let host: string;
    for (const key of Object.keys(headers)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'sec-websocket-key') websocketKey = headers[key] as string;
      if (lowerKey === 'host') host = headers[key] as string;
    }
    return [host, websocketKey].join(',');
  }

  public static sendNeedsAuth(socket: net.Socket): void {
    socket.end(
      'HTTP/1.1 407 Proxy Authentication Required\r\n' +
        'Proxy-Authenticate: Basic realm="sa"\r\n\r\n',
    );
  }
}

interface IRequestSessionEvents {
  close: void;
  response: IRequestSessionResponseEvent;
  request: IRequestSessionRequestEvent;
  'http-error': IRequestSessionHttpErrorEvent;
  'resource-state': IResourceStateChangeEvent;
  'socket-connect': ISocketEvent;
  'socket-close': ISocketEvent;
}

export interface ISocketEvent {
  socket: MitmSocket;
}

export interface IResourceStateChangeEvent {
  context: IMitmRequestContext;
  state: ResourceState;
}

export interface IRequestSessionResponseEvent extends IRequestSessionRequestEvent {
  browserRequestId: string;
  frameId: number;
  response: IResourceResponse;
  wasCached: boolean;
  dnsResolvedIp?: string;
  resourceType: IResourceType;
  responseOriginalHeaders?: IHttpHeaders;
  body: Buffer;
  redirectedToUrl?: string;
  executionMillis: number;
  browserBlockedReason?: string;
  browserCanceled?: boolean;
}

export interface IRequestSessionRequestEvent {
  id: number;
  url: URL;
  request: IResourceRequest;
  postData: Buffer;
  documentUrl: string;
  serverAlpn: string;
  protocol: string;
  socketId: number;
  isHttp2Push: boolean;
  wasIntercepted: boolean;
  originalHeaders: IHttpHeaders;
  localAddress: string;
}

export interface IRequestSessionHttpErrorEvent {
  request: IRequestSessionResponseEvent;
  error: Error;
}
