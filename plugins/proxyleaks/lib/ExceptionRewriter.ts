import IDevtoolsSession, { Protocol } from '@secret-agent/interfaces/IDevtoolsSession';
import injectedSourceUrl from '@secret-agent/interfaces/injectedSourceUrl';
import PausedEvent = Protocol.Debugger.PausedEvent;
import SearchMatch = Protocol.Debugger.SearchMatch;
import CallFrame = Protocol.Debugger.CallFrame;

export default class ExceptionRewriter {
  private devtoolsSession: IDevtoolsSession;

  private readonly handlers: {
    matchCondition: (variableName: string) => string;
    callbackFn: (args: ICatchBreakpointCallbackArgs) => Promise<void>;
  }[] = [];

  private breakpoints = new Set<string>();

  constructor(devtoolsSession: IDevtoolsSession) {
    this.devtoolsSession = devtoolsSession;
    this.devtoolsSession.on('Debugger.paused', this.onPaused.bind(this));
  }

  public onCatch(
    condition: (variableName: string) => string,
    callbackFn: (args: ICatchBreakpointCallbackArgs) => Promise<void>,
  ): void {
    this.handlers.push({ matchCondition: condition, callbackFn });
  }

  public initialize(): Promise<any> {
    return Promise.all([
      this.devtoolsSession.send('Debugger.enable'),
      this.devtoolsSession.send('Debugger.setInstrumentationBreakpoint', {
        instrumentation: 'beforeScriptExecution',
      }),
    ]);
  }

  public callFunctionOn(objectId: string, functionDeclaration: string): Promise<any> {
    return this.devtoolsSession.send('Runtime.callFunctionOn', {
      functionDeclaration: `function(){
        const arg0 = Object.values(this)[0];
        (${functionDeclaration}).call(arg0);
      }`,
      objectId,
    });
  }

  public async evaluateOnCallFrame<T>(callFrame: CallFrame, expression: string): Promise<T> {
    const response = await this.devtoolsSession.send('Debugger.evaluateOnCallFrame', {
      callFrameId: callFrame.callFrameId,
      expression,
    });
    return response.result.value;
  }

  public async searchScript(
    scriptId: string,
    search: RegExp | string,
    lineNumber?: number,
  ): Promise<SearchMatch[]> {
    let isRegex = false;
    let query = search as string;
    if (search instanceof RegExp) {
      query = search.source;
      isRegex = true;
    }
    const points = await this.devtoolsSession.send('Debugger.searchInContent', {
      scriptId,
      isRegex,
      query,
    });
    if (lineNumber !== undefined) {
      return points.result.filter(x => x.lineNumber === lineNumber);
    }
    return points.result;
  }

  private async onPaused(event: PausedEvent): Promise<void> {
    try {
      if (event.reason === 'instrumentation') {
        const { url, scriptId } = event.data;
        if (url !== injectedSourceUrl) {
          await this.registerCatchBlockBreakpoints(scriptId);
        }
      }

      if (event.reason === 'other' && event.hitBreakpoints?.some(x => this.breakpoints.has(x))) {
        await this.onBreakpointHit(event.callFrames[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await this.devtoolsSession.send('Debugger.resume');
    }
  }

  private async registerCatchBlockBreakpoints(scriptId: string): Promise<void> {
    const searchResults = await this.searchScript(scriptId, new RegExp(/\s*catch\s*\(/));
    for (const result of searchResults) {
      const matches = result.lineContent.match(/\s*catch\s*\((\w+)[)|\s*=>]/);
      const variableName = matches ? matches[1].replace(/\(\)/g, '') : null;
      if (!variableName) {
        continue;
      }

      const condition = this.handlers.map(x => x.matchCondition(variableName)).join(' || ');
      const breakpoint = await this.devtoolsSession
        .send('Debugger.setBreakpoint', {
          location: {
            scriptId,
            lineNumber: result.lineNumber,
            // columnNumber,
          },
          condition,
        })
        .catch(() => null);
      if (breakpoint) this.breakpoints.add(breakpoint.breakpointId);
    }
  }

  private async onBreakpointHit(callFrame: CallFrame): Promise<void> {
    const handlers = this.handlers;
    const objectId = callFrame.scopeChain.find(x => x.type === 'catch')?.object?.objectId;
    if (!objectId) return;

    const conditions = handlers.map(x => x.matchCondition('error'));
    const { result } = await this.devtoolsSession.send('Runtime.callFunctionOn', {
      functionDeclaration: `function(){
          const error = Object.values(this)[0];
          const matchingIndex = [${conditions.join(', ')}].findIndex(Boolean);
          return JSON.stringify({
            matchingIndex,
            error: {
                stack: error.stack,
                message: error.message,
                name: error.name,
                constructor: error.constructor ? error.constructor.name : '',
                ...error
             }
           });
          }`,
      objectId,
      returnByValue: true,
    });

    const { error, matchingIndex } = JSON.parse(result.value);

    const catchBreakpoint = handlers[matchingIndex];

    const [lineNumber, position] = error.stack
      .split(/\r?\n/)[1]
      .split(':')
      .slice(-2)
      .map(x => x.replace(/[^\d]/g, ''))
      .map(Number);

    const scriptId = callFrame.location.scriptId;
    await catchBreakpoint.callbackFn({
      // line reports 1 spot off from where search finds them
      sourceLocation: {
        scriptId,
        lineNumber: lineNumber - 1,
        position,
      },
      callFrame,
      catchArgsObjectId: objectId,
      error,
    });
  }
}

export interface IExceptionRewriter {
  matchCondition: (variableName: string) => string;
  callbackFn: (args: ICatchBreakpointCallbackArgs) => Promise<void>;
}

export interface ICatchBreakpointCallbackArgs {
  sourceLocation: {
    scriptId: string;
    lineNumber: number;
    position: number;
  };
  callFrame: CallFrame;
  catchArgsObjectId: string;
  error: Error;
}
