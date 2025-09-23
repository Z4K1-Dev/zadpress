import { HydraEngine, getHydraEngine } from './HydraEngine';
import { CompanyProfileCore } from './cores/CompanyProfileCore';
import { PluginConfig } from '../../plugins/base-plugin';

/**
 * Hydra Engine Demo - Tamer1's First Hydra Instance
 * 
 * This demo shows how to:
 * 1. Initialize the Hydra Engine
 * 2. Register a Company Profile Core
 * 3. Grow the Company Profile head
 * 4. Interact with the active head
 * 5. Cut the head (optional)
 * 
 * This demonstrates the "Nothing-by-Default" philosophy:
 * - The engine starts empty
 * - We grow only the head we need
 * - The system becomes what we need it to be
 */

async function runHydraDemo() {
  console.log('🐉 ===============================================');
  console.log('🐉   HYDRA ENGINE DEMO - TAMER1 INSTANCE');
  console.log('🐉 ===============================================');
  
  try {
    // Step 1: Initialize the Hydra Engine
    console.log('\n🐉 Step 1: Initializing Hydra Engine...');
    const hydraEngine = getHydraEngine();
    await hydraEngine.initialize();
    
    console.log('✅ Hydra Engine initialized successfully!');
    
    // Step 2: Check initial status (should be empty)
    console.log('\n🐉 Step 2: Checking initial status...');
    const initialStatus = hydraEngine.getStatus();
    console.log('Initial Status:', JSON.stringify(initialStatus, null, 2));
    
    // Step 3: Register the Company Profile Core
    console.log('\n🐉 Step 3: Registering Company Profile Core...');
    
    const companyProfileConfig: PluginConfig = {
      name: 'company-profile',
      description: 'Complete company profile management system',
      version: '1.0.0',
      isActive: true,
      settings: {
        theme: 'corporate',
        features: {
          pages: true,
          team: true,
          testimonials: true,
          portfolio: true,
          contact: true,
          analytics: true,
          seo: true
        }
      }
    };
    
    hydraEngine.registerCore('company-profile', CompanyProfileCore, companyProfileConfig);
    console.log('✅ Company Profile Core registered!');
    
    // Step 4: Grow the Company Profile head
    console.log('\n🐉 Step 4: Growing Company Profile head...');
    await hydraEngine.growHead('company-profile', companyProfileConfig);
    console.log('✅ Company Profile head grown successfully!');
    
    // Step 5: Check status after growing head
    console.log('\n🐉 Step 5: Checking status after growing head...');
    const afterGrowthStatus = hydraEngine.getStatus();
    console.log('Status After Growth:', JSON.stringify(afterGrowthStatus, null, 2));
    
    // Step 6: Check active heads
    console.log('\n🐉 Step 6: Checking active heads...');
    const activeHeads = hydraEngine.getActiveHeads();
    console.log('Active Heads:', activeHeads);
    
    // Step 7: Get the Company Profile head instance
    console.log('\n🐉 Step 7: Getting Company Profile head instance...');
    const companyProfileHead = hydraEngine.getHead('company-profile');
    if (companyProfileHead) {
      console.log('✅ Company Profile head retrieved!');
      console.log('Core Type:', companyProfileHead.getCoreType());
      console.log('Required Capabilities:', companyProfileHead.getRequiredCapabilities());
      console.log('Default Theme:', companyProfileHead.getDefaultTheme());
      
      // Get core status
      const coreStatus = companyProfileHead.getCoreStatus();
      console.log('Core Status:', JSON.stringify(coreStatus, null, 2));
      
      // Get active features
      const activeFeatures = companyProfileHead.getActiveFeatures();
      console.log('Active Features:', activeFeatures);
      
      // Check capabilities
      console.log('Has page-management capability:', companyProfileHead.hasCapability('page-management'));
      console.log('Has team-management capability:', companyProfileHead.hasCapability('team-management'));
      console.log('Has e-commerce capability:', companyProfileHead.hasCapability('e-commerce'));
    }
    
    // Step 8: Demonstrate event system
    console.log('\n🐉 Step 8: Demonstrating event system...');
    const eventEmitter = hydraEngine.getEventEmitter();
    
    // Listen for Hydra events
    eventEmitter.on('hydra:headgrown', (data) => {
      console.log('🎉 Event: Head grown -', data);
    });
    
    eventEmitter.on('hydra:coreloaded', (data) => {
      console.log('🎉 Event: Core loaded -', data);
    });
    
    // Emit a test event
    eventEmitter.emit('hydra:test', {
      message: 'Test event from Tamer1',
      timestamp: new Date().toISOString()
    });
    
    // Step 9: Demonstrate hook system
    console.log('\n🐉 Step 9: Demonstrating hook system...');
    const hookManager = hydraEngine.getHookManager();
    
    // Add a test hook
    hookManager.addAction('hydra:testhook', (data) => {
      console.log('🎣 Hook executed with data:', data);
      return `Hook processed: ${data.message}`;
    });
    
    // Execute the hook
    hookManager.doAction('hydra:testhook', {
      message: 'Test hook execution',
      source: 'Tamer1 demo'
    });
    
    // Step 10: Optional - Cut the head (commented out for demo)
    console.log('\n🐉 Step 10: Head cutting demo (skipped for demo)...');
    console.log('💡 To cut the head, uncomment the following lines:');
    console.log('// await hydraEngine.cutHead(\'company-profile\');');
    console.log('// console.log(\'✅ Company Profile head cut!\');');
    
    /*
    // Uncomment to test head cutting
    await hydraEngine.cutHead('company-profile');
    console.log('✅ Company Profile head cut!');
    
    const afterCutStatus = hydraEngine.getStatus();
    console.log('Status After Cutting:', JSON.stringify(afterCutStatus, null, 2));
    */
    
    // Step 11: Final status
    console.log('\n🐉 Step 11: Final status...');
    const finalStatus = hydraEngine.getStatus();
    console.log('Final Status:', JSON.stringify(finalStatus, null, 2));
    
    console.log('\n🐉 ===============================================');
    console.log('🐉   HYDRA ENGINE DEMO COMPLETED SUCCESSFULLY!');
    console.log('🐉 ===============================================');
    console.log('🐉');
    console.log('🐉 Key Takeaways:');
    console.log('🐉 1. Hydra Engine starts with NOTHING by default');
    console.log('🐉 2. We grew ONLY the Company Profile head');
    console.log('🐉 3. The system became a Company Profile system');
    console.log('🐉 4. No forced context, no unnecessary features');
    console.log('🐉 5. True modularity achieved!');
    console.log('🐉');
    console.log('🐉 "CONTEXT IS DETERMINED BY ACTIVE PLUGINS, NOT BY THE SYSTEM ITSELF"');
    console.log('🐉 ===============================================');
    
  } catch (error) {
    console.error('💥 Demo failed:', error);
    throw error;
  }
}

// Export the demo function
export { runHydraDemo };

// Auto-run if this file is executed directly
if (require.main === module) {
  runHydraDemo()
    .then(() => {
      console.log('\n🎉 Demo completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Demo failed:', error);
      process.exit(1);
    });
}