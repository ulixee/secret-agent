import { BrowserUtils, Helpers, TestLogger } from '@unblocked-web/sa-testing';
import MitmRequestContext from '@unblocked-web/sa-mitm/lib/MitmRequestContext';
import { createPromise } from '@ulixee/commons/lib/utils';
import { LocationStatus } from '@unblocked-web/emulator-spec/browser/Location';
import { ITestKoaServer } from '@unblocked-web/sa-testing/helpers';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import { Pool } from '../index';
import env from '@unblocked-web/sa-mitm/env';

const mocks = {
  MitmRequestContext: {
    create: jest.spyOn(MitmRequestContext, 'create'),
  },
};

let koa: ITestKoaServer;
let pool: Pool;
beforeAll(async () => {
  koa = await Helpers.runKoaServer(true);
  pool = new Pool(BrowserUtils.newPoolOptions);
  await pool.start();
});

beforeEach(async () => {
  mocks.MitmRequestContext.create.mockClear();
  TestLogger.testNumber += 1;
});

afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

test('should send a Host header to secure http1 Chrome requests', async () => {
  let rawHeaders: string[] = [];

  const server = await Helpers.runHttpsServer((req, res) => {
    rawHeaders = req.rawHeaders;
    res.end('<html>Loaded</html>');
  });

  const url = `${server.baseUrl}/`;
  const agent = await pool.createAgent({ logger: TestLogger.forTest(module) });
  Helpers.needsClosing.push(agent);
  const page = await agent.newPage();
  await page.goto(url);
  expect(rawHeaders[0]).toBe('Host');
});

test('should send preflight requests', async () => {
  const corsPromise = new Promise<boolean>(resolve => {
    koa.options('/preflightPost', ctx => {
      ctx.response.set('Access-Control-Allow-Origin', ctx.headers.origin);
      ctx.response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      ctx.response.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
      ctx.body = '';
      resolve(true);
    });
  });
  const postPromise = new Promise<boolean>(resolve => {
    koa.post('/preflightPost', ctx => {
      ctx.body = 'ok';
      resolve(true);
    });
  });

  const agent = await pool.createAgent({ logger: TestLogger.forTest(module) });
  Helpers.needsClosing.push(agent);
  agent.mitmRequestSession.interceptorHandlers.push({
    urls: ['http://dataliberationfoundation.org/postback'],
    handlerFn(url, type, request, response) {
      response.end(`<html lang="en">
<body>
<script type="text/javascript">
const xhr = new XMLHttpRequest();
xhr.open('POST', '${koa.baseUrl}/preflightPost');
xhr.setRequestHeader('X-PINGOTHER', 'pingpong');
xhr.setRequestHeader('Content-Type', 'application/xml');
xhr.send('<person><name>DLF</name></person>');
</script>
</body>
</html>
    `);
      return true;
    },
  });
  const page = await agent.newPage();
  await page.goto(`http://dataliberationfoundation.org/postback`);
  await expect(corsPromise).resolves.toBeTruthy();
  await expect(postPromise).resolves.toBeTruthy();

  expect(mocks.MitmRequestContext.create).toHaveBeenCalledTimes(3);

  const context = mocks.MitmRequestContext.create.mock.results[1];
  expect(context.value.method).toBe('OPTIONS');

  const context2 = mocks.MitmRequestContext.create.mock.results[2];
  expect(context2.value.method).toBe('POST');
});

test('should proxy requests from worker threads', async () => {
  koa.get('/worker.js', ctx => {
    ctx.set('content-type', 'application/javascript');
    ctx.body = `
onmessage = function(e) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '${koa.baseUrl}/xhr');
  xhr.send('FromWorker');
}`;
  });
  koa.get('/testWorker', ctx => {
    ctx.body = `<html lang="en">
<h1>This is a visible page</h1>
<script>
const myWorker = new Worker("worker.js");
myWorker.postMessage('send');
</script>
</html>
    `;
  });
  const serviceXhr = new Promise<string>(resolve => {
    koa.post('/xhr', async ctx => {
      ctx.body = 'Ok';
      const requestBody = await Helpers.readableToBuffer(ctx.req);
      resolve(requestBody.toString());
    });
  });
  const agent = await pool.createAgent({ logger: TestLogger.forTest(module) });
  Helpers.needsClosing.push(agent);
  const page = await agent.newPage();
  await page.goto(`${koa.baseUrl}/testWorker`);
  await page.mainFrame.waitForLoad({ loadStatus: 'PaintingStable' });
  await expect(serviceXhr).resolves.toBe('FromWorker');
  expect(mocks.MitmRequestContext.create).toHaveBeenCalledTimes(3);
});

test('should proxy requests from shared workers', async () => {
  const xhrResolvable = new Resolvable<string>();
  const server = await Helpers.runHttpsServer(async (req, res) => {
    if (req.url === '/shared-worker.js') {
      res.setHeader('content-type', 'application/javascript');
      res.end(`
onconnect = async message => {
  const port = message.ports[0]
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '${server.baseUrl}/sharedWorkerXhr');
  xhr.send('FromSharedWorker');
  port.postMessage('done')
}`);
    } else if (req.url === '/testSharedWorker') {
      res.setHeader('content-type', 'text/html');
      res.end(`<html lang="en">
<script>
try {

const sharedWorker = new SharedWorker('./shared-worker.js');
sharedWorker.port.start()
sharedWorker.port.addEventListener('message', message => {
    sharedWorker.port.close();
});
} catch(error ){
    console.log('couldnt start shared worker', error)
}
</script>
<h1>This is a visible page</h1>
</html>
    `);
    } else if (req.url === '/sharedWorkerXhr') {
      res.setHeader('content-type', 'text');
      res.end('ok');
      const requestBody = await Helpers.readableToBuffer(req);
      xhrResolvable.resolve(requestBody.toString());
    }
  });
  const agent = await pool.createAgent({ logger: TestLogger.forTest(module) });
  Helpers.needsClosing.push(agent);
  const page = await agent.newPage();
  await page.goto(`${server.baseUrl}/testSharedWorker`);
  await page.mainFrame.waitForLoad({ loadStatus: 'PaintingStable' });
  await expect(xhrResolvable.promise).resolves.toBe('FromSharedWorker');
  expect(mocks.MitmRequestContext.create).toHaveBeenCalledTimes(3);
});

test('should not see proxy headers in a service worker', async () => {
  const xhrHeaders = createPromise();
  const xhrHeadersFromWorker = createPromise();
  const server = await Helpers.runHttpsServer(async (request, response) => {
    const path = request.url;
    if (path === '/worker.js') {
      response.setHeader('content-type', 'application/javascript');
      response.end(`
self.addEventListener('fetch', event => {
  event.respondWith(async function(){
    return fetch(event.request.url, {
      method: event.request.method,
      credentials: 'include',
      headers: {
        'Intercepted': true,
        'original-proxy-auth': event.request.headers['proxy-authorization']
      },
      body: event.request.headers['proxy-authorization'] ? 'ProxyAuth' : 'LooksGoodFromPage'
    });
  }());
});

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  if (event.data === 'activate-app') {
    self.skipWaiting();
    self.clients.claim();
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => client.postMessage("start-app"));
    });
    fetch('/xhr/2', {
      method: 'POST',
      body: 'FromWorker'
    }).catch(err => {});
  }
});
`);
    }
    if (path === '/service-worker') {
      response.setHeader('Server-Worker-Allowed', '/xhr');
      response.end(`<html lang="en"><body>
<h1>I'm loaded</h1>
<script>

window.addEventListener('load', function() {
    navigator.serviceWorker.register('./worker.js');
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.active) {
        reg.active.postMessage("activate-app");
      }
    });
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data === 'start-app') {
        fetch('/xhr', {
          method: 'POST',
          body: 'FromPage'
        });
      }
   });
  });

</script>
</body>
</html>
    `);
    }

    let body = '';
    for await (const chunk of request) body += chunk;
    if (path === '/xhr') {
      xhrHeaders.resolve(request.headers);
      expect(body).toBe('LooksGoodFromPage');
      response.end('Cool');
    }
    if (path === '/xhr/2') {
      xhrHeadersFromWorker.resolve(request.headers);
      expect(body).toBe('FromWorker');
      response.end('Got it');
    }
  });

  const agent = await pool.createAgent({ logger: TestLogger.forTest(module) });
  Helpers.needsClosing.push(agent);
  const page = await agent.newPage();
  await page.goto(`${server.baseUrl}/service-worker`);
  await page.mainFrame.waitForLoad({ loadStatus: 'PaintingStable' });
  const [originalHeaders, headersFromWorker] = await Promise.all([
    xhrHeaders.promise,
    xhrHeadersFromWorker.promise,
  ]);
  // check that both go through mitm
  await expect(originalHeaders['proxy-authorization']).not.toBeTruthy();
  await expect(headersFromWorker['proxy-authorization']).not.toBeTruthy();
  await expect(originalHeaders['user-agent']).toBe(headersFromWorker['user-agent']);
  expect(mocks.MitmRequestContext.create).toHaveBeenCalledTimes(4);
});

test('should proxy iframe requests', async () => {
  const agent = await pool.createAgent({ logger: TestLogger.forTest(module) });
  const page = await agent.newPage();

  agent.mitmRequestSession.interceptorHandlers.push({
    urls: [
      'https://dataliberationfoundation.org/iframe',
      'https://dataliberationfoundation.org/test.css',
      'https://dataliberationfoundation.org/dlfSite.png',
    ],
    handlerFn(url, type, request, response) {
      response.end(`<html lang="en">
<head><link rel="stylesheet" type="text/css" href="/test.css"/></head>
<body><img alt="none" src="/dlfSite.png"/></body>
</html>`);
      return true;
    },
  });
  koa.get('/iframe-test', async ctx => {
    ctx.body = `<html lang="en">
<body>
This is the main body
<iframe src="https://dataliberationfoundation.org/iframe"></iframe>
</body>
</html>`;
  });
  await page.goto(`${koa.baseUrl}/iframe-test`);
  await page.waitForLoad(LocationStatus.AllContentLoaded);
  expect(mocks.MitmRequestContext.create).toHaveBeenCalledTimes(4);
  const urls = mocks.MitmRequestContext.create.mock.results.map(x => x.value.url.href);
  expect(urls).toEqual([
    expect.stringMatching(/http:\/\/localhost:\d+\/iframe-test/),
    'https://dataliberationfoundation.org/iframe',
    'https://dataliberationfoundation.org/test.css',
    'https://dataliberationfoundation.org/dlfSite.png',
  ]);
});
