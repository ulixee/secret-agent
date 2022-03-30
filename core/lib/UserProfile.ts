import IUserProfile from '@secret-agent/interfaces/IUserProfile';
import IDomStorage from '@secret-agent/interfaces/IDomStorage';
import Log from '@secret-agent/commons/Logger';
import { IPuppetPage } from '@secret-agent/interfaces/IPuppetPage';
import { assert } from '@secret-agent/commons/utils';
import { IPuppetFrame } from '@secret-agent/interfaces/IPuppetFrame';
import Session from './Session';
import InjectedScripts from './InjectedScripts';

const { log } = Log(module);

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

  public static async install(session: Session) {
    const { userProfile } = session;
    assert(userProfile, 'UserProfile exists');
    const sessionId = session.id;

    const { storage, cookies } = userProfile;
    const origins = Object.keys(storage ?? {});

    const hasStorage =
      storage && origins.length && origins.some(x => storage[x]?.indexedDB?.length);
    if (!cookies && !hasStorage) {
      return this;
    }

    const parentLogId = log.info('UserProfile.install', { sessionId });

    let page: IPuppetPage;
    try {
      session.mitmRequestSession.bypassAllWithEmptyResponse = true;
      if (cookies && cookies.length) {
        await session.browserContext.addCookies(cookies, origins);
      }

      if (hasStorage) {
        page = await session.browserContext.newPage();
        // install scripts so we can restore storage
        await InjectedScripts.installDomStorageRestore(page);

        for (const origin of origins) {
          const originStorage = storage[origin];
          if (!originStorage || !originStorage.indexedDB.length) {
            continue;
          }

          await page.navigate(origin);
          await page.mainFrame.evaluate(
            `window.restoreUserStorage(${JSON.stringify(originStorage.indexedDB)})`,
            true,
          );
        }
      }
    } finally {
      if (page) await page.close().catch(() => null);
      session.mitmRequestSession.bypassAllWithEmptyResponse = false;
      log.info('UserProfile.installed', { sessionId, parentLogId });
    }

    return this;
  }

  public static async installDomStorage(session: Session, page: IPuppetPage) {
    const { userProfile } = session;
    const domStorage = userProfile.storage;
    if (!domStorage) return;

    const startMitm = { ...session.mitmRequestSession.blockedResources };
    try {
      session.mitmRequestSession.blockedResources = {
        types: [],
        urls: Object.keys(domStorage),
        handlerFn(req, res, ctx) {
          const sessionStorage = domStorage[ctx.url.origin]?.sessionStorage ?? [];
          const localStorage = domStorage[ctx.url.origin]?.localStorage ?? [];
          const html = `<html><body>
<h5>${ctx.url.origin}</h5>
<script>
for (const [key,value] of ${JSON.stringify(sessionStorage)}) {
  sessionStorage.setItem(key,value);
}
for (const [key,value] of ${JSON.stringify(localStorage)}) {
  localStorage.setItem(key,value);
}
</script></body></html>`;
          res.end(html);

          return true;
        },
      };
      // reinstall session storage for the
      await page.devtoolsSession.send('Page.setDocumentContent', {
        frameId: page.mainFrame.id,
        html: `<html>
<body>
<h1>Restoring Dom Storage</h1>
${Object.keys(domStorage)
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
        await frame.waitForLifecycleEvent('DOMContentLoaded');
      }
    } finally {
      session.mitmRequestSession.blockedResources = startMitm;
    }
  }
}
