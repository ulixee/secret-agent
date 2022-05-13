const envDebug = process.env.DEBUG ?? '';
const pkgJson = require('./package.json');

export default {
  disableMitm: booleanOrUndefined(process.env.UBK_MITM_DISABLE),
  showChrome: booleanOrUndefined(process.env.UBK_SHOW_CHROME),
  disableDevtools: booleanOrUndefined(process.env.UBK_DISABLE_DEVTOOLS),
  noChromeSandbox: booleanOrUndefined(process.env.UBK_NO_CHROME_SANDBOX),
  disableGpu: booleanOrUndefined(process.env.UBK_DISABLE_GPU),
  logDevtools:
    envDebug.includes('ubk:*') ||
    envDebug.includes('ubk*') ||
    envDebug === '*' ||
    envDebug.includes('ubk:devtools'),
  isTest: process.env.NODE_ENV === 'test',
  defaultChromeId:
    process.env.UBK_DEFAULT_BROWSER_ID ??
    Object.keys(pkgJson.dependencies).find(x => x.match('@ulixee/(chrome-\d+-0)')?.[1]),
};

function booleanOrUndefined(envValue): boolean | undefined {
  if (envValue === undefined) return undefined;
  return Boolean(JSON.parse(envValue ?? 'false'));
}
