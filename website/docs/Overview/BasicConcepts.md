# Basic Concepts

## Each Hero Instance Has a Unique User

- user-agent
- ip address
- audio fingerprint
- fonts
- webgl / canvas
- cookies & storage
- screen details
- 100s more

Note: IP addresses are set through upstreamProxyUrl on each Hero.

## The DOM Has Finally Been Awaited

The easiest way to explain Dynamic DOM is with some comparison examples. Let's say you want to load a URL and loop through a list of items.

### Doing It with Hero

Here's how you would do it with Hero:

```js
import Hero from '@ulixee/hero';

const { document } = hero;

const elems = document.querySelectorAll('ul');
for (const elem of await elems) {
  db.query('SELECT FROM items WHERE id=?', [elem.id]);
  // ^^ WORKS
}
```

Hero's Dynamic DOM allows you to keep all calls within your script context. It also follows the W3C spec to a T. In fact, go ahead and copy lines 3 through 7 and run paste them into your browser's DevTools. They run perfectly.

### Doing It with Puppeteer

Here's how you would do it with Puppeteer:

```js
const Puppeteer = require('puppeteer');

const selector = 'ul li';
page.evaluate(
  (selector, db) => {
    const elems = document.querySelectorAll(selector);
    for (const elem of elems) {
      db.query('SELECT FROM items WHERE id=?', [elem.id]);
      // ^^ BREAKS
    }
  },
  selector,
  db,
);
```

As you'll notice, the above example throws an error. Although you can pass arguments into a remote method, they must be serializable, which means you can only pass through simple types.

When used in a simple example as show above, Puppeteer's approach seems okay. However, the reality is, most scraper scripts are complex, and your code becomes littered with multiple contexts, adding context to an already complex environment.

## Headless Browsers Need Not Always Render

When you're trying to eke out performance, a common technique is to disable rendering various parts of a webpage. Hero allows you to [turn off](/docs/overview/configuration#blocked-resources) everything from the style and images of a page, to the javascript environment. You can even simulate making http requests from inside a loaded web page, without ever loading the page.

```js
import Hero from '@ulixee/hero';

const hero = new Hero();
await hero.configure({
  blockedResourceTypes: ['All'],
});
await hero.goto('https://ulixee.org');
// referer will be https://ulixee.org
const doc = await hero.fetch('https://ulixee.org/docs/overview/configuration');
```

## Mice and Keyboards Are Human Too

Hero drives mice and keyboards with [Human Emulators](/docs/advanced/human-emulators). Human emulators translate your clicks and moves into randomized human-like patterns that can pass bot-blocker checks.
