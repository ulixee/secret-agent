// NOTE: do not use node dependencies

import { IDomChangeEvent, INodeData } from '../interfaces/IDomChangeEvent';
import { IMouseEvent } from '../interfaces/IMouseEvent';
import { IFocusEvent } from '../interfaces/IFocusEvent';
import { IScrollEvent } from '../interfaces/IScrollEvent';

// exporting a type is ok. Don't export variables or will blow up the page
export type PageRecorderResultSet = [
  IDomChangeEvent[],
  IMouseEvent[],
  IFocusEvent[],
  IScrollEvent[],
];

// @ts-ignore
const eventsCallback = (window[runtimeFunction] as unknown) as (data: string) => void;
// @ts-ignore
delete window[runtimeFunction];

function upload(records: PageRecorderResultSet) {
  try {
    eventsCallback(JSON.stringify(records));
    return true;
  } catch (err) {
    console.log(`ERROR calling page recorder callback: ${String(err)}`, err);
  }
  return false;
}

class NodeTracker {
  private nextId = 1;
  private nodeIds = new Map<Node, number>();

  public has(node: Node) {
    return this.nodeIds.has(node);
  }

  public getId(node: Node) {
    if (!node) return undefined;
    return this.nodeIds.get(node) || undefined;
  }

  public track(node: Node) {
    if (this.nodeIds.has(node)) {
      return this.nodeIds.get(node);
    }

    recorder.extractChanges();
    const id = (this.nextId += 1);
    this.nodeIds.set(node, id);
    return id;
  }

  public getNode(id: number) {
    for (const [node, nodeId] of this.nodeIds) {
      if (id === nodeId) {
        return node;
      }
    }
    throw new Error(`Node with id not found -> ${id}`);
  }
}

const nodeTracker = new NodeTracker();

// @ts-ignore
window.nodeTracker = nodeTracker;

class PageEventsRecorder {
  private domChanges: IDomChangeEvent[] = [];
  private mouseEvents: IMouseEvent[] = [];
  private focusEvents: IFocusEvent[] = [];
  private scrollEvents: IScrollEvent[] = [];

  private commandId = -1;
  private propertyTrackingElements = new Map<Node, Map<string, string | boolean>>();

  private readonly observer: MutationObserver;

  constructor() {
    this.observer = new MutationObserver(this.onMutation.bind(this));
    this.observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  public setCommandId(id: number) {
    const isUnset = this.commandId === -1;
    this.commandId = id;

    if (!isUnset) return;

    for (const change of this.domChanges) {
      if (change[0] === -1) change[0] = this.commandId;
    }
    this.uploadChanges();
  }

  public extractChanges(): PageRecorderResultSet {
    const changes = this.convertMutationsToChanges(this.observer.takeRecords());
    this.domChanges.push(...changes);
    return this.pageResultset;
  }

  public trackFocus(eventType: 'in' | 'out', focusEvent: FocusEvent) {
    const nodeId = focusEvent.target ? nodeTracker.getId(focusEvent.target as Node) : undefined;
    const relatedNodeId = focusEvent.relatedTarget
      ? nodeTracker.getId(focusEvent.relatedTarget as Node)
      : undefined;
    const time = new Date().toISOString();
    const event = [this.commandId, eventType, nodeId, relatedNodeId, time] as IFocusEvent;
    this.focusEvents.push(event);
    this.checkForPropertyChanges(time);
  }

  public trackMouse(eventType: MouseEventType, mouseEvent: MouseEvent) {
    const nodeId = mouseEvent.target ? nodeTracker.getId(mouseEvent.target as Node) : undefined;
    const relatedNodeId = mouseEvent.relatedTarget
      ? nodeTracker.getId(mouseEvent.relatedTarget as Node)
      : undefined;
    const event = [
      this.commandId,
      eventType,
      mouseEvent.pageX,
      mouseEvent.pageY,
      mouseEvent.buttons,
      nodeId,
      relatedNodeId,
      new Date().toISOString(),
    ] as IMouseEvent;
    this.mouseEvents.push(event);
  }

  public trackScroll(scrollX: number, scrollY: number) {
    this.scrollEvents.push([this.commandId, scrollX, scrollY, new Date().toISOString()]);
  }

  public checkForPropertyChanges(changeTime?: string) {
    const timestamp = changeTime || new Date().toISOString();
    for (const [input, propertyMap] of this.propertyTrackingElements) {
      for (const [propertyName, value] of propertyMap) {
        const newPropValue = input[propertyName];
        if (newPropValue !== value) {
          const nodeId = nodeTracker.getId(input);
          this.domChanges.push([
            this.commandId,
            'property',
            { id: nodeId, properties: { [propertyName]: newPropValue } },
            timestamp,
          ]);
          propertyMap.set(propertyName, newPropValue);
        }
      }
    }
  }

  public get pageResultset(): PageRecorderResultSet {
    return [
      [...this.domChanges],
      [...this.mouseEvents],
      [...this.focusEvents],
      [...this.scrollEvents],
    ];
  }

  public resetLists() {
    this.domChanges.length = 0;
    this.mouseEvents.length = 0;
    this.focusEvents.length = 0;
    this.scrollEvents.length = 0;
  }

  public disconnect() {
    this.extractChanges();
    this.observer.disconnect();
    this.uploadChanges();
  }

  private uploadChanges() {
    if (upload(this.pageResultset)) {
      this.resetLists();
    }
  }

  private onMutation(mutations: MutationRecord[]) {
    const changes = this.convertMutationsToChanges(mutations);
    this.domChanges.push(...changes);

    this.uploadChanges();
  }

  private convertMutationsToChanges(mutations: MutationRecord[]) {
    const changes: IDomChangeEvent[] = [];
    const currentCommandId = this.commandId;
    const stamp = new Date().toISOString();

    this.checkForPropertyChanges(stamp);
    const addedNodes: Node[] = [];
    for (const mutation of mutations) {
      for (let i = 0, length = mutation.addedNodes.length; i < length; i += 1) {
        addedNodes.push(mutation.addedNodes[i]);
      }
    }

    for (const mutation of mutations) {
      switch (mutation.type) {
        case 'childList':
          let isFirstRemoved = true;
          for (let i = 0, length = mutation.removedNodes.length; i < length; i += 1) {
            const node = mutation.removedNodes[i];
            const serial = this.serializeNode(node);
            serial.parentNodeId = nodeTracker.getId(mutation.target);
            serial.previousSiblingId = nodeTracker.getId(
              isFirstRemoved ? mutation.previousSibling : node.previousSibling,
            );
            changes.push([currentCommandId, 'removed', serial, stamp]);
            isFirstRemoved = false;
          }

          // A batch of changes includes changes in a set of nodes.
          // Since we're flattening, only the first one should be added after the mutation sibling.
          let isFirstAdded = true;
          for (let i = 0, length = mutation.addedNodes.length; i < length; i += 1) {
            const node = mutation.addedNodes[i];
            const serial = this.serializeNode(node);
            serial.parentNodeId = nodeTracker.getId(mutation.target);
            serial.previousSiblingId = nodeTracker.getId(
              isFirstAdded ? mutation.previousSibling : node.previousSibling,
            );
            changes.push([currentCommandId, 'added', serial, stamp]);
            isFirstAdded = false;
          }

          // A batch of changes (setting innerHTML) will send nodes in a hierarchy instead of
          // individually so we need to extract child nodes into flat hierarchy

          for (let i = 0, length = mutation.addedNodes.length; i < length; i += 1) {
            const node = mutation.addedNodes[i];
            const children = this.serializeChildren(node, addedNodes);
            for (const childData of children) {
              changes.push([currentCommandId, 'added', childData, stamp]);
            }
          }
          break;

        case 'attributes':
          const attributeChange = this.serializeNode(mutation.target);
          if (!attributeChange.attributes) attributeChange.attributes = {};
          attributeChange.attributes[
            mutation.attributeName
          ] = (mutation.target as Element).getAttribute(mutation.attributeName);
          changes.push([currentCommandId, 'attribute', attributeChange, stamp]);
          break;

        case 'characterData':
          const textChange = this.serializeNode(mutation.target);
          textChange.textContent = mutation.target.textContent;
          changes.push([currentCommandId, 'text', textChange, stamp]);
          break;
      }
    }

    return changes;
  }

  private serializeChildren(node: Node, addedNodes: Node[]) {
    const serialized: INodeData[] = [];
    for (let i = 0, length = node.childNodes.length; i < length; i += 1) {
      const child = node.childNodes[i];
      if (!nodeTracker.has(child) && !addedNodes.includes(child)) {
        const serial = this.serializeNode(child);
        serial.parentNodeId = nodeTracker.getId(child.parentElement);
        serial.previousSiblingId = nodeTracker.getId(child.previousSibling);
        serialized.push(serial, ...this.serializeChildren(child, addedNodes));
      }
    }
    return serialized;
  }

  private serializeNode(node: Node): INodeData {
    if (node === null) {
      return undefined;
    }

    const id = nodeTracker.getId(node);
    if (id !== undefined) {
      return { id: id };
    }

    const data: INodeData = {
      nodeType: node.nodeType,
      id: nodeTracker.track(node),
    };

    switch (data.nodeType) {
      case Node.COMMENT_NODE:
      case Node.TEXT_NODE:
        data.textContent = node.textContent;
        break;

      case Node.ELEMENT_NODE:
        const element = node as Element;
        data.tagName = element.tagName;
        if (element.attributes.length) {
          data.attributes = {};
          for (let i = 0, length = element.attributes.length; i < length; i += 1) {
            const attr = element.attributes[i];
            data.attributes[attr.name] = attr.value;
          }
        }

        let propertyChecks: [string, string | boolean][];
        for (const prop of propertiesToCheck) {
          if (prop in element) {
            if (!propertyChecks) propertyChecks = [];
            propertyChecks.push([prop, element[prop]]);
          }
        }
        if (propertyChecks) {
          const propsMap = new Map<string, string | boolean>(propertyChecks);
          this.propertyTrackingElements.set(node, propsMap);
        }
        break;
    }

    return data;
  }
}

const propertiesToCheck = ['value', 'selected', 'checked'];

const recorder = new PageEventsRecorder();

// @ts-ignore
window.setCommandId = id => recorder.setCommandId(id);

function flushPageRecorder() {
  const changes = recorder.extractChanges();

  recorder.resetLists();
  return changes;
}
// @ts-ignore
window.flushPageRecorder = flushPageRecorder;

window.addEventListener('beforeunload', () => {
  recorder.disconnect();
});

document.addEventListener('input', e => recorder.checkForPropertyChanges(), {
  capture: true,
  passive: true,
});

document.addEventListener('keydown', _ => recorder.checkForPropertyChanges(), {
  capture: true,
  passive: true,
});

document.addEventListener('change', _ => recorder.checkForPropertyChanges(), {
  capture: true,
  passive: true,
});

document.addEventListener('mousemove', e => recorder.trackMouse(MouseEventType.MOVE, e), {
  capture: true,
  passive: true,
});

document.addEventListener('mousedown', e => recorder.trackMouse(MouseEventType.DOWN, e), {
  capture: true,
  passive: true,
});

document.addEventListener('mouseup', e => recorder.trackMouse(MouseEventType.UP, e), {
  capture: true,
  passive: true,
});

document.addEventListener('mouseover', e => recorder.trackMouse(MouseEventType.OVER, e), {
  capture: true,
  passive: true,
});

document.addEventListener('mouseleave', e => recorder.trackMouse(MouseEventType.OUT, e), {
  capture: true,
  passive: true,
});

document.addEventListener('focusin', e => recorder.trackFocus('in', e), {
  capture: true,
  passive: true,
});

document.addEventListener('focusout', e => recorder.trackFocus('out', e), {
  capture: true,
  passive: true,
});

document.addEventListener('scroll', _ => recorder.trackScroll(window.scrollX, window.scrollY), {
  capture: true,
  passive: true,
});

// need duplicate since this is a variable - not just a type
enum MouseEventType {
  MOVE = 0,
  DOWN = 1,
  UP = 2,
  OVER = 3,
  OUT = 4,
}
