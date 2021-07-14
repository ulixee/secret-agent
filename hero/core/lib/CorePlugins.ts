import { URL } from 'url';
import { IBoundLog } from '@ulixee/hero-interfaces/ILog';
import { IPuppetPage } from '@ulixee/hero-interfaces/IPuppetPage';
import { IPuppetWorker } from '@ulixee/hero-interfaces/IPuppetWorker';
import IHttpResourceLoadDetails from '@ulixee/hero-interfaces/IHttpResourceLoadDetails';
import IDnsSettings from '@ulixee/hero-interfaces/IDnsSettings';
import ITcpSettings from '@ulixee/hero-interfaces/ITcpSettings';
import ITlsSettings from '@ulixee/hero-interfaces/ITlsSettings';
import { IInteractionGroups, IInteractionStep } from '@ulixee/hero-interfaces/IInteractions';
import IInteractionsHelper from '@ulixee/hero-interfaces/IInteractionsHelper';
import IPoint from '@ulixee/hero-interfaces/IPoint';
import ICorePlugin, {
  IHumanEmulator,
  IBrowserEmulator,
  IBrowserEmulatorConfig,
  ISelectBrowserMeta,
  ICorePluginClass,
  IOnClientCommandMeta,
  IBrowserEmulatorClass,
  IHumanEmulatorClass,
} from '@ulixee/hero-interfaces/ICorePlugin';
import ICorePlugins from '@ulixee/hero-interfaces/ICorePlugins';
import ICorePluginCreateOptions from '@ulixee/hero-interfaces/ICorePluginCreateOptions';
import IBrowserEngine from '@ulixee/hero-interfaces/IBrowserEngine';
import { PluginTypes } from '@ulixee/hero-interfaces/IPluginTypes';
import requirePlugins from '@ulixee/hero-plugin-utils/lib/utils/requirePlugins';
import IHttp2ConnectSettings from '@ulixee/hero-interfaces/IHttp2ConnectSettings';
import IDeviceProfile from '@ulixee/hero-interfaces/IDeviceProfile';
import Core from '../index';

const DefaultBrowserEmulatorId = 'default-browser-emulator';
const DefaultHumanEmulatorId = 'default-human-emulator';

interface IOptionsCreate {
  userAgentSelector?: string;
  deviceProfile?: IDeviceProfile;
  humanEmulatorId?: string;
  browserEmulatorId?: string;
  selectBrowserMeta?: ISelectBrowserMeta;
  dependencyMap?: IDependencyMap;
  corePluginPaths?: string[];
}

interface IDependencyMap {
  [clientPluginId: string]: string[];
}

export default class CorePlugins implements ICorePlugins {
  public static corePluginClassesById: { [id: string]: ICorePluginClass } = {};

  public readonly browserEngine: IBrowserEngine;
  public readonly browserEmulator: IBrowserEmulator;
  public readonly humanEmulator: IHumanEmulator;

  private readonly instances: ICorePlugin[] = [];
  private readonly instanceById: { [id: string]: ICorePlugin } = {};
  private readonly createOptions: ICorePluginCreateOptions;
  private readonly logger: IBoundLog;

  constructor(options: IOptionsCreate, logger: IBoundLog) {
    const {
      userAgentSelector,
      dependencyMap,
      corePluginPaths,
      browserEmulatorId = DefaultBrowserEmulatorId,
      humanEmulatorId = DefaultHumanEmulatorId,
    } = options;

    let BrowserEmulator = Core.pluginMap.browserEmulatorsById[browserEmulatorId];
    if (!BrowserEmulator) {
      BrowserEmulator = requirePlugins<IBrowserEmulatorClass>(
        browserEmulatorId,
        PluginTypes.BrowserEmulator,
      )[0];
    }
    if (!BrowserEmulator) throw new Error(`Browser emulator ${browserEmulatorId} was not found`);

    let HumanEmulator = Core.pluginMap.humanEmulatorsById[humanEmulatorId];
    // Backwards compatibility for 1.4.X > 1.5.0
    if (!HumanEmulator && humanEmulatorId === 'basic') {
      HumanEmulator = Core.pluginMap.humanEmulatorsById[DefaultHumanEmulatorId];
    }
    if (!HumanEmulator) {
      HumanEmulator = requirePlugins<IHumanEmulatorClass>(
        humanEmulatorId,
        PluginTypes.HumanEmulator,
      )[0];
    }
    if (!HumanEmulator) throw new Error(`Human emulator ${humanEmulatorId} was not found`);

    const { browserEngine, userAgentOption } =
      options.selectBrowserMeta || BrowserEmulator.selectBrowserMeta(userAgentSelector);
    this.createOptions = {
      browserEngine,
      userAgentOption,
      logger,
      corePlugins: this,
      deviceProfile: options.deviceProfile,
    };
    this.browserEngine = browserEngine;
    this.logger = logger;

    this.browserEmulator = new BrowserEmulator(this.createOptions);
    this.addPluginInstance(this.browserEmulator);

    this.humanEmulator = new HumanEmulator(this.createOptions);
    this.addPluginInstance(this.humanEmulator);

    Object.values(Core.pluginMap.corePluginsById).forEach(x => this.use(x));

    if (Core.allowDynamicPluginLoading) {
      if (dependencyMap) {
        this.loadDependencies(dependencyMap);
      }
      if (corePluginPaths) {
        this.loadCorePluginPaths(corePluginPaths);
      }
    }
  }

  // BROWSER EMULATORS

  public configure(options: IBrowserEmulatorConfig): void {
    this.instances.filter(p => p.configure).forEach(p => p.configure(options));
  }

  public onDnsConfiguration(settings: IDnsSettings): void {
    this.instances.filter(p => p.onDnsConfiguration).forEach(p => p.onDnsConfiguration(settings));
  }

  public onTcpConfiguration(settings: ITcpSettings): void {
    this.instances.filter(p => p.onTcpConfiguration).forEach(p => p.onTcpConfiguration(settings));
  }

  public onTlsConfiguration(settings: ITlsSettings): void {
    this.instances.filter(p => p.onTlsConfiguration).forEach(p => p.onTlsConfiguration(settings));
  }

  public async onNewPuppetPage(page: IPuppetPage): Promise<void> {
    await Promise.all(
      this.instances.filter(p => p.onNewPuppetPage).map(p => p.onNewPuppetPage(page)),
    );
  }

  public async onNewPuppetWorker(worker: IPuppetWorker): Promise<void> {
    await Promise.all(
      this.instances.filter(p => p.onNewPuppetWorker).map(p => p.onNewPuppetWorker(worker)),
    );
  }

  public async onHttp2SessionConnect(
    resource: IHttpResourceLoadDetails,
    settings: IHttp2ConnectSettings,
  ): Promise<void> {
    await Promise.all(
      this.instances
        .filter(p => p.onHttp2SessionConnect)
        .map(p => p.onHttp2SessionConnect(resource, settings)),
    );
  }

  public async beforeHttpRequest(resource: IHttpResourceLoadDetails): Promise<void> {
    await Promise.all(
      this.instances.filter(p => p.beforeHttpRequest).map(p => p.beforeHttpRequest(resource)),
    );
  }

  public async beforeHttpResponse(resource: IHttpResourceLoadDetails): Promise<any> {
    await Promise.all(
      this.instances.filter(p => p.beforeHttpResponse).map(p => p.beforeHttpResponse(resource)),
    );
  }

  public websiteHasFirstPartyInteraction(url: URL): void {
    this.instances
      .filter(p => p.websiteHasFirstPartyInteraction)
      .forEach(p => p.websiteHasFirstPartyInteraction(url));
  }

  // HUMAN EMULATORS

  public async playInteractions(
    interactionGroups: IInteractionGroups,
    runFn: (interaction: IInteractionStep) => Promise<void>,
    helper?: IInteractionsHelper,
  ): Promise<void> {
    const plugin = this.instances.filter(p => p.playInteractions).pop();
    if (plugin && plugin.playInteractions) {
      await plugin.playInteractions(interactionGroups, runFn, helper);
    } else {
      for (const interactionGroup of interactionGroups) {
        for (const interactionStep of interactionGroup) {
          await runFn(interactionStep);
        }
      }
    }
  }

  public async getStartingMousePoint(helper?: IInteractionsHelper): Promise<IPoint> {
    const plugin = this.instances.filter(p => p.getStartingMousePoint).pop();
    if (plugin && plugin.getStartingMousePoint) {
      return await plugin.getStartingMousePoint(helper);
    }
  }

  // PLUGIN COMMANDS

  public async onPluginCommand(
    toPluginId: string,
    commandMeta: IOnClientCommandMeta,
    args: any[],
  ): Promise<any> {
    const plugin = this.instanceById[toPluginId];
    if (plugin && plugin.onClientCommand) {
      return await plugin.onClientCommand(commandMeta, ...args);
    }
    this.logger.warn(`Plugin (${toPluginId}) could not be found for command`);
  }

  // ADDING PLUGINS TO THE STACK

  public use(CorePlugin: ICorePluginClass) {
    if (this.instanceById[CorePlugin.id]) return;
    this.addPluginInstance(new CorePlugin(this.createOptions));
  }

  private addPluginInstance(corePlugin: ICorePlugin) {
    this.instances.push(corePlugin);
    this.instanceById[corePlugin.id] = corePlugin;
  }

  private require(corePluginId: string): ICorePluginClass {
    if (!CorePlugins.corePluginClassesById[corePluginId]) {
      try {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const CorePlugin = require(corePluginId);
        if (!CorePlugin) return;
        CorePlugins.corePluginClassesById[corePluginId] = CorePlugin.default || CorePlugin;
      } catch (error) {
        return;
      }
    }
    return CorePlugins.corePluginClassesById[corePluginId];
  }

  private loadDependencies(dependencyMap: IDependencyMap) {
    Object.entries(dependencyMap).forEach(([clientPluginId, corePluginIds]) => {
      corePluginIds.forEach(corePluginId => {
        if (this.instanceById[corePluginId]) return;
        if (Core.pluginMap.corePluginsById[corePluginId]) return;
        this.logger.info(`Dynamically requiring ${corePluginId} requested by ${clientPluginId}`);
        const Plugin = requirePlugins<ICorePluginClass>(corePluginId, PluginTypes.CorePlugin)[0];
        if (!Plugin) throw new Error(`Could not find ${corePluginId}`);

        this.use(Plugin);
      });
    });
  }

  private loadCorePluginPaths(corePluginPaths: string[]) {
    for (const corePluginPath of corePluginPaths) {
      if (Core.pluginMap.corePluginsById[corePluginPath]) return;
      const Plugins = requirePlugins<ICorePluginClass>(corePluginPath, PluginTypes.CorePlugin);
      Plugins.forEach(Plugin => this.use(Plugin));
    }
  }
}
