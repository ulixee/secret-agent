import { URL } from 'url';
import IHttpResourceLoadDetails from './IHttpResourceLoadDetails';
import IDnsSettings from "./IDnsSettings";
import ITcpSettings from "./ITcpSettings";
import ITlsSettings from "./ITlsSettings";

export default interface INetworkEmulation {
  onDnsConfiguration?(settings: IDnsSettings): void;
  onTcpConfiguration?(settings: ITcpSettings): void;
  onTlsConfiguration?(settings: ITlsSettings): void;

  beforeHttpRequest?(request: IHttpResourceLoadDetails): Promise<any>;
  beforeHttpResponse?(resource: IHttpResourceLoadDetails): Promise<any>;
  // Function needed for browsers implementing first-party cookies
  websiteHasFirstPartyInteraction?(url: URL): void;
}
