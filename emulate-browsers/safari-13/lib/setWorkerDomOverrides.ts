import { BrowserEmulatorBase, IBrowserData } from "@secret-agent/browser-emulator-utils";
import { IPuppetWorker } from '@secret-agent/interfaces/IPuppetWorker';
import loadDomOverrides from "./loadDomOverrides";

export default async function setWorkerDomOverrides(emulator: BrowserEmulatorBase, data: IBrowserData, worker: IPuppetWorker) {
  const domOverrides = loadDomOverrides(emulator, data);
  const scripts = domOverrides.build([
    'Error.captureStackTrace',
    'Error.constructor',
    'navigator.deviceMemory',
    'navigator',
    'WebGLRenderingContext.prototype.getParameter',
  ]);
  return Promise.all(scripts.map(x => worker.evaluate(x.script, true)));
}
