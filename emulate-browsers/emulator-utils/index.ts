import IBrowserEmulatorClass, {
  BrowserEmulatorClassDecorator,
} from '@secret-agent/interfaces/IBrowserEmulatorClass';
import IBrowserEmulator from '@secret-agent/interfaces/IBrowserEmulator';
import IBrowserData from './interfaces/IBrowserData';
import DataLoader from './lib/DataLoader';
import BrowserEmulatorBase from './lib/BrowserEmulatorBase';
import getTcpSettingsForOs from './lib/getTcpSettingsForOs';
import parseNavigatorPlugins from './lib/parseNavigatorPlugins';
import DomOverridesBuilder from './lib/DomOverridesBuilder';
import Viewports from './lib/Viewports';
import * as DnsOverTlsProviders from './lib/DnsOverTlsProviders';

export {
  DnsOverTlsProviders,
  BrowserEmulatorClassDecorator,
  BrowserEmulatorBase,
  IBrowserData,
  IBrowserEmulator,
  IBrowserEmulatorClass,
  DomOverridesBuilder,
  DataLoader,
  getTcpSettingsForOs,
  parseNavigatorPlugins,
  Viewports
};
