import fs from 'fs';
import Log from '@secret-agent/commons/Logger';
import IDevtoolsClient from '@secret-agent/core/interfaces/IDevtoolsClient';
import { PageRecorderResultSet } from '@secret-agent/injected-scripts/scripts/pageEventsRecorder';
import FrameTracker from '@secret-agent/core/lib/FrameTracker';
import DomEnv from '@secret-agent/core/lib/DomEnv';

const domObserver = fs.readFileSync(
  require.resolve('@secret-agent/injected-scripts/scripts/pageEventsRecorder.js'),
  'utf8',
);

const { log } = Log(module);

const runtimeFunction = '__saPageListenerCallback';

export default class PageEventsListener {
  public onNewContext?: (contextId: number) => Promise<any>;
  private isClosing: boolean = false;
  private readonly devtoolsClient: IDevtoolsClient;
  private readonly frameTracker: FrameTracker;
  private readonly onResults: (frameId: string, ...args: PageRecorderResultSet) => Promise<any>;

  constructor(
    devtoolsClient: IDevtoolsClient,
    frameTracker: FrameTracker,
    onResults: (frameId: string, ...args: PageRecorderResultSet) => Promise<any>,
  ) {
    this.devtoolsClient = devtoolsClient;
    this.frameTracker = frameTracker;
    this.onResults = onResults;
  }

  public async listen() {
    await this.devtoolsClient.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `(function(runtimeFunction) { \n\n ${domObserver.toString()} \n\n })('${runtimeFunction}');`,
      worldName: DomEnv.installedDomWorldName,
    });

    await this.devtoolsClient.on(
      'Runtime.bindingCalled',
      async ({ name, payload, executionContextId }) => {
        if (name !== runtimeFunction) return;
        const frameId = this.frameTracker.getFrameIdForExecutionContext(executionContextId);
        if (!frameId) {
          log.warn('PageEventsListener.bindingCalledBeforeExecutionTracked', {
            executionContextId,
            name,
            payload,
          });
          return;
        }

        const result = JSON.parse(payload) as PageRecorderResultSet;

        await this.onResults(frameId, ...result);
      },
    );

    await this.devtoolsClient.on('Runtime.executionContextCreated', async ctx => {
      if (ctx.context.name !== DomEnv.installedDomWorldName) return;
      const contextId = ctx.context.id;

      setImmediate(this.addBindingToContext.bind(this), contextId);
    });
  }

  public async setCommandIdForPage(commandId: number) {
    await this.frameTracker.runInActiveFrames(
      `window.setCommandId(${commandId});`,
      DomEnv.installedDomWorldName,
    );
  }

  public async setCommandIdInContext(commandId: number, contextId: number) {
    await this.devtoolsClient
      .send('Runtime.evaluate', {
        expression: `window.setCommandId(${commandId});`,
        contextId,
        returnByValue: true,
      })
      .catch(err => log.warn('NewContext.setCommandIdError', err));
  }

  public close() {
    this.isClosing = true;
  }

  public async flush() {
    const results = await this.frameTracker.runInActiveFrames(
      `window.flushPageRecorder()`,
      DomEnv.installedDomWorldName,
    );
    for (const [frameId, result] of Object.entries(results)) {
      if (result.value) {
        await this.onResults(frameId, ...(result.value as PageRecorderResultSet));
      }
    }
  }

  private async addBindingToContext(contextId: number, retries = 5) {
    if (this.isClosing) return;

    try {
      await this.devtoolsClient.send('Runtime.addBinding', {
        name: runtimeFunction,
        contextId,
      });
    } catch (err) {
      if (retries > 0 && err?.message.includes('Cannot find context with specified id')) {
        await new Promise(resolve => setTimeout(resolve, 10 * (2 ^ (retries -= 1))));
        return this.addBindingToContext(contextId);
      }
      throw err;
    }

    if (this.onNewContext) {
      await this.onNewContext(contextId);
    }
  }
}
