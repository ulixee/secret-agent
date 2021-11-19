import { Helpers } from '@secret-agent/testing';
import CorePlugins from '@secret-agent/core/lib/CorePlugins';
import { IBoundLog } from '@secret-agent/interfaces/ILog';
import Log from '@secret-agent/commons/Logger';
import RequestSession from '@secret-agent/mitm/handlers/RequestSession';
import MitmServer from '@secret-agent/mitm/lib/MitmProxy';
import lookupPublicIp, { IpLookupServices } from '../lib/helpers/lookupPublicIp';
import BrowserEmulator from '../index';

const { log } = Log(module);
const browserEmulatorId = BrowserEmulator.id;
const selectBrowserMeta = BrowserEmulator.selectBrowserMeta();

afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

test('can resolve a v4 address', async () => {
  await expect(lookupPublicIp()).resolves.toBeTruthy();
});

test('can resolve an ip address with a mitm socket', async () => {
  const mitmServer = await MitmServer.start();
  Helpers.needsClosing.push(mitmServer);

  const plugins = new CorePlugins({ browserEmulatorId, selectBrowserMeta }, log as IBoundLog);
  const session = new RequestSession(`1`, plugins);
  mitmServer.registerSession(session, false);
  Helpers.needsClosing.push(session);

  await expect(lookupPublicIp(IpLookupServices.aws, session.requestAgent)).resolves.toBeTruthy();
});
