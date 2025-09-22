export interface PluginConfig {
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  settings?: Record<string, any>;
}

export interface PluginSettings {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    label: string;
    required: boolean;
    default?: any;
    description?: string;
  };
}

export abstract class BasePlugin {
  public config: PluginConfig;
  public isLoaded: boolean = false;
  
  constructor(config: PluginConfig) {
    this.config = config;
  }

  abstract load(): Promise<void>;
  abstract unload(): Promise<void>;
  
  protected validateSettings(settings: Record<string, any>, schema: PluginSettings): boolean {
    for (const [key, setting] of Object.entries(schema)) {
      if (setting.required && settings[key] === undefined) {
        console.error(`Required setting '${key}' is missing for plugin ${this.config.name}`);
        return false;
      }
      
      if (settings[key] !== undefined && typeof settings[key] !== setting.type) {
        console.error(`Setting '${key}' must be of type ${setting.type} for plugin ${this.config.name}`);
        return false;
      }
    }
    return true;
  }
  
  protected injectScript(src: string, async: boolean = true): Promise<void> {
    if (typeof window === 'undefined') return;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = async;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      
      document.head.appendChild(script);
    });
  }
  
  protected injectMetaTag(name: string, content: string): void {
    if (typeof window === 'undefined') return;
    
    const meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!meta) {
      const newMeta = document.createElement('meta') as HTMLMetaElement;
      newMeta.name = name;
      document.head.appendChild(newMeta);
    } else {
      meta.content = content;
    }
  }
  
  protected injectStructuredData(data: any): void {
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }
}