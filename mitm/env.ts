import * as Path from 'path';
import * as Os from 'os';

const envDebug = process.env.DEBUG ?? '';

export default {
  sslKeylogFile: process.env.SSLKEYLOGFILE,
  // TODO: this is insecure by default because golang 1.14 has an issue verifying certain certificate authorities:
  // https://github.com/golang/go/issues/24652
  // https://github.com/golang/go/issues/38365
  allowInsecure: Boolean(JSON.parse(process.env.UBK_MITM_ALLOW_INSECURE ?? 'true')),
  enableMitmCache: Boolean(JSON.parse(process.env.UBK_MITM_ENABLED_CACHE ?? 'false')),
  defaultStorageDirectory:
    process.env.UBK_NETWORK_DIR ?? process.env.UBK_DATA_DIR ?? Path.join(Os.tmpdir(), '.ulixee'),
  isDebug: envDebug.includes('ubk:*') || envDebug.includes('ubk*') || envDebug === '*' || envDebug.includes('ubk:mitm'),
};
