import IHttpResourceLoadDetails from '@unblocked-web/emulator-spec/net/IHttpResourceLoadDetails';

export default interface IBrowserRequestMatcher {
  cancelPending(): void;
  resolveBrowserRequest(resource: IHttpResourceLoadDetails): void;
  determineResourceType(resource: IHttpResourceLoadDetails): void;
}
