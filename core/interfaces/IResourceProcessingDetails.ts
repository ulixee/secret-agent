import IHttpHeaders from '@unblocked-web/emulator-spec/net/IHttpHeaders';

export default interface IResourceProcessingDetails {
  socketId: number;
  redirectedToUrl?: string;
  originalHeaders: IHttpHeaders;
  responseOriginalHeaders?: IHttpHeaders;
  protocol: string;
  dnsResolvedIp?: string;
  wasCached?: boolean;
  wasIntercepted: boolean;
  browserRequestId?: string;
  isHttp2Push: boolean;
  browserBlockedReason?: string;
  browserCanceled?: boolean;
}
