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

// Enhanced water particle strictly following a path via id
const WaterParticle = ({ pathId, delay = 0, duration = 2, size = 5 }: { 
  pathId: string; 
  delay?: number; 
  duration?: number;
  size?: number;
}) => (
  <g className="water-particle">
    <circle r={size} fill="#ffffff">
      <animateMotion 
        dur={`${duration}s`} 
        begin={`${delay}s`} 
        repeatCount="indefinite"
        keyPoints="0;1"
        keyTimes="0;1"
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
    <circle r={size * 1.5} fill="#60a5fa" opacity="0.4">
      <animateMotion 
        dur={`${duration}s`} 
        begin={`${delay}s`} 
        repeatCount="indefinite"
        keyPoints="0;1"
        keyTimes="0;1"
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  </g>
);

export function SystemMapSvg({ zoom, isFlowing, flowSpeed, zones, selectedZone, setSelectedZone, hoveredZone, setHoveredZone }: SystemMapSvgProps) {
  // Coordinates for the 4 sensor nodes
  const sensorNodes = [
    { id: 'S1', zoneId: zones[0]?.id, x: 200, y: 150 },
    { id: 'S4', zoneId: zones[3]?.id, x: 200, y: 350 },
    { id: 'S3', zoneId: zones[2]?.id, x: 200, y: 550 },
    { id: 'S2', zoneId: zones[1]?.id, x: 475, y: 500 },
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
        {/* HIGH INTENSITY PIPE GRADIENTS */}
        <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="15%" stopColor="#2563eb" />
          <stop offset="35%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="65%" stopColor="#3b82f6" />
          <stop offset="85%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Specular highlight for professional look */}
        <linearGradient id="pipe-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#dbeafe" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#dbeafe" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.95" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="pipe-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
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
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.3" />
      </pattern>
      <rect width="900" height="700" fill="url(#grid)" />

      {/* PLOT BOUNDARY */}
      <path 
        d="M 50,50 L 350,50 L 350,350 L 600,350 L 600,50 L 850,50 L 850,650 L 50,650 Z"
        fill="#ffffff" 
        stroke="#94a3b8" 
        strokeWidth="3"
        filter="url(#zone-shadow)"
        className="dark:fill-slate-950 dark:stroke-slate-600"
      />

      {/* PIPE NETWORK LAYER */}
      <g className="pipes" strokeLinecap="round" strokeLinejoin="round">
        {/* Primary Trunk Line Path */}
        <path id="trunk-pipe" d="M 200,680 L 200,50" stroke="#3b82f6" strokeWidth="24" fill="none" filter="url(#pipe-glow)" opacity="0.25" />
        <path d="M 200,680 L 200,50" stroke="url(#pipe-gradient)" strokeWidth="18" fill="none" />
        <path d="M 200,680 L 200,50" stroke="url(#pipe-highlight)" strokeWidth="8" fill="none" opacity="0.8" />

        {/* Primary Horizontal Branch Path */}
        <path id="horizontal-branch" d="M 200,450 L 600,450" stroke="#3b82f6" strokeWidth="22" fill="none" filter="url(#pipe-glow)" opacity="0.25" />
        <path d="M 200,450 L 600,450" stroke="url(#pipe-gradient)" strokeWidth="16" fill="none" />
        <path d="M 200,450 L 600,450" stroke="url(#pipe-highlight)" strokeWidth="7" fill="none" opacity="0.8" />

        {/* Zone Sub-branches */}
        <path id="branch-z1-main" d="M 200,100 L 100,100" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />
        <path id="branch-z4-main" d="M 200,300 L 100,300" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />
        <path id="branch-z3-main" d="M 200,550 L 100,550" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />
        <path id="branch-z2-main" d="M 400,450 L 400,550" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />

        {/* Junction Manifolds */}
        <g transform="translate(200, 450)">
          <circle r="22" fill="url(#pulse-gradient)" opacity="0.7" className="animate-pulse-glow" />
          <circle r="14" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3.5" />
        </g>
        <circle cx="200" cy="100" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="200" cy="300" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="200" cy="550" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="400" cy="450" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />

        {/* FLOW ANIMATIONS - STRICTLY FOLLOWING ARCHITECTURAL IDS */}
        {isFlowing && (
          <g className="flow-animations" filter="url(#particle-glow)">
            <WaterParticle pathId="trunk-pipe" delay={0} duration={2.5 / flowSpeed} size={6} />
            <WaterParticle pathId="horizontal-branch" delay={0.3} duration={2 / flowSpeed} size={6} />
            <WaterParticle pathId="branch-z1-main" delay={0.2} duration={1.5 / flowSpeed} size={5.5} />
            <WaterParticle pathId="branch-z4-main" delay={0.4} duration={1.5 / flowSpeed} size={5.5} />
            <WaterParticle pathId="branch-z3-main" delay={0.6} duration={1.5 / flowSpeed} size={5.5} />
            <WaterParticle pathId="branch-z2-main" delay={0.5} duration={1.5 / flowSpeed} size={5.5} />
          </g>
        )}
      </g>

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
                <g 
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedZone(z.id)}
                  onMouseEnter={() => setHoveredZone(z.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{ 
                    filter: hoveredZone === z.id ? styles.glow : 'url(#zone-shadow)',
                    transform: hoveredZone === z.id ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: `${z.ox}px ${z.oy}px`
                  }}
                >
                  <rect 
                    x={z.x} y={z.y} width={z.w} height={z.h} rx="8"
                    fill={styles.fill} 
                    stroke={styles.stroke} 
                    strokeWidth={hoveredZone === z.id ? 4 : styles.strokeWidth}
                    opacity="0.8"
                  />
                  <g transform={`translate(${z.x + z.w - 25}, ${z.y + 20})`}>
                    <CircleDot className="size-5" stroke={styles.stroke} strokeWidth="2" fill={styles.stroke} />
                  </g>
                  <text x={z.ox} y={z.oy - 5} className="text-sm font-bold fill-slate-800 dark:fill-slate-100 pointer-events-none" textAnchor="middle">
                    {zoneData.name}
                  </text>
                  <text x={z.ox} y={z.oy + 15} className="text-xs fill-slate-600 dark:fill-slate-400 pointer-events-none" textAnchor="middle">
                    {zoneData.area}
                  </text>
                </g>
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

        {/* INTERACTIVE SENSOR NODES */}
        <g className="sensors">
          {sensorNodes.map((sensor) => {
            const zoneData = zones.find(z => z.id === sensor.zoneId);
            return (
              <Tooltip key={sensor.id}>
                <TooltipTrigger asChild>
                  <g transform={`translate(${sensor.x}, ${sensor.y})`} className="cursor-help">
                    <circle r="16" fill="white" className="drop-shadow-lg opacity-0 hover:opacity-100 transition-opacity" />
                    <circle r="14" fill="white" stroke="#2563eb" strokeWidth="3" className="drop-shadow-md" />
                    <circle r="10" fill="#dbeafe" />
                    <Droplets className="size-5 text-blue-600" x="-2.5" y="-2.5" />
                    <text y="22" x="0" className="text-[10px] font-black fill-blue-600 dark:fill-blue-400" textAnchor="middle">{sensor.id}</text>
                    <circle r="14" fill="none" stroke="#2563eb" strokeWidth="1" className="animate-ping opacity-20" />
                  </g>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl min-w-[180px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-black text-blue-600 dark:text-blue-400 text-sm tracking-tighter">NODE {sensor.id}</span>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold border-blue-200 text-blue-600">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Activity className="size-3" /> Moisture
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{zoneData?.soilMoisture || '--'}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Thermometer className="size-3" /> Temperature
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{zoneData?.temperature || '--'}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Signal className="size-3" /> Signal
                        </span>
                        <span className="text-sm font-bold text-emerald-500">-64 dBm</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t text-[9px] text-slate-400 font-medium italic">
                      Last pulse: 2.4s ago
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </g>
      </TooltipProvider>

      {/* PRIMARY WATER SOURCE */}
      <g transform="translate(200, 685)">
        <circle r="20" fill="#1e40af" stroke="#60a5fa" strokeWidth="4" className="drop-shadow-xl" />
        <circle r="14" fill="url(#hub-gradient)" />
        <Waves className="size-7 text-white" x="-3.5" y="-3.5" />
      </g>
    </motion.svg>
  );
}