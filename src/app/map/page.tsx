"use client"

import { useState } from "react";
import { mockZones } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Map as MapIcon, 
  Droplets, 
  Thermometer, 
  Waves, 
  Zap, 
  Info,
  Maximize2,
  Minimize2,
  Pipette
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Map hydration level to colors as requested
const getStatusColor = (thirstLevel: string, status: string) => {
  if (status === 'Offline') return 'fill-neutral-900 stroke-neutral-700'; // Black
  if (thirstLevel === 'URGENT') return 'fill-destructive/40 stroke-destructive'; // Red
  if (thirstLevel === 'NORMAL') return 'fill-emerald-500/40 stroke-emerald-500'; // Green
  if (thirstLevel === 'SKIP') return 'fill-amber-500/40 stroke-amber-500'; // Orange
  if (thirstLevel === 'LOW') return 'fill-emerald-500/20 stroke-emerald-400'; // Green
  return 'fill-neutral-900 stroke-neutral-700'; // Default black for unequipped
};

export default function SystemMapPage() {
  const [zoom, setZoom] = useState(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Simulation of a 5th area that is "Unequipped"
  const unequippedArea = {
    id: 'zone-5',
    name: 'Storage Shed & Buffer',
    points: "600,100 750,150 750,300 600,350 500,250",
    color: 'fill-neutral-900 stroke-neutral-700'
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Architectural Map</h1>
          <p className="text-muted-foreground font-body mt-1">2D layout of zones, sensors, and distribution infrastructure.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}><Minimize2 className="size-4" /></Button>
           <span className="text-xs font-bold w-12 text-center">{Math.round(zoom * 100)}%</span>
           <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(2, zoom + 0.1))}><Maximize2 className="size-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Map Viewport */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-card overflow-hidden h-[600px] relative">
          <CardContent className="p-0 h-full flex items-center justify-center bg-muted/20">
            <motion.svg 
              viewBox="0 0 800 600" 
              className="w-full h-full drop-shadow-2xl"
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Plot Background Boundary */}
              <rect x="50" y="50" width="700" height="500" rx="20" fill="currentColor" className="text-background/50" />
              
              {/* Distribution Pipes (Background Infrastructure) */}
              <path 
                d="M400,550 V300 H100 M400,300 H700 M400,300 V100" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="4" 
                strokeDasharray="8 4"
                className="opacity-30"
              />
              <circle cx="400" cy="550" r="8" fill="hsl(var(--primary))" className="animate-pulse" />

              {/* Zone 1: Front Garden (Rectangle) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <polygon 
                      points="100,100 350,100 350,250 100,250" 
                      className={`cursor-pointer transition-all duration-300 hover:opacity-80 ${getStatusColor(mockZones[0].thirstLevel, mockZones[0].status)}`}
                      strokeWidth="2"
                      onClick={() => setSelectedZone(mockZones[0].id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{mockZones[0].name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 2: Backyard Orchard (Circle-ish Polygon) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <circle 
                      cx="550" cy="450" r="100" 
                      className={`cursor-pointer transition-all duration-300 hover:opacity-80 ${getStatusColor(mockZones[1].thirstLevel, mockZones[1].status)}`}
                      strokeWidth="2"
                      onClick={() => setSelectedZone(mockZones[1].id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{mockZones[1].name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 3: Vegetable Patch (Hexagon) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <polygon 
                      points="100,400 200,350 300,400 300,500 200,550 100,500" 
                      className={`cursor-pointer transition-all duration-300 hover:opacity-80 ${getStatusColor(mockZones[2].thirstLevel, mockZones[2].status)}`}
                      strokeWidth="2"
                      onClick={() => setSelectedZone(mockZones[2].id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{mockZones[2].name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 4: Side Lawn (Square) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <rect 
                      x="400" y="100" width="150" height="150" 
                      className={`cursor-pointer transition-all duration-300 hover:opacity-80 ${getStatusColor(mockZones[3].thirstLevel, mockZones[3].status)}`}
                      strokeWidth="2"
                      onClick={() => setSelectedZone(mockZones[3].id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{mockZones[3].name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Area 5: Unequipped (Polygonal) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <polygon 
                      points={unequippedArea.points}
                      className={`cursor-pointer transition-all duration-300 hover:opacity-80 ${unequippedArea.color}`}
                      strokeWidth="2"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{unequippedArea.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Sensor Markers */}
              <g className="sensors">
                {/* Zone 1 Sensor */}
                <circle cx="225" cy="175" r="5" fill="white" stroke="black" strokeWidth="1" />
                <text x="235" y="180" className="text-[10px] fill-muted-foreground font-bold">S1</text>
                
                {/* Zone 2 Sensor */}
                <circle cx="550" cy="450" r="5" fill="white" stroke="black" strokeWidth="1" />
                <text x="560" y="455" className="text-[10px] fill-muted-foreground font-bold">S2</text>
                
                {/* Zone 3 Sensor */}
                <circle cx="200" cy="450" r="5" fill="white" stroke="black" strokeWidth="1" />
                <text x="210" y="455" className="text-[10px] fill-muted-foreground font-bold">S3</text>
              </g>

            </motion.svg>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 p-4 bg-background/90 backdrop-blur-md rounded-xl border shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <Pipette className="size-3" /> Map Legend
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
                <span className="text-xs">Well-Watered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-amber-500/40 border border-amber-500" />
                <span className="text-xs">Transitioning</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-destructive/40 border border-destructive" />
                <span className="text-xs">Immediate Need</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-neutral-900 border border-neutral-700" />
                <span className="text-xs">No System</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="size-5 text-primary" /> Zone Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedZone ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xl">{mockZones.find(z => z.id === selectedZone)?.name}</h3>
                    <p className="text-sm text-muted-foreground">{mockZones.find(z => z.id === selectedZone)?.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Moisture</p>
                      <p className="text-lg font-bold">{mockZones.find(z => z.id === selectedZone)?.soilMoisture}%</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Status</p>
                      <Badge variant="outline" className="mt-1">{mockZones.find(z => z.id === selectedZone)?.status}</Badge>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <a href={`/zones/${selectedZone}`}>Open Control Panel</a>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <MapIcon className="size-12 text-muted/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground italic">Click a zone on the map to see real-time data.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Waves className="size-4" /> Pipe Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs opacity-90 leading-relaxed">
                The dashed lines represent underground HDPE piping. The main feed originates from the southern pump station (Valve #0).
              </p>
              <div className="mt-4 p-3 bg-white/10 rounded-lg flex items-center justify-between">
                <span className="text-xs font-bold uppercase">Main Flow</span>
                <span className="text-sm font-bold">2.4 bar</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
