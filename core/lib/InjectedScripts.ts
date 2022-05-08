import * as fs from 'fs';
import { stringifiedTypeSerializerClass } from '@ulixee/commons/lib/TypeSerializer';
import FramesManager from './FramesManager';
import { IDomPaintEvent } from '@unblocked-web/emulator-spec/browser/Location';

const pageScripts = {
  NodeTracker: fs.readFileSync(`${__dirname}/../injected-scripts/NodeTracker.js`, 'utf8'),
  jsPath: fs.readFileSync(`${__dirname}/../injected-scripts/jsPath.js`, 'utf8'),
  MouseEvents: fs.readFileSync(`${__dirname}/../injected-scripts/MouseEvents.js`, 'utf8'),
  PaintEvents: fs.readFileSync(`${__dirname}/../injected-scripts/PaintEvents.js`, 'utf8'),
};

const pageEventsCallbackName = '__saPagePaintEventListenerCallback';
export const injectedScript = `(function saInjectedScripts(runtimeFunction) {
const exports = {}; // workaround for ts adding an exports variable
${stringifiedTypeSerializerClass};

${pageScripts.NodeTracker};
${pageScripts.jsPath};
${pageScripts.MouseEvents};
${pageScripts.PaintEvents};

window.TypeSerializer = TypeSerializer;
window.SA = {
  JsPath,
  MouseEvents
};
})('${pageEventsCallbackName}');`;

export default class InjectedScripts {
  public static JsPath = `SA.JsPath`;
  public static MouseEvents = `SA.MouseEvents`;

  public static install(
    framesManager: FramesManager,
    onPaintEvent: (
      frameId: string,
      event: { url: string; event: IDomPaintEvent; timestamp: number },
    ) => void,
  ): Promise<any> {
    return Promise.all([
      framesManager.addPageCallback(
        pageEventsCallbackName,
        (payload, frameId) => onPaintEvent(frameId, JSON.parse(payload)),
        framesManager.page.installJsPathIntoIsolatedContext,
      ),
      framesManager.addNewDocumentScript(
        injectedScript,
        framesManager.page.installJsPathIntoIsolatedContext,
      ),
    ]);
  }
}
