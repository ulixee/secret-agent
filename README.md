# Unblocked Agent

Unblocked Agent is an automated web browser that's built to be controlled from every facet by a developer.

- [x] **Powered by Chrome** - The powerful Chrome engine sits under the hood, allowing for lightning fast rendering.
- [x] **Hook in at every level of the stack** - Hooks are defined in the network layer (TCP, TLS, HTTP, HTTP2), browser level and user interactions. You have full control of Chrome Devtools API all along the way.
- [x] **Track Nodes with JsPath** - Uses the JsPath specification to query and track DOM Nodes.


## Installation

```shell script
npm i --save @unblocked-web/agent
```

or

```shell script
yarn add @unblocked/agent
```

## Usage


```js
const { Agent } = require('@unblocked-web/agent');

(async () => {
  const agent = new Agent({ browserEngine: new Chrome98() });
  const page = await agent.newPage();
  await page.goto('https://example.org/');
  await page.waitForLoad('PaintingStable');
  
  const outerHTML = await page.mainFrame.outerHTML();
  const title = await page.evaluate('document.title');
  const intro = await page.evaluate(`document.querySelector('p').textContent`);
    
  await agent.close();
})();
```


## Contributing

We'd love your help in making Unblocked Agent a better tool. Please don't hesitate to send a pull request.

## License

[MIT](LICENSE.md)
