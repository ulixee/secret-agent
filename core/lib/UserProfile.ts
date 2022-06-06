import IUserProfile from '@secret-agent/interfaces/IUserProfile';
import IDomStorage from '@secret-agent/interfaces/IDomStorage';
import { IPuppetPage } from '@secret-agent/interfaces/IPuppetPage';
import { assert } from '@secret-agent/commons/utils';
import Session from './Session';
import InjectedScripts from './InjectedScripts';

export default class UserProfile {
  public static async export(session: Session) {
    const cookies = await session.browserContext.getCookies();

    // start with previous storage
    const storage: IDomStorage = session.options.userProfile?.storage ?? {};

    for (const tab of session.tabsById.values()) {
      const page = tab.puppetPage;

      const dbs = await page.getIndexedDbDatabaseNames();
      const frames = page.frames;
      for (const { origin, frameId, databases } of dbs) {
        const frame = frames.find(x => x.id === frameId);
        storage[origin] = await frame?.evaluate(
          `window.exportDomStorage(${JSON.stringify(databases)})`,
          true,
        );
      }
    }

    return {
      cookies,
      storage,
      userAgentString: session.plugins.browserEmulator.userAgentString,
      deviceProfile: session.plugins.browserEmulator.deviceProfile,
    } as IUserProfile;
  }

  public static async installCookies(session: Session) {
    const { userProfile } = session;
    assert(userProfile, 'UserProfile exists');

    const { storage, cookies } = userProfile;
    const origins = Object.keys(storage ?? {});

    if (cookies && cookies.length) {
      await session.browserContext.addCookies(cookies, origins);
    }
    return this;
  }

  public static async installStorage(session: Session, page: IPuppetPage) {
    const { userProfile } = session;
    const storage = userProfile.storage;
    if (!storage) return;

    const startMitm = { ...session.mitmRequestSession.blockedResources };
    try {
      session.mitmRequestSession.blockedResources = {
        types: [],
        urls: Object.keys(storage),
        handlerFn(req, res, ctx) {
          let script = '';
          const originStorage = storage[ctx.url.origin];
          const sessionStorage = originStorage?.sessionStorage;
          if (sessionStorage) {
            script += `
for (const [key,value] of ${JSON.stringify(sessionStorage)}) {
  sessionStorage.setItem(key,value);
}\n`;
          }
          const localStorage = originStorage?.localStorage;
          if (localStorage) {
            script += `\n
for (const [key,value] of ${JSON.stringify(localStorage)}) {
  localStorage.setItem(key,value);
}\n`;
          }

          if (originStorage?.indexedDB) {
            script += `\n\n 
             ${InjectedScripts.getIndexedDbStorageRestoreScript(originStorage.indexedDB)}`;
          }

          res.end(`<html><body>
<h5>${ctx.url.origin}</h5>
<script>
${script}
</script>
</body></html>`);

          return true;
        },
      };
      // reinstall session storage for the
      await page.devtoolsSession.send('Page.setDocumentContent', {
        frameId: page.mainFrame.id,
        html: `<html>
<body>
<h1>Restoring Dom Storage</h1>
${Object.keys(storage)
  .map(x => `<iframe src="${x}"></iframe>`)
  .join('\n')}
</body>
</html>`,
      });

      for (const frame of page.frames) {
        if (frame === page.mainFrame) {
          // no loader is set, so need to have special handling
          if (!page.mainFrame.activeLoader.lifecycle.load) {
            await page.mainFrame.waitOn('frame-lifecycle', x => x.name === 'load');
          }
          continue;
        }
        await frame.waitForLifecycleEvent('load');
      }
    } finally {
      session.mitmRequestSession.blockedResources = startMitm;
    }
  }
}
