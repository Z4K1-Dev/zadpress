import { HybridPluginManager } from '../src/lib/hybrid-system/HybridPluginManager';
import { PluginEventEmitter } from '../src/lib/hybrid-system/EventEmitter';
import { HookManager } from '../src/lib/hybrid-system/HookManager';
import { PluginRegistry } from '../src/lib/hybrid-system/PluginRegistry';
import { HybridSystemFactory } from '../src/lib/hybrid-system/factory';
import { db } from '../src/lib/db';
import { BasePlugin } from '../plugins/base-plugin';

/**
 * Hydra Engine - The Core Body of the Hydra System
 * 
 * "CONTEXT IS DETERMINED BY ACTIVE PLUGINS, NOT BY THE SYSTEM ITSELF"
 * 
 * The Hydra Engine is the central nervous system that manages all plugins,
 * events, hooks, and database operations. It's the "body" that can grow
 * multiple "heads" (cores) based on the active plugins.
 */
export class HydraEngine {
  private pluginSystem: HybridPluginManager;
  private eventEmitter: PluginEventEmitter;
  private hookManager: HookManager;
  private registry: PluginRegistry;
  private database: typeof db;
  private isInitialized: boolean = false;
  private activeHeads: Map<string, any> = new Map();
  private coreRegistry: Map<string, any> = new Map();
  
  constructor() {
    console.log('🐉 Hydra Engine: Initializing the beast...');
    
    // Initialize the hybrid system components
    this.pluginSystem = HybridSystemFactory.create({
      maxEventHistory: 1000,
      maxHookCacheSize: 100,
      cleanupInterval: 60000,
      enableDebugMode: true,
      enablePerformanceMonitoring: true
    });
    
    this.eventEmitter = this.pluginSystem.getEventEmitter();
    this.hookManager = this.pluginSystem.getHookManager();
    this.registry = this.pluginSystem.getRegistry();
    this.database = db;
    
    console.log('🐉 Hydra Engine: Body components initialized');
  }
  
  /**
   * Initialize the Hydra Engine
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('🐉 Hydra Engine: Already initialized');
      return;
    }
    
    try {
      console.log('🐉 Hydra Engine: Starting initialization sequence...');
      
      // Initialize the hybrid system
      await this.pluginSystem.initialize();
      
      // Setup Hydra-specific event listeners
      this.setupHydraEventListeners();
      
      this.isInitialized = true;
      
      console.log('🐉 Hydra Engine: ✅ Initialization complete - Ready to grow heads!');
      
      // Emit initialization event
      this.eventEmitter.emit('hydra:initialized', {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
      
    } catch (error) {
      console.error('🐉 Hydra Engine: 💥 Initialization failed:', error);
      throw error;
    }
  }
  
  /**
   * Grow a new head (activate a core plugin)
   * This is where the Hydra magic happens - growing new functionality
   */
  async growHead(coreName: string, config?: any): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Hydra Engine not initialized');
    }
    
    console.log(`🐉 Hydra Engine: Growing head "${coreName}"...`);
    
    try {
      // Check if the core plugin is registered in our registry
      const coreRegistration = this.coreRegistry.get(coreName);
      if (!coreRegistration) {
        throw new Error(`Core plugin "${coreName}" not found in registry`);
      }
      
      // Get the instance from registration
      const instance = coreRegistration.instance;
      
      // Load the plugin (grow the head)
      await this.pluginSystem.loadPlugin(instance, config || instance.config);
      
      // Track the active head
      this.activeHeads.set(coreName, instance);
      
      console.log(`🐉 Hydra Engine: ✅ Head "${coreName}" grown successfully!`);
      
      // Emit head growth event
      this.eventEmitter.emit('hydra:headgrown', {
        coreName,
        timestamp: new Date().toISOString(),
        config: config || instance.config
      });
      
    } catch (error) {
      console.error(`🐉 Hydra Engine: 💥 Failed to grow head "${coreName}":`, error);
      throw error;
    }
  }
  
  /**
   * Cut a head (deactivate a core plugin)
   * This is where Hydra shows its regenerative power
   */
  async cutHead(coreName: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Hydra Engine not initialized');
    }
    
    console.log(`🐉 Hydra Engine: Cutting head "${coreName}"...`);
    
    try {
      // Check if the head exists
      if (!this.activeHeads.has(coreName)) {
        throw new Error(`Head "${coreName}" is not active`);
      }
      
      // Unload the plugin (cut the head)
      await this.pluginSystem.unloadPlugin(coreName);
      
      // Remove from active heads
      this.activeHeads.delete(coreName);
      
      console.log(`🐉 Hydra Engine: ✅ Head "${coreName}" cut successfully!`);
      
      // Emit head cut event
      this.eventEmitter.emit('hydra:headcut', {
        coreName,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`🐉 Hydra Engine: 💥 Failed to cut head "${coreName}":`, error);
      throw error;
    }
  }
  
  /**
   * Get all active heads
   */
  getActiveHeads(): string[] {
    return Array.from(this.activeHeads.keys());
  }
  
  /**
   * Check if a specific head is active
   */
  hasHead(coreName: string): boolean {
    return this.activeHeads.has(coreName);
  }
  
  /**
   * Get head instance
   */
  getHead(coreName: string): any {
    return this.activeHeads.get(coreName);
  }
  
  /**
   * Get Hydra Engine status
   */
  getStatus(): any {
    const systemStatus = this.pluginSystem.getSystemStatus();
    
    return {
      engine: {
        initialized: this.isInitialized,
        activeHeads: this.getActiveHeads(),
        totalHeads: this.activeHeads.size
      },
      system: systemStatus,
      database: {
        connected: true // We can add more sophisticated health checks
      }
    };
  }
  
  /**
   * Register a core plugin
   */
  registerCore(name: string, pluginClass: typeof BasePlugin, config: any): void {
    console.log(`🐉 Hydra Engine: Registering core "${name}"...`);
    
    // Create an instance and register it
    const instance = new pluginClass(config);
    
    // Store in our own registry (simple Map for now)
    if (!this.coreRegistry) {
      this.coreRegistry = new Map();
    }
    
    this.coreRegistry.set(name, {
      class: pluginClass,
      config: config,
      instance: instance
    });
    
    console.log(`🐉 Hydra Engine: ✅ Core "${name}" registered and ready to grow!`);
    
    // Emit core registration event
    this.eventEmitter.emit('hydra:coreregistered', {
      name,
      config,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Setup Hydra-specific event listeners
   */
  private setupHydraEventListeners(): void {
    console.log('🐉 Hydra Engine: Setting up event listeners...');
    
    // Listen for system shutdown
    this.eventEmitter.on('system:shutdown', () => {
      console.log('🐉 Hydra Engine: Shutdown initiated - cutting all heads...');
      this.shutdown();
    });
    
    // Listen for plugin loaded events
    this.eventEmitter.on('plugin:loaded', (data) => {
      console.log(`🐉 Hydra Engine: Plugin "${data.name}" loaded successfully`);
    });
    
    // Listen for plugin unloaded events
    this.eventEmitter.on('plugin:unloaded', (data) => {
      console.log(`🐉 Hydra Engine: Plugin "${data.name}" unloaded successfully`);
    });
    
    // Listen for errors
    this.eventEmitter.on('error', (error) => {
      console.error('🐉 Hydra Engine: System error detected:', error);
    });
    
    console.log('🐉 Hydra Engine: ✅ Event listeners setup complete');
  }
  
  /**
   * Shutdown the Hydra Engine
   */
  private shutdown(): void {
    try {
      console.log('🐉 Hydra Engine: Starting shutdown sequence...');
      
      // Cut all active heads
      const headsToCut = Array.from(this.activeHeads.keys());
      for (const headName of headsToCut) {
        try {
          this.cutHead(headName);
        } catch (error) {
          console.error(`🐉 Hydra Engine: Failed to cut head "${headName}" during shutdown:`, error);
        }
      }
      
      this.isInitialized = false;
      
      console.log('🐉 Hydra Engine: ✅ Shutdown complete - The beast sleeps');
      
    } catch (error) {
      console.error('🐉 Hydra Engine: 💥 Shutdown failed:', error);
    }
  }
  
  // Expose core components for advanced usage
  getEventEmitter(): PluginEventEmitter {
    return this.eventEmitter;
  }
  
  getHookManager(): HookManager {
    return this.hookManager;
  }
  
  getRegistry(): PluginRegistry {
    return this.registry;
  }
  
  getDatabase(): typeof db {
    return this.database;
  }
}

/**
 * Global Hydra Engine instance
 */
let globalHydraEngine: HydraEngine | null = null;

/**
 * Get or create global Hydra Engine instance
 */
export function getHydraEngine(): HydraEngine {
  if (!globalHydraEngine) {
    globalHydraEngine = new HydraEngine();
  }
  return globalHydraEngine;
}

/**
 * Reset global Hydra Engine instance (for testing)
 */
export function resetHydraEngine(): void {
  globalHydraEngine = null;
}