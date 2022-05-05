import { Agent } from 'secret-agent';

const Chrome98 = require('@ulixee/chrome-98-0');

async function run() {
  const agent = new Agent({ browserEngine: new Chrome98() });
  const page = await agent.newPage();
  await page.goto('https://example.org/');
  await page.waitForLoad('PaintingStable');

  console.log('\n-- PRINTING location.href ---------');
  console.log(page.mainFrame.url);

  const { outerHTML } = await page.devtoolsSession.send('DOM.getOuterHTML');
  console.log('-- PRINTING outerHTML ---------------');
  console.log(outerHTML);
  const title = await page.evaluate<string>('document.title', true);

  const intro = await page.evaluate(`document.querySelector('p').textContent`);

  console.log('-------------------------------------');

  await agent.close();

  console.log('OUTPUT from https://example.org', { outerHTML, title, intro });
}

run().catch(error => console.log(error));
