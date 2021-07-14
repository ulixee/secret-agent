import Core, { Session } from '@ulixee/hero-core';
import { Helpers } from '@ulixee/testing';
import { InteractionCommand } from '@ulixee/hero-interfaces/IInteractions';
import Puppet from '@ulixee/hero-puppet';
import Log from '@ulixee/commons/Logger';
import { ITestKoaServer } from '@ulixee/testing/helpers';
import ConnectionToClient from '../server/ConnectionToClient';
import InjectedScripts from '../lib/InjectedScripts';

const { log } = Log(module);

const getContentScript = `(() => {
  let retVal = '';
  if (document.doctype)
    retVal = new XMLSerializer().serializeToString(document.doctype);
  if (document.documentElement)
    retVal += document.documentElement.outerHTML;
  return retVal;
})()`;

let koaServer: ITestKoaServer;
let connectionToClient: ConnectionToClient;
beforeAll(async () => {
  connectionToClient = Core.addConnection();
  Helpers.onClose(() => connectionToClient.disconnect(), true);
  koaServer = await Helpers.runKoaServer();
  koaServer.get('/empty', ctx => {
    ctx.body = `<html></html>`;
  });
});
afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

describe('basic Dom Replay tests', () => {
  it('basic replay test', async () => {
    koaServer.get('/test1', ctx => {
      ctx.body = `<body>
<div>
    <h1>This is the starting point</h1>
    <ul>
        <li>1</li>
    </ul>
    <a href="#" onclick="clicky()">Clickeroo</a>
</div>
<div id="div2"></div>
<script>
 let clicks = 0;
 const child = document.createElement('li');
 const child2 = document.createElement('li');
 const child3 = document.createElement('li');
 const parent = document.querySelector('ul');

 function clicky(){
   clicks += 1;

   if (clicks === 1) {
     child.textContent = 'Another one ' + parent.children.length;
     parent.append(child, child2, child3);
   }
   if (clicks === 2) {
     parent.removeChild(child2);
   }
   if (clicks === 3) {
     parent.append(child);
   }
   if (clicks === 4) {
     document.querySelector('#div2').setAttribute('data', "{ data: true }");
     document.querySelector('#div2').setAttribute('trial', '1');
   }
   if (clicks === 5) {
     child.textContent = 'Li 2';
   }
   if (clicks === 6){
     // test inserting a bunch at once
     const div2 = document.createElement('div');
     div2.innerHTML = "<p>This is para 1</p><br/><p>This is para 2</p>";
     document.body.insertBefore(div2, document.querySelector('script'))
   }
   return false;
 }
</script>
</body>`;
    });
    const meta = await connectionToClient.createSession();
    const tab = Session.getTab(meta);
    await tab.goto(`${koaServer.baseUrl}/test1`);
    await tab.waitForLoad('DomContentLoaded');
    const session = tab.session;

    const mirrorChrome = new Puppet(session.browserEngine);
    await mirrorChrome.start();
    Helpers.onClose(() => mirrorChrome.close());

    const context = await mirrorChrome.newContext(session.plugins, log.createChild(module));
    // context.on('devtools-message', console.log);
    const mirrorPage = await context.newPage();
    const debug = false;
    if (debug) {
      // eslint-disable-next-line no-console
      mirrorPage.on('page-error', console.log);
      // eslint-disable-next-line no-console
      mirrorPage.on('console', console.log);
    }
    await Promise.all([
      mirrorPage.navigate(`${koaServer.baseUrl}/empty`),
      mirrorPage.mainFrame.waitOn('frame-lifecycle', event => event.name === 'load'),
    ]);
    const sourceHtml = await tab.puppetPage.mainFrame.evaluate(getContentScript, false);

    const mainPageChanges = await tab.getMainFrameDomChanges();
    await InjectedScripts.restoreDom(mirrorPage, mainPageChanges);

    const mirrorHtml = await mirrorPage.mainFrame.evaluate(getContentScript, false);
    if (mirrorHtml !== sourceHtml) {
      // eslint-disable-next-line no-console
      console.log('Mirror Page mismatch', mainPageChanges);
    }
    expect(mirrorHtml).toBe(sourceHtml);

    let lastCommandId = tab.lastCommandId;
    for (let i = 1; i <= 6; i += 1) {
      await tab.interact([
        {
          command: InteractionCommand.click,
          mousePosition: ['window', 'document', ['querySelector', 'a']],
        },
      ]);

      await new Promise(resolve => setTimeout(resolve, 100));

      const pageChangesByFrame = await tab.getMainFrameDomChanges(lastCommandId);
      lastCommandId = tab.lastCommandId;
      await InjectedScripts.restoreDom(mirrorPage, pageChangesByFrame);
      // replay happens on animation tick now
      await new Promise(setImmediate);

      const sourceHtmlNext = await tab.puppetPage.mainFrame.evaluate(getContentScript, false);
      const mirrorHtmlNext = await mirrorPage.mainFrame.evaluate(getContentScript, false);
      expect(mirrorHtmlNext).toBe(sourceHtmlNext);
    }
  }, 45e3);

  it('should support multiple tabs', async () => {
    koaServer.get('/tab1', ctx => {
      ctx.body = `<body>
<div>
    <h1>This is the starting point</h1>
    <ul>
        <li>1</li>
    </ul>
    <a href="/tab2" target="_blank">Clickeroo</a>
</div>
</body>`;
    });
    koaServer.get('/tab2', ctx => {
      ctx.body = `
<html>
<head>
  <script type="text/javascript">
  (() => {
    console.log('Ran!');
  })();
</script>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title>Dom Replay Test</title>
</head>
<body>
<div>
    <h1>This is tab 2</h1>
</div>
</body>
</html>`;
    });
    const meta = await connectionToClient.createSession();
    const tab = Session.getTab(meta);
    await tab.goto(`${koaServer.baseUrl}/tab1`);
    await tab.waitForLoad('DomContentLoaded');
    const session = tab.session;

    const mirrorChrome = new Puppet(session.browserEngine);
    await mirrorChrome.start();
    Helpers.onClose(() => mirrorChrome.close());

    const mirrorContext = await mirrorChrome.newContext(session.plugins, log.createChild(module));
    const mirrorPage = await mirrorContext.newPage();

    await Promise.all([
      mirrorPage.navigate(`${koaServer.baseUrl}/empty`),
      mirrorPage.mainFrame.waitOn('frame-lifecycle', event => event.name === 'load'),
    ]);
    const sourceHtml = await tab.puppetPage.mainFrame.evaluate(getContentScript, false);

    {
      const changes = await tab.getMainFrameDomChanges();
      expect(changes).toHaveLength(21);
      await InjectedScripts.restoreDom(mirrorPage, changes);
      // replay happens on animation tick now
      await new Promise(setImmediate);
    }

    const mirrorHtml = await mirrorPage.mainFrame.evaluate(getContentScript, false);
    expect(mirrorHtml).toBe(sourceHtml);

    await tab.interact([
      {
        command: InteractionCommand.click,
        mousePosition: ['window', 'document', ['querySelector', 'a']],
      },
    ]);
    const newTab = await tab.waitForNewTab();
    await newTab.waitForLoad('PaintingStable');
    const newTabHtml = await newTab.puppetPage.mainFrame.evaluate(getContentScript, false);
    const pageChanges = await newTab.getMainFrameDomChanges();
    expect(pageChanges.length).toBeGreaterThan(10);

    const newTabMirrorPage = await mirrorContext.newPage();
    await Promise.all([
      newTabMirrorPage.navigate(`${koaServer.baseUrl}/empty`),
      newTabMirrorPage.mainFrame.waitOn('frame-lifecycle', event => event.name === 'load'),
    ]);

    await InjectedScripts.restoreDom(newTabMirrorPage, pageChanges);

    const mirrorNewTabHtml = await newTabMirrorPage.mainFrame.evaluate(getContentScript, false);
    expect(mirrorNewTabHtml).toBe(newTabHtml);
  }, 45e3);
});
