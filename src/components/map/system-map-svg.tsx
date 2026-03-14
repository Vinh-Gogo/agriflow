"use client"

import { motion } from "framer-motion";
import { CircleDot, Droplets, Waves, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapZone, getStatusStyles } from "@/lib/map-data";

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

// Enhanced water particle with trail effect
const WaterParticle = ({ pathId, delay = 0, duration = 2, size = 5 }: { 
  pathId: string; 
  delay?: number; 
  duration?: number;
  size?: number;
}) => (
  <g className="water-particle">
    {/* Main bright particle */}
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
    {/* Glow halo */}
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
    {/* Trail particle */}
    <circle r={size * 0.5} fill="#93c5fd" opacity="0.7">
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

// Flow direction arrow marker
const FlowArrow = ({ x, y, rotation, pulseDelay = 0 }: { 
  x: number; 
  y: number; 
  rotation: number;
  pulseDelay?: number;
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
    <polygon points="-6,-4 6,0 -6,4" fill="#ffffff" opacity="0.9">
      <animate 
        attributeName="opacity" 
        values="0.4;1;0.4" 
        dur="1.5s" 
        begin={`${pulseDelay}s`}
        repeatCount="indefinite" 
      />
    </polygon>
  </g>
);

export function SystemMapSvg({ zoom, isFlowing, flowSpeed, zones, selectedZone, setSelectedZone, hoveredZone, setHoveredZone }: SystemMapSvgProps) {
  const unequippedArea = {
    id: 'zone-5',
    name: 'Kho Bãi & Vùng Đệm',
    description: 'Khu vực chưa lắp đặt hệ thống tưới tự động',
  };

  return (
    <motion.svg 
      viewBox="0 0 900 700" 
      className="w-full h-full"
      animate={{ scale: zoom }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformOrigin: 'center center' }}
    >
      <defs>
        {/* Zone Gradients */}
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

        {/* ENHANCED BRIGHT BLUE PIPE GRADIENT - ULTRA VIBRANT */}
        <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="15%" stopColor="#2563eb" />
          <stop offset="35%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="65%" stopColor="#3b82f6" />
          <stop offset="85%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Inner highlight for 3D liquid effect */}
        <linearGradient id="pipe-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#dbeafe" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#dbeafe" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.95" />
        </linearGradient>

        {/* High-intensity outer glow for pipe visibility */}
        <filter id="pipe-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Stronger glow for flow particles */}
        <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="zone-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.3" />
        </filter>

        <radialGradient id="hub-gradient">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </radialGradient>

        {/* Animated pulse ring for junctions */}
        <radialGradient id="pulse-gradient">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Grid */}
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.3" />
      </pattern>
      <rect width="900" height="700" fill="url(#grid)" />

      {/* Plot Boundary */}
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
        
        {/* === MAIN TRUNK PIPE (Vertical - Water Source to Top) === */}
        {/* Outer glow layer - High visibility */}
        <path 
          id="trunk-pipe" 
          d="M 200,680 L 200,50" 
          stroke="#3b82f6" 
          strokeWidth="24" 
          fill="none" 
          filter="url(#pipe-glow)"
          opacity="0.25"
        />
        {/* Main pipe body */}
        <path 
          d="M 200,680 L 200,50" 
          stroke="url(#pipe-gradient)" 
          strokeWidth="18" 
          fill="none"
        />
        {/* Specular highlight for liquid effect */}
        <path 
          d="M 200,680 L 200,50" 
          stroke="url(#pipe-highlight)" 
          strokeWidth="8" 
          fill="none"
          opacity="0.8"
        />
        {/* Pipe edge lines for crisp definition */}
        <path d="M 209,680 L 209,50" stroke="#1e3a8a" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M 191,680 L 191,50" stroke="#1e3a8a" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* === HORIZONTAL DISTRIBUTION BRANCH === */}
        <path 
          id="horizontal-branch" 
          d="M 200,450 L 600,450" 
          stroke="#3b82f6" 
          strokeWidth="22" 
          fill="none" 
          filter="url(#pipe-glow)"
          opacity="0.25"
        />
        <path 
          d="M 200,450 L 600,450" 
          stroke="url(#pipe-gradient)" 
          strokeWidth="16" 
          fill="none"
        />
        <path 
          d="M 200,450 L 600,450" 
          stroke="url(#pipe-highlight)" 
          strokeWidth="7" 
          fill="none"
          opacity="0.8"
        />
        <path d="M 200,442 L 600,442" stroke="#1e3a8a" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M 200,458 L 600,458" stroke="#1e3a8a" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* === ZONE 1 BRANCHES (Top Left - Vegetable) === */}
        <path id="branch-z1-main" d="M 200,100 L 100,100" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />
        <path d="M 200,100 L 100,100" stroke="url(#pipe-highlight)" strokeWidth="5" fill="none" opacity="0.8" />
        
        <path id="branch-z1-sub1" d="M 100,100 L 100,150" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path d="M 100,100 L 100,150" stroke="url(#pipe-highlight)" strokeWidth="4" fill="none" opacity="0.8" />
        
        <path id="branch-z1-sub2" d="M 100,100 L 250,100" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path d="M 100,100 L 250,100" stroke="url(#pipe-highlight)" strokeWidth="4" fill="none" opacity="0.8" />

        {/* === ZONE 4 BRANCHES (Middle Left - Lawn) === */}
        <path id="branch-z4-main" d="M 200,300 L 100,300" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />
        <path d="M 200,300 L 100,300" stroke="url(#pipe-highlight)" strokeWidth="5" fill="none" opacity="0.8" />
        
        <path id="branch-z4-sub1" d="M 100,300 L 100,350" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path d="M 100,300 L 100,350" stroke="url(#pipe-highlight)" strokeWidth="4" fill="none" opacity="0.8" />

        {/* === ZONE 3 BRANCHES (Bottom Left - Flower) === */}
        <path id="branch-z3-main" d="M 200,550 L 100,550" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />
        <path d="M 200,550 L 100,550" stroke="url(#pipe-highlight)" strokeWidth="5" fill="none" opacity="0.8" />
        
        <path id="branch-z3-sub1" d="M 100,550 L 100,600" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path d="M 100,550 L 100,600" stroke="url(#pipe-highlight)" strokeWidth="4" fill="none" opacity="0.8" />

        {/* === ZONE 2 BRANCHES (Right - Orchard) === */}
        <path id="branch-z2-main" d="M 400,450 L 400,550" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />
        <path d="M 400,450 L 400,550" stroke="url(#pipe-highlight)" strokeWidth="5" fill="none" opacity="0.8" />
        
        <path id="branch-z2-sub1" d="M 400,550 L 350,550" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path d="M 400,550 L 350,550" stroke="url(#pipe-highlight)" strokeWidth="4" fill="none" opacity="0.8" />
        
        <path id="branch-z2-v1" d="M 500,450 L 500,600" stroke="url(#pipe-gradient)" strokeWidth="12" fill="none" />
        <path d="M 500,450 L 500,600" stroke="url(#pipe-highlight)" strokeWidth="5" fill="none" opacity="0.8" />

        {/* === JUNCTION HUBS with Pulse Animation === */}
        {/* Main junction */}
        <g transform="translate(200, 450)">
          <circle r="22" fill="url(#pulse-gradient)" opacity="0.7">
            <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="14" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3.5" />
          <circle r="6" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Other junctions */}
        <circle cx="200" cy="100" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="200" cy="300" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="200" cy="550" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="400" cy="450" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="500" cy="450" r="13" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="100" cy="100" r="11" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="100" cy="300" r="11" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="100" cy="550" r="11" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="2.5" />

        {/* === FLOW DIRECTION ARROWS === */}
        {isFlowing && (
          <g className="flow-directions" opacity="0.95">
            {/* Trunk pipe - Flow UP */}
            <FlowArrow x={200} y={600} rotation={-90} pulseDelay={0} />
            <FlowArrow x={200} y={500} rotation={-90} pulseDelay={0.3} />
            <FlowArrow x={200} y={400} rotation={-90} pulseDelay={0.6} />
            <FlowArrow x={200} y={300} rotation={-90} pulseDelay={0.9} />
            <FlowArrow x={200} y={200} rotation={-90} pulseDelay={1.2} />
            <FlowArrow x={200} y={100} rotation={-90} pulseDelay={1.5} />

            {/* Horizontal branch - Flow RIGHT */}
            <FlowArrow x={300} y={450} rotation={0} pulseDelay={0.2} />
            <FlowArrow x={450} y={450} rotation={0} pulseDelay={0.5} />
            <FlowArrow x={550} y={450} rotation={0} pulseDelay={0.8} />

            {/* Zone 1 branch - Flow LEFT */}
            <FlowArrow x={150} y={100} rotation={180} pulseDelay={0.4} />
            <FlowArrow x={100} y={125} rotation={90} pulseDelay={0.6} />

            {/* Zone 4 branch - Flow LEFT */}
            <FlowArrow x={150} y={300} rotation={180} pulseDelay={0.5} />
            <FlowArrow x={100} y={325} rotation={90} pulseDelay={0.7} />

            {/* Zone 3 branch - Flow LEFT */}
            <FlowArrow x={150} y={550} rotation={180} pulseDelay={0.6} />
            <FlowArrow x={100} y={575} rotation={90} pulseDelay={0.8} />

            {/* Zone 2 branch - Flow DOWN */}
            <FlowArrow x={400} y={500} rotation={90} pulseDelay={0.5} />
            <FlowArrow x={500} y={525} rotation={90} pulseDelay={0.7} />
          </g>
        )}

        {/* === WATER FLOW PARTICLES - BRIGHT WHITE/SKY === */}
        {isFlowing && (
          <g className="flow-animations" filter="url(#particle-glow)">
            {/* Trunk pipe particles */}
            <WaterParticle pathId="trunk-pipe" delay={0} duration={2.5 / flowSpeed} size={6} />
            <WaterParticle pathId="trunk-pipe" delay={0.6} duration={2.5 / flowSpeed} size={5.5} />
            <WaterParticle pathId="trunk-pipe" delay={1.2} duration={2.5 / flowSpeed} size={6} />
            <WaterParticle pathId="trunk-pipe" delay={1.8} duration={2.5 / flowSpeed} size={5} />

            {/* Horizontal branch particles */}
            <WaterParticle pathId="horizontal-branch" delay={0.3} duration={2 / flowSpeed} size={6} />
            <WaterParticle pathId="horizontal-branch" delay={1} duration={2 / flowSpeed} size={5.5} />
            <WaterParticle pathId="horizontal-branch" delay={1.7} duration={2 / flowSpeed} size={6} />

            {/* Branch particles */}
            <WaterParticle pathId="branch-z1-main" delay={0.2} duration={1.5 / flowSpeed} size={5.5} />
            <WaterParticle pathId="branch-z1-sub1" delay={0.5} duration={1.2 / flowSpeed} size={5} />
            <WaterParticle pathId="branch-z1-sub2" delay={0.8} duration={1.3 / flowSpeed} size={5} />

            <WaterParticle pathId="branch-z4-main" delay={0.4} duration={1.5 / flowSpeed} size={5.5} />
            <WaterParticle pathId="branch-z4-sub1" delay={0.9} duration={1.2 / flowSpeed} size={5} />

            <WaterParticle pathId="branch-z3-main" delay={0.6} duration={1.5 / flowSpeed} size={5.5} />
            <WaterParticle pathId="branch-z3-sub1" delay={1.1} duration={1.2 / flowSpeed} size={5} />

            <WaterParticle pathId="branch-z2-main" delay={0.5} duration={1.5 / flowSpeed} size={5.5} />
            <WaterParticle pathId="branch-z2-sub1" delay={1} duration={1.2 / flowSpeed} size={5} />
            <WaterParticle pathId="branch-z2-v1" delay={0.7} duration={1.4 / flowSpeed} size={5.5} />
          </g>
        )}

        {/* Valve indicators at zone entries */}
        <g className="valves" opacity="0.95">
          <rect x="92" y="94" width="16" height="12" rx="3" fill="#1e3a8a" stroke="#ffffff" strokeWidth="2" className="drop-shadow-lg" />
          <rect x="92" y="294" width="16" height="12" rx="3" fill="#1e3a8a" stroke="#ffffff" strokeWidth="2" className="drop-shadow-lg" />
          <rect x="92" y="544" width="16" height="12" rx="3" fill="#1e3a8a" stroke="#ffffff" strokeWidth="2" className="drop-shadow-lg" />
          <rect x="392" y="544" width="16" height="12" rx="3" fill="#1e3a8a" stroke="#ffffff" strokeWidth="2" className="drop-shadow-lg" />
          <rect x="492" y="544" width="16" height="12" rx="3" fill="#1e3a8a" stroke="#ffffff" strokeWidth="2" className="drop-shadow-lg" />
        </g>
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
                  />
                  {/* Zone pattern overlay */}
                  <g stroke="currentColor" strokeWidth="0.5" opacity="0.12" className="pointer-events-none">
                    {[...Array(4)].map((_, i) => (
                      <line key={`h-${z.id}-${i}`} x1={z.x + 10} y1={z.y + 20 + i * 45} x2={z.x + z.w - 10} y2={z.y + 20 + i * 45} />
                    ))}
                  </g>
                  {/* Zone status indicator */}
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
                <p className="font-bold">{zoneData.name}</p>
                <p className="text-xs">{zoneData.crop}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Unequipped Area */}
        <Tooltip>
          <TooltipTrigger asChild>
            <g 
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('zone-5')}
              onMouseLeave={() => setHoveredZone(null)}
            >
              <rect 
                x="600" y="50" width="250" height="600" rx="8" 
                fill="url(#pattern-soil)" 
                stroke="#52525b" 
                strokeWidth={hoveredZone === 'zone-5' ? 4 : 2} 
              />
              <text x="725" y="340" className="text-sm font-bold fill-slate-400 pointer-events-none" textAnchor="middle">
                {unequippedArea.name}
              </text>
              <text x="725" y="360" className="text-xs fill-slate-500 pointer-events-none" textAnchor="middle">
                Chưa kết nối ống
              </text>
            </g>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="font-bold">{unequippedArea.name}</p>
            <p className="text-xs">{unequippedArea.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* SENSORS LAYER */}
      <g className="sensors">
        <g transform="translate(200, 150)">
          <circle r="14" fill="white" stroke="#2563eb" strokeWidth="3" className="drop-shadow-lg" />
          <circle r="10" fill="#dbeafe" />
          <Droplets className="size-5 text-blue-600" x="-2.5" y="-2.5" />
          <text y="18" x="0" className="text-[8px] font-bold fill-blue-600" textAnchor="middle">S1</text>
        </g>
        <g transform="translate(475, 500)">
          <circle r="14" fill="white" stroke="#2563eb" strokeWidth="3" className="drop-shadow-lg" />
          <circle r="10" fill="#dbeafe" />
          <Droplets className="size-5 text-blue-600" x="-2.5" y="-2.5" />
          <text y="18" x="0" className="text-[8px] font-bold fill-blue-600" textAnchor="middle">S2</text>
        </g>
        <g transform="translate(200, 350)">
          <circle r="14" fill="white" stroke="#2563eb" strokeWidth="3" className="drop-shadow-lg" />
          <circle r="10" fill="#dbeafe" />
          <Droplets className="size-5 text-blue-600" x="-2.5" y="-2.5" />
          <text y="18" x="0" className="text-[8px] font-bold fill-blue-600" textAnchor="middle">S3</text>
        </g>
      </g>

      {/* WATER SOURCE ENTRY POINT */}
      <g transform="translate(200, 685)">
        <circle r="20" fill="#1e40af" stroke="#60a5fa" strokeWidth="4" className="drop-shadow-xl" />
        <circle r="14" fill="url(#hub-gradient)" />
        <Waves className="size-7 text-white" x="-3.5" y="-3.5" />
        <text y="26" x="0" className="text-[9px] font-bold fill-blue-700 dark:fill-blue-400" textAnchor="middle">
          NGUỒN
        </text>
      </g>
    </motion.svg>
  );
}
