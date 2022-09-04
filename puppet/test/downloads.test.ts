import * as Fs from 'fs';
import Log from '@secret-agent/commons/Logger';
import IPuppetContext from '@secret-agent/interfaces/IPuppetContext';
import CorePlugins from '@secret-agent/core/lib/CorePlugins';
import { IBoundLog } from '@secret-agent/interfaces/ILog';
import Core from '@secret-agent/core';
import { TestServer } from './server';
import Puppet from '../index';
import { capturePuppetContextLogs, createTestPage, ITestPage } from './TestPage';
import CustomBrowserEmulator from './_CustomBrowserEmulator';

const { log } = Log(module);
const browserEmulatorId = CustomBrowserEmulator.id;

describe('Downloads', () => {
  let server: TestServer;
  let page: ITestPage;
  let puppet: Puppet;
  let context: IPuppetContext;
  const needsClosing = [];

  beforeAll(async () => {
    Core.use(CustomBrowserEmulator);
    const { browserEngine } = CustomBrowserEmulator.selectBrowserMeta();
    server = await TestServer.create(0);
    puppet = new Puppet(browserEngine);
    await puppet.start();
    context = await createContext(puppet);
    context.on('page', event => {
      needsClosing.push(event.page);
    });
  });

  afterEach(async () => {
    await page.close();
    for (const close of needsClosing) {
      await close.close();
    }
    needsClosing.length = 0;
  });

  beforeEach(async () => {
    page = createTestPage(await context.newPage());
    server.reset();
    server.setRoute('/download', (req, res) => {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment');
      res.end(`Hello world`);
    });
    server.setRoute('/downloadWithFilename', (req, res) => {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename=file.txt');
      res.end(`Hello world`);
    });
    server.setRoute('/downloadWithDelay', (req, res) => {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename=file.txt');
      // Chromium requires a large enough payload to trigger the download event soon enough
      res.write('a'.repeat(4096));
      res.write('foo');
      res.uncork();
    });
  });

  afterAll(async () => {
    await server.stop();
    await context.close();
    await puppet.close();
  });

  it('should report download when navigation turns into download', async () => {
    const [download, , navigationResponse] = await Promise.all([
      page.waitOn('download-started'),
      page.waitOn('download-finished'),
      page.navigate(server.url('download')).catch(e => e),
    ]);
    expect(download.url).toBe(server.url('download'));
    const path = download.path;
    expect(Fs.existsSync(path)).toBeTruthy();
    expect(Fs.readFileSync(path).toString()).toBe('Hello world');

    expect(navigationResponse.loaderType).toBe('download');
    expect(navigationResponse.loaderId).toBeTruthy();
    expect(navigationResponse instanceof Error).not.toBeTruthy();
  });

  it('should report proper download url when download is from download attribute', async () => {
    await page.goto(server.emptyPage);
    await page.setContent(
      `<a href="${server.baseUrl}/chromium-linux.zip" download="foo.zip">download</a>`,
    );
    const [download] = await Promise.all([page.waitOn('download-started'), page.click('a')]);
    expect(download.url).toBe(`${server.baseUrl}/chromium-linux.zip`);
    await page.close();
  });

  it('should report non-navigation downloads', async () => {
    server.setRoute('/download', (req, res) => {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.end(`Hello world`);
    });

    await page.goto(server.emptyPage);
    await page.setContent(`<a download="file.txt" href="${server.baseUrl}/download">download</a>`);
    const [download] = await Promise.all([
      page.waitOn('download-started'),
      page.waitOn('download-finished'),
      page.click('a'),
    ]);
    expect(download.suggestedFilename).toBe(`file.txt`);
    const path = download.path;
    expect(Fs.existsSync(path)).toBeTruthy();
    expect(Fs.readFileSync(path).toString()).toBe('Hello world');
    await page.close();
  });

  it(`should report download for Blobs`, async () => {
    const download = Promise.all([
      page.waitOn('download-started'),
      page.waitOn('download-finished'),
    ]);
    await page.goto(`${server.baseUrl}/download-blob.html`);
    await page.click('a');
    const path = (await download)[0].path;
    expect(Fs.readFileSync(path).toString()).toBe('Hello world');
    await page.close();
  });

  it('should report alt-click downloads', async () => {
    // Firefox does not download on alt-click by default.
    // Our WebKit embedder does not download on alt-click, although Safari does.
    server.setRoute('/download', (req, res) => {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.end(`Hello world`);
    });

    await page.goto(server.emptyPage);
    await page.setContent(`<a href="${server.baseUrl}/download">download</a>`);
    await page.keyboard.down('Alt');
    const [download] = await Promise.all([
      page.waitOn('download-started'),
      page.waitOn('download-finished'),
      page.click('a'),
    ]);
    await page.keyboard.up('Alt');
    const path = download.path;
    expect(Fs.existsSync(path)).toBeTruthy();
    expect(Fs.readFileSync(path).toString()).toBe('Hello world');
    await page.close();
  });

  it('should report new window downloads', async () => {
    await page.setContent(`<a target=_blank href="${server.baseUrl}/download">download</a>`);
    const [download] = await Promise.all([
      page.waitOn('download-started'),
      page.waitOn('download-finished'),
      page.click('a'),
    ]);
    const path = download.path;
    expect(Fs.existsSync(path)).toBeTruthy();
    await page.close();
  });

  it.skip('should delete downloads on context destruction', async () => {
    const newContext = await createContext(puppet);
    needsClosing.push(newContext);
    const newPage = createTestPage(await newContext.newPage());
    needsClosing.push(newPage);

    await newPage.setContent(`<a href="${server.baseUrl}/download">download</a>`);
    const [download1] = await Promise.all([
      newPage.waitOn('download-started'),
      newPage.waitOn('download-finished'),
      newPage.click('a'),
    ]);
    const [download2] = await Promise.all([
      newPage.waitOn('download-started'),
      newPage.waitOn('download-finished'),
      newPage.click('a'),
    ]);
    const path1 = download1.path;
    const path2 = download2.path;
    expect(Fs.existsSync(path1)).toBeTruthy();
    expect(Fs.existsSync(path2)).toBeTruthy();
    await newContext.close();
    expect(Fs.existsSync(path1)).toBeFalsy();
    expect(Fs.existsSync(path2)).toBeFalsy();
  });

  it.skip('should close the context without awaiting the download', async () => {
    server.setRoute('/downloadStall', (req, res) => {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename=file.txt');
      res.writeHead(200);
      res.flushHeaders();
      res.write(`Hello world`);
    });
    const newContext = await createContext(puppet);
    needsClosing.push(newContext);
    const newPage = createTestPage(await newContext.newPage());
    needsClosing.push(newPage);

    await newPage.goto(server.emptyPage);
    await newPage.setContent(
      `<a href="${server.baseUrl}/downloadStall" download="file.txt">click me</a>`,
    );
    const [download] = await Promise.all([newPage.waitOn('download-started'), newPage.click('a')]);
    await newContext.close();
    await new Promise(setImmediate);
    expect(Fs.existsSync(download.path)).toBeFalsy();
  });
});

async function createContext(puppet: Puppet, enableDownloads = true): Promise<IPuppetContext> {
  const plugins = new CorePlugins({ browserEmulatorId }, log as IBoundLog);
  const context = await puppet.newContext(plugins, log);
  capturePuppetContextLogs(context, `${puppet.browserEngine.fullVersion}-downloads-test`);
  if (enableDownloads) {
    const outDir = `${process.env.SA_SESSIONS_DIR}/downloads`;
    if (!Fs.existsSync(outDir)) Fs.mkdirSync(outDir);
    await context.enableDownloads(outDir);
  }
  return context;
}
