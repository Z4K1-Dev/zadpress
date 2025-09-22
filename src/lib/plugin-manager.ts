import { BasePlugin, PluginConfig } from '@/plugins/base-plugin';

export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, typeof BasePlugin> = new Map();
  private activePlugins: Map<string, BasePlugin> = new Map();
  private pluginConfigs: Map<string, PluginConfig> = new Map();

  private constructor() {}

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  registerPlugin(name: string, pluginClass: typeof BasePlugin): void {
    this.plugins.set(name, pluginClass);
    console.log(`Plugin ${name} registered`);
  }

  async loadPlugin(name: string, config: PluginConfig): Promise<void> {
    if (!this.plugins.has(name)) {
      console.error(`Plugin ${name} not found`);
      return;
    }

    if (this.activePlugins.has(name)) {
      console.log(`Plugin ${name} is already loaded`);
      return;
    }

    try {
      const PluginClass = this.plugins.get(name)!;
      const plugin = new PluginClass(config);
      
      await plugin.load();
      this.activePlugins.set(name, plugin);
      this.pluginConfigs.set(name, config);
      
      console.log(`Plugin ${name} loaded successfully`);
    } catch (error) {
      console.error(`Failed to load plugin ${name}:`, error);
    }
  }

  async unloadPlugin(name: string): Promise<void> {
    const plugin = this.activePlugins.get(name);
    if (!plugin) {
      console.log(`Plugin ${name} is not loaded`);
      return;
    }

    try {
      await plugin.unload();
      this.activePlugins.delete(name);
      this.pluginConfigs.delete(name);
      
      console.log(`Plugin ${name} unloaded successfully`);
    } catch (error) {
      console.error(`Failed to unload plugin ${name}:`, error);
    }
  }

  async reloadPlugin(name: string, config: PluginConfig): Promise<void> {
    await this.unloadPlugin(name);
    await this.loadPlugin(name, config);
  }

  async loadActivePlugins(): Promise<void> {
    try {
      const response = await fetch('/api/plugins/active');
      if (!response.ok) {
        console.error('Failed to fetch active plugins');
        return;
      }

      const activeConfigs = await response.json();
      
      for (const config of activeConfigs) {
        if (config.isActive) {
          await this.loadPlugin(config.name, config);
        }
      }
    } catch (error) {
      console.error('Error loading active plugins:', error);
    }
  }

  getLoadedPlugins(): string[] {
    return Array.from(this.activePlugins.keys());
  }

  getPluginConfig(name: string): PluginConfig | undefined {
    return this.pluginConfigs.get(name);
  }

  isPluginLoaded(name: string): boolean {
    return this.activePlugins.has(name);
  }

  async updatePluginConfig(name: string, config: Partial<PluginConfig>): Promise<void> {
    const currentConfig = this.pluginConfigs.get(name);
    if (!currentConfig) {
      console.error(`Plugin ${name} not found`);
      return;
    }

    const updatedConfig = { ...currentConfig, ...config };
    this.pluginConfigs.set(name, updatedConfig);

    if (this.activePlugins.has(name)) {
      await this.reloadPlugin(name, updatedConfig);
    }
  }
}

export const pluginManager = PluginManager.getInstance();