import IResourceHeaders from '@secret-agent/interfaces/IResourceHeaders';
import { pickRandom } from '@secret-agent/commons/utils';
import IHttpResourceLoadDetails from '@secret-agent/interfaces/IHttpResourceLoadDetails';
import IBrowserData, {
  IDataHeaders,
} from '@secret-agent/browser-emulator-utils/interfaces/IBrowserData';
import { BrowserEmulatorBase } from '@secret-agent/browser-emulator-utils';

export default function modifyHeaders(
  emulator: BrowserEmulatorBase,
  data: IBrowserData,
  resource: IHttpResourceLoadDetails,
) {
  const { userAgentString, locale } = emulator;
  const defaultOrder = getOrderAndDefaults(emulator, data.headers, resource);

  const requestLowerHeaders = {};
  for (const [key, value] of Object.entries(resource.requestHeaders)) {
    requestLowerHeaders[key.toLowerCase()] = value;
  }

  const headers = resource.requestHeaders;

  if (!defaultOrder || (resource.isClientHttp2 && resource.isServerHttp2)) {
    const newHeaders: IResourceHeaders = {};
    let hasKeepAlive = false;
    for (const [header, value] of Object.entries(headers)) {
      let key = header;
      if (resource.isServerHttp2 === false) {
        key = key
          .split('-')
          .map(x => `${x[0].toUpperCase()}${x.slice(1)}`)
          .join('-');
      }
      if (header.match(/^connection/i)) hasKeepAlive = true;

      if (header.match(/^user-agent/i) && value !== userAgentString) {
        newHeaders[key] = userAgentString;
      } else {
        newHeaders[key] = value;
      }
    }
    if (!defaultOrder && !hasKeepAlive && !resource.isServerHttp2) {
      newHeaders.Connection = 'keep-alive';
    }
    resource.requestHeaders = newHeaders;
    return true;
  }

  const headerList: [string, string | string[]][] = [];
  for (const headerName of defaultOrder.order) {
    const defaults = defaultOrder.defaults[headerName];
    const lowerName = headerName.toLowerCase();
    let value = requestLowerHeaders[lowerName];

    if (lowerName === 'accept-language') {
      // force overwrite some values
      value = locale;
    } else if (lowerName === 'user-agent') {
      // force overwrite some values
      value = userAgentString;
    } else if (value && lowerName.startsWith('sec-fetch')) {
      // if header is an Sec-Fetch header, trust Chrome and keep value
    } else if (defaults && defaults.length) {
      // use default data
      if (!defaults.includes(value as string)) {
        value = pickRandom(defaults);
      }
    }

    if (value) {
      headerList.push([headerName, value]);
    }
  }

  const lowerNames = defaultOrder.order.map(x => x.toLowerCase());
  let index = -1;
  const fetchMode = requestLowerHeaders['sec-fetch-mode'];
  for (const [header, value] of Object.entries(headers)) {
    index += 1;
    const lowerHeader = header.toLowerCase();
    const isAlreadyIncluded = lowerNames.includes(lowerHeader);
    if (isAlreadyIncluded) continue;

    const isDefaultHeader =
      defaultHeaders.includes(lowerHeader) ||
      lowerHeader.startsWith('sec-') ||
      lowerHeader.startsWith('proxy-');

    const shouldIncludeOrigin = lowerHeader === 'origin' && fetchMode === 'cors';

    // if default order does not include this header, strip it
    if (isDefaultHeader && lowerHeader !== 'cookie' && !shouldIncludeOrigin) continue;

    // if past the end, reset the index to the last spot
    if (index >= headerList.length) index = headerList.length - 1;

    // insert at same index it would have been otherwise (unless past end)
    headerList.splice(index, 0, [header, value]);
  }

  const newHeaders: IResourceHeaders = {};
  for (const entry of headerList) newHeaders[entry[0]] = entry[1];

  resource.requestHeaders = newHeaders;
  return true;
}

function getOrderAndDefaults(
  emulator: BrowserEmulatorBase,
  headerProfiles: IDataHeaders,
  resource: IHttpResourceLoadDetails,
) {
  const { method, originType, requestHeaders: headers, resourceType, isSSL } = resource;
  let profiles = headerProfiles[resourceType];
  if (!profiles && resourceType === 'Websocket') profiles = headerProfiles['Websocket Upgrade'];
  if (!profiles) return null;

  let defaultOrders = profiles.filter(x => x.secureDomain === isSSL);

  if (defaultOrders.length > 1) {
    const methodOrders = defaultOrders.filter(x => x.method.toLowerCase() === method.toLowerCase());
    if (methodOrders.length) {
      defaultOrders = methodOrders;
    }
  }

  if (defaultOrders.length > 1) {
    const originDefaultOrders = defaultOrders.filter(x => x.originTypes.includes(originType));
    if (originDefaultOrders.length) {
      defaultOrders = originDefaultOrders;
    }
  }

  let defaultOrder = pickRandom(defaultOrders);
  if (headers.Cookie || headers.cookie) {
    const withCookie = defaultOrders.find(x => x.order.includes('Cookie'));
    if (withCookie) defaultOrder = withCookie;
  }

  if (!defaultOrder) {
    emulator.log.error<any>('Headers.NotFound', { resourceType, isSSL, method, originType });
    return null;
  }

  return {
    order: defaultOrder.order,
    defaults: defaultOrder.defaults,
  };
}

const defaultHeaders = [
  'accept',
  'accept-charset',
  'accept-encoding',
  'accept-language',
  'accept-patch',
  'accept-ranges',
  'access-control-allow-credentials',
  'access-control-allow-headers',
  'access-control-allow-methods',
  'access-control-allow-origin',
  'access-control-expose-headers',
  'access-control-max-age',
  'access-control-request-headers',
  'access-control-request-method',
  'age',
  'allow',
  'alt-svc',
  'authorization',
  'cache-control',
  'connection',
  'content-disposition',
  'content-encoding',
  'content-language',
  'content-length',
  'content-location',
  'content-range',
  'content-type',
  'cookie',
  'date',
  'expect',
  'expires',
  'forwarded',
  'from',
  'host',
  'if-match',
  'if-modified-since',
  'if-none-match',
  'if-range',
  'if-unmodified-since',
  'last-modified',
  'location',
  'origin',
  'pragma',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'public-key-pins',
  'range',
  'referer',
  'retry-after',
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-fetch-user',
  'sec-origin-policy',
  'set-cookie',
  'strict-transport-security',
  'tk',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'upgrade-insecure-requests',
  'user-agent',
  'vary',
  'via',
  'warning',
  'www-authenticate',
];
