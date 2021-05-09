import IViewport from './IViewport';

export default interface IBrowserEmulatorConfig {
  viewport?: IViewport;
  timezoneId?: string;
  locale?: string;
}
