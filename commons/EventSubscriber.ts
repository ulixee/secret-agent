import IRegisteredEventListener, {
  IEventSubscriber,
} from '@secret-agent/interfaces/IRegisteredEventListener';

export default class EventSubscriber implements IEventSubscriber {
  private readonly registeredEventListeners: IRegisteredEventListener[] = [];

  on<K extends string | symbol, Func extends (...args: any[]) => void>(
    emitter: {
      on(event: K, listener: Func, includeUnhandledEvents?: boolean);
      off(event: K, listener: Func);
    },
    eventName: K,
    handler: Func,
    includeUnhandledEvents?: boolean,
  ): IRegisteredEventListener {
    emitter.on(eventName, handler, includeUnhandledEvents);
    const registeredEvent: IRegisteredEventListener = { emitter, eventName, handler };
    this.registeredEventListeners.push(registeredEvent);
    return registeredEvent;
  }

  once<Event extends string | symbol, Func extends (...args: any[]) => void>(
    emitter: {
      once(event: Event, listener: Func, includeUnhandledEvents?: boolean);
      off(event: Event, listener: Func);
    },
    eventName: Event,
    handler: Func,
    includeUnhandledEvents?: boolean,
  ): IRegisteredEventListener {
    emitter.once(eventName, handler, includeUnhandledEvents);
    const registeredEvent: IRegisteredEventListener = { emitter, eventName, handler };
    this.registeredEventListeners.push(registeredEvent);
    return registeredEvent;
  }

  off(...listeners: IRegisteredEventListener[]): void {
    for (const listener of listeners) {
      listener.emitter.off(listener.eventName, listener.handler);
    }
    listeners.length = 0;
  }

  close(...keepMockEvents: (string | symbol)[]): void {
    for (const listener of this.registeredEventListeners) {
      if (keepMockEvents.includes(listener.eventName)) {
        // add a mock event handler (like for capturing events)
        (listener.emitter as any).on(listener.eventName, () => null);
      }
      listener.emitter.off(listener.eventName, listener.handler);
    }
    this.registeredEventListeners.length = 0;
  }
}
