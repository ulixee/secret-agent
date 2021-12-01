// This import statement is important for all this to work, otherwise we don't extend but replace the secret-agent module definition.
// https://github.com/microsoft/TypeScript/issues/10859
import type {} from '@secret-agent/client/lib/extendables';
import ClientPlugin from './lib/ClientPlugin';
import CorePlugin from './lib/CorePlugin';

type ExecuteJsPluginAdditions = {
  executeJs<T extends any[]>(fn: string | ((...args: T) => any), ...args: T);
};

declare module '@secret-agent/client/lib/extendables' {
  interface Agent extends ExecuteJsPluginAdditions {}
  interface Tab extends ExecuteJsPluginAdditions {}
  interface FrameEnvironment extends ExecuteJsPluginAdditions {}
}

export { ClientPlugin, CorePlugin };

export default { ClientPlugin, CorePlugin };
