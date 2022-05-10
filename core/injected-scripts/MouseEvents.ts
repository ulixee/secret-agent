import IMouseResult from '@unblocked-web/emulator-spec/interact/IMouseResult';
import { INodeVisibility } from '@unblocked-web/js-path';
import IWindowOffset from '@unblocked-web/emulator-spec/browser/IWindowOffset';

class MouseEvents {
  private static pendingEvent?: Promise<IMouseResult>;
  private static pendingEventResolve?: (result: IMouseResult) => void;
  private static targetNodeId: number;
  private static containerOffset: { x: number; y: number } = { x: 0, y: 0 };

  public static init() {
    this.onMousedown = this.onMousedown.bind(this);
  }

  public static getWindowOffset(): IWindowOffset {
    const scrollElement = document.scrollingElement ?? document.documentElement;
    return {
      innerHeight,
      innerWidth,
      scrollY: scrollElement?.scrollTop ?? 0,
      scrollX: scrollElement?.scrollLeft ?? 0,
      scrollHeight: scrollElement?.scrollHeight ?? 0,
      scrollWidth: scrollElement?.scrollWidth ?? 0,
    };
  }

  public static async waitForScrollStop(timeoutMillis: number) {
    const endTime = new Date().getTime() + (timeoutMillis ?? 50);
    const scrollElement = document.scrollingElement ?? document.documentElement;
    let left = 0;
    let top = 0;
    let consecutiveMatches = 0;
    do {
      await new Promise(requestAnimationFrame);
      const prevLeft = left;
      const prevTop = top;
      left = scrollElement.scrollLeft;
      top = scrollElement.scrollTop;
      if (left === prevLeft && top === prevTop) {
        consecutiveMatches += 1;
      } else {
        consecutiveMatches = 0;
      }
      if (consecutiveMatches >= 2) return [left, top];
    } while (new Date().getTime() < endTime);

    return [left, top];
  }

  public static listenFor(
    nodeId: number,
    containerOffset: { x: number; y: number },
  ): INodeVisibility {
    if (this.targetNodeId) this.clearEvent(this.targetNodeId);

    const node = NodeTracker.getWatchedNodeWithId(nodeId);
    if (!node) throw new Error('Node not found');

    const visibility = this.getNodeVisibility(node);

    this.containerOffset = containerOffset;
    this.targetNodeId = nodeId;
    this.pendingEvent = new Promise<IMouseResult>(resolve => {
      this.pendingEventResolve = resolve;
    });

    window.addEventListener('mousedown', this.onMousedown, {
      once: true,
      capture: true,
    });

    return visibility;
  }

  public static didTrigger(nodeId: number) {
    try {
      if (this.targetNodeId !== nodeId) {
        throw new Error(`"mouseup" listener not found`);
      }

      return this.pendingEvent;
    } finally {
      this.clearEvent(nodeId);
    }
  }

  private static onMousedown(event: MouseEvent) {
    const node = NodeTracker.getWatchedNodeWithId(this.targetNodeId);
    const targetNodeId = event.target ? NodeTracker.watchNode(event.target as Node) : undefined;
    const relatedTargetNodeId = event.relatedTarget
      ? NodeTracker.watchNode(event.relatedTarget as Node)
      : undefined;

    const result: IMouseResult = {
      pageX: this.containerOffset.x + event.pageX - window.scrollX,
      pageY: this.containerOffset.y + event.pageY - window.scrollY,
      targetNodeId,
      relatedTargetNodeId,
      didClickLocation: node.contains(event.target as Node) || node === event.target,
    };

    if (!result.didClickLocation) {
      event.cancelBubble = true;
      event.preventDefault();
      // @ts-ignore
      result.targetNodePreview = generateNodePreview(event.target);
      // @ts-ignore
      result.expectedNodePreview = generateNodePreview(node);
      result.expectedNodeVisibility = this.getNodeVisibility(node);
    }

    this.pendingEventResolve(result);
    return result.didClickLocation;
  }

  private static getNodeVisibility(node: Node): INodeVisibility {
    const objectAtPath = new ObjectAtPath();
    objectAtPath.objectAtPath = node;
    return objectAtPath.getComputedVisibility();
  }

  private static clearEvent(nodeId: number) {
    if (this.targetNodeId === nodeId) {
      window.removeEventListener('mousedown', this.onMousedown);
      this.pendingEvent = null;
      this.pendingEventResolve = null;
      this.targetNodeId = null;
    }
  }
}

MouseEvents.init();
