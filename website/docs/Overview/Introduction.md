# Introduction

> Hero is a free and open source headless browser that's written in NodeJs, built on top of Chrome and [nearly impossible for websites to detect](https://github.com/ulixee/double-agent/).

## Why Hero?

- **Built for scraping** - it's the first modern headless browsers designed specifically for scraping instead of just automated testing.
- **Designed for web developers** - We've recreated a fully compliant DOM directly in NodeJS allowing you bypass the headaches of previous scraper tools.
- **Powered by Chrome** - The powerful Chrome engine sits under the hood, allowing for lightning fast rendering.
- **Emulates any modern browser** - Browser emulators make it easy to disguise your script as practically any browser.
- **Avoids detection along the entire stack** - Don't be blocked because of TLS fingerprints in your networking stack.

## How It Works

We started by challenging ourselves to create the ultimate scraper detection tool, which we coined [DoubleAgent](https://github.com/ulixee/double-agent/). Along the way we discovered 76,697 checks that any website can implement to [block practically all known scrapers](https://stateofscraping.org). Then we designed Hero to bypass detection by emulating real users.

Hero uses Chrome as its core rendering engine under the hood, with DevTools Protocol as its glue layer.

Instead of creating another complex puppeteer-like API that requires use of nested callbacks and running code in remote contexts, we designed the AwaitedDOM. AwaitedDOM is a W3C compliant DOM written for NodeJS that allows you to write scraper scripts as if you were inside the webpage.

## Installation

To use Hero in your project, install it with npm or yarn:

```bash
npm i --save ulixee
```

or

```bash
yarn add ulixee
```

When you install Hero, it also downloads a recent version of Chrome and an app call [Replay](/docs/advanced/session-replay) to debug and troubleshoot sessions.

More details about installation can be found on the [troubleshooting](/docs/help/troubleshooting) page.

## Usage Example

Hero's API should be familiar to web developers everywhere. We created a W3C compliant DOM library for Node, which allows you to use the exact same DOM selector and traversal commands as you do in modern web browsers like Chromium, Firefox, and Safari.

For example, here's how you might extract the title and intro paragraph from example.org:

```js
import Hero from '@ulixee/hero';

(async () => {
  const hero = new Hero();
  await hero.goto('https://example.org');
  const title = await hero.document.title;
  const intro = await hero.document.querySelector('p').textContent;
  hero.output = { title, intro };
  await hero.close();

  console.log('Retrieved from https://example.org', hero.output);
})();
```

As shown in the example above, window.document follows the standard DOM specification, but with a cool twist which we call the AwaitedDOM.
