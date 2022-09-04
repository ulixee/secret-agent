import inspectInstanceProperties from 'awaited-dom/base/inspectInstanceProperties';
import StateMachine from 'awaited-dom/base/StateMachine';
import { ISuperElement } from 'awaited-dom/base/interfaces/super';
import { IRequestInit } from 'awaited-dom/base/interfaces/official';
import SuperDocument from 'awaited-dom/impl/super-klasses/SuperDocument';
import Storage from 'awaited-dom/impl/official-klasses/Storage';
import CSSStyleDeclaration from 'awaited-dom/impl/official-klasses/CSSStyleDeclaration';
import Request from 'awaited-dom/impl/official-klasses/Request';
import { ILocationTrigger, LocationStatus } from '@secret-agent/interfaces/Location';
import IWaitForResourceOptions from '@secret-agent/interfaces/IWaitForResourceOptions';
import IWaitForElementOptions from '@secret-agent/interfaces/IWaitForElementOptions';
import Response from 'awaited-dom/impl/official-klasses/Response';
import IWaitForOptions from '@secret-agent/interfaces/IWaitForOptions';
import {
  IElementIsolate,
  IHTMLFrameElementIsolate,
  IHTMLIFrameElementIsolate,
  IHTMLObjectElementIsolate,
  INodeIsolate,
} from 'awaited-dom/base/interfaces/isolate';
import IScreenshotOptions from '@secret-agent/interfaces/IScreenshotOptions';
import AwaitedPath from 'awaited-dom/base/AwaitedPath';
import { INodeVisibility } from '@secret-agent/interfaces/INodeVisibility';
import * as Util from 'util';
import CoreTab from './CoreTab';
import Resource, { createResource } from './Resource';
import IWaitForResourceFilter from '../interfaces/IWaitForResourceFilter';
import WebsocketResource from './WebsocketResource';
import AwaitedEventTarget from './AwaitedEventTarget';
import CookieStorage from './CookieStorage';
import Agent, { IState as IAgentState } from './Agent';
import FrameEnvironment from './FrameEnvironment';
import CoreFrameEnvironment from './CoreFrameEnvironment';
import IAwaitedOptions from '../interfaces/IAwaitedOptions';
import Dialog from './Dialog';
import FileChooser from './FileChooser';
import Download from './Download';

const awaitedPathState = StateMachine<
  any,
  { awaitedPath: AwaitedPath; awaitedOptions: IAwaitedOptions }
>();
const { getState, setState } = StateMachine<Tab, IState>();
const agentState = StateMachine<Agent, IAgentState>();

export interface IState {
  agent: Agent;
  coreTab: Promise<CoreTab>;
  mainFrameEnvironment: FrameEnvironment;
  frameEnvironments: FrameEnvironment[];
}

interface IEventType {
  resource: Resource | WebsocketResource;
  dialog: Dialog;
  download: Download;
}

const propertyKeys: (keyof Tab)[] = [
  'lastCommandId',
  'tabId',
  'url',
  'cookieStorage',
  'localStorage',
  'sessionStorage',
  'document',
  'frameEnvironments',
  'mainFrameEnvironment',
  'Request',
];

export default class Tab extends AwaitedEventTarget<IEventType> {
  constructor(agent: Agent, coreTab: Promise<CoreTab>) {
    super(() => {
      return { target: coreTab };
    });
    const mainFrameEnvironment = new FrameEnvironment(
      agent,
      this,
      coreTab.then(x => x?.mainFrameEnvironment),
    );
    setState(this, {
      agent,
      coreTab,
      mainFrameEnvironment,
      frameEnvironments: [mainFrameEnvironment],
    });

    async function sendToTab(pluginId: string, ...args: any[]): Promise<any> {
      return (await coreTab).commandQueue.run('Tab.runPluginCommand', pluginId, args);
    }

    for (const clientPlugin of agentState.getState(agent).clientPlugins) {
      if (clientPlugin.onTab) clientPlugin.onTab(agent, this, sendToTab);
    }
  }

  public get tabId(): Promise<number> {
    return getCoreTab(this).then(x => x.tabId);
  }

  public get lastCommandId(): Promise<number> {
    return getCoreTab(this).then(x => x.commandQueue.lastCommandId);
  }

  public get url(): Promise<string> {
    return this.mainFrameEnvironment.url;
  }

  public get mainFrameEnvironment(): FrameEnvironment {
    return getState(this).mainFrameEnvironment;
  }

  public get cookieStorage(): CookieStorage {
    return this.mainFrameEnvironment.cookieStorage;
  }

  public get frameEnvironments(): Promise<FrameEnvironment[]> {
    return getRefreshedFrameEnvironments(this);
  }

  public get document(): SuperDocument {
    return this.mainFrameEnvironment.document;
  }

  public get localStorage(): Storage {
    return this.mainFrameEnvironment.localStorage;
  }

  public get sessionStorage(): Storage {
    return this.mainFrameEnvironment.sessionStorage;
  }

  public get Request(): typeof Request {
    return this.mainFrameEnvironment.Request;
  }

  // METHODS

  public async fetch(request: Request | string, init?: IRequestInit): Promise<Response> {
    return await this.mainFrameEnvironment.fetch(request, init);
  }

  public async getFrameEnvironment(
    element: IHTMLFrameElementIsolate | IHTMLIFrameElementIsolate | IHTMLObjectElementIsolate,
  ): Promise<FrameEnvironment | null> {
    const { awaitedPath, awaitedOptions } = awaitedPathState.getState(element);
    const elementCoreFrame = await awaitedOptions.coreFrame;
    const frameMeta = await elementCoreFrame.getChildFrameEnvironment(awaitedPath.toJSON());
    if (!frameMeta) return null;

    const coreTab = await getCoreTab(this);
    return await getOrCreateFrameEnvironment(this, coreTab.getCoreFrameForMeta(frameMeta));
  }

  public getComputedStyle(element: IElementIsolate, pseudoElement?: string): CSSStyleDeclaration {
    return FrameEnvironment.getComputedStyle(element, pseudoElement);
  }

  public async goto(href: string, timeoutMs?: number): Promise<Resource> {
    const coreTab = await getCoreTab(this);
    const resource = await coreTab.goto(href, timeoutMs);
    return createResource(Promise.resolve(coreTab), resource);
  }

  public async goBack(timeoutMs?: number): Promise<string> {
    const coreTab = await getCoreTab(this);
    return coreTab.goBack(timeoutMs);
  }

  public async goForward(timeoutMs?: number): Promise<string> {
    const coreTab = await getCoreTab(this);
    return coreTab.goForward(timeoutMs);
  }

  public async reload(timeoutMs?: number): Promise<Resource> {
    const coreTab = await getCoreTab(this);
    const resource = await coreTab.reload(timeoutMs);
    return createResource(Promise.resolve(coreTab), resource);
  }

  public async getJsValue<T>(path: string): Promise<T> {
    return await this.mainFrameEnvironment.getJsValue(path);
  }

  // @deprecated 2021-04-30: Replaced with getComputedVisibility
  public async isElementVisible(element: IElementIsolate): Promise<boolean> {
    return await this.getComputedVisibility(element as any).then(x => x.isVisible);
  }

  public async getComputedVisibility(node: INodeIsolate): Promise<INodeVisibility> {
    return await FrameEnvironment.getComputedVisibility(node);
  }

  public async takeScreenshot(options?: IScreenshotOptions): Promise<Buffer> {
    const coreTab = await getCoreTab(this);
    return coreTab.takeScreenshot(options);
  }

  public async waitForFileChooser(options?: IWaitForOptions): Promise<FileChooser> {
    const coreTab = await getCoreTab(this);
    const prompt = await coreTab.waitForFileChooser(options);
    const coreFrame = coreTab.frameEnvironmentsById.get(prompt.frameId);
    return new FileChooser(Promise.resolve(coreFrame), prompt);
  }

  public async waitForPaintingStable(options?: IWaitForOptions): Promise<void> {
    return await this.mainFrameEnvironment.waitForPaintingStable(options);
  }

  public async waitForLoad(status: LocationStatus, options?: IWaitForOptions): Promise<void> {
    return await this.mainFrameEnvironment.waitForLoad(status, options);
  }

  public waitForResource(
    filter: IWaitForResourceFilter,
    options?: IWaitForResourceOptions,
  ): Promise<(Resource | WebsocketResource)[]> {
    return Resource.waitFor(this, filter, options);
  }

  public async waitForElement(
    element: ISuperElement,
    options?: IWaitForElementOptions,
  ): Promise<void> {
    return await this.mainFrameEnvironment.waitForElement(element, options);
  }

  public async waitForLocation(
    trigger: ILocationTrigger,
    options?: IWaitForOptions,
  ): Promise<Resource> {
    return await this.mainFrameEnvironment.waitForLocation(trigger, options);
  }

  public async waitForMillis(millis: number): Promise<void> {
    const coreTab = await getCoreTab(this);
    await coreTab.waitForMillis(millis);
  }

  public focus(): Promise<void> {
    const { agent, coreTab } = getState(this);
    agentState.getState(agent).connection.activeTab = this;
    return coreTab.then(x => x.focusTab());
  }

  public close(): Promise<void> {
    const { agent, coreTab } = getState(this);
    const { connection } = agentState.getState(agent);
    connection.closeTab(this);
    return coreTab.then(x => x.close());
  }

  public toJSON(): any {
    // return empty so we can avoid infinite "stringifying" in jest
    return {
      type: this.constructor.name,
    };
  }

  public [Util.inspect.custom](): any {
    return inspectInstanceProperties(this, propertyKeys as any);
  }
}

async function getOrCreateFrameEnvironment(
  tab: Tab,
  coreFrame: CoreFrameEnvironment,
): Promise<FrameEnvironment> {
  const state = getState(tab);
  const { frameEnvironments } = state;

  for (const frameEnvironment of frameEnvironments) {
    const frameId = await frameEnvironment.frameId;
    if (frameId === coreFrame.frameId) return frameEnvironment;
  }
  const frameEnvironment = new FrameEnvironment(state.agent, tab, Promise.resolve(coreFrame));
  frameEnvironments.push(frameEnvironment);
  return frameEnvironment;
}

async function getRefreshedFrameEnvironments(tab: Tab): Promise<FrameEnvironment[]> {
  const state = getState(tab);
  const { frameEnvironments } = state;
  const coreTab = await state.coreTab;
  const coreFrames = await coreTab.getCoreFrameEnvironments();

  const newFrameIds = coreFrames.map(x => x.frameId);

  for (const frameEnvironment of frameEnvironments) {
    const id = await frameEnvironment.frameId;
    // remove frames that are gone
    if (!newFrameIds.includes(id)) {
      const idx = frameEnvironments.indexOf(frameEnvironment);
      frameEnvironments.splice(idx, 1);
    }
  }

  await Promise.all(coreFrames.map(x => getOrCreateFrameEnvironment(tab, x)));

  return frameEnvironments;
}

export function getCoreTab(tab: Tab): Promise<CoreTab> {
  return getState(tab).coreTab.then(x => {
    if (x instanceof Error) throw x;
    return x;
  });
}

// CREATE

export function createTab(agent: Agent, coreTab: Promise<CoreTab>): Tab {
  return new Tab(agent, coreTab);
}
