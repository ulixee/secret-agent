import IViewport from '@unblocked/emulator-spec/IViewport';
import Browser from 'secret-agent/lib/Browser';
import ChromeEngine from 'secret-agent/lib/ChromeEngine';
import { IBrowserContextHooks, IBrowserHooks } from '@unblocked/emulator-spec/IHooks';
import IBrowser from '@unblocked/emulator-spec/IBrowser';
import env from './env';
import { Helpers } from './index';
import DefaultChrome = require('@ulixee/chrome-98-0');

let ChromeApp = DefaultChrome;
if (env.defaultBrowserId) {
  ChromeApp = require(`@ulixee/defaultBrowserId`);
}

export const defaultBrowserEngine = new ChromeEngine(new ChromeApp());

export const newPoolOptions = { defaultBrowserEngine };
export const browserEngineOptions = defaultBrowserEngine;

export function createDefaultBrowser(): Browser {
  const browser = new Browser(defaultBrowserEngine);
  Helpers.onClose(() => browser.close(), true);
  return browser;
}

export class PageHooks implements IBrowserHooks, IBrowserContextHooks {
  viewport: IViewport = {
    screenHeight: 900,
    screenWidth: 1024,
    positionY: 0,
    positionX: 0,
    height: 900,
    width: 1024,
  };

  locale = 'en';
  timezoneId = 'America/New_York';
  userAgentString = 'Browser Test';
  operatingSystemPlatform = 'linux';

  constructor(
    config: {
      locale?: string;
      viewport?: IViewport;
      timezoneId?: string;
      userAgent?: string;
      osPlatform?: string;
    } = {},
  ) {
    config.locale ??= this.locale;
    config.viewport ??= this.viewport;
    config.timezoneId ??= this.timezoneId;
    config.osPlatform ??= this.operatingSystemPlatform;

    this.locale = config.locale;
    this.viewport = config.viewport;
    this.timezoneId = config.timezoneId;
    this.operatingSystemPlatform = config.osPlatform;
    if (config.userAgent) {
      this.userAgentString = config.userAgent;
    }
  }

  public async onNewPage(page): Promise<void> {
    const devtools = page.devtoolsSession;
    await Promise.all([
      devtools.send('Network.setUserAgentOverride', {
        userAgent: this.userAgentString,
        acceptLanguage: this.locale,
        platform: this.operatingSystemPlatform,
      }),
      devtools
        .send('Emulation.setTimezoneOverride', { timezoneId: this.timezoneId })
        .catch(() => null),
      devtools.send('Emulation.setLocaleOverride', { locale: this.locale }).catch(err => err),
      this.viewport
        ? devtools
            .send('Emulation.setDeviceMetricsOverride', {
              width: this.viewport.width,
              height: this.viewport.height,
              deviceScaleFactor: 1,
              positionX: this.viewport.positionX,
              positionY: this.viewport.positionY,
              screenWidth: this.viewport.screenWidth,
              screenHeight: this.viewport.screenHeight,
              mobile: false,
            })
            .catch(() => null)
        : null,
      devtools.send('Emulation.setFocusEmulationEnabled', { enabled: true }).catch(err => err),
    ]);
  }

  public async onNewBrowser(browser: IBrowser): Promise<void> {
    browser.engine.launchArguments.push(
      '--force-color-profile=srgb', // Force all monitors to be treated as though they have the specified color profile.
    );
  }
}
