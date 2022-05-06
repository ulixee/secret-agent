import type { IDomPaintEvent } from '@bureau/interfaces/Location';

declare const runtimeFunction: string;
// callback binding
const eventsCallback = window[runtimeFunction] as unknown as (data: string) => void;

class PaintEvents {
  onEventCallbackFn: (event: IDomPaintEvent, timestamp: number, url: string) => void;

  constructor() {
    window.addEventListener('DOMContentLoaded', () => {
      this.eventTriggered('DomContentLoaded');
    });

    window.addEventListener('load', () => {
      this.eventTriggered('AllContentLoaded');
    });

    if (window.self.location?.href !== 'about:blank') {
      const paintObserver = new PerformanceObserver(entryList => {
        if (entryList.getEntriesByName('first-contentful-paint').length) {
          this.eventTriggered('FirstContentfulPaint');
          paintObserver.disconnect();
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });

      const contentStableObserver = new PerformanceObserver(() => {
        this.eventTriggered('LargestContentfulPaint');
        contentStableObserver.disconnect();
      });
      contentStableObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  }

  eventTriggered(event: IDomPaintEvent) {
    const timestamp = Date.now();
    const url = window.self.location.href;
    eventsCallback(JSON.stringify({ timestamp, event, url }));
    if (this.onEventCallbackFn) this.onEventCallbackFn(event, timestamp, url);
  }
}

window.PaintEvents = new PaintEvents();
