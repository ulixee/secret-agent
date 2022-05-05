import IBrowser from '@unblocked/emulator-spec/IBrowser';
import IBrowserLaunchArgs from '@unblocked/emulator-spec/IBrowserLaunchArgs';
import { Agent } from 'secret-agent';
const Chrome98 = require('@ulixee/chrome-98-0');

async function run() {
  const agent = new Agent({
    browserEngine: new Chrome98(),
    hooks: {
      onNewBrowser(browser: IBrowser, options: IBrowserLaunchArgs) {
        options.showChrome = true;
      },
    },
  });
  await agent.open();

  const page = await agent.newPage();
  await page.goto('https://news.ycombinator.com/');
  await page.waitForLoad('PaintingStable');

  console.log('\n-- PRINTING location.href ---------');
  console.log(page.mainFrame.url);

  const stories = await page.evaluate<
    {
      nodeId: number;
      id: string;
      score: number;
      title: string;
      age: string;
      commentCount: number;
      url: string;
      contributor: { id: string; username: string };
    }[]
  >(
    `(() => {
    const stories = document.querySelectorAll('.athing');
    const result = [];
    for (const story of stories) {
      const nodeId = NodeTracker.watchNode(story);
      const extraElem =  story.nextElementSibling;
      const record = { nodeId };
      const titleElem =  story.querySelector('a.storylink');
      const scoreElem = extraElem.querySelector('.score');
      
      record.score = scoreElem ? parseInt(scoreElem.textContent,10) ?? 0;
      record.id = story.getAttribute('id');
      record.age = extraElem.querySelector('.age a').textContent;
      record.title = titleElem.textContent;
      const contributor = extraElem.querySelector('.hnuser').textContent;
      record.contributor = { id: contributor, username: contributor };
  
      const links = Array.from(extraElem.querySelectorAll('.subtext > a'));
      const commentsLink = links[links.length - 1];
      const commentText = commentsLink.textContent;
      record.commentCount = commentText.includes('comment')
        ? parseInt(commentText.trim().match(/(\d+)\s/)[0], 10)
        : 0;
  
      lastStory = commentsLink;
      record.url = titleElem.getAttribute('href');
      result.push(record);
    }
    return result;
  })`,
    true,
  );
  let lastStory;
  const output = [];

  for (const story of stories) {
    await wait(200);
    lastStory = [story.nodeId];
    await page.interact([
      {
        command: 'move',
        mousePosition: lastStory,
      },
    ]);
    output.push(story);
  }

  if (lastStory) {
    await page.click(lastStory);
    await page.mainFrame.waitForLocation('change');
    const textAreaNodeId = await page.mainFrame.jsPath.getNodePointerId([
      'document',
      ['querySelector', 'textarea'],
    ]);

    while (true) {
      const visibility = await page.mainFrame.jsPath.getNodeVisibility([textAreaNodeId]);
      if (visibility.isVisible) break;
      await wait(100);
    }
    await page.click([textAreaNodeId]);
    await page.type('Hackernews!');

    const lastCommentId = await page.evaluate<number>(
      `(() => {
    const lastComment = Array.from(document.querySelectorAll('.commtext')).slice(-1).pop()
    return NodeTracker.watchNode(lastComment);
    }`,
      true,
    );
    await page.interact([
      {
        command: 'move',
        mousePosition: [lastCommentId],
      },
    ]);
  }

  console.log('-- PRINTING extracted results ---------------');
  console.log(output);

  console.log('-------------------------------------');
  console.log('DONE');

  await agent.close();
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run().catch(error => console.log(error));
