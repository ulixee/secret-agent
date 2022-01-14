import { Http2Session } from 'http2';
import { Log } from '@secret-agent/commons/Logger';
import { IBoundLog } from '@secret-agent/interfaces/ILog';
import { IEventSubscriber } from '@secret-agent/interfaces/IRegisteredEventListener';
import { bindFunctions } from '@secret-agent/commons/utils';

export default class Http2SessionBinding {
  private logger: IBoundLog;

  constructor(
    readonly clientSession: Http2Session,
    readonly serverSession: Http2Session,
    readonly eventSubscriber: IEventSubscriber,
    logData: { sessionId: string } & any,
  ) {
    this.logger = new Log(module, logData) as IBoundLog;
    bindFunctions(this);
    this.bind();
  }

  private bind(): void {
    const clientSession = this.clientSession;
    const serverSession = this.serverSession;

    if (clientSession) {
      this.eventSubscriber.on(clientSession, 'ping', this.pingServer);
    }

    this.eventSubscriber.on(serverSession, 'error', this.onServerError);
    this.eventSubscriber.on(serverSession, 'close', this.onServerClose);
    this.eventSubscriber.on(serverSession, 'goaway', this.onServerGoaway);
    this.eventSubscriber.on(serverSession, 'remoteSettings', remoteSettings => {
      this.logger.stats('Http2Client.remoteSettings', {
        settings: remoteSettings,
      });
    });
    this.eventSubscriber.on(serverSession, 'frameError', (frameType, errorCode) => {
      this.logger.warn('Http2Client.frameError', {
        frameType,
        errorCode,
      });
    });
    this.eventSubscriber.on(serverSession, 'altsvc', (alt, altOrigin) => {
      this.logger.stats('Http2.altsvc', {
        altOrigin,
        alt,
      });
    });
    this.eventSubscriber.on(serverSession, 'origin', origins => {
      this.logger.stats('Http2.origin', {
        origins,
      });
    });
  }

  private pingServer(bytes: Buffer): void {
    if (this.serverSession.destroyed) return;
    this.serverSession.ping(bytes, () => null);
  }

  private onServerClose(): void {
    this.logger.info('Http2Client.close');
    if (!this.clientSession || this.clientSession.destroyed) return;
    this.clientSession.close();
  }

  private onServerError(error: Error): void {
    this.logger.warn('Http2Client.error', {
      error,
    });
    if (!this.clientSession || this.clientSession.destroyed) return;
    this.clientSession.destroy(error);
  }

  private onServerGoaway(
    code: number,
    lastStreamID?: number,
    opaqueData?: NodeJS.ArrayBufferView,
  ): void {
    this.logger.stats('Http2.goaway', {
      code,
      lastStreamID,
      opaqueData,
    });
    if (!this.clientSession || this.clientSession.destroyed) return;
    this.clientSession.goaway(code);
  }
}
