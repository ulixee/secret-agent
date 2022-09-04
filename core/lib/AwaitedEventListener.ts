import { v1 as uuidv1 } from 'uuid';
import { IJsPath } from 'awaited-dom/base/AwaitedPath';
import ISessionMeta from '@secret-agent/interfaces/ISessionMeta';
import { assert } from '@secret-agent/commons/utils';
import EventSubscriber from '@secret-agent/commons/EventSubscriber';
import IListenerObject from '../interfaces/IListenerObject';
import Session from './Session';

export interface ITrigger {
  meta: ISessionMeta;
  listenerId: string;
  eventArgs: any[];
}

// TODO: can we merge TypedEventEmitter ideas and eventListenerIdsByType?. Revisit when we get to dom events
export default class AwaitedEventListener {
  private readonly listenersById = new Map<string, IListenerObject>();
  private eventSubscriber = new EventSubscriber();

  constructor(private session: Session) {
    this.eventSubscriber.once(session, 'closing', () => this.triggerListenersWithType('close'));
  }

  public close() {
    for (const entry of this.listenersById.values()) {
      if (entry.type !== 'close') {
        this.remove(entry.id);
      }
    }
    this.eventSubscriber.close();
    this.session = null;
  }

  public listen(
    sessionMeta: ISessionMeta,
    jsPath: IJsPath | null,
    type: string,
  ): { listenerId: string } {
    const listenerId = uuidv1();
    const listener: IListenerObject = {
      id: listenerId,
      type,
      jsPath,
      meta: sessionMeta,
    };
    this.listenersById.set(listenerId, listener);

    const tab = Session.getTab(sessionMeta);
    if (jsPath) {
      if (isWebsocketListener(listener)) {
        listener.listenFn = this.triggerListenersWithId.bind(this, listenerId);

        const resourceId = parseInt(jsPath[1] as string, 10);
        // need to give client time to register function sending events
        process.nextTick(() => tab.sessionState.onWebsocketMessages(resourceId, listener.listenFn));
      }
      if (listener.jsPath && listener.jsPath[0] === 'downloads') {
        const downloadId = listener.jsPath[1] as string;
        listener.listenFn = download => {
          if (download.id === downloadId) this.triggerListenersWithId(listenerId, download);
        };
        tab.on('download-progress', listener.listenFn);
        process.nextTick(() => listener.listenFn(tab.session.downloadsById.get(downloadId)));
      }
    } else if (type && tab) {
      if (type !== 'close') {
        listener.listenFn = this.triggerListenersWithType.bind(this, type);
        tab.on(type as any, listener.listenFn);
      }
    }

    return { listenerId };
  }

  public remove(id: string): void {
    const listener = this.listenersById.get(id);
    this.listenersById.delete(id);
    if (!listener.type) return; // ToDo: need to unbind listeners in DOM

    const { type, meta, listenFn, jsPath } = listener;
    const tab = Session.getTab(meta);
    if (tab) {
      tab.off(type as any, listenFn);

      if (isWebsocketListener(listener)) {
        tab.sessionState.stopWebsocketMessages(jsPath[1] as string, listenFn);
      }
    }

    for (const entry of this.listenersById.values()) {
      if (entry.type && entry.type === type) this.listenersById.delete(entry.id);
    }
  }

  private triggerListenersWithType(type: string, ...args): void {
    assert(type, 'Must provide a listener type');
    for (const [id, listener] of this.listenersById) {
      if (listener.type === type) {
        this.triggerListenersWithId(id, ...args);
      }
    }
  }

  private triggerListenersWithId(listenerId: string, ...args): void {
    const listenerObject = this.listenersById.get(listenerId);
    const { meta } = listenerObject;
    this.session.onAwaitedEvent({ meta, listenerId, eventArgs: args });
  }
}

function isWebsocketListener(listener: IListenerObject) {
  return listener.jsPath && listener.jsPath[0] === 'resources' && listener.type === 'message';
}
