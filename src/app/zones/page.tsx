
"use client"

import { mockZones } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Settings2, 
  Thermometer, 
  ArrowUpRight,
  Info,
  Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mapping mock zones to visual positions and dimensions for the canvas
const zoneLayouts: Record<string, { x: number, y: number, w: number, h: number, rx: number }> = {
  "zone-1": { x: 50, y: 50, w: 300, h: 200, rx: 12 },    // Front Garden
  "zone-2": { x: 400, y: 50, w: 350, h: 350, rx: 12 },   // Backyard Orchard
  "zone-3": { x: 50, y: 300, w: 300, h: 250, rx: 12 },   // Vegetable Patch
  "zone-4": { x: 400, y: 430, w: 350, h: 120, rx: 12 },  // Side Lawn
};

export default function ZonesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Garden Visualization</h1>
          <p className="text-muted-foreground font-body mt-1">Interactive layout of your automated irrigation network.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Info className="mr-2 size-4" /> Help
          </Button>
          <Button className="bg-primary">
            <Plus className="mr-2 size-4" /> Add Zone
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Canvas Area */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-slate-100/50 overflow-hidden min-h-[500px] relative">
          <CardHeader className="bg-white/80 backdrop-blur-sm border-b z-10 relative">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Live Garden Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex items-center justify-center h-full min-h-[600px]">
            <svg 
              viewBox="0 0 800 600" 
              className="w-full h-full max-w-4xl drop-shadow-2xl"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background/Fence/Grass area */}
              <rect x="0" y="0" width="800" height="600" fill="#f8fafc" rx="20" />
              <path d="M0 0 L800 0 L800 600 L0 600 Z" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="10 10" />

              {mockZones.map((zone) => {
                const layout = zoneLayouts[zone.id] || { x: 0, y: 0, w: 100, h: 100, rx: 8 };
                const isWatering = zone.status === 'Watering';
                const isWarning = zone.status === 'Warning';
                
                return (
                  <Link key={zone.id} href={`/zones/${zone.id}`} className="group cursor-pointer">
                    {/* Zone Shape */}
                    <rect 
                      x={layout.x} 
                      y={layout.y} 
                      width={layout.w} 
                      height={layout.h} 
                      rx={layout.rx}
                      className={cn(
                        "transition-all duration-300 stroke-2",
                        isWatering ? "fill-primary/10 stroke-primary" : 
                        isWarning ? "fill-destructive/5 stroke-destructive animate-pulse" : 
                        "fill-emerald-50 stroke-emerald-200 group-hover:fill-emerald-100 group-hover:stroke-emerald-400"
                      )}
                    />
                    
                    {/* Water Pulse Animation */}
                    {isWatering && (
                      <rect 
                        x={layout.x} 
                        y={layout.y} 
                        width={layout.w} 
                        height={layout.h} 
                        rx={layout.rx}
                        className="fill-primary/20 animate-ping opacity-20 pointer-events-none"
                      />
                    )}

                    {/* Zone Label */}
                    <g transform={`translate(${layout.x + 15}, ${layout.y + 30})`}>
                      <text className="font-bold text-xs fill-slate-700 pointer-events-none">
                        {zone.name}
                      </text>
                      <text y="18" className="text-[10px] fill-slate-400 font-medium pointer-events-none">
                        {zone.type} • {zone.soilMoisture}%
                      </text>
                    </g>

                    {/* Status Indicator Dot */}
                    <circle 
                      cx={layout.x + layout.w - 15} 
                      cy={layout.y + 15} 
                      r="4" 
                      className={cn(
                        isWatering ? "fill-primary animate-bounce" : 
                        isWarning ? "fill-destructive" : 
                        "fill-emerald-500"
                      )}
                    />

                    {/* Visualizing Sprinklers/Drip lines for Detail */}
                    {zone.type === 'Sprinkler' && (
                      <circle cx={layout.x + layout.w/2} cy={layout.y + layout.h/2} r="10" className="fill-slate-200 opacity-30" />
                    )}
                  </Link>
                );
              })}
            </svg>
          </CardContent>
        </Card>

        {/* Legend and Summary Stats */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Map Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded bg-primary/20 border-2 border-primary" />
                <span className="text-sm font-medium">Currently Irrigating</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-4 rounded bg-destructive/10 border-2 border-destructive" />
                <span className="text-sm font-medium">System Alert</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-4 rounded bg-emerald-50 border-2 border-emerald-200" />
                <span className="text-sm font-medium">Idle / Optimal</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Zone Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockZones.map((zone) => (
                  <Link key={zone.id} href={`/zones/${zone.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{zone.name}</p>
                      <div className="flex items-center gap-2">
                        <Droplets className="size-3 text-primary" />
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">{zone.soilMoisture}% Moisture</span>
                      </div>
                    </div>
                    <Badge variant={zone.status === 'Watering' ? 'default' : 'outline'} className="text-[10px]">
                      {zone.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold" asChild>
             <Link href="/analytics">
                Full System Analytics <ArrowUpRight className="ml-2 size-4" />
             </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
