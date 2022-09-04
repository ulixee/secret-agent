import { IncomingMessage } from 'http';
import Logger from '@secret-agent/commons/Logger';
import { createPromise } from '@secret-agent/commons/utils';
import { DomActionType } from '@secret-agent/interfaces/IDomChangeEvent';
import IResourceMeta from '@secret-agent/interfaces/IResourceMeta';
import IResolvablePromise from '@secret-agent/interfaces/IResolvablePromise';
import DomChangesTable, { IFrontendDomChangeEvent } from '../models/DomChangesTable';
import SessionDb, { ISessionLookup, ISessionLookupArgs } from '../dbs/SessionDb';
import CommandFormatter from '../lib/CommandFormatter';
import { ISessionRecord } from '../models/SessionTable';
import { MouseEventType } from '../models/MouseEventsTable';

const { log } = Logger(module);

export default class ConnectionToReplay {
  private readonly lookupArgs: ISessionLookupArgs;
  private sessionLookup: ISessionLookup;

  private readonly pendingPushes: Promise<any>[] = [];
  private readonly sessionClosedPromise = createPromise();

  private session: ISessionRecord;
  private tabsById = new Map<
    number,
    {
      tabId: number;
      createdTime: number;
      detachedFromTabId?: number;
      startOrigin: string;
      width: number;
      height: number;
    }
  >();

  private readonly mainFrames = new Set<number>();

  private lastScriptState: IScriptState;
  private tabReadyPromise: IResolvablePromise<void>;

  constructor(readonly sendMessage: (data: string) => Promise<unknown>, request: IncomingMessage) {
    this.pendingPushes.push(this.sessionClosedPromise.promise);
    const { headers } = request;
    this.lookupArgs = {
      scriptInstanceId: headers['script-instance-id'] as string,
      scriptEntrypoint: headers['script-entrypoint'] as string,
      sessionName: headers['session-name'] as string,
      dataLocation: headers['data-location'] as string,
      sessionId: headers['session-id'] as string,
    };
  }

  public async handleRequest(): Promise<void> {
    try {
      log.stats('ReplayApi', this.lookupArgs);

      this.sessionLookup = SessionDb.findWithRelated(this.lookupArgs);

      this.subscribeToTables();

      let resolved = -1;
      // sort of complicated, but we're checking that everything has been sent and completed
      while (this.pendingPushes.length > resolved) {
        resolved = this.pendingPushes.length;
        await Promise.all([...this.pendingPushes]).catch(() => null);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await this.send('trailer', { messages: this.pendingPushes.length });
    } catch (error) {
      await this.send('error', { message: error.message });
      log.error('SessionState.ErrorLoadingSession', {
        error,
        ...this.lookupArgs,
      });
    }
    // do one last wait to catch errors and everything else
    await Promise.all(this.pendingPushes).catch(() => null);
  }

  public close(error?: Error) {
    if (!this.sessionLookup) return;

    const db = this.sessionLookup.sessionDb;
    db.unsubscribeToChanges();
    // don't close a live db
    if (db.readonly) {
      setImmediate(() => db.close());
    }
    log.stats('ConnectionToReplay.Closed', { error, sessionId: this.lookupArgs.sessionId });
  }

  private subscribeToTables(): void {
    if (!this.sessionLookup) {
      log.error('Replay Api Error - no session found for script', this.lookupArgs);
      throw new Error("There aren't any stored sessions for this script.");
    }

    const sessionLookup = this.sessionLookup;
    const db = sessionLookup.sessionDb;
    this.session = db.session.get();

    db.tabs.subscribe(tabs => {
      for (const tab of tabs) {
        if (!this.tabsById.has(tab.id)) {
          this.addTabId(tab.id, tab.createdTime);
        }
        if (tab.detachedAtCommandId) {
          this.tabsById.get(tab.id).detachedFromTabId = tab.parentId;
        }
        const sessionTab = this.tabsById.get(tab.id);
        sessionTab.height = tab.viewportHeight;
        sessionTab.width = tab.viewportWidth;
      }
      this.send('tabs', [...this.tabsById.values()]);
    });

    db.frames.subscribe(frames => {
      for (const frame of frames) {
        if (!frame.parentId) {
          this.mainFrames.add(frame.id);
        }
        this.addTabId(frame.tabId, frame.createdTimestamp);
      }
    });

    this.tabReadyPromise = createPromise<void>();
    this.pendingPushes.push(this.tabReadyPromise.promise);

    db.domChanges.subscribe(changes => {
      for (const change of changes) {
        DomChangesTable.inflateRecord(change);
        const isMainFrame = this.mainFrames.has(change.frameId);
        if (isMainFrame && change.action === DomActionType.newDocument) {
          this.tabHasUrl(change.tabId, change.timestamp, change.textContent);
        }
        (change as IFrontendDomChangeEvent).frameIdPath = db.frames.frameDomNodePathsById.get(
          change.frameId,
        );
        change.frameId = undefined;
      }
      this.send('dom-changes', changes);
    });

    db.commands.subscribe(commands => {
      const commandsWithResults = commands.map(CommandFormatter.parseResult);
      for (const command of commandsWithResults) {
        command.frameIdPath = db.frames.frameDomNodePathsById.get(command.frameId);
        this.addTabId(command.tabId, command.startDate);
        if (
          command.name === 'goto' &&
          (command as any).parsedResult &&
          command.resultType === 'Object' &&
          !this.tabReadyPromise.isResolved
        ) {
          // check if non-http response
          const result = (command as any).parsedResult as IResourceMeta;
          const responseHeaders = result.response?.headers;
          if (!responseHeaders) continue;
          const contentType = responseHeaders['content-type'] ?? responseHeaders['Content-Type'];
          if (contentType && !contentType.includes('html')) {
            this.tabHasUrl(command.tabId, result.response.timestamp, result.url);
          }
        }
      }
      this.send('commands', commandsWithResults);
      this.checkState();
    });

    const mouseFilter = [MouseEventType.MOVE, MouseEventType.DOWN, MouseEventType.UP];
    db.mouseEvents.subscribe(mouseEvents => {
      const toPublish = mouseEvents
        .filter(x => mouseFilter.includes(x.event))
        .map(x => {
          (x as any).frameIdPath = db.frames.frameDomNodePathsById.get(x.frameId);
          return x;
        });
      if (toPublish.length) this.send('mouse-events', toPublish);
    });

    db.scrollEvents.subscribe(scroll => {
      for (const evt of scroll) {
        (evt as any).frameIdPath = db.frames.frameDomNodePathsById.get(evt.frameId);
      }
      this.send('scroll-events', scroll);
    });

    db.focusEvents.subscribe(events => {
      for (const evt of events) {
        (evt as any).frameIdPath = db.frames.frameDomNodePathsById.get(evt.frameId);
      }
      this.send('focus-events', events);
    });

    db.output.subscribe(events => {
      this.send('output', events);
    });

    db.resources.subscribe(resources => {
      const resourcesToSend = [];

      for (const resource of resources) {
        if (
          (resource.type !== 'Document' && resource.requestMethod !== 'GET') ||
          !resource.responseHeaders
        )
          continue;
        resourcesToSend.push({
          url: resource.requestUrl,
          id: resource.id,
          statusCode: resource.statusCode,
          tabId: resource.tabId,
          type: resource.type,
          redirectedToUrl: resource.redirectedToUrl,
        });
      }
      this.send('resources', resourcesToSend);
    });

    db.frameNavigations.subscribe(() => this.checkState());
    db.session.subscribe(() => this.checkState());
    this.checkState();
    if (this.session.closeDate) {
      setImmediate(() => this.sessionClosedPromise.resolve());
    }
  }

  private tabHasUrl(tabId: number, timestamp: number, url: string) {
    this.addTabId(tabId, timestamp);
    const tab = this.tabsById.get(tabId);
    if (!tab.startOrigin) {
      tab.startOrigin = url;
    }
    if (!this.tabReadyPromise.isResolved) {
      this.send('session', {
        ...this.session,
        tabs: [...this.tabsById.values()],
        dataLocation: this.sessionLookup.dataLocation,
        relatedScriptInstances: this.sessionLookup.relatedScriptInstances,
        relatedSessions: this.sessionLookup.relatedSessions,
      });
      this.tabReadyPromise.resolve();
    }
  }

  private checkState(): void {
    if (!this.sessionLookup?.sessionState) return;
    const scriptState = this.sessionLookup.sessionState.checkForResponsive();

    if (scriptState.closeDate && !this.sessionClosedPromise.isResolved) {
      this.send('script-state', scriptState);
      // give sqlite time to flush out published changes
      setTimeout(() => this.sessionClosedPromise.resolve(), 500);
      return;
    }

    const lastState = <IScriptState>{ ...(this.lastScriptState ?? {}) };
    this.lastScriptState = scriptState;
    if (
      lastState.hasRecentErrors !== scriptState.hasRecentErrors ||
      lastState.closeDate !== scriptState.closeDate ||
      lastState.lastActivityDate?.getTime() !== scriptState.lastActivityDate?.getTime() ||
      lastState.lastCommandName !== scriptState.lastCommandName
    ) {
      this.send('script-state', scriptState);
    }
  }

  private addTabId(tabId: number, timestamp: number): void {
    if (!tabId) return;
    if (!this.tabsById.has(tabId)) {
      this.tabsById.set(tabId, {
        tabId,
        createdTime: timestamp,
        startOrigin: null,
        width: null,
        height: null,
      });
    }
  }

  private send(event: string, data: any): void {
    if (Array.isArray(data) && data.length === 0) {
      return;
    }

    const json = JSON.stringify({ event, data }, (_, value) => {
      if (value !== undefined && value !== null) return value;
    });

    const sendPromise = this.sendMessage(json).catch(err => err);
    if (sendPromise) this.pendingPushes.push(sendPromise);
  }
}

interface IScriptState {
  lastCommandName: string;
  lastActivityDate: Date;
  hasRecentErrors: boolean;
  closeDate?: Date;
}
