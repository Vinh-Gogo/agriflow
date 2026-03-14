
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  CloudRain
} from "lucide-react";
import { mockZones, mockAlerts } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const activeWateringCount = mockZones.filter(z => z.status === 'Watering').length;
  const avgMoisture = Math.round(mockZones.reduce((acc, z) => acc + z.soilMoisture, 0) / mockZones.length);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">System Overview</h1>
        <p className="text-muted-foreground font-body mt-1">Real-time status of your HydroSense Hub network.</p>
      </div>

      {/* Hero Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">System Health</CardTitle>
            <Activity className="size-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs opacity-70 mt-1">All gateway nodes online</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Zones</CardTitle>
            <Droplets className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeWateringCount} / {mockZones.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently being irrigated</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Soil Moisture</CardTitle>
            <Thermometer className="size-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgMoisture}%</div>
            <Progress value={avgMoisture} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weather Guard</CardTitle>
            <Wind className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Sprinklers paused (wind &gt; 5m/s)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Main Content: Zones Summary */}
        <Card className="md:col-span-4 border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b bg-slate-50/50 py-4 px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Active Zones</CardTitle>
                <CardDescription>Status of your irrigation zones.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/zones">View Map</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockZones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      zone.status === 'Watering' ? 'bg-primary/10 text-primary' : 
                      zone.status === 'Warning' ? 'bg-destructive/10 text-destructive' : 
                      'bg-slate-100 text-slate-500'
                    }`}>
                      <Droplets className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{zone.name}</p>
                      <p className="text-xs text-muted-foreground">{zone.type} Mode • {zone.lastWatered}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold">{zone.soilMoisture}% Humidity</p>
                      <Progress value={zone.soilMoisture} className="h-1 w-16 mt-1" />
                    </div>
                    <Badge variant={
                      zone.status === 'Watering' ? 'default' : 
                      zone.status === 'Warning' ? 'destructive' : 
                      'outline'
                    } className="text-[10px] uppercase font-bold">
                      {zone.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: Notifications/Alerts */}
        <Card className="md:col-span-3 border-none shadow-sm bg-white">
          <CardHeader className="border-b bg-slate-50/50 py-4 px-6">
            <CardTitle className="text-lg font-semibold">System Alerts</CardTitle>
            <CardDescription>Recent events and notifications.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="p-4 flex gap-4">
                  <div className="mt-0.5">
                    {alert.severity === 'high' ? (
                      <AlertTriangle className="size-4 text-destructive" />
                    ) : alert.severity === 'medium' ? (
                      <Activity className="size-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="size-4 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Insight Section (Place for AI Call) */}
      <Card className="border-none shadow-sm bg-accent/10 border-accent/20">
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-accent rounded">
                <CloudRain className="size-4 text-accent-foreground" />
              </div>
              <h3 className="font-bold text-lg">AI Weekly Insight</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on last week's performance, switching Zone 1 to Drip Hybrid mode could save 15% more water during high-temp peaks.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            View Analysis <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
