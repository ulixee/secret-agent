import EventSubscriber from '@secret-agent/commons/EventSubscriber';
import { TypedEventEmitter } from '@secret-agent/commons/eventUtils';
import Protocol from 'devtools-protocol';
import { IPuppetWorker, IPuppetWorkerEvents } from '@secret-agent/interfaces/IPuppetWorker';
import { createPromise } from '@secret-agent/commons/utils';
import { IBoundLog } from '@secret-agent/interfaces/ILog';
import { CanceledPromiseError } from '@secret-agent/commons/interfaces/IPendingWaitEvent';
import ICorePlugins from '@secret-agent/interfaces/ICorePlugins';
import { BrowserContext } from './BrowserContext';
import { DevtoolsSession } from './DevtoolsSession';
import { NetworkManager } from './NetworkManager';
import ConsoleMessage from './ConsoleMessage';
import ConsoleAPICalledEvent = Protocol.Runtime.ConsoleAPICalledEvent;
import TargetInfo = Protocol.Target.TargetInfo;
import ExceptionThrownEvent = Protocol.Runtime.ExceptionThrownEvent;
import ExecutionContextCreatedEvent = Protocol.Runtime.ExecutionContextCreatedEvent;

export class Worker extends TypedEventEmitter<IPuppetWorkerEvents> implements IPuppetWorker {
  public readonly browserContext: BrowserContext;
  public isReady: Promise<Error | null>;
  public get isInitializationSent(): Promise<void> {
    return this.initializationSent.promise;
  }

  public hasLoadedResponse = false;
  public readonly devtoolsSession: DevtoolsSession;

  protected readonly logger: IBoundLog;

  private readonly initializationSent = createPromise<void>();
  private readonly networkManager: NetworkManager;
  private readonly targetInfo: TargetInfo;

  private readonly eventSubscriber = new EventSubscriber();
  private readonly executionContextId = createPromise<number>();

  public get id(): string {
    return this.targetInfo.targetId;
  }

  public get url(): string {
    return this.targetInfo.url;
  }

  public get type(): IPuppetWorker['type'] {
    return this.targetInfo.type as IPuppetWorker['type'];
  }

  constructor(
    browserContext: BrowserContext,
    parentNetworkManager: NetworkManager,
    devtoolsSession: DevtoolsSession,
    logger: IBoundLog,
    targetInfo: TargetInfo,
  ) {
    super();
    this.targetInfo = targetInfo;
    this.devtoolsSession = devtoolsSession;
    this.browserContext = browserContext;
    this.logger = logger.createChild(module, {
      workerTargetId: this.id,
      workerType: this.type,
    });
    this.networkManager = new NetworkManager(devtoolsSession, this.logger, browserContext.proxy);
    const events = this.eventSubscriber;
    events.on(devtoolsSession, 'Runtime.consoleAPICalled', this.onRuntimeConsole.bind(this));
    events.on(devtoolsSession, 'Runtime.exceptionThrown', this.onRuntimeException.bind(this));
    events.on(devtoolsSession, 'Runtime.executionContextCreated', this.onContextCreated.bind(this));
    events.on(devtoolsSession, 'disconnected', this.emit.bind(this, 'close'));

    this.isReady = this.initialize(parentNetworkManager).catch(err => err);
  }

  initialize(pageNetworkManager: NetworkManager): Promise<void> {
    const { plugins } = this.browserContext;
    const result = Promise.all([
      this.networkManager.initializeFromParent(pageNetworkManager).catch(err => {
        // web workers can use parent network
        if (err.message.includes(`'Fetch.enable' wasn't found`)) return;
        throw err;
      }),
      this.devtoolsSession.send('Runtime.enable'),
      this.initializeEmulation(plugins),
      this.devtoolsSession.send('Runtime.runIfWaitingForDebugger'),
    ]);

    setImmediate(() => this.initializationSent.resolve());
    return result.then(() => null);
  }

  async evaluate<T>(expression: string, isInitializationScript = false): Promise<T> {
    const result = await this.devtoolsSession.send('Runtime.evaluate', {
      expression,
      awaitPromise: !isInitializationScript,
      // contextId,
      returnByValue: true,
    });

    if (result.exceptionDetails) {
      throw ConsoleMessage.exceptionToError(result.exceptionDetails);
    }

    const remote = result.result;
    if (remote.objectId) this.devtoolsSession.disposeRemoteObject(remote);
    return remote.value as T;
  }

  close(): void {
    this.networkManager.close();
    this.cancelPendingEvents('Worker closing', ['close']);
    this.eventSubscriber.close();
  }

  toJSON() {
    return {
      id: this.id,
      url: this.url,
      type: this.type,
    };
  }

  private initializeEmulation(plugins: ICorePlugins): Promise<any> {
    if (!plugins.onNewPuppetWorker) return;

    return Promise.all([
      plugins.onNewPuppetWorker(this),
      this.devtoolsSession.send('Debugger.enable'),
      this.devtoolsSession.send('Debugger.setBreakpointByUrl', {
        lineNumber: 0,
        url: this.targetInfo.url,
      }),
    ])
      .then(this.resumeAfterEmulation.bind(this))
      .catch(error => {
        if (error instanceof CanceledPromiseError) return;
        this.logger.error('Emulator.onNewPuppetWorkerError', {
          error,
        });
        throw error;
      });
  }

  private resumeAfterEmulation(): Promise<any> {
    return Promise.all([
      this.devtoolsSession.send('Runtime.runIfWaitingForDebugger'),
      this.devtoolsSession.send('Debugger.disable'),
    ]);
  }

  private onContextCreated(event: ExecutionContextCreatedEvent): void {
    this.executionContextId.resolve(event.context.id);
  }

  private onRuntimeException(msg: ExceptionThrownEvent): void {
    const error = ConsoleMessage.exceptionToError(msg.exceptionDetails);

    this.emit('page-error', {
      error,
    });
  }

  private onRuntimeConsole(event: ConsoleAPICalledEvent): void {
    const message = ConsoleMessage.create(this.devtoolsSession, event);
    const frameId = `${this.type}:${this.url}`; // TBD

    this.emit('console', {
      frameId,
      ...message,
    });
  }
}
