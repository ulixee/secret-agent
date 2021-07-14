import ICoreRequestPayload from '@ulixee/hero-interfaces/ICoreRequestPayload';
import { Helpers } from '@ulixee/testing/index';
import { Handler } from '../index';
import ConnectionToCore from '../connections/ConnectionToCore';

const outgoing = jest.fn();

class Piper extends ConnectionToCore {
  async internalSendRequest(payload: ICoreRequestPayload): Promise<void> {
    const response = await outgoing(payload);
    this.onMessage({
      responseId: payload.messageId,
      data: response?.data,
      ...(response ?? {}),
    });
  }

  protected createConnection = () => Promise.resolve(null);
  protected destroyConnection = () => Promise.resolve(null);
}

afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

describe('Handler', () => {
  it('allows you to run concurrent dispatched tasks', async () => {
    let counter = 0;
    outgoing.mockImplementation(({ command }) => {
      if (command === 'Session.create') {
        return {
          data: {
            tabId: 'tab-id',
            sessionId: `${(counter += 1)}`,
            sessionsDataLocation: '',
          },
        };
      }
      if (command === 'Session.addEventListener') {
        return {
          data: { listenerId: 1 },
        };
      }
      if (command === 'Session.close') {
        return {
          data: {},
        };
      }
    });
    const concurrency = 6;
    const handler = new Handler(
      new Piper({
        maxConcurrency: concurrency,
      }),
    );
    Helpers.needsClosing.push(handler);

    const sessionsRunning = new Map<string, boolean>();
    const runningAtSameTime: string[][] = [];
    const expectedCalls: string[] = [];

    const runFn = async (hero): Promise<any> => {
      const sessionId = await hero.sessionId;
      sessionsRunning.set(sessionId, true);
      const concurrent: string[] = [];
      for (const [session, isRunning] of sessionsRunning) {
        if (isRunning) concurrent.push(session);
      }
      runningAtSameTime.push(concurrent);
      await new Promise<void>(resolve => setTimeout(resolve, Math.random() * 25));
      sessionsRunning.set(sessionId, false);
    };
    for (let i = 0; i < 100; i += 1) {
      handler.dispatchHero(runFn, { input: i });
      expectedCalls.push('Session.create', 'Session.close');
    }

    await handler.waitForAllDispatches();

    expect(runningAtSameTime.filter(x => x.length > concurrency)).toHaveLength(0);
    expect(runningAtSameTime.filter(x => x.length >= concurrency).length).toBeGreaterThanOrEqual(1);

    await handler.close();

    const outgoingCommands = outgoing.mock.calls;
    expect(outgoingCommands.map(c => c[0].command).sort()).toMatchObject(
      ['Core.connect', ...expectedCalls, 'Core.disconnect'].sort(),
    );
  });

  it('has a max concurrency for "created" heros', async () => {
    let counter = 0;
    let listenerId = 0;
    outgoing.mockImplementation(({ command }) => {
      if (command === 'Session.create') {
        return {
          data: {
            tabId: 'tab-id',
            sessionId: `${(counter += 1)}`,
            sessionsDataLocation: '',
          },
        };
      }
      if (command === 'Session.addEventListener') {
        return {
          data: { listenerId: (listenerId += 1).toString() },
        };
      }
      if (command === 'close') {
        return {
          data: {},
        };
      }
    });
    const connection = new Piper({
      maxConcurrency: 2,
    });
    const handler = new Handler(connection);
    Helpers.needsClosing.push(handler);

    const hero1 = await handler.createHero();
    const hero2 = await handler.createHero();
    await expect(hero1.sessionId).resolves.toBe('1');
    await expect(hero2.sessionId).resolves.toBe('2');
    const hero3 = handler.createHero();

    async function isHero3Available(): Promise<boolean> {
      const result = await Promise.race([
        hero3,
        new Promise(resolve => setTimeout(() => resolve('not avail'), 100)),
      ]);
      return result !== 'not avail';
    }

    await expect(isHero3Available()).resolves.toBe(false);

    await hero1.close();
    connection.onMessage({ listenerId: '1', meta: { sessionId: '1' }, eventArgs: [] });
    await new Promise(setImmediate);
    await expect(isHero3Available()).resolves.toBe(true);
  });
});
