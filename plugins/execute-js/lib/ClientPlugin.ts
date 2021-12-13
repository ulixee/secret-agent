import { ISendToCoreFn } from '@secret-agent/interfaces/IClientPlugin';
import ClientPlugin from '@secret-agent/plugin-utils/lib/ClientPlugin';
import type { Agent, Tab, FrameEnvironment } from 'secret-agent';
import { IExecuteJsArgs } from './IExecuteJsArgs';

const { name: pluginId } = require('../package.json');

export default class ExecuteJsClientPlugin extends ClientPlugin {
  public static id = pluginId;
  public static coreDependencyIds = [pluginId];

  public onAgent(agent: Agent, sendToCore: ISendToCoreFn) {
    agent.executeJs = this.executeJs.bind(this, sendToCore);
  }

  public onTab(agent: Agent, tab: Tab, sendToCore: ISendToCoreFn) {
    tab.executeJs = this.executeJs.bind(this, sendToCore);
  }

  public onFrameEnvironment(
    agent: Agent,
    frameEnvironment: FrameEnvironment,
    sendToCore: ISendToCoreFn,
  ) {
    frameEnvironment.executeJs = this.executeJs.bind(this, sendToCore);
  }

  // PRIVATE

  private executeJs<T extends any[]>(
    sendToCore: ISendToCoreFn,
    fn: string | ((...args: T) => any),
    ...args: T
  ): Promise<any> {
    let fnName = '';
    let fnSerialized = fn as string;
    if (typeof fn !== 'string') {
      fnName = fn.name;
      fnSerialized = `(${fn.toString()})(${JSON.stringify(args).slice(1, -1)});`;
    }
    return sendToCore(pluginId, <IExecuteJsArgs>{
      fnName,
      fnSerialized,
      args,
      isolateFromWebPageEnvironment: false,
    });
  }
}
