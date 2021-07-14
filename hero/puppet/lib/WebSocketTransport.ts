import * as EventUtils from '@ulixee/commons/eventUtils';
import { addEventListeners, TypedEventEmitter } from '@ulixee/commons/eventUtils';
import Log from '@ulixee/commons/Logger';
import IRegisteredEventListener from '@ulixee/hero-interfaces/IRegisteredEventListener';
import IConnectionTransport, {
  IConnectionTransportEvents,
} from '@ulixee/hero-interfaces/IConnectionTransport';
import * as WebSocket from 'ws';
import Resolvable from '@ulixee/commons/Resolvable';

const { log } = Log(module);

export class WebSocketTransport
  extends TypedEventEmitter<IConnectionTransportEvents>
  implements IConnectionTransport {
  eventListeners: IRegisteredEventListener[];

  public get waitForOpen(): Promise<void> {
    return this.connectResolvable.promise;
  }

  public get url(): string {
    return this.webSocket.url;
  }

  private readonly connectResolvable = new Resolvable<void>();
  private readonly webSocket: WebSocket;

  constructor(url: string, readonly label = 'root') {
    super();
    this.webSocket = new WebSocket(url);
    this.webSocket.on('open', this.connectResolvable.resolve);
    this.webSocket.on('error', this.connectResolvable.reject);
    this.eventListeners = addEventListeners(this.webSocket, [
      ['message', this.onMessage.bind(this)],
      ['close', this.onClosed.bind(this)],
      ['error', error => log.info('WebSocketTransport.Error', { error, sessionId: null })],
    ]);
    this.emit = this.emit.bind(this);
  }

  send(message: string) {
    this.webSocket.send(message);
  }

  close() {
    EventUtils.removeEventListeners(this.eventListeners);
    this.webSocket.close();
  }

  clone(): WebSocketTransport {
    return new WebSocketTransport(this.webSocket.url, 'clone');
  }

  private onClosed() {
    log.stats('WebSocketTransport.Closed');
    this.emit('close');
  }

  private onMessage(event: string): void {
    this.emit('message', event);
  }
}
