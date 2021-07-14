import { Helpers } from '@ulixee/testing/index';
import Core, { GlobalPool } from '../index';
import Session from '../lib/Session';

const shutdownSpy = jest.spyOn(Core, 'shutdown');

afterEach(Helpers.afterEach);
afterAll(Helpers.afterAll);

describe('basic Core tests', () => {
  it('starts, configures, and shuts down', async () => {
    const connection = Core.addConnection();
    Helpers.onClose(() => connection.disconnect());
    await connection.connect({ maxConcurrentHerosCount: 5 });

    expect(GlobalPool.maxConcurrentHerosCount).toBe(5);
    expect(GlobalPool.activeSessionCount).toBe(0);

    await Core.shutdown();
  });

  it('runs createTab', async () => {
    const connection = Core.addConnection();
    Helpers.onClose(() => connection.disconnect());
    await connection.connect({ maxConcurrentHerosCount: 2 });
    await connection.createSession();

    expect(GlobalPool.maxConcurrentHerosCount).toBe(2);
    expect(GlobalPool.activeSessionCount).toBe(1);

    await Core.shutdown();
  });

  it('shuts down if connect set to be not persistent and Core.start not called', async () => {
    shutdownSpy.mockClear();

    const connection = Core.addConnection();
    await connection.connect({ isPersistent: false });
    Helpers.onClose(() => connection.disconnect());
    const connectionCloseSpy = jest.spyOn(connection, 'disconnect');
    connection.autoShutdownMillis = 0;

    const { sessionId } = await connection.createSession();
    await Session.get(sessionId).close();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(shutdownSpy).toHaveBeenCalledTimes(1);
    expect(connectionCloseSpy).toHaveBeenCalled();
    await Core.shutdown();
  });

  it('will not shutdown if start called and there are no open connections', async () => {
    shutdownSpy.mockClear();
    await Core.start();

    const connection = Core.addConnection();
    await connection.connect();
    const connectionCloseSpy = jest.spyOn(connection, 'disconnect');

    const { sessionId } = await connection.createSession();
    await Session.get(sessionId).close();

    await connection.disconnect();

    expect(shutdownSpy).toHaveBeenCalledTimes(0);
    expect(connectionCloseSpy).toHaveBeenCalledTimes(1);
    await Core.shutdown();
  });

  it('should be able to get multiple entries out of the pool', async () => {
    const connection = Core.addConnection();
    Helpers.onClose(() => connection.disconnect());
    GlobalPool.maxConcurrentHerosCount = 3;
    await connection.connect({ maxConcurrentHerosCount: 3 });
    const httpServer = await Helpers.runHttpServer({
      addToResponse: response => {
        response.setHeader('Set-Cookie', 'ulixee=test1');
      },
    });
    expect(GlobalPool.maxConcurrentHerosCount).toBe(3);
    expect(GlobalPool.activeSessionCount).toBe(0);

    const tab1 = Session.getTab(await connection.createSession());
    Helpers.needsClosing.push(tab1.session);
    // #1
    await tab1.goto(httpServer.url);
    expect(GlobalPool.activeSessionCount).toBe(1);

    const tab2 = Session.getTab(await connection.createSession());
    Helpers.needsClosing.push(tab2.session);

    // #2
    await tab2.goto(httpServer.url);
    expect(GlobalPool.activeSessionCount).toBe(2);

    const tab3 = Session.getTab(await connection.createSession());
    Helpers.needsClosing.push(tab3.session);

    // #3
    await tab3.goto(httpServer.url);
    expect(GlobalPool.activeSessionCount).toBe(3);

    // #4
    const tab4Promise = connection.createSession();
    expect(GlobalPool.activeSessionCount).toBe(3);
    await tab1.session.close();
    const tab4Meta = await tab4Promise;
    const tab4 = Session.getTab(tab4Meta);
    Helpers.needsClosing.push(tab4.session);

    // should give straight to this waiting promise
    expect(GlobalPool.activeSessionCount).toBe(3);
    await tab4.goto(httpServer.url);
    await tab4.session.close();
    expect(GlobalPool.activeSessionCount).toBe(2);

    await Promise.all([tab1.session.close(), tab2.session.close(), tab3.session.close()]);
    expect(GlobalPool.activeSessionCount).toBe(0);
    await httpServer.close();
  }, 15e3);
});
