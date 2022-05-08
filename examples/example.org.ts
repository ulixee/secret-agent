import { Agent } from '@unblocked-web/secret-agent';

const Chrome98 = require('@ulixee/chrome-98-0');

async function run() {
  const agent = new Agent({ browserEngine: new Chrome98() });
  const page = await agent.newPage();
  await page.goto('https://example.org/');
  await page.waitForLoad('PaintingStable');

  console.log('\n-- PRINTING location.href ---------');
  console.log(page.mainFrame.url);

  const outerHTML = await page.mainFrame.outerHTML();
  console.log('-- PRINTING outerHTML ---------------');
  console.log(outerHTML);
  const title = await page.evaluate<string>('document.title', true);

  const intro = await page.evaluate<string>(`document.querySelector('p').textContent`, true);

  console.log('-------------------------------------');

  await agent.close();

  console.log('Title + intro from https://example.org', { title, intro });
}

run().catch(error => console.log(error));
