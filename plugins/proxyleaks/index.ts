import { IPuppetPage } from '@secret-agent/interfaces/IPuppetPage';
import CoreExtenderBase from '@secret-agent/plugin-utils/lib/CoreExtenderBase';
import ExceptionRewriter from './lib/ExceptionRewriter';

const { name: pluginId } = require('./package.json');

export default class ProxyLeaksCorePlugin extends CoreExtenderBase {
  public static id = pluginId;

  onNewPuppetPage(page: IPuppetPage): Promise<any> {
    const majorVersion = Number(this.browserEngine.fullVersion.split('.').shift());
    // extends leak plugged in chrome 91
    if (this.browserEngine.name !== 'chrome' || majorVersion >= 91) return;

    const exceptionRewriter = new ExceptionRewriter(page.devtoolsSession);
    exceptionRewriter.onCatch(
      x => `${x}.stack.includes("at Proxy.[Symbol.hasInstance]")`,
      ({ catchArgsObjectId }) => this.rewriteProxyHasInstance(exceptionRewriter, catchArgsObjectId),
    );

    exceptionRewriter.onCatch(
      x => `String(${x}).includes("Class extends value [object Function]")`,
      async ({ sourceLocation, callFrame, catchArgsObjectId }) => {
        const { scriptId, lineNumber, position } = sourceLocation;
        const functionBeingProbed = await this.findExtendsMatchingLocation(
          exceptionRewriter,
          scriptId,
          lineNumber,
          position,
        );

        const fnToString = await exceptionRewriter.evaluateOnCallFrame<string>(
          callFrame,
          `String(${functionBeingProbed})`,
        );

        return this.rewriteProxyExtends(exceptionRewriter, catchArgsObjectId, fnToString);
      },
    );

    return exceptionRewriter.initialize();
  }

  private rewriteProxyHasInstance(exceptionRewriter: ExceptionRewriter, catchArgsObjectId: string) {
    return exceptionRewriter.callFunctionOn(
      catchArgsObjectId,
      `function() {
        this.message = this.message.replace("Proxy.[Symbol.hasInstance]", 'Function.[Symbol.hasInstance]');
        this.stack = this.stack.replace("Proxy.[Symbol.hasInstance]", 'Function.[Symbol.hasInstance]');
       }`,
    );
  }

  private rewriteProxyExtends(
    exceptionRewriter: ExceptionRewriter,
    catchArgsObjectId: string,
    fnToString: string,
  ) {
    return exceptionRewriter.callFunctionOn(
      catchArgsObjectId,
      `function(){
        this.message = this.message.replace("extends value [object Function]", 'extends value ${fnToString}');
        this.stack = this.stack.replace("extends value [object Function]", 'extends value ${fnToString}');
       }`,
    );
  }

  private async findExtendsMatchingLocation(
    rewriter: ExceptionRewriter,
    scriptId: string,
    lineNumber: number,
    position: number,
  ) {
    // search for script source location
    const locations = await rewriter.searchScript(scriptId, ' extends ', lineNumber);
    if (!locations?.length) return null;
    const match = locations[0];
    const parts = match.lineContent.split(/\s+/);

    // find variable name
    let fnOverridden = '';
    for (const part of parts) {
      if (!part) continue;
      const startIndex = match.lineContent.indexOf(part);
      if (startIndex <= position && startIndex + part.length > position) {
        fnOverridden = part;
        break;
      }
    }
    if (!fnOverridden)
      throw new Error(
        `Unable to locate variable in script: "${match.lineContent}" at position ${position}`,
      );
    return fnOverridden;
  }
}
