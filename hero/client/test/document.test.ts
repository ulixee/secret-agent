// need to import this before the awaited stuff gets imported
import '../lib/SetupAwaitedHandler';

import { getState as getElementState } from 'awaited-dom/base/official-klasses/Element';
import IExecJsPathResult from '@ulixee/hero-interfaces/IExecJsPathResult';
import { getNodePointerFnName } from '@ulixee/hero-interfaces/jsPathFnNames';
import { Helpers } from '@ulixee/testing';
import ICoreRequestPayload from '@ulixee/hero-interfaces/ICoreRequestPayload';
import ICoreResponsePayload from '@ulixee/hero-interfaces/ICoreResponsePayload';
import { Handler } from '../index';
import ConnectionToCore from '../connections/ConnectionToCore';

afterAll(Helpers.afterAll);

describe('document tests', () => {
  it('runs querySelector', async () => {
    const outgoing = jest.fn(
      async (payload: ICoreRequestPayload): Promise<ICoreResponsePayload> => {
        const { command, args } = payload;
        await new Promise(resolve => setTimeout(resolve, 5));
        if (command === 'Session.create') {
          return {
            data: { tabId: 'tab-id', sessionId: 'session-id', sessionsDataLocation: '' },
          };
        }
        if (command === 'Session.addEventListener') {
          return {
            data: { listenerId: '1' },
          };
        }
        if (command === 'FrameEnvironment.execJsPath') {
          const [jsPath] = args;
          const lastPath = jsPath[jsPath.length - 1];
          if (lastPath && lastPath[0] === getNodePointerFnName) {
            return {
              data: {
                value: null,
                nodePointer: { id: 1 },
              } as IExecJsPathResult,
            };
          }
        }
      },
    );

    class Piper extends ConnectionToCore {
      async internalSendRequest(payload: ICoreRequestPayload): Promise<void> {
        const data = await outgoing(payload);

        this.onMessage({
          responseId: payload.messageId,
          data: data?.data,
          ...(data ?? {}),
        });
      }

      protected createConnection = () => Promise.resolve(null);
      protected destroyConnection = () => Promise.resolve(null);
    }

    const handler = new Handler(new Piper());
    const hero = await handler.createHero();
    Helpers.needsClosing.push(hero);

    const element = hero.document.querySelector('h1');
    const jsPath = getElementState(element).awaitedPath.toJSON();
    expect(jsPath[0]).toBe('document');
    expect(jsPath[1]).toMatchObject(['querySelector', 'h1']);

    const superElement = await element;
    await superElement.tagName;

    await hero.close();
    await handler.close();

    const outgoingCommands = outgoing.mock.calls;
    expect(outgoingCommands.map(x => x[0].command)).toMatchObject([
      'Core.connect',
      'Session.create',
      'Session.addEventListener',
      'FrameEnvironment.execJsPath',
      'FrameEnvironment.execJsPath',
      'Session.close',
      'Core.disconnect',
    ]);
    expect(outgoingCommands[3][0].args).toMatchObject([[...jsPath, [getNodePointerFnName]]]);
    expect(outgoingCommands[4][0].args).toMatchObject([[1, 'tagName']]);
  });
});
