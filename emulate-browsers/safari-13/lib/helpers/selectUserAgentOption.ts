import IUserAgentMatchMeta from '@secret-agent/interfaces/IUserAgentMatchMeta';
import { pickRandom } from '@secret-agent/commons/utils';
import { IDataUserAgentOptions } from '@secret-agent/browser-emulator-utils/interfaces/IBrowserData';

export default function selectUserAgentOption(
  userAgentOptions: IDataUserAgentOptions,
  meta: IUserAgentMatchMeta,
) {
  if (!meta) return pickRandom(userAgentOptions as any[]);
  const filteredOptions = userAgentOptions.filter(userAgentOption => {
    if (userAgentOption.browserId !== meta.browser.id) return false;
    if (userAgentOption.operatingSystemId !== meta.operatingSystem.id) return false;
    return true;
  });
  return pickRandom(filteredOptions);
}
