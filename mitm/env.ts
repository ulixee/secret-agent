import * as Path from 'path';
import * as Os from 'os';

const envDebug = process.env.DEBUG ?? '';

export default {
  sslKeylogFile: process.env.SSLKEYLOGFILE,
  // TODO: this is insecure by default because golang 1.14 has an issue verifying certain certificate authorities:
  // https://github.com/golang/go/issues/24652
  // https://github.com/golang/go/issues/38365
  allowInsecure: Boolean(JSON.parse(process.env.MITM_ALLOW_INSECURE ?? 'true')),
  enableMitmCache: Boolean(JSON.parse(process.env.SA_ENABLE_MITM_CACHE ?? 'false')),
  defaultStorageDirectory:
    process.env.SA_NETWORK_DIR ?? process.env.SA_DATA_DIR ?? Path.join(Os.tmpdir(), '.ulixee'),
  isDebug: envDebug.includes('sa:*') || envDebug.includes('sa*') || envDebug === '*' || envDebug.includes('sa:mitm'),
};
