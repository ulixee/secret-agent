import IHttpResourceLoadDetails from '@unblocked/emulator-spec/IHttpResourceLoadDetails';

export default interface IBrowserRequestMatcher {
  cancelPending(): void;
  resolveBrowserRequest(resource: IHttpResourceLoadDetails): void;
  determineResourceType(resource: IHttpResourceLoadDetails): void;
}
