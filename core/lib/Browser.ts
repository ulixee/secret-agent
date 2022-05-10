import { Protocol } from 'devtools-protocol';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import { assert } from '@ulixee/commons/lib/utils';
import Log from '@ulixee/commons/lib/Logger';
import IBrowserEngine from '@unblocked-web/emulator-spec/browser/IBrowserEngine';
import IBrowserLaunchArgs from '@unblocked-web/emulator-spec/browser/IBrowserLaunchArgs';
import IBrowser, { IBrowserEvents } from '@unblocked-web/emulator-spec/browser/IBrowser';
import { CanceledPromiseError } from '@ulixee/commons/interfaces/IPendingWaitEvent';
import Resolvable from '@ulixee/commons/lib/Resolvable';
import { IBrowserHooks, IHooksProvider } from '@unblocked-web/emulator-spec/hooks/IHooks';
import { Connection } from './Connection';
import BrowserContext, { IBrowserContextCreateOptions } from './BrowserContext';
import DevtoolsSession from './DevtoolsSession';
import BrowserProcess from './BrowserProcess';
import BrowserLaunchError from '../errors/BrowserLaunchError';
import env from '../env';
import * as os from 'os';
import GetVersionResponse = Protocol.Browser.GetVersionResponse;

const { log } = Log(module);

let browserIdCounter = 0;

export default class Browser extends TypedEventEmitter<IBrowserEvents> implements IBrowser {
  public devtoolsSession: DevtoolsSession;
  public readonly id: string;
  public readonly engine: IBrowserEngine;
  public readonly browserContextsById = new Map<string, BrowserContext>();

  public get name(): string {
    if (!this.version) return 'Unlaunched';
    return this.version.product.split('/').shift();
  }

  public get fullVersion(): string {
    if (!this.version) return 'Unlaunched';
    return this.version.product.split('/').pop();
  }

  public get majorVersion(): number {
    if (!this.version) return -1;
    return this.fullVersion?.split('.').map(Number).shift();
  }

  public get supportsBrowserContextProxy(): boolean {
    return this.majorVersion >= 85;
  }

  public launchPromise = new Resolvable<void | Error>();
  public isLaunchStarted = false;
  private readonly hooks: IBrowserHooks[] = [];
  private isShuttingDown: Promise<Error | void>;

  private connection: Connection;
  private process: BrowserProcess;

  private version: GetVersionResponse;

  private get defaultBrowserContext(): BrowserContext {
    return this.browserContextsById.get(undefined);
  }

  constructor(engine: IBrowserEngine, hooks?: IHooksProvider, launchArgs?: IBrowserLaunchArgs) {
    super();
    this.engine = engine;
    this.id = String((browserIdCounter += 1));
    launchArgs ??= {};
    launchArgs.disableDevtools ??= env.disableDevtools;
    launchArgs.disableGpu ??= env.disableGpu;
    launchArgs.noChromeSandbox ??= env.noChromeSandbox;
    launchArgs.showChrome ??= env.showChrome;

    this.applyDefaultLaunchArgs(launchArgs);

    if (hooks) {
      this.hooks.push(hooks);
      for (const hook of this.hooks) {
        hook.onNewBrowser?.(this, launchArgs);
      }
    }
  }

  public async launch(): Promise<Browser> {
    if (this.isLaunchStarted) {
      await this.launchPromise.promise;
      return this;
    }

    const parentLogId = log.info('Browser.Launching', {
      sessionId: null,
      name: this.engine.name,
      fullVersion: this.engine.fullVersion,
    });
    try {
      this.isLaunchStarted = true;
      if (this.engine.verifyLaunchable) await this.engine.verifyLaunchable();

      const process = new BrowserProcess(this.engine);
      const hasError = await process.hasLaunchError;
      if (hasError) throw hasError;

      try {
        await this.didLaunchProcess(process);
      } catch (error) {
        await process.close();
        throw error;
      }
      this.launchPromise.resolve();
      log.stats('Browser.Launched', {
        ...this.version,
        executablePath: this.engine.executablePath,
        desiredFullVersion: this.engine.fullVersion,
        sessionId: null,
        parentLogId,
      });
      return this;
    } catch (err) {
      const launchError = new BrowserLaunchError(err.message, err.stack);
      this.launchPromise.reject(launchError);
      log.stats('Browser.LaunchError', {
        launchError,
        parentLogId,
        sessionId: null,
      });
      await this.launchPromise.promise;
    }
  }

  public async newContext(options: IBrowserContextCreateOptions = {}): Promise<BrowserContext> {
    if (!this.launchPromise) throw new CanceledPromiseError('This Browser has been shut down');
    if (!this.isLaunchStarted) throw new Error('This Browser has not had launch() called on it');

    const error = await this.launchPromise.promise;
    if (error) throw error;

    if (this.isShuttingDown) throw new Error('Shutting down');

    options.isIncognito ??= true;

    if (!options.isIncognito) {
      let defaultContext = this.defaultBrowserContext;
      if (!defaultContext) {
        defaultContext = new BrowserContext(this, false, options);
        await this.onNewContext(defaultContext);
      }
      defaultContext.proxy = options.proxy;
      return defaultContext;
    }

    const isolatedContext = new BrowserContext(this, true, options);
    await isolatedContext.open();
    await this.onNewContext(isolatedContext);
    return isolatedContext;
  }

  public getBrowserContext(id: string): BrowserContext {
    return this.browserContextsById.get(id) ?? this.defaultBrowserContext;
  }

  public isEqualEngine(engine: IBrowserEngine): boolean {
    return (
      this.engine.executablePath === engine.executablePath &&
      this.engine.launchArguments.toString() === engine.launchArguments.toString()
    );
  }

  public async close(): Promise<void | Error> {
    const closePromises: Promise<any>[] = [];
    if (!this.isLaunchStarted) return;
    if (this.isShuttingDown) return this.isShuttingDown;

    const parentLogId = log.stats('Browser.Closing');

    try {
      // if we started to get ready, clear out now
      this.isLaunchStarted = false;
      this.isShuttingDown = new Promise<Error | void>(async resolve => {
        try {
          if (this.launchPromise) {
            const err = await this.launchPromise.catch(startError => startError);
            this.launchPromise = null;
            if (err) return resolve(err);
          }

          for (const [, context] of this.browserContextsById) closePromises.push(context.close());
          await Promise.all(closePromises);
          await this.process?.close();
          this.connection.dispose();
        } finally {
          resolve();
        }
      });

      return await this.isShuttingDown;
    } catch (error) {
      log.error('Browser.Closing:Error', { parentLogId, sessionId: null, error });
    } finally {
      this.emit('close');
      this.removeAllListeners();
      log.stats('Browser.Closed', { parentLogId, sessionId: null });
    }
  }

  public isConnected(): boolean {
    return !this.connection.isClosed;
  }

  public hook(hooks: IBrowserHooks): void {
    this.hooks.push(hooks);
  }

  protected async didLaunchProcess(process: BrowserProcess): Promise<void> {
    this.process = process;
    this.process.once('close', () => {
      this.emit('close');
      this.removeAllListeners();
    });

    const connection = new Connection(this.process.transport);
    this.connection = connection;
    this.devtoolsSession = connection.rootSession;

    this.connection.once('disconnected', this.emit.bind(this, 'close'));
    this.devtoolsSession.on('Target.attachedToTarget', this.onAttachedToTarget.bind(this));
    this.devtoolsSession.on('Target.detachedFromTarget', this.onDetachedFromTarget.bind(this));
    this.devtoolsSession.on('Target.targetCreated', this.onTargetCreated.bind(this));
    this.devtoolsSession.on('Target.targetDestroyed', this.onTargetDestroyed.bind(this));
    this.devtoolsSession.on('Target.targetCrashed', this.onTargetCrashed.bind(this));

    await this.devtoolsSession.send('Target.setAutoAttach', {
      autoAttach: true,
      waitForDebuggerOnStart: true,
      flatten: true,
    });

    await this.devtoolsSession.send('Target.setDiscoverTargets', {
      discover: true,
    });
    this.version = await this.devtoolsSession.send('Browser.getVersion');
  }

  private applyDefaultLaunchArgs(options: IBrowserLaunchArgs): void {
    this.engine.launchArguments ??= [];
    const launchArgs = this.engine.launchArguments;

    if (options.proxyPort !== undefined && !launchArgs.some(x => x.startsWith('--proxy-server'))) {
      launchArgs.push(
        // Use proxy for localhost URLs
        '--proxy-bypass-list=<-loopback>',
        `--proxy-server=localhost:${options.proxyPort}`,
      );
    }

    if (options.noChromeSandbox === true) {
      launchArgs.push('--no-sandbox');
    } else if (os.platform() === 'linux') {
      const runningAsRoot = process.geteuid && process.geteuid() === 0;
      if (runningAsRoot) {
        // eslint-disable-next-line no-console
        console.warn(
          'WARNING: SecretAgent is being run under "root" user - disabling Chrome sandbox! ' +
            'Run under regular user to get rid of this warning.',
        );
        launchArgs.push('--no-sandbox');
      }
    }

    launchArgs.push('--remote-debugging-pipe', '--ignore-certificate-errors');

    this.engine.isHeaded = options.showChrome === true;
    if (!this.engine.isHeaded) {
      launchArgs.push('--headless');
    }
  }

  private onAttachedToTarget(event: Protocol.Target.AttachedToTargetEvent): void {
    const { targetInfo, sessionId } = event;

    assert(targetInfo.browserContextId, `targetInfo: ${JSON.stringify(targetInfo, null, 2)}`);

    if (targetInfo.type === 'page') {
      const devtoolsSession = this.connection.getSession(sessionId);
      const context = this.getBrowserContext(targetInfo.browserContextId);
      context?.onPageAttached(devtoolsSession, targetInfo).catch(() => null);
      return;
    }

    if (targetInfo.type === 'shared_worker') {
      const devtoolsSession = this.connection.getSession(sessionId);
      const context = this.getBrowserContext(targetInfo.browserContextId);
      context?.onSharedWorkerAttached(devtoolsSession, targetInfo).catch(() => null);
    }

    if (targetInfo.type === 'service_worker') {
      const devtoolsSession = this.connection.getSession(sessionId);
      if (!devtoolsSession) return;

      const context = this.getBrowserContext(targetInfo.browserContextId);
      context?.onSharedWorkerAttached(devtoolsSession, targetInfo).catch(() => null);
      if (event.waitingForDebugger) {
        devtoolsSession
          .send('Runtime.runIfWaitingForDebugger')
          .catch(() => null)
          .then(() => this.devtoolsSession.send('Target.detachFromTarget', { sessionId }))
          .catch(() => null);
      }
    }

    if (targetInfo.type === 'other' && targetInfo.url.startsWith('devtools://devtools')) {
      const devtoolsSession = this.connection.getSession(sessionId);
      const context = this.getBrowserContext(targetInfo.browserContextId);
      for (const hook of this.hooks) {
        void hook.onDevtoolsPanelAttached?.(devtoolsSession).catch(() => null);
      }
      context?.onDevtoolsPanelAttached(devtoolsSession, targetInfo);
      return;
    }

    if (event.waitingForDebugger && targetInfo.type === 'other') {
      const devtoolsSession = this.connection.getSession(sessionId);
      if (!devtoolsSession) return;
      // Ideally, detaching should resume any target, but there is a bug in the backend.
      devtoolsSession
        .send('Runtime.runIfWaitingForDebugger')
        .catch(() => null)
        .then(() => this.devtoolsSession.send('Target.detachFromTarget', { sessionId }))
        .catch(() => null);
    }
  }

  private async onTargetCreated(event: Protocol.Target.TargetCreatedEvent): Promise<void> {
    const { targetInfo } = event;
    if (targetInfo.type === 'page' && !targetInfo.attached) {
      const context = this.getBrowserContext(targetInfo.browserContextId);
      await context?.attachToTarget(targetInfo.targetId);
    }
    if (targetInfo.type === 'shared_worker') {
      const context = this.getBrowserContext(targetInfo.browserContextId);
      await context?.attachToWorker(targetInfo);
    }
  }

  private onTargetDestroyed(event: Protocol.Target.TargetDestroyedEvent): void {
    const { targetId } = event;
    for (const context of this.browserContextsById.values()) {
      context.targetDestroyed(targetId);
    }
  }

  private onTargetCrashed(event: Protocol.Target.TargetCrashedEvent): void {
    const { targetId, errorCode, status } = event;
    if (status === 'killed') {
      for (const context of this.browserContextsById.values()) {
        context.targetKilled(targetId, errorCode);
      }
    }
  }

  private onDetachedFromTarget(event: Protocol.Target.DetachedFromTargetEvent): void {
    const targetId = event.targetId;
    for (const [, context] of this.browserContextsById) {
      context.onTargetDetached(targetId);
    }
  }

  private async onNewContext(context: BrowserContext): Promise<void> {
    const id = context.id;
    this.browserContextsById.set(id, context);
    context.once('close', () => this.browserContextsById.delete(id));
    for (const hook of this.hooks) {
      await hook.onNewBrowserContext?.(context);
    }
  }
}
