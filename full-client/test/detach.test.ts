import { Helpers } from '@secret-agent/testing';
import { ITestKoaServer } from '@secret-agent/testing/helpers';
import { IState } from '@secret-agent/client/lib/Agent';
import Resolvable from '@secret-agent/commons/Resolvable';
import StateMachine from 'awaited-dom/base/StateMachine';
import Core from '@secret-agent/core';
import IAwaitedOptions from '@secret-agent/client/interfaces/IAwaitedOptions';
import FrameEnvironment from '@secret-agent/core/lib/FrameEnvironment';
import { Agent, Handler, RemoteConnectionToCore } from '../index';

let koaServer: ITestKoaServer;
let handler: Handler;
beforeAll(async () => {
  handler = new Handler();
  Helpers.onClose(() => handler.close(), true);
  koaServer = await Helpers.runKoaServer();
});
afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

describe('basic Detach tests', () => {
  it('can detach a document', async () => {
    koaServer.get('/detach-1', ctx => {
      ctx.body = `
        <body>
          <a href="#page1">Click Me</a>
        </body>
      `;
    });
    const agent = await openBrowser(`/detach-1`);
    const links = await agent.document.querySelectorAll('a').length;
    expect(links).toBe(1);

    const frozenTab = await agent.detach(agent.activeTab);
    const detachedTab = await frozenTab.document.querySelectorAll('a').length;
    expect(detachedTab).toBe(1);
  });

  it('should keep the original tab detached', async () => {
    koaServer.get('/detach-grow', ctx => {
      ctx.body = `
        <body>
          <a href="javascript:void(0);" onclick="clicker()">Click Me</a>

          <script>
          function clicker() {
            const elem = document.createElement('A');
            document.querySelector('a').after(elem)
          }
          </script>
        </body>
      `;
    });
    const agent = await openBrowser(`/detach-grow`);
    const links = await agent.document.querySelectorAll('a').length;
    expect(links).toBe(1);

    const frozenTab = await agent.detach(agent.activeTab);
    const detachedTab = await frozenTab.document.querySelectorAll('a').length;
    expect(detachedTab).toBe(1);

    await agent.click(agent.document.querySelector('a'));
    const linksAfterClick = await agent.document.querySelectorAll('a').length;
    expect(linksAfterClick).toBe(2);

    const detachedLinksAfterClick = await frozenTab.document.querySelectorAll('a').length;
    expect(detachedLinksAfterClick).toBe(1);

    const frozenTab2 = await agent.detach(agent.activeTab);
    const detachedTab2 = await frozenTab2.document.querySelectorAll('a').length;
    expect(detachedTab2).toBe(2);
  });

  it('can handle jsPaths when element not present', async () => {
    let run = 0;
    koaServer.get('/detach-notthere', ctx => {
      run += 1;
      if (run === 1) {
        ctx.body = `
        <body>
          <a id="link1">Click Me</a>
          <div id="loop">
              <div class="parent">
                <div class="child">1</div>
                <div class="child">2</div>
                <div class="child">3</div>
              </div>
          </div>
        </body>
      `;
      } else {
        ctx.body = `
        <body>
          <a id="link2">Click Me</a>
        </body>
      `;
      }
    });

    {
      const agent = await openBrowser(`/detach-notthere`);
      await mockDetach(agent);
      const frozenTab = await agent.detach(agent.activeTab);
      const link = await frozenTab.document.querySelector('#link1');
      await expect(link.innerText).resolves.toBe('Click Me');
      await expect(
        frozenTab.document.querySelector('#loop').firstElementChild.innerHTML,
      ).resolves.toBeTruthy();
      const parent = await frozenTab.document.querySelectorAll('.child');
      for (const child of parent) {
        await expect(child.hasAttribute('class')).resolves.toBe(true);
      }
      await agent.close();
    }
    {
      const agent = await openBrowser(`/detach-notthere`);
      await mockDetach(agent);
      const frozenTab = await agent.detach(agent.activeTab);
      const link = await frozenTab.document.querySelector('#link1');
      expect(link).toBe(null);

      await expect(
        frozenTab.document.querySelector('#loop').firstElementChild.innerHTML,
      ).rejects.toThrow();
      const parent = await frozenTab.document.querySelectorAll('.child');
      for (const child of parent) {
        expect(child).not.toBeTruthy();
      }
      await agent.close();
    }
  });

  it('will wait for flushes to complete', async () => {
    koaServer.get('/detach-flush', ctx => {
      ctx.body = `
        <body>
          <a id="link1" href="#page1">Click Me</a>
        </body>
      `;
    });
    {
      // @ts-ignore
      const connection = handler.connections[0];
      const sendRequestSpy = jest.spyOn(connection, 'sendRequest');
      const agent = await openBrowser(`/detach-flush`);
      await mockDetach(agent, 'detach-flush');
      const frozenTab = await agent.detach(agent.activeTab);
      const link = await frozenTab.document.querySelector('#link1');
      await link.getAttribute('id');
      await link.getAttribute('class');
      await link.dataset;
      const links = await frozenTab.document.querySelectorAll('a').length;
      expect(links).toBe(1);

      const outgoingCommands = sendRequestSpy.mock.calls;
      expect(outgoingCommands.map(c => c[0].command)).toMatchObject([
        'Session.create',
        'Session.addEventListener',
        'Tab.goto',
        'FrameEnvironment.waitForLoad',
        'Session.detachTab',
        'FrameEnvironment.execJsPath',
        'FrameEnvironment.execJsPath',
        'FrameEnvironment.execJsPath',
        'FrameEnvironment.execJsPath',
        'FrameEnvironment.execJsPath',
      ]);
      await agent.close();
    }
    {
      await Core.start();
      Helpers.onClose(() => Core.shutdown());

      const connection = new RemoteConnectionToCore({ host: await Core.server.address });
      await connection.connect();
      const sendRequest = connection.sendRequest.bind(connection);

      const flushPromise = new Resolvable<void>();
      const sendRequestSpy = jest.spyOn(connection, 'sendRequest');
      sendRequestSpy.mockImplementation(async request => {
        if (request.command === 'Session.flush' && !flushPromise.isResolved) {
          flushPromise.resolve();
          await new Promise(setImmediate);
        }
        return sendRequest(request);
      });

      const agent = await new Agent({ connectionToCore: connection });
      Helpers.needsClosing.push(agent);

      const connectionToClient = Core.connections[Core.connections.length - 1];
      // @ts-ignore
      const recordCommands = connectionToClient.recordCommands.bind(connectionToClient);
      const recordCommandsSpy = jest.spyOn<any, any>(connectionToClient, 'recordCommands');
      const waitForClose = new Resolvable<void>();
      recordCommandsSpy.mockImplementation(async (...args) => {
        if (!waitForClose.isResolved && (args[2] as any).length > 10) {
          await waitForClose.promise;
        }

        return recordCommands(...args);
      });

      await agent.goto(`${koaServer.baseUrl}/detach-flush`);
      await agent.waitForPaintingStable();
      await mockDetach(agent, 'detach-flush');
      const frozenTab = await agent.detach(agent.activeTab);
      const link = await frozenTab.document.querySelector('#link1');
      await link.getAttribute('id');
      await link.getAttribute('class');
      await link.dataset;

      const frameSpy = jest.spyOn(FrameEnvironment.prototype, 'recordDetachedJsPath');

      const frameState = StateMachine<any, IAwaitedOptions>();
      const coreFrame = await frameState.getState(frozenTab.mainFrameEnvironment).coreFrame;
      for (let i = 0; i < 1001; i += 1) {
        coreFrame.recordDetachedJsPath(1, new Date(), new Date());
      }
      await flushPromise;
      const links = await frozenTab.document.querySelectorAll('a').length;
      expect(links).toBe(1);

      await Promise.all([agent.close(), waitForClose.resolve()]);
      const outgoingCommands = sendRequestSpy.mock.calls;
      expect(outgoingCommands.map(c => c[0].command)).toMatchObject([
        'Session.create',
        'Tab.goto',
        'FrameEnvironment.waitForLoad',
        'Session.detachTab',
        'Session.flush',
        'Session.flush',
        'Session.close',
      ]);

      expect(frameSpy).toHaveBeenCalledTimes(1006);
    }
  });
});

async function openBrowser(path: string) {
  const agent = await handler.createAgent();
  Helpers.needsClosing.push(agent);
  await agent.goto(`${koaServer.baseUrl}${path}`);
  await agent.waitForPaintingStable();
  return agent;
}

const { getState } = StateMachine<any, IState>();
async function mockDetach(agent: Partial<Agent>, callsitePath = 'path1') {
  const coreSession = await getState(agent).connection.getCoreSessionOrReject();
  const origDetach = coreSession.detachTab;

  const interceptDetach = jest.spyOn(coreSession, 'detachTab');
  interceptDetach.mockImplementationOnce((tab, callSitePath: string, key?: string) => {
    return origDetach.call(coreSession, tab, callsitePath, key);
  });
}
