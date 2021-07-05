import { Helpers } from '@secret-agent/testing';
import Core, { Session } from '@secret-agent/core';
import { Handler } from '@secret-agent/client';
import ProxyLeaksCorePlugin from '../index';

let handler: Handler;
beforeAll(async () => {
  await Core.start();
  Core.use(ProxyLeaksCorePlugin);
  handler = new Handler({ host: await Core.server.address });
  Helpers.onClose(() => handler.close(), true);
});

afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

test('should escape proxy detection', async () => {
  const httpsserver = await Helpers.runHttpsServer((req, res) => res.end('<h1>Hi</h1>'));
  const agent = await handler.createAgent({ showReplay: false });
  Helpers.needsClosing.push(agent);
  const tabId = await agent.activeTab.tabId;
  const sessionId = await agent.sessionId;
  const tab = Session.getTab({ tabId, sessionId });
  const page = tab.puppetPage;
  await agent.goto(httpsserver.baseUrl);
  await agent.waitForPaintingStable();

  const result = await page.evaluate<string>(`(() => {
   // return String(new TypeError("Class extends value " + Permissions.prototype.query + " is not a constructor or null"))
   try {
        class Blah extends Permissions.prototype.query {}
        return ''
    } catch (error) {
        return String(error)
    }
  })();`);
  expect(result).toBe(
    'TypeError: Class extends value function query() { [native code] } is not a constructor or null',
  );

  const result2 = await page.evaluate<string>(`(() => {
  const testFn = Function.prototype.toString
    try {
        testFn instanceof testFn;
        return '';
    } catch (error) {
        return error.stack
    }
  })();`);
  expect(result2).not.toContain(`Proxy.[Symbol.hasInstance]`);
});

test.skip('should escape proxy detection on creepjs', async () => {
  const agent = await handler.createAgent({ showReplay: true });
  Helpers.needsClosing.push(agent);

  await agent.goto('https://abrahamjuliot.github.io/creepjs/');
  await agent.waitForPaintingStable();
  await agent.waitForMillis(5e3);

  const stealthRating = await agent.document.querySelector('.stealth-rating').textContent;
  expect(stealthRating.substr(0, 3)).toBe('0% ');
  await agent.close();
}, 40e3);
