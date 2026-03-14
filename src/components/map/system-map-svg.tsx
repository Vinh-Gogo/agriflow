"use client"

import { motion } from "framer-motion";
import { CircleDot, Droplets, Waves, Thermometer, Activity, Signal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapZone, getStatusStyles } from "@/lib/map-data";
import { Badge } from "@/components/ui/badge";

interface SystemMapSvgProps {
  zoom: number;
  isFlowing: boolean;
  flowSpeed: number;
  zones: MapZone[];
  selectedZone: string | null;
  setSelectedZone: (id: string | null) => void;
  hoveredZone: string | null;
  setHoveredZone: (id: string | null) => void;
}


export function SystemMapSvg({ zoom, isFlowing, flowSpeed, zones, selectedZone, setSelectedZone, hoveredZone, setHoveredZone }: SystemMapSvgProps) {
  // Coordinates for the 4 sensor nodes
  const sensorNodes = [
    { id: 'S1', zoneId: zones[0]?.id, x: 0, y: 0 },
    { id: 'S4', zoneId: zones[3]?.id, x: 0, y: 200 },
    { id: 'S3', zoneId: zones[2]?.id, x: 0, y: 400 },
    { id: 'S2', zoneId: zones[1]?.id, x: 275, y: 350 },
  ];

  // Zone pipe coordinates - each zone has a main pipe with + shaped branches
  const zonePipes = [
    {
      zoneId: zones[0]?.id,
      mainPipe: { x1: 100, y1: 150, x2: 300, y2: 150 }, // Horizontal main pipe
      branch1: { x1: 200, y1: 100, x2: 200, y2: 200 }, // Vertical branch (forms +)
      branch2: { x1: 150, y1: 150, x2: 250, y2: 150 } // Secondary horizontal branch
    },
    {
      zoneId: zones[1]?.id,
      mainPipe: { x1: 350, y1: 500, x2: 600, y2: 500 }, // Horizontal main pipe
      branch1: { x1: 475, y1: 450, x2: 475, y2: 550 }, // Vertical branch (forms +)
      branch2: { x1: 425, y1: 500, x2: 525, y2: 500 } // Secondary horizontal branch
    },
    {
      zoneId: zones[2]?.id,
      mainPipe: { x1: 100, y1: 550, x2: 300, y2: 550 }, // Horizontal main pipe
      branch1: { x1: 200, y1: 500, x2: 200, y2: 600 }, // Vertical branch (forms +)
      branch2: { x1: 150, y1: 550, x2: 250, y2: 550 } // Secondary horizontal branch
    },
    {
      zoneId: zones[3]?.id,
      mainPipe: { x1: 100, y1: 350, x2: 300, y2: 350 }, // Horizontal main pipe
      branch1: { x1: 200, y1: 300, x2: 200, y2: 400 }, // Vertical branch (forms +)
      branch2: { x1: 150, y1: 350, x2: 250, y2: 350 } // Secondary horizontal branch
    }
  ];

  return (
    <motion.svg 
      viewBox="0 0 900 700" 
      className="w-full h-full"
      animate={{ scale: zoom }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformOrigin: 'center center' }}
    >
      <defs>
        {/* HIGH INTENSITY PIPE GRADIENTS - ENHANCED CYAN */}
        <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="20%" stopColor="#06b6d4" />
          <stop offset="40%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#67e8f9" />
          <stop offset="60%" stopColor="#22d3ee" />
          <stop offset="80%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>

        {/* Specular highlight - ENHANCED */}
        <linearGradient id="pipe-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="1" />
          <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="65%" stopColor="#bae6fd" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="1" />
        </linearGradient>

        {/* Glow Filters - ENHANCED */}
        <filter id="pipe-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feFlood floodColor="#06b6d4" floodOpacity="0.7" result="color" />
          <feComposite in="color" in2="blur" operator="in" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id="hub-gradient">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </radialGradient>

        <radialGradient id="pulse-gradient">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>

        {/* Zone-specific gradients and patterns */}
        <linearGradient id="gradient-healthy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#4ade80" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.85" />
        </linearGradient>
        
        <linearGradient id="gradient-urgent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ef4444" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
        </linearGradient>
        
        <linearGradient id="gradient-transition" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#fb923c" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.9" />
        </linearGradient>
        
        <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bef264" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0.8" />
        </linearGradient>
        
        <pattern id="pattern-soil" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#3f3f46" />
          <circle cx="2" cy="2" r="1" fill="#52525b" opacity="0.5" />
          <circle cx="10" cy="12" r="1.5" fill="#52525b" opacity="0.3" />
          <circle cx="18" cy="5" r="1" fill="#52525b" opacity="0.4" />
        </pattern>

        <filter id="zone-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Grid Pattern Background */}
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      </pattern>
      <rect width="900" height="700" fill="url(#grid)" />


      {/* PIPE NETWORK LAYER */}

      {/* ZONES LAYER */}
      <TooltipProvider>
        {[
          { id: zones[0]?.id, x: 50, y: 50, w: 300, h: 200, ox: 200, oy: 150 },
          { id: zones[3]?.id, x: 50, y: 250, w: 300, h: 200, ox: 200, oy: 350 },
          { id: zones[2]?.id, x: 50, y: 450, w: 300, h: 200, ox: 200, oy: 550 },
          { id: zones[1]?.id, x: 350, y: 350, w: 250, h: 300, ox: 475, oy: 500 }
        ].map(z => {
          if (!z.id) return null;
          const zoneData = zones.find(item => item.id === z.id)!;
          const styles = getStatusStyles(zoneData.thirstLevel, zoneData.status);
          return (
            <Tooltip key={z.id}>
              <TooltipTrigger asChild>
                <rect 
                  x={z.x} y={z.y} width={z.w} height={z.h} rx="8"
                  fill={styles.fill} 
                  stroke={styles.stroke} 
                  strokeWidth={styles.strokeWidth}
                  opacity="0.8"
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover text-popover-foreground p-3 rounded-xl shadow-xl border border-border">
                <div className="space-y-1">
                  <p className="font-bold">{zoneData.name}</p>
                  <p className="text-xs">{zoneData.crop}</p>
                  <Badge variant="outline" className="text-[10px] mt-1">{zoneData.soilMoisture}% Humidity</Badge>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

      </TooltipProvider>

      {/* PRIMARY WATER SOURCE */}
    </motion.svg>
  );
}