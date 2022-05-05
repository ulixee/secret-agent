import * as Path from 'path';
import * as Os from 'os';

export default {
  sslKeylogFile: process.env.SSLKEYLOGFILE,
  allowInsecure: Boolean(JSON.parse(process.env.MITM_ALLOW_INSECURE ?? 'true')),
  enableMitmCache: Boolean(JSON.parse(process.env.SA_ENABLE_MITM_CACHE ?? 'false')),
  defaultStorageDirectory:
    process.env.SA_NETWORK_DIR ?? process.env.SA_DATA_DIR ?? Path.join(Os.tmpdir(), '.ulixee'),
};
