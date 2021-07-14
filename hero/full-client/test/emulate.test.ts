import * as Fs from 'fs';
import { Helpers } from '@ulixee/testing';
import { GlobalPool } from '@ulixee/hero-core';
import { ITestKoaServer } from '@ulixee/testing/helpers';
import Resolvable from '@ulixee/commons/Resolvable';
import Viewports from '@ulixee/default-browser-emulator/lib/Viewports';
import { Handler } from '../index';

let koaServer: ITestKoaServer;
let handler: Handler;
beforeAll(async () => {
  handler = new Handler();
  Helpers.onClose(() => handler.close(), true);
  koaServer = await Helpers.runKoaServer(true);
  GlobalPool.maxConcurrentHerosCount = 3;
});
afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

describe('basic Emulator tests', () => {
  it('should be able to set a timezoneId', async () => {
    const hero = await handler.createHero({
      timezoneId: 'America/Los_Angeles',
    });
    Helpers.needsClosing.push(hero);
    await new Promise(resolve => setTimeout(resolve, 1e3));

    await hero.goto(`${koaServer.baseUrl}`);

    const formatted = 'Sat Nov 19 2016 10:12:34 GMT-0800 (Pacific Standard Time)';
    const timezoneOffset = await hero.getJsValue('new Date(1479579154987).toString()');
    expect(timezoneOffset).toBe(formatted);
  });

  it('should affect accept-language header', async () => {
    const hero = await handler.createHero({ locale: 'en-GB,en' });
    Helpers.needsClosing.push(hero);

    let acceptLanguage = '';
    koaServer.get('/headers', ctx => {
      acceptLanguage = ctx.get('accept-language');
      ctx.body = '<html></html>';
    });

    await hero.goto(`${koaServer.baseUrl}/headers`);
    expect(acceptLanguage).toBe('en-GB,en;q=0.9');
  });

  it('should affect navigator.language', async () => {
    const hero = await handler.createHero({ locale: 'fr-CH,fr-CA' });
    Helpers.needsClosing.push(hero);

    await hero.goto(`${koaServer.baseUrl}`);
    const result = await hero.getJsValue(`navigator.language`);
    expect(result).toBe('fr-CH');

    const result2 = await hero.getJsValue(`navigator.languages`);
    expect(result2).toStrictEqual(['fr-CH', 'fr-CA']);
  });

  it('should format number', async () => {
    {
      const hero = await handler.createHero({ locale: 'en-US,en;q=0.9' });
      Helpers.needsClosing.push(hero);

      await hero.goto(`${koaServer.baseUrl}`);
      const result = await hero.getJsValue(`(1000000.5).toLocaleString()`);
      expect(result).toBe('1,000,000.5');
    }
    {
      const hero = await handler.createHero({ locale: 'fr-CH' });
      Helpers.needsClosing.push(hero);

      await hero.goto(`${koaServer.baseUrl}`);

      const result = await hero.getJsValue(`(1000000.5).toLocaleString()`);
      expect(result).toBe('1 000 000,5');
    }
  });

  it('should format date', async () => {
    {
      const hero = await handler.createHero({
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
      });
      Helpers.needsClosing.push(hero);

      await hero.goto(`${koaServer.baseUrl}`);

      const formatted = 'Sat Nov 19 2016 10:12:34 GMT-0800 (Pacific Standard Time)';

      const result = await hero.getJsValue(`new Date(1479579154987).toString()`);
      expect(result).toBe(formatted);
    }
    {
      const hero = await handler.createHero({
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
      });
      Helpers.needsClosing.push(hero);

      await hero.goto(`${koaServer.baseUrl}`);

      const formatted = 'Sat Nov 19 2016 19:12:34 GMT+0100 (Mitteleuropäische Normalzeit)';
      const result = await hero.getJsValue(`new Date(1479579154987).toString()`);
      expect(result).toBe(formatted);
    }
  });
});

describe('setScreensize', () => {
  it('should set the proper viewport size', async () => {
    const windowFraming = {
      screenGapLeft: 0,
      screenGapTop: 0,
      screenGapRight: 0,
      screenGapBottom: 0,
      frameBorderWidth: 0,
      frameBorderHeight: 0,
    };
    const viewport = Viewports.getDefault(windowFraming, windowFraming);
    const hero = await handler.createHero({
      viewport,
    });
    Helpers.needsClosing.push(hero);

    await hero.goto(`${koaServer.baseUrl}`);
    const screenWidth = await hero.getJsValue('screen.width');
    expect(screenWidth).toBe(viewport.screenWidth);
    const screenHeight = await hero.getJsValue('screen.height');
    expect(screenHeight).toBe(viewport.screenHeight);

    const screenX = await hero.getJsValue('screenX');
    expect(screenX).toBe(viewport.positionX);
    const screenY = await hero.getJsValue('screenY');
    expect(screenY).toBe(viewport.positionY);

    const innerWidth = await hero.getJsValue('innerWidth');
    expect(innerWidth).toBe(viewport.width);
    const innerHeight = await hero.getJsValue('innerHeight');
    expect(innerHeight).toBe(viewport.height);
  });

  it('should support Media Queries', async () => {
    const hero = await handler.createHero({
      viewport: {
        width: 200,
        height: 200,
        screenWidth: 200,
        screenHeight: 200,
        positionY: 0,
        positionX: 0,
      },
    });
    Helpers.needsClosing.push(hero);

    expect(await hero.getJsValue(`matchMedia('(min-device-width: 100px)').matches`)).toBe(true);
    expect(await hero.getJsValue(`matchMedia('(min-device-width: 300px)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(max-device-width: 100px)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(max-device-width: 300px)').matches`)).toBe(true);
    expect(await hero.getJsValue(`matchMedia('(device-width: 500px)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(device-width: 200px)').matches`)).toBe(true);

    expect(await hero.getJsValue(`matchMedia('(min-device-height: 100px)').matches`)).toBe(true);
    expect(await hero.getJsValue(`matchMedia('(min-device-height: 300px)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(max-device-height: 100px)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(max-device-height: 300px)').matches`)).toBe(true);
    expect(await hero.getJsValue(`matchMedia('(device-height: 500px)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(device-height: 200px)').matches`)).toBe(true);
  });
});

describe('mouse', () => {
  it('should emulate the hover media feature', async () => {
    const hero = await handler.createHero();
    Helpers.needsClosing.push(hero);

    expect(await hero.getJsValue(`matchMedia('(hover: none)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(hover: hover)').matches`)).toBe(true);
    expect(await hero.getJsValue(`matchMedia('(any-hover: none)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(any-hover: hover)').matches`)).toBe(true);
    expect(await hero.getJsValue(`matchMedia('(pointer: coarse)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(pointer: fine)').matches`)).toBe(true);
    expect(await hero.getJsValue(`matchMedia('(any-pointer: coarse)').matches`)).toBe(false);
    expect(await hero.getJsValue(`matchMedia('(any-pointer: fine)').matches`)).toBe(true);
  });
});

describe('geolocation', () => {
  it('should be able to set a geolocation', async () => {
    const hero = await handler.createHero({ geolocation: { longitude: 10, latitude: 10 } });
    Helpers.needsClosing.push(hero);
    await hero.goto(koaServer.baseUrl);

    const geolocation = await hero.getJsValue(`new Promise(resolve => navigator.geolocation.getCurrentPosition(position => {
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      }))`);
    expect(geolocation).toEqual({
      latitude: 10,
      longitude: 10,
    });
  });
});

describe('user hero and platform', () => {
  const propsToGet = `appVersion, platform, userAgent, deviceMemory`.split(',').map(x => x.trim());

  it('should be able to configure a userAgent', async () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4472.124 Safari/537.36';
    const hero = await handler.createHero({
      userAgent,
    });
    Helpers.needsClosing.push(hero);

    const heroMeta = await hero.meta;
    expect(heroMeta.userAgentString).toBe(userAgent);
  });

  it('should be able to configure a userAgent with a range', async () => {
    const hero = await handler.createHero({
      userAgent: '~ chrome >= 88 && chrome < 89',
    });
    Helpers.needsClosing.push(hero);

    const heroMeta = await hero.meta;
    const chromeMatch = heroMeta.userAgentString.match(/Chrome\/(\d+)/);
    expect(chromeMatch).toBeTruthy();
    const version = Number(chromeMatch[1]);
    expect(version).toBe(88);
  });

  it('should be able to configure a userAgent with a wildcard', async () => {
    const hero = await handler.createHero({
      userAgent: '~ chrome = 88.x',
    });
    Helpers.needsClosing.push(hero);

    const heroMeta = await hero.meta;
    const chromeMatch = heroMeta.userAgentString.match(/Chrome\/(\d+)/);
    expect(chromeMatch).toBeTruthy();
    const version = Number(chromeMatch[1]);
    expect(version).toBe(88);
  });

  it('should add user hero and platform to window & frames', async () => {
    const hero = await handler.createHero();
    Helpers.needsClosing.push(hero);

    const heroMeta = await hero.meta;

    const requestUserAgentStrings: string[] = [];

    koaServer.get('/agent-test', ctx => {
      requestUserAgentStrings.push(ctx.get('user-agent'));
      ctx.body = `<html lang="en">
<h1>Agent Test</h1>
<iframe src="/frame"></iframe>
</html>`;
    });

    koaServer.get('/frame', ctx => {
      requestUserAgentStrings.push(ctx.get('user-agent'));
      ctx.body = `<html><body>
<script>
  const { ${propsToGet.join(',')} } = navigator;
  fetch('${koaServer.baseUrl}/frame-xhr', {
   method: 'POST',
   body: JSON.stringify({ ${propsToGet.join(',')} })
  });
</script>
</body></html>`;
    });

    const frameXhr = new Promise<object>(resolve => {
      koaServer.post('/frame-xhr', async ctx => {
        requestUserAgentStrings.push(ctx.get('user-agent'));
        const body = JSON.parse((await Helpers.readableToBuffer(ctx.req)).toString());
        resolve(body);
        ctx.body = 'Ok';
      });
    });

    /////// TEST BEGIN /////

    await hero.goto(`${koaServer.baseUrl}/agent-test`);
    const frameParams = await frameXhr;

    for (const useragent of requestUserAgentStrings) {
      expect(useragent).toBe(heroMeta.userAgentString);
    }

    async function getJsValue(jsValue: string) {
      const result = await hero.getJsValue(jsValue);
      return result;
    }

    const windowParams: any = {};
    for (const prop of propsToGet) {
      windowParams[prop] = await getJsValue(`navigator.${prop}`);
    }

    expect(heroMeta.userAgentString).toBe(windowParams.userAgent);
    expect(heroMeta.operatingSystemPlatform).toBe(windowParams.platform);

    for (const prop of propsToGet) {
      expect(`${prop}=${frameParams[prop]}`).toStrictEqual(`${prop}=${windowParams[prop]}`);
    }
  });

  it('should maintain user agent and platform across navigations', async () => {
    const hero = await handler.createHero();
    Helpers.needsClosing.push(hero);

    const heroMeta = await hero.meta;

    const requestUserAgentStrings: string[] = [];

    const httpsServer = await Helpers.runHttpsServer(async (req, res) => {
      requestUserAgentStrings.push(req.headers['user-agent']);
      if (req.url === '/s2-page1') {
        res.end(
          `<html lang="en">
<script>
  const { ${propsToGet.join(',')} } = navigator;
  var startPageVars = { ${propsToGet.join(',')} };
</script>
<body><a href="${koaServer.baseUrl}/page2">link</a></body></html>`,
        );
      } else {
        res.writeHead(404).end();
      }
    });

    koaServer.get('/page1', ctx => {
      requestUserAgentStrings.push(ctx.get('user-agent'));
      ctx.body = `<html lang="en"><body><a href="${httpsServer.baseUrl}/s2-page1">link</a></body></html>`;
    });

    koaServer.get('/page2', ctx => {
      requestUserAgentStrings.push(ctx.get('user-agent'));
      ctx.body = `<html lang="en"><body><h1>Last Page</h1></body></html>`;
    });

    async function getParams() {
      const windowParams: any = {};
      for (const prop of propsToGet) {
        windowParams[prop] = await hero.getJsValue(`navigator.${prop}`);
      }
      return windowParams;
    }

    await hero.goto(`${koaServer.baseUrl}/page1`);

    const page1WindowParams = await getParams();

    expect(heroMeta.userAgentString).toBe(page1WindowParams.userAgent);
    expect(heroMeta.operatingSystemPlatform).toBe(page1WindowParams.platform);

    await hero.click(hero.document.querySelector('a'));

    const page2WindowParams = await getParams();
    for (const prop of propsToGet) {
      expect(`${prop}=${page2WindowParams[prop]}`).toStrictEqual(
        `${prop}=${page1WindowParams[prop]}`,
      );
    }

    const page2StartParams = await hero.getJsValue('startPageVars');
    for (const prop of propsToGet) {
      expect(`${prop}=${page2StartParams[prop]}`).toStrictEqual(
        `${prop}=${page1WindowParams[prop]}`,
      );
    }

    await hero.click(hero.document.querySelector('a'));
    const page3WindowParams = await getParams();
    for (const key of propsToGet) {
      expect(page3WindowParams[key]).toBe(page1WindowParams[key]);
    }

    await hero.goBack();
    const backParams = await getParams();
    for (const key of propsToGet) {
      expect(backParams[key]).toBe(page1WindowParams[key]);
    }
    for (const useragent of requestUserAgentStrings) {
      expect(useragent).toBe(heroMeta.userAgentString);
    }
  });

  it('should add user hero and platform to dedicated workers', async () => {
    const hero = await handler.createHero();
    Helpers.needsClosing.push(hero);

    const heroMeta = await hero.meta;

    const requestUserAgentStrings: string[] = [];

    koaServer.get('/workers-test', ctx => {
      requestUserAgentStrings.push(ctx.get('user-agent'));
      ctx.body = `<html lang="en">
<script>new Worker("worker.js").postMessage('');</script>
</html>`;
    });

    koaServer.get('/worker.js', ctx => {
      requestUserAgentStrings.push(ctx.get('user-agent'));
      ctx.set('content-type', 'application/javascript');
      ctx.body = `onmessage = () => {

  const { ${propsToGet.join(',')} } = navigator;
  fetch('/worker-xhr', {
   method: 'POST',
   body: JSON.stringify({ ${propsToGet.join(',')} })
  });
}`;
    });

    const xhr = new Promise<object>(resolve => {
      koaServer.post('/worker-xhr', async ctx => {
        requestUserAgentStrings.push(ctx.get('user-agent'));
        const body = JSON.parse((await Helpers.readableToBuffer(ctx.req)).toString());
        resolve(body);
        ctx.body = 'Ok';
      });
    });

    await hero.goto(`${koaServer.baseUrl}/workers-test`);
    const params = await xhr;

    for (const useragent of requestUserAgentStrings) {
      expect(useragent).toBe(heroMeta.userAgentString);
    }

    for (const prop of propsToGet) {
      const windowValue = await hero.getJsValue(`navigator.${prop}`);
      expect(params[prop]).toStrictEqual(windowValue);
      expect(`${prop}=${params[prop]}`).toStrictEqual(`${prop}=${windowValue}`);
    }
  });

  it('should add user hero and platform to service workers', async () => {
    const hero = await handler.createHero();
    Helpers.needsClosing.push(hero);

    const heroMeta = await hero.meta;

    const requestUserAgentStrings: string[] = [];

    koaServer.get('/sw-test', ctx => {
      requestUserAgentStrings.push(ctx.get('user-agent'));
      ctx.body = `<html lang="en">
<h1>Service Worker Test</h1>
<script>
    navigator.serviceWorker.register('./service-worker.js');
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.active) {
        reg.active.postMessage("send");
      }
    });
    navigator.serviceWorker.addEventListener("message", (event) => {
      fetch('/service-xhr', {
        method: 'POST',
        body: event.data
      });
   });
</script>
</html>`;
    });

    koaServer.get('/service-worker.js', ctx => {
      requestUserAgentStrings.push(ctx.get('user-agent'));
      ctx.set('content-type', 'application/javascript');
      ctx.body = `
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async event => {
  if (event.data !== 'send') return;
  self.skipWaiting();
  self.clients.claim();
  const clients = await self.clients.matchAll();

  const { ${propsToGet.join(',')} } = navigator;
  const data = JSON.stringify({ ${propsToGet.join(',')} });

  clients.forEach(client => client.postMessage(data));
});`;
    });

    const xhr = new Promise<object>(resolve => {
      koaServer.post('/service-xhr', async ctx => {
        requestUserAgentStrings.push(ctx.get('user-agent'));
        const body = JSON.parse((await Helpers.readableToBuffer(ctx.req)).toString());
        resolve(body);
        ctx.body = 'Ok';
      });
    });

    /////// TEST BEGIN /////

    await hero.goto(`${koaServer.baseUrl}/sw-test`);
    const params = await xhr;

    for (const useragent of requestUserAgentStrings) {
      expect(useragent).toBe(heroMeta.userAgentString);
    }

    for (const prop of propsToGet) {
      const windowValue = await hero.getJsValue(`navigator.${prop}`);
      expect(params[prop]).toStrictEqual(windowValue);
    }
  });

  it('should be able to load the creep-js phantom worker tests', async () => {
    let jsonResult = new Resolvable<string>();
    const httpsServer = await Helpers.runHttpsServer(async (req, res) => {
      res.setHeader('access-control-allow-origin', '*');
      if (req.url.match('/creepjs/tests/workers.html')) {
        res.end(`<!DOCTYPE html>
      <html lang="en">
      <body>
      <div id="fingerprint-data"></div>
          <script src="workers.js"></script>
      </body>
      </html>`);
      } else if (req.url.includes('worker-result')) {
        const result = await Helpers.readableToBuffer(req);
        jsonResult.resolve(result.toString());
        res.end('');
      } else {
        await new Promise(resolve => setTimeout(resolve, 50));
        const body = Fs.readFileSync(`${__dirname}/html/worker.js`);
        res.setHeader('etag', 'W/"602f25aa-573c"');
        res.setHeader('content-type', 'application/javascript; charset=utf-8');
        res.end(body);
      }
    });

    jsonResult = new Resolvable<string>();

    const hero = await handler.createHero();
    Helpers.needsClosing.push(hero);
    await hero.goto(`${httpsServer.baseUrl}/creepjs/tests/workers.html`);

    const result = JSON.parse(await jsonResult.promise);
    expect(result).toBeTruthy();

    const { windowScope, dedicatedWorker, sharedWorker, serviceWorker } = result;
    expect(windowScope.userAgent).toBe(dedicatedWorker.userAgent);
    expect(windowScope.userAgent).toBe(serviceWorker.userAgent);
    expect(windowScope.userAgent).toBe(sharedWorker.userAgent);
    expect(windowScope.memory).toBe(dedicatedWorker.memory);
    expect(windowScope.memory).toBe(serviceWorker.memory);
    expect(windowScope.memory).toBe(sharedWorker.memory);
    await hero.close();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should load creepjs', async () => {
    const hero = await handler.createHero();
    Helpers.needsClosing.push(hero);
    await hero.goto('https://abrahamjuliot.github.io/creepjs/tests/workers.html');
    await hero.waitForPaintingStable();
    const cols = await hero.document.querySelectorAll('.col-six');
    for (const col of cols) {
      const background = await col.getAttribute('style');
      expect(background.trim()).toBe('background: none');
    }
  });
});
