import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Plugin configuration interface
interface PluginConfig {
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  settings?: Record<string, any>;
}

// Default plugin configurations
const defaultPlugins: PluginConfig[] = [
  {
    name: 'google-analytics',
    description: 'Google Analytics integration for website tracking',
    version: '1.0.0',
    isActive: false,
    settings: {
      trackingId: '',
      anonymizeIp: true,
      enableDemographics: false
    }
  },
  {
    name: 'seo-tools',
    description: 'SEO tools for meta tags and structured data',
    version: '1.0.0',
    isActive: true,
    settings: {
      title: '',
      description: '',
      keywords: '',
      author: '',
      ogImage: '',
      twitterCard: 'summary'
    }
  },
  {
    name: 'sitemap-generator',
    description: 'Automatic sitemap generation for SEO',
    version: '1.0.0',
    isActive: true,
    settings: {
      baseUrl: '',
      autoGenerate: true,
      includeImages: true,
      defaultChangefreq: 'weekly',
      defaultPriority: 0.8
    }
  },
  {
    name: 'rich-snippet',
    description: 'Rich snippet and structured data generation',
    version: '1.0.0',
    isActive: true,
    settings: {
      enableArticle: true,
      enableProduct: true,
      enableLocalBusiness: true,
      enableOrganization: true,
      defaultOrganization: {}
    }
  },
  {
    name: 'google-local',
    description: 'Google Local Business integration',
    version: '1.0.0',
    isActive: false,
    settings: {
      placeId: '',
      apiKey: '',
      enableReviews: true,
      enableDirections: true,
      enablePhotos: true,
      mapContainerId: 'google-map'
    }
  },
  {
    name: 'keyword-tagging',
    description: 'Keyword analysis and tagging system',
    version: '1.0.0',
    isActive: true,
    settings: {
      primaryKeywords: [],
      secondaryKeywords: [],
      autoTag: true,
      densityThreshold: 0.5,
      maxKeywords: 10,
      enableMetaKeywords: true,
      enableContentAnalysis: true
    }
  }
];

// GET /api/plugins - Get all plugins
export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch from database
    // For now, return default plugins
    return NextResponse.json(defaultPlugins);
  } catch (error) {
    console.error('Error fetching plugins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plugins' },
      { status: 500 }
    );
  }
}

// POST /api/plugins - Update plugin configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, isActive, settings } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Plugin name is required' },
        { status: 400 }
      );
    }

    // Find the plugin
    const pluginIndex = defaultPlugins.findIndex(p => p.name === name);
    if (pluginIndex === -1) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }

    // Update plugin configuration
    const updatedPlugin = {
      ...defaultPlugins[pluginIndex],
      isActive: isActive !== undefined ? isActive : defaultPlugins[pluginIndex].isActive,
      settings: settings || defaultPlugins[pluginIndex].settings
    };

    // In a real app, save to database
    // For now, update in memory (this won't persist across server restarts)
    defaultPlugins[pluginIndex] = updatedPlugin;

    return NextResponse.json(updatedPlugin);
  } catch (error) {
    console.error('Error updating plugin:', error);
    return NextResponse.json(
      { error: 'Failed to update plugin' },
      { status: 500 }
    );
  }
}