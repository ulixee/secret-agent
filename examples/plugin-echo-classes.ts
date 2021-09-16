// eslint-disable-next-line max-classes-per-file
import { ISendToCoreFn } from '@secret-agent/interfaces/IClientPlugin';
import { ClientPlugin, CorePlugin } from '@secret-agent/plugin-utils';
import { IOnClientCommandMeta } from '@secret-agent/interfaces/ICorePlugin';
import type { Agent, Tab } from 'secret-agent';

export class EchoClientPlugin extends ClientPlugin {
  static readonly id = 'echo-plugin';
  static coreDependencyIds = [EchoClientPlugin.id];

  public onAgent(agent: Agent, sendToCore: ISendToCoreFn): void {
    agent.echo = (echo1: string, echo2: number, ...echoAny: any[]) => {
      return this.echo(sendToCore, echo1, echo2, ...echoAny);
    };
  }

  public onTab(agent: Agent, tab: Tab, sendToCore: ISendToCoreFn): void {
    tab.echo = (echo1: string, echo2: number, ...echoAny: any[]) => {
      return this.echo(sendToCore, echo1, echo2, ...echoAny);
    };
  }

  private async echo(
    sendToCore: ISendToCoreFn,
    echo1: string,
    echo2: number,
    ...echoAny: any[]
  ): Promise<[string, number, ...any[]]> {
    return await sendToCore(EchoClientPlugin.id, echo1, echo2, ...echoAny);
  }
}

export class EchoCorePlugin extends CorePlugin {
  static readonly id = 'echo-plugin';

  public onClientCommand(
    { puppetPage }: IOnClientCommandMeta,
    echo1: string,
    echo2: number,
    ...echoAny: any[]
  ): Promise<any> {
    return Promise.resolve([echo1, echo2, ...echoAny]);
  }
}

type ExecuteJsPluginAdditions = {
  echo(echo1: string, echo2: number, ...echoAny: any[]): Promise<[string, number, ...any[]]>;
};

declare module '@secret-agent/client/lib/extendables' {
  interface Agent extends ExecuteJsPluginAdditions {}
  interface Tab extends ExecuteJsPluginAdditions {}
}
