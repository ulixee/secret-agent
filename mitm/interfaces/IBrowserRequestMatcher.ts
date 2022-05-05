import IHttpResourceLoadDetails from '@bureau/interfaces/IHttpResourceLoadDetails';

export default interface IBrowserRequestMatcher {
  cancelPending(): void;
  resolveBrowserRequest(resource: IHttpResourceLoadDetails): void;
  determineResourceType(resource: IHttpResourceLoadDetails): void;
}
