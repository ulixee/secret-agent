import '@ulixee/commons/SourceMapSupport';
import hero, {
  ConnectionFactory,
  IConnectionToCoreOptions,
  RemoteConnectionToCore,
} from '@ulixee/hero-client';
import { CoreProcess } from '@ulixee/hero-core';
import ShutdownHandler from '@ulixee/commons/ShutdownHandler';

export * from '@ulixee/hero-client';
export default hero;

let coreHost: Promise<string>;

ConnectionFactory.createLocalConnection = (options: IConnectionToCoreOptions) => {
  coreHost ??= CoreProcess.spawn(options);

  const connection = new RemoteConnectionToCore({
    ...options,
    host: coreHost,
  });

  ShutdownHandler.register(() => connection.disconnect());
  return connection;
};
