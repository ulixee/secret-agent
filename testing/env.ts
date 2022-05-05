import * as Path from 'path';
import * as Os from 'os';

export default {
  defaultBrowserId: process.env.SA_DEFAULT_BROWSER_ID,
  dataDir:
    process.env.SA_NETWORK_DIR ?? process.env.SA_DATA_DIR ?? Path.join(Os.tmpdir(), '.ulixee'),
  isLogDebug: !!process.env.DEBUG?.match(/[,]?sa[:,]?/),
  useLogColors: !Boolean(JSON.parse(process.env.NODE_DISABLE_COLORS ?? '0')),
};
