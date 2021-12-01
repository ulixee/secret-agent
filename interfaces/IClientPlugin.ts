import { PluginTypes } from './IPluginTypes';
import type { Agent, Tab, FrameEnvironment } from '../client';

export default interface IClientPlugin {
  id: string;

  onAgent?(agent: Agent, sendToCore: ISendToCoreFn): void;
  onTab?(agent: Agent, tab: Tab, sendToCore: ISendToCoreFn): void;
  onFrameEnvironment?(
    agent: Agent,
    frameEnvironment: FrameEnvironment,
    sendToCore: ISendToCoreFn,
  ): void;
}

export interface IClientPluginClass {
  id: string;
  type: PluginTypes.ClientPlugin;
  coreDependencyIds?: string[];
  new (): IClientPlugin;
}

// decorator for client plugin classes. hacky way to check the class implements statics we need
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClientPluginClassDecorator(constructor: IClientPluginClass): void {}

export type ISendToCoreFn = (toPluginId: string, ...args: any[]) => Promise<any>;
