import { BasePlugin } from '../hybrid-system';
import { PluginConfig } from '../../src/plugins/base-plugin';

/**
 * Hydra Core - The Heads of the Hydra System
 * 
 * Each Hydra Core represents a "head" of the Hydra - a complete,
 * self-contained functionality domain like Forum, E-commerce, Blog, etc.
 * 
 * These are not just plugins - they are complete solutions for specific domains.
 */
export abstract class HydraCore extends BasePlugin {
  protected coreType: string;
  protected requiredCapabilities: string[];
  protected defaultTheme: string;
  protected coreFeatures: Map<string, any> = new Map();
  
  constructor(config: PluginConfig) {
    super(config);
    this.coreType = this.getCoreType();
    this.requiredCapabilities = this.getRequiredCapabilities();
    this.defaultTheme = this.getDefaultTheme();
  }
  
  /**
   * Get the core type identifier
   * This defines what "head" this is (forum, ecommerce, blog, etc.)
   */
  abstract getCoreType(): string;
  
  /**
   * Get required capabilities for this core
   * These are the fundamental capabilities this core provides
   */
  abstract getRequiredCapabilities(): string[];
  
  /**
   * Get the default theme for this core
   * Each core can have its own optimized theme
   */
  abstract getDefaultTheme(): string;
  
  /**
   * Setup core-specific features
   * This is where each core implements its unique functionality
   */
  protected abstract setupCoreFeatures(): Promise<void>;
  
  /**
   * Get core-specific routes
   * Each core can define its own API routes
   */
  abstract getCoreRoutes(): CoreRoute[];
  
  /**
   * Get core-specific database models
   * Each core can define its own database schema
   */
  abstract getCoreModels(): CoreModel[];
  
  /**
   * Initialize the core
   * This is called when the Hydra grows this head
   */
  async load(): Promise<void> {
    console.log(`🐉 ${this.coreType} Core: Initializing head...`);
    
    try {
      // Setup core features
      await this.setupCoreFeatures();
      
      // Register core capabilities
      await this.registerCapabilities();
      
      // Setup core routes
      await this.setupCoreRoutes();
      
      // Setup core models
      await this.setupCoreModels();
      
      // Setup core event listeners
      this.setupCoreEventListeners();
      
      this.isLoaded = true;
      
      console.log(`🐉 ${this.coreType} Core: ✅ Head fully grown and operational!`);
      
      // Emit core loaded event
      this.getEventEmitter().emit('hydra:coreloaded', {
        type: this.coreType,
        capabilities: this.requiredCapabilities,
        theme: this.defaultTheme,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`🐉 ${this.coreType} Core: 💥 Failed to initialize head:`, error);
      throw error;
    }
  }
  
  /**
   * Unload the core
   * This is called when the Hydra cuts this head
   */
  async unload(): Promise<void> {
    console.log(`🐉 ${this.coreType} Core: Cutting head...`);
    
    try {
      // Cleanup core features
      await this.cleanupCoreFeatures();
      
      // Unregister capabilities
      await this.unregisterCapabilities();
      
      // Remove core routes
      await this.removeCoreRoutes();
      
      // Cleanup core models
      await this.cleanupCoreModels();
      
      // Remove core event listeners
      this.removeCoreEventListeners();
      
      this.isLoaded = false;
      
      console.log(`🐉 ${this.coreType} Core: ✅ Head successfully cut`);
      
      // Emit core unloaded event
      this.getEventEmitter().emit('hydra:coreunloaded', {
        type: this.coreType,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`🐉 ${this.coreType} Core: 💥 Failed to cut head:`, error);
      throw error;
    }
  }
  
  /**
   * Register core capabilities
   */
  private async registerCapabilities(): Promise<void> {
    console.log(`🐉 ${this.coreType} Core: Registering capabilities...`);
    
    for (const capability of this.requiredCapabilities) {
      this.coreFeatures.set(capability, {
        type: capability,
        status: 'active',
        core: this.coreType,
        timestamp: new Date().toISOString()
      });
      
      // Emit capability registration event
      this.getEventEmitter().emit('hydra:capabilityregistered', {
        capability,
        core: this.coreType,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🐉 ${this.coreType} Core: ✅ ${this.requiredCapabilities.length} capabilities registered`);
  }
  
  /**
   * Unregister core capabilities
   */
  private async unregisterCapabilities(): Promise<void> {
    console.log(`🐉 ${this.coreType} Core: Unregistering capabilities...`);
    
    for (const capability of this.requiredCapabilities) {
      this.coreFeatures.delete(capability);
      
      // Emit capability unregistration event
      this.getEventEmitter().emit('hydra:capabilityunregistered', {
        capability,
        core: this.coreType,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🐉 ${this.coreType} Core: ✅ Capabilities unregistered`);
  }
  
  /**
   * Setup core routes
   */
  private async setupCoreRoutes(): Promise<void> {
    console.log(`🐉 ${this.coreType} Core: Setting up routes...`);
    
    const routes = this.getCoreRoutes();
    
    for (const route of routes) {
      // Register route with the system
      this.addHook('hydra:registerRoute', () => ({
        path: route.path,
        method: route.method,
        handler: route.handler,
        core: this.coreType
      }));
      
      // Emit route registration event
      this.getEventEmitter().emit('hydra:routeregistered', {
        path: route.path,
        method: route.method,
        core: this.coreType,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🐉 ${this.coreType} Core: ✅ ${routes.length} routes registered`);
  }
  
  /**
   * Remove core routes
   */
  private async removeCoreRoutes(): Promise<void> {
    console.log(`🐉 ${this.coreType} Core: Removing routes...`);
    
    const routes = this.getCoreRoutes();
    
    for (const route of routes) {
      // Remove route from the system
      this.addHook('hydra:removeRoute', () => ({
        path: route.path,
        method: route.method,
        core: this.coreType
      }));
      
      // Emit route removal event
      this.getEventEmitter().emit('hydra:routeremoved', {
        path: route.path,
        method: route.method,
        core: this.coreType,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🐉 ${this.coreType} Core: ✅ Routes removed`);
  }
  
  /**
   * Setup core models
   */
  private async setupCoreModels(): Promise<void> {
    console.log(`🐉 ${this.coreType} Core: Setting up database models...`);
    
    const models = this.getCoreModels();
    
    for (const model of models) {
      // Register model with the system
      this.addHook('hydra:registerModel', () => ({
        name: model.name,
        schema: model.schema,
        core: this.coreType
      }));
      
      // Emit model registration event
      this.getEventEmitter().emit('hydra:modelregistered', {
        name: model.name,
        core: this.coreType,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🐉 ${this.coreType} Core: ✅ ${models.length} models registered`);
  }
  
  /**
   * Cleanup core models
   */
  private async cleanupCoreModels(): Promise<void> {
    console.log(`🐉 ${this.coreType} Core: Cleaning up database models...`);
    
    const models = this.getCoreModels();
    
    for (const model of models) {
      // Remove model from the system
      this.addHook('hydra:removeModel', () => ({
        name: model.name,
        core: this.coreType
      }));
      
      // Emit model removal event
      this.getEventEmitter().emit('hydra:modelremoved', {
        name: model.name,
        core: this.coreType,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🐉 ${this.coreType} Core: ✅ Models cleaned up`);
  }
  
  /**
   * Setup core event listeners
   */
  private setupCoreEventListeners(): void {
    console.log(`🐉 ${this.coreType} Core: Setting up event listeners...`);
    
    // Listen for core-specific events
    this.getEventEmitter().on(`hydra:${this.coreType}:request`, (data) => {
      this.handleCoreRequest(data);
    });
    
    // Listen for system events
    this.getEventEmitter().on('hydra:systemstatus', () => {
      this.reportCoreStatus();
    });
    
    console.log(`🐉 ${this.coreType} Core: ✅ Event listeners setup complete`);
  }
  
  /**
   * Remove core event listeners
   */
  private removeCoreEventListeners(): void {
    console.log(`🐉 ${this.coreType} Core: Removing event listeners...`);
    
    // Remove core-specific event listeners
    this.getEventEmitter().removeAllListeners(`hydra:${this.coreType}:request`);
    this.getEventEmitter().removeAllListeners('hydra:systemstatus');
    
    console.log(`🐉 ${this.coreType} Core: ✅ Event listeners removed`);
  }
  
  /**
   * Handle core-specific requests
   */
  private handleCoreRequest(data: any): void {
    console.log(`🐉 ${this.coreType} Core: Handling request -`, data);
    
    // Each core can implement its own request handling logic
    this.getEventEmitter().emit(`hydra:${this.coreType}:response`, {
      requestId: data.requestId,
      response: this.processCoreRequest(data),
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Process core-specific request
   * Override this in specific core implementations
   */
  protected processCoreRequest(data: any): any {
    return {
      status: 'success',
      message: `${this.coreType} Core request processed`,
      core: this.coreType,
      data
    };
  }
  
  /**
   * Report core status
   */
  private reportCoreStatus(): void {
    const status = {
      type: this.coreType,
      loaded: this.isLoaded,
      capabilities: this.requiredCapabilities,
      activeFeatures: Array.from(this.coreFeatures.keys()),
      theme: this.defaultTheme,
      timestamp: new Date().toISOString()
    };
    
    this.getEventEmitter().emit('hydra:corestatus', status);
  }
  
  /**
   * Get core status
   */
  getCoreStatus(): any {
    return {
      type: this.coreType,
      loaded: this.isLoaded,
      capabilities: this.requiredCapabilities,
      activeFeatures: Array.from(this.coreFeatures.keys()),
      theme: this.defaultTheme,
      config: this.config
    };
  }
  
  /**
   * Get active features
   */
  getActiveFeatures(): string[] {
    return Array.from(this.coreFeatures.keys());
  }
  
  /**
   * Check if capability is available
   */
  hasCapability(capability: string): boolean {
    return this.coreFeatures.has(capability);
  }
}

/**
 * Core route interface
 */
export interface CoreRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: (req: any, res: any) => Promise<any>;
}

/**
 * Core model interface
 */
export interface CoreModel {
  name: string;
  schema: any; // Prisma schema or similar
}