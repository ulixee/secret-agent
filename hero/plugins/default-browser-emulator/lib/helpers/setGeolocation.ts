import { assert } from '@ulixee/commons/utils';
import { IPuppetPage } from '@ulixee/hero-interfaces/IPuppetPage';
import BrowserEmulator from '../../index';

export default function setActiveAndFocused(
  emulator: BrowserEmulator,
  page: IPuppetPage,
): Promise<any> {
  const location = emulator.geolocation;
  if (!location) return;

  assert(Math.abs(location.latitude) <= 90, 'Latitude must be in a range from -90 to 90');
  assert(Math.abs(location.longitude) <= 180, 'Longitude must be in a range from -180 to 180');

  if (!location.accuracy) location.accuracy = 50 - Math.floor(Math.random() * 10);
  assert(location.accuracy >= 0, 'Accuracy must be a number greater than or equal to 0');

  return Promise.all([
    page.devtoolsSession.send('Emulation.setGeolocationOverride', {
      ...location,
    }),
    page.browserContext.sendWithBrowserDevtoolsSession('Browser.grantPermissions', {
      permissions: ['geolocation'],
      browserContextId: page.browserContext.id,
    }),
  ]);
}
