import { Helpers } from '@secret-agent/testing';
import CoreServer from '@secret-agent/core/server';
import * as Fs from 'fs';
import Download from '@secret-agent/client/lib/Download';
import { Handler } from '../index';

let koaServer;
let handler: Handler;
beforeAll(async () => {
  const coreServer = new CoreServer();
  await coreServer.listen({ port: 0 });
  handler = new Handler({ maxConcurrency: 1, host: await coreServer.address });
  Helpers.onClose(() => {
    handler.close();
    coreServer.close();
  }, true);
  koaServer = await Helpers.runKoaServer();
});
afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

describe('Downloads tests', () => {
  it('can get a download', async () => {
    koaServer.get('/download', ctx => {
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.set('Content-Disposition', 'attachment');
      ctx.body = 'This is a download';
    });
    koaServer.get('/download-page', ctx => {
      ctx.body = `<html>
<body>
<h1>Download Page</h1>
<a href="/download" download="test.txt">Click me</a>
</html>`;
    });

    const agent = await handler.createAgent();
    Helpers.needsClosing.push(agent);

    await agent.goto(`${koaServer.baseUrl}/download-page`);
    await agent.waitForPaintingStable();
    const input = await agent.document.querySelector('a');
    const downloadPromise = new Promise<Download>(resolve =>
      agent.activeTab.once('download', event => {
        resolve(event);
      }),
    );

    await agent.click(input);
    const download = await downloadPromise;

    expect(download.progress).toBeGreaterThanOrEqual(0);
    expect(download.id).toBeTruthy();
    await download.waitForFinished();
    expect(download.complete).toBe(true);
    const data = (await download.data()).toString();
    expect(data).toBe('This is a download');

    const path = download.path;
    expect(Fs.existsSync(path)).toBeTruthy();

    await download.delete();
    expect(Fs.existsSync(path)).toBeFalsy();
  });

  it('should handle going directly to a downloaded asset', async () => {
    const pdf = Fs.readFileSync(`${__dirname}/html/test.pdf`);
    koaServer.get('/test.pdf', ctx => {
      ctx.set('Content-Type', 'application/pdf');
      ctx.set('Content-Disposition', 'attachment');
      ctx.body = pdf;
    });

    const agent = await handler.createAgent();
    Helpers.needsClosing.push(agent);

    const downloadPromise = new Promise<Download>(resolve =>
      agent.activeTab.once('download', event => {
        resolve(event);
      }),
    );
    const resource = await agent.goto(`${koaServer.baseUrl}/test.pdf`);
    expect(resource.url).toBe(`${koaServer.baseUrl}/test.pdf`);
    const resourceData = await resource.data;
    expect(resourceData).toBeTruthy();
    expect(resourceData.toString()).toBe(pdf.toString());

    const download = await downloadPromise;

    expect(download.progress).toBeGreaterThanOrEqual(0);
    expect(download.id).toBeTruthy();
    await download.waitForFinished();
    expect(download.complete).toBe(true);

    const data = (await download.data()).toString();
    expect(data).toEqual(pdf.toString());
  });
});
