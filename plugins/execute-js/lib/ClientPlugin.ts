import { ISendToCoreFn } from '@secret-agent/interfaces/IClientPlugin';
import ClientPlugin from '@secret-agent/plugin-utils/lib/ClientPlugin';
import type { Agent, Tab } from 'secret-agent';

const { name: pluginId } = require('../package.json');

export default class ExecuteJsClientPlugin extends ClientPlugin {
  public static id = pluginId;
  public static coreDependencyIds = [pluginId];

  public onAgent(agent: Agent, sendToCore: ISendToCoreFn) {
    agent.executeJs = (fn, ...args) => {
      return this.executeJs(fn, sendToCore, args);
    };
  }

  public onTab(agent: Agent, tab: Tab, sendToCore: ISendToCoreFn) {
    tab.executeJs = (fn, ...args) => {
      return this.executeJs(fn, sendToCore, args);
    };
  }

  // PRIVATE

  private executeJs(fn, sendToCore, args): Promise<any> {
    let fnName;
    let fnSerialized;
    if (typeof fn === 'string') {
      fnName = '';
      fnSerialized = fn;
    } else {
      fnName = fn.name;
      fnSerialized = `(${fn.toString()})(${JSON.stringify(args).slice(1, -1)});`;
    }
    return sendToCore(pluginId, fnName, fnSerialized, args);
  }
}
