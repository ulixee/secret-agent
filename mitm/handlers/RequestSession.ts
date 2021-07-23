import * as http from 'http';
import IResolvablePromise from '@ulixee/commons/interfaces/IResolvablePromise';
import { createPromise } from '@ulixee/commons/utils';
import ResourceType from '@ulixee/hero-interfaces/ResourceType';
import IHttpResourceLoadDetails from '@ulixee/hero-interfaces/IHttpResourceLoadDetails';
import IResourceRequest from '@ulixee/hero-interfaces/IResourceRequest';
import IResourceHeaders from '@ulixee/hero-interfaces/IResourceHeaders';
import * as http2 from 'http2';
import IResourceResponse from '@ulixee/hero-interfaces/IResourceResponse';
import * as net from 'net';
import { TypedEventEmitter } from '@ulixee/commons/eventUtils';
import Log from '@ulixee/commons/Logger';
import MitmSocket from '@ulixee/hero-mitm-socket/index';
import ICorePlugins from '@ulixee/hero-interfaces/ICorePlugins';
import { URL } from 'url';
import MitmRequestAgent from '../lib/MitmRequestAgent';
import IMitmRequestContext from '../interfaces/IMitmRequestContext';
import { Dns } from '../lib/Dns';
import ResourceState from '../interfaces/ResourceState';
import BrowserRequestMatcher from '../lib/BrowserRequestMatcher';

const { log } = Log(module);

export default class RequestSession extends TypedEventEmitter<IRequestSessionEvents> {
  public websocketBrowserResourceIds: {
    [headersHash: string]: IResolvablePromise<string>;
  } = {};

  public isClosing = false;
  public blockedResources: {
    types: ResourceType[];
    urls: string[];
    handlerFn?: (
      request: http.IncomingMessage | http2.Http2ServerRequest,
      response: http.ServerResponse | http2.Http2ServerResponse,
    ) => boolean;
  } = {
    types: [],
    urls: [],
  };

  public requestAgent: MitmRequestAgent;
  public requestedUrls: {
    url: string;
    redirectedToUrl: string;
    redirectChain: string[];
    responseTime: Date;
  }[] = [];

  public readonly browserRequestMatcher: BrowserRequestMatcher;

  // use this to bypass the mitm and just return a dummy response (ie for UserProfile setup)
  public bypassAllWithEmptyResponse: boolean;

  private readonly dns: Dns;

  constructor(
    readonly sessionId: string,
    readonly plugins: ICorePlugins,
    public upstreamProxyUrl?: string,
  ) {
    super();
    this.logger = log.createChild(module, {
      sessionId,
    });
    this.requestAgent = new MitmRequestAgent(this);
    this.dns = new Dns(this);
    this.browserRequestMatcher = new BrowserRequestMatcher(this);
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
        x.redirectedToUrl === resourceRedirect.url &&
        resource.requestTime.getTime() - x.responseTime.getTime() < 5e3,
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
      this.plugins.websiteHasFirstPartyInteraction(context.url);
    }

    await this.plugins.beforeHttpResponse(context);
  }

  public async lookupDns(host: string): Promise<string> {
    if (this.dns) {
      try {
        return await this.dns.lookupIp(host);
      } catch (error) {
        log.info('DnsLookup.Error', {
          sessionId: this.sessionId,
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
    this.browserRequestMatcher.cancelPending();
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

    setImmediate(() => this.emit('close'));
  }

  public shouldBlockRequest(url: string): boolean {
    if (!this.blockedResources?.urls) {
      return false;
    }
    for (const blockedUrlFragment of this.blockedResources.urls) {
      if (url.includes(blockedUrlFragment) || url.match(blockedUrlFragment)) {
        return true;
      }
    }
    return false;
  }

  // function to override for
  public blockHandler(
    request: http.IncomingMessage | http2.Http2ServerRequest,
    response: http.ServerResponse | http2.Http2ServerResponse,
  ): boolean {
    if (this.blockedResources?.handlerFn) return this.blockedResources.handlerFn(request, response);
    return false;
  }

  public recordDocumentUserActivity(documentUrl: string): void {
    this.plugins.websiteHasFirstPartyInteraction(new URL(documentUrl));
  }

  /////// Websockets ///////////////////////////////////////////////////////////

  public getWebsocketUpgradeRequestId(headers: IResourceHeaders): Promise<string> {
    const key = this.getWebsocketHeadersKey(headers);

    this.websocketBrowserResourceIds[key] ??= createPromise<string>(30e3);
    return this.websocketBrowserResourceIds[key].promise;
  }

  public registerWebsocketHeaders(
    tabId: number,
    message: {
      browserRequestId: string;
      headers: IResourceHeaders;
    },
  ): void {
    this.browserRequestMatcher.requestIdToTabId.set(message.browserRequestId, tabId);
    const key = this.getWebsocketHeadersKey(message.headers);

    this.websocketBrowserResourceIds[key] ??= createPromise<string>();
    this.websocketBrowserResourceIds[key].resolve(message.browserRequestId);
  }

  private getWebsocketHeadersKey(headers: IResourceHeaders): string {
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
  response: IResourceResponse;
  wasCached: boolean;
  dnsResolvedIp?: string;
  resourceType: ResourceType;
  responseOriginalHeaders?: IResourceHeaders;
  body: Buffer;
  redirectedToUrl?: string;
  executionMillis: number;
  browserBlockedReason?: string;
  browserCanceled?: boolean;
}

export interface IRequestSessionRequestEvent {
  id: number;
  request: IResourceRequest;
  serverAlpn: string;
  protocol: string;
  socketId: number;
  isHttp2Push: boolean;
  didBlockResource: boolean;
  originalHeaders: IResourceHeaders;
  localAddress: string;
}

export interface IRequestSessionHttpErrorEvent {
  request: IRequestSessionResponseEvent;
  error: Error;
}
