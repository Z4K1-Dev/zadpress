import { NextRequest, NextResponse } from 'next/server';

// GET /api/plugins/active - Get active plugins only
export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch active plugins from database
    // For now, return mock active plugins
    const activePlugins = [
      {
        name: 'seo-tools',
        description: 'SEO tools for meta tags and structured data',
        version: '1.0.0',
        isActive: true,
        settings: {
          title: 'My Website',
          description: 'A modern website with SEO optimization',
          keywords: 'website, seo, optimization',
          author: 'Website Author',
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
          baseUrl: 'https://example.com',
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
          defaultOrganization: {
            name: 'My Organization',
            url: 'https://example.com',
            logo: 'https://example.com/logo.png'
          }
        }
      },
      {
        name: 'keyword-tagging',
        description: 'Keyword analysis and tagging system',
        version: '1.0.0',
        isActive: true,
        settings: {
          primaryKeywords: ['website', 'seo'],
          secondaryKeywords: ['optimization', 'content'],
          autoTag: true,
          densityThreshold: 0.5,
          maxKeywords: 10,
          enableMetaKeywords: true,
          enableContentAnalysis: true
        }
      }
    ];

    return NextResponse.json(activePlugins);
  } catch (error) {
    console.error('Error fetching active plugins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active plugins' },
      { status: 500 }
    );
  }
}