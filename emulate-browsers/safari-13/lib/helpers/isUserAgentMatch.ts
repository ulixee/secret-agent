import IUserAgentMatchMeta from "@secret-agent/interfaces/IUserAgentMatchMeta";
import { IDataBasic } from "@secret-agent/browser-emulator-utils/interfaces/IBrowserData";

export default function isUserAgentMatch(basicData: IDataBasic, meta: IUserAgentMatchMeta): boolean {
  const { browserMatcher } = basicData;
  if (!browserMatcher) return false;
  const matchName = (browserMatcher.name || '').toLowerCase();
  const matchVersionRange = browserMatcher.versionRange || [];
  const metaBrowser = meta.browser;
  if (metaBrowser.name !== matchName) return false;
  if (!matchVersionRange.length) return true;

  const minMajorVersion = Math.min(...matchVersionRange);
  const maxMajorVersion = Math.max(...matchVersionRange);

  return (
    metaBrowser.version.major >= minMajorVersion && metaBrowser.version.major <= maxMajorVersion
  );
}
