'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface HydraStatus {
  engine: {
    initialized: boolean;
    activeHeads: string[];
    totalHeads: number;
  };
  system: {
    eventEmitter: {
      listenersCount: number;
      eventsEmitted: number;
      eventHistorySize: number;
      registeredEvents: number;
    };
    hookManager: {
      hooksCount: number;
      filtersCount: number;
      actionsCount: number;
      averageExecutionTime: number;
    };
    registry: {
      registeredPlugins: number;
      activePlugins: number;
      dependencyIssues: string[];
      capabilities: string[];
      activationOrder: string[];
    };
    performance: {
      memoryUsage: number;
      averageEventTime: number;
      averageHookTime: number;
    };
  };
  database: {
    connected: boolean;
  };
}

interface HeadStatus {
  type: string;
  loaded: boolean;
  capabilities: string[];
  activeFeatures: string[];
  theme: string;
  config: any;
}

export default function HydraTestPage() {
  const [status, setStatus] = useState<HydraStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHead, setSelectedHead] = useState<string | null>(null);
  const [headStatus, setHeadStatus] = useState<HeadStatus | null>(null);
  const [actionResponse, setActionResponse] = useState<any>(null);

  // Fetch Hydra status
  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hydra');
      const result = await response.json();
      
      if (result.success) {
        setStatus(result.data);
      } else {
        setError(result.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Grow a head
  const growHead = async (coreName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hydra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'grow-head',
          coreName,
        }),
      });
      
      const result = await response.json();
      setActionResponse(result);
      
      if (result.success) {
        await fetchStatus(); // Refresh status
      } else {
        setError(result.error || 'Failed to grow head');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Cut a head
  const cutHead = async (coreName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hydra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cut-head',
          coreName,
        }),
      });
      
      const result = await response.json();
      setActionResponse(result);
      
      if (result.success) {
        await fetchStatus(); // Refresh status
        setSelectedHead(null);
        setHeadStatus(null);
      } else {
        setError(result.error || 'Failed to cut head');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Get head details
  const getHeadDetails = async (coreName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hydra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-head',
          coreName,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setHeadStatus(result.data);
        setSelectedHead(coreName);
      } else {
        setError(result.error || 'Failed to get head details');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">🐉 Hydra Engine Test</h1>
        <p className="text-lg text-muted-foreground">
          Test the "Nothing-by-Default" philosophy in action
        </p>
        <Badge variant="outline" className="text-sm">
          CONTEXT IS DETERMINED BY ACTIVE PLUGINS, NOT BY THE SYSTEM ITSELF
        </Badge>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Response */}
      {actionResponse && (
        <Alert>
          <AlertDescription>
            <strong>Action Response:</strong>
            <pre className="mt-2 text-sm bg-muted p-2 rounded">
              {JSON.stringify(actionResponse, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>🎮 Control Panel</CardTitle>
          <CardDescription>
            Control the Hydra Engine - grow heads, cut heads, see the magic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={fetchStatus} 
              disabled={loading}
              variant="outline"
            >
              🔄 Refresh Status
            </Button>
            <Button 
              onClick={() => growHead('company-profile')} 
              disabled={loading || status?.engine.activeHeads.includes('company-profile')}
            >
              🌱 Grow Company Profile Head
            </Button>
            {status?.engine.activeHeads.includes('company-profile') && (
              <Button 
                onClick={() => cutHead('company-profile')} 
                disabled={loading}
                variant="destructive"
              >
                🪓 Cut Company Profile Head
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Display */}
      {status && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="engine">🚀 Engine</TabsTrigger>
            <TabsTrigger value="system">⚙️ System</TabsTrigger>
            <TabsTrigger value="heads">🐉 Heads</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Heads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{status.engine.totalHeads}</div>
                  <p className="text-xs text-muted-foreground">
                    {status.engine.activeHeads.join(', ') || 'None'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{status.system.eventEmitter.eventsEmitted}</div>
                  <p className="text-xs text-muted-foreground">
                    {status.system.eventEmitter.registeredEvents} registered
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Memory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {status.system.performance.memoryUsage.toFixed(1)}MB
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently in use
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engine">
            <Card>
              <CardHeader>
                <CardTitle>🚀 Engine Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Initialized:</strong> {status.engine.initialized ? '✅' : '❌'}
                  </div>
                  <div>
                    <strong>Total Heads:</strong> {status.engine.totalHeads}
                  </div>
                </div>
                <Separator />
                <div>
                  <strong>Active Heads:</strong>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {status.engine.activeHeads.length > 0 ? (
                      status.engine.activeHeads.map((head) => (
                        <Badge 
                          key={head} 
                          variant={selectedHead === head ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => getHeadDetails(head)}
                        >
                          {head}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No active heads</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>📡 Event System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Listeners:</strong> {status.system.eventEmitter.listenersCount}</div>
                  <div><strong>Events Emitted:</strong> {status.system.eventEmitter.eventsEmitted}</div>
                  <div><strong>History Size:</strong> {status.system.eventEmitter.eventHistorySize}</div>
                  <div><strong>Registered Events:</strong> {status.system.eventEmitter.registeredEvents}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎣 Hook System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Hooks Count:</strong> {status.system.hookManager.hooksCount}</div>
                  <div><strong>Filters:</strong> {status.system.hookManager.filtersCount}</div>
                  <div><strong>Actions:</strong> {status.system.hookManager.actionsCount}</div>
                  <div><strong>Avg Execution:</strong> {status.system.hookManager.averageExecutionTime.toFixed(2)}ms</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📚 Registry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Registered Plugins:</strong> {status.system.registry.registeredPlugins}</div>
                  <div><strong>Active Plugins:</strong> {status.system.registry.activePlugins}</div>
                  <div><strong>Dependency Issues:</strong> {status.system.registry.dependencyIssues.length}</div>
                  <div><strong>Capabilities:</strong> {status.system.registry.capabilities.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>⚡ Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Memory Usage:</strong> {status.system.performance.memoryUsage.toFixed(2)}MB</div>
                  <div><strong>Avg Event Time:</strong> {status.system.performance.averageEventTime.toFixed(2)}ms</div>
                  <div><strong>Avg Hook Time:</strong> {status.system.performance.averageHookTime.toFixed(2)}ms</div>
                  <div><strong>Database:</strong> {status.database.connected ? '✅ Connected' : '❌ Disconnected'}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heads">
            <Card>
              <CardHeader>
                <CardTitle>🐉 Active Heads Details</CardTitle>
                <CardDescription>
                  Click on a head to see detailed information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedHead && headStatus ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{selectedHead}</h3>
                      <Badge variant={headStatus.loaded ? "default" : "secondary"}>
                        {headStatus.loaded ? "Loaded" : "Not Loaded"}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <strong>Type:</strong> {headStatus.type}
                    </div>
                    
                    <div>
                      <strong>Theme:</strong> {headStatus.theme}
                    </div>
                    
                    <div>
                      <strong>Capabilities:</strong>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {headStatus.capabilities.map((capability) => (
                          <Badge key={capability} variant="outline">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <strong>Active Features:</strong>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {headStatus.activeFeatures.map((feature) => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <details className="mt-4">
                      <summary className="cursor-pointer font-medium">Configuration</summary>
                      <pre className="mt-2 text-sm bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(headStatus.config, null, 2)}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Select a head from the Engine tab to view details
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}