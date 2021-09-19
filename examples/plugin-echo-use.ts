import { Agent } from 'secret-agent';
import Core from '@secret-agent/core';
import * as Path from 'path';

async function run() {
  // For security, need to explicitly activate dynamic loading to allow Core to load a random path.
  Core.allowDynamicPluginLoading = true;
  await Core.start();
  const agent = new Agent({ connectionToCore: { host: await Core.server.address } });
  agent.use(Path.join(__dirname, 'plugin-echo-classes.js'));
  /**
   * Or install into Core and client
   * Core.use(require('./plugin-echo-classes'));
   * agent.use(require('./plugin-echo-classes'));
   **/

  await agent.goto('https://example.org/');
  await agent.waitForPaintingStable();
  const result = await agent.echo('Echo', 1, 2, 3, true);
  console.log('Echo result', {
    sent: ['Echo', 1, 2, 3, true],
    result,
  });
  await agent.close();
}

run().catch(error => console.log(error));
