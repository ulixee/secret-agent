import { IPuppetPage } from '@secret-agent/interfaces/IPuppetPage';
import { IPuppetFrame } from '@secret-agent/interfaces/IPuppetFrame';
import { IKeyboardKey } from '@secret-agent/interfaces/IKeyboardLayoutUS';
import { keyDefinitions } from '@secret-agent/puppet-chrome/interfaces/USKeyboardLayout';
import IPuppetContext from '@secret-agent/interfaces/IPuppetContext';
import * as Fs from 'fs';

export interface ITestPage extends IPuppetPage {
  click(selector: string): Promise<void>;
  type(text: string): Promise<void>;
  attachFrame(frameId: string, url: string): Promise<IPuppetFrame>;
  detachFrame(frameId: string): Promise<void>;
  goto(url: string, waitOnLifecycle?: string, timeoutMs?: number): Promise<void>;
  setContent(content: string): Promise<void>;
  waitForPopup(): Promise<IPuppetPage>;
}

export function capturePuppetContextLogs(context: IPuppetContext, id: string): void {
  const outDir = process.env.SA_SESSIONS_DIR;

  if (!Fs.existsSync(outDir)) Fs.mkdirSync(outDir, { recursive: true });

  context.on('devtools-message', x => {
    Fs.appendFileSync(`${outDir}/${id}.txt`, `${JSON.stringify(x)}\n`);
  });
}

export function createTestPage(page: IPuppetPage) {
  const castPage = page as ITestPage;
  castPage.attachFrame = attachFrame.bind(page, page);
  castPage.detachFrame = detachFrame.bind(page, page);
  castPage.click = click.bind(page, page);
  castPage.type = type.bind(page, page);
  castPage.setContent = setContent.bind(page, page);
  castPage.waitForPopup = waitForPopup.bind(page, page);
  castPage.goto = goto.bind(page, page);
  return castPage;
}

export async function type(page: IPuppetPage, text: string) {
  for (const char of text) {
    if (char in keyDefinitions) await page.keyboard.press(char as IKeyboardKey);
    else await page.keyboard.sendCharacter(char);
  }
}

export async function click(page: IPuppetPage, selector: string) {
  const coordinates: any = await page.evaluate(`(()=>{
    const rect = document.querySelector('${selector}').getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y
    };
})();`);
  await page.mouse.move(coordinates.x, coordinates.y);
  await page.mouse.down();
  await page.mouse.up();
}

export async function attachFrame(page: IPuppetPage, frameId: string, url: string) {
  const framePromise = page.waitOn('frame-created');
  await page.evaluate(`
        (async () => {
          const frame = document.createElement('iframe');
          frame.src = '${url}';
          frame.id = '${frameId}';
          document.body.appendChild(frame);
          await new Promise(x => (frame.onload = x));
        })()`);
  const { frame } = await framePromise;
  return page.frames.find(x => x.id === frame.id);
}

export async function detachFrame(page: IPuppetPage, frameId: string) {
  await page.evaluate(`((frameId) => {
        document.getElementById(frameId).remove();
      })('${frameId}')`);
}

export async function goto(
  page: IPuppetPage,
  url: string,
  waitOnLifecycle: 'load' | 'DOMContentLoaded' = 'load',
  timeoutMs?: number,
) {
  waitOnLifecycle ??= 'load';
  timeoutMs ??= 30e3;
  const [loader] = await Promise.all([
    page.navigate(url),
    page.mainFrame.waitOn('frame-navigated', null, timeoutMs),
  ]);
  await page.mainFrame.waitForLifecycleEvent(waitOnLifecycle, loader.loaderId, timeoutMs);
}

export async function setContent(page: IPuppetPage, content: string) {
  // @ts-ignore
  page.mainFrame.defaultLoaderId = null;
  await page.evaluate(`((content) => {
        window.stop();
        document.open();
        document.write(content);
        document.close();
      })(${JSON.stringify(content)})`);
}

export async function waitForPopup(page: IPuppetPage) {
  return new Promise<IPuppetPage>(resolve => {
    page.popupInitializeFn = async popup => resolve(popup);
  });
}
