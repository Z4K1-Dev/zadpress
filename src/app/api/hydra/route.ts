import { NextRequest, NextResponse } from 'next/server';
import { getHydraEngine } from '@/lib/hydra/HydraEngine';
import { CompanyProfileCore } from '@/lib/hydra/cores/CompanyProfileCore';

/**
 * Hydra Engine API Endpoint
 * 
 * This endpoint demonstrates the Hydra Engine in action:
 * - Initialize the engine
 * - Register and grow heads
 * - Manage the system state
 * 
 * This is the practical implementation of the "Nothing-by-Default" philosophy
 */

// Initialize the engine once (singleton pattern)
let hydraEngineInitialized = false;

async function ensureHydraEngineInitialized() {
  if (!hydraEngineInitialized) {
    const hydraEngine = getHydraEngine();
    await hydraEngine.initialize();
    
    // Register Company Profile Core
    const companyProfileConfig = {
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
    hydraEngineInitialized = true;
  }
}

// GET /api/hydra - Get Hydra status
export async function GET(request: NextRequest) {
  try {
    await ensureHydraEngineInitialized();
    
    const hydraEngine = getHydraEngine();
    const status = hydraEngine.getStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Hydra Engine status retrieved',
      data: status,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting Hydra status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get Hydra status',
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// POST /api/hydra - Control Hydra Engine
export async function POST(request: NextRequest) {
  try {
    await ensureHydraEngineInitialized();
    
    const body = await request.json();
    const { action, coreName, config } = body;
    
    const hydraEngine = getHydraEngine();
    
    switch (action) {
      case 'grow-head':
        if (!coreName) {
          return NextResponse.json(
            { success: false, error: 'Core name is required' },
            { status: 400 }
          );
        }
        
        await hydraEngine.growHead(coreName, config);
        
        return NextResponse.json({
          success: true,
          message: `Head "${coreName}" grown successfully`,
          action: 'grow-head',
          coreName,
          timestamp: new Date().toISOString()
        });
        
      case 'cut-head':
        if (!coreName) {
          return NextResponse.json(
            { success: false, error: 'Core name is required' },
            { status: 400 }
          );
        }
        
        await hydraEngine.cutHead(coreName);
        
        return NextResponse.json({
          success: true,
          message: `Head "${coreName}" cut successfully`,
          action: 'cut-head',
          coreName,
          timestamp: new Date().toISOString()
        });
        
      case 'get-head':
        if (!coreName) {
          return NextResponse.json(
            { success: false, error: 'Core name is required' },
            { status: 400 }
          );
        }
        
        const head = hydraEngine.getHead(coreName);
        if (!head) {
          return NextResponse.json(
            { success: false, error: 'Head not found' },
            { status: 404 }
          );
        }
        
        const headStatus = head.getCoreStatus();
        
        return NextResponse.json({
          success: true,
          message: `Head "${coreName}" retrieved successfully`,
          action: 'get-head',
          coreName,
          data: headStatus,
          timestamp: new Date().toISOString()
        });
        
      case 'list-heads':
        const activeHeads = hydraEngine.getActiveHeads();
        
        return NextResponse.json({
          success: true,
          message: 'Active heads retrieved successfully',
          action: 'list-heads',
          data: {
            activeHeads,
            count: activeHeads.length
          },
          timestamp: new Date().toISOString()
        });
        
      case 'has-head':
        if (!coreName) {
          return NextResponse.json(
            { success: false, error: 'Core name is required' },
            { status: 400 }
          );
        }
        
        const hasHead = hydraEngine.hasHead(coreName);
        
        return NextResponse.json({
          success: true,
          message: `Head "${coreName}" existence checked`,
          action: 'has-head',
          coreName,
          data: {
            hasHead,
            exists: hasHead
          },
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Error in Hydra API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute Hydra action',
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}