
"use client"

import { motion } from "framer-motion";
import { CircleDot, Droplets, Waves } from "lucide-react";
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

const WaterParticle = ({ pathId, delay = 0, duration = 2, size = 4 }: { 
  pathId: string; 
  delay?: number; 
  duration?: number;
  size?: number;
}) => (
  <g className="water-particle">
    <circle r={size} fill="#ffffff" opacity="0.9">
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
    <circle r={size * 0.6} fill="#93c5fd" opacity="0.6">
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

        <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="25%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>

        <linearGradient id="pipe-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
        </linearGradient>

        <filter id="pipe-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="zone-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.3" />
        </filter>

        <radialGradient id="hub-gradient">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
      </defs>

      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.3" />
      </pattern>
      <rect width="900" height="700" fill="url(#grid)" />

      <path 
        d="M 50,50 L 350,50 L 350,350 L 600,350 L 600,50 L 850,50 L 850,650 L 50,650 Z"
        fill="#ffffff" 
        stroke="#94a3b8" 
        strokeWidth="3"
        filter="url(#zone-shadow)"
        className="dark:fill-slate-950 dark:stroke-slate-600"
      />

      <g className="pipes" strokeLinecap="round" strokeLinejoin="round">
        <path id="trunk-pipe" d="M 200,680 L 200,50" stroke="url(#pipe-gradient)" strokeWidth="16" fill="none" filter="url(#pipe-glow)" />
        <path d="M 200,680 L 200,50" stroke="url(#pipe-highlight)" strokeWidth="6" fill="none" opacity="0.5" />
        
        <path id="horizontal-branch" d="M 200,450 L 600,450" stroke="url(#pipe-gradient)" strokeWidth="14" fill="none" filter="url(#pipe-glow)" />
        <path d="M 200,450 L 600,450" stroke="url(#pipe-highlight)" strokeWidth="5" fill="none" opacity="0.5" />

        {/* Branches */}
        <path id="branch-z1-main" d="M 200,100 L 100,100" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path id="branch-z1-sub1" d="M 100,100 L 100,150" stroke="url(#pipe-gradient)" strokeWidth="8" fill="none" />
        <path id="branch-z1-sub2" d="M 100,100 L 250,100" stroke="url(#pipe-gradient)" strokeWidth="8" fill="none" />
        
        <path id="branch-z4-main" d="M 200,300 L 100,300" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path id="branch-z4-sub1" d="M 100,300 L 100,350" stroke="url(#pipe-gradient)" strokeWidth="8" fill="none" />
        
        <path id="branch-z3-main" d="M 200,550 L 100,550" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path id="branch-z3-sub1" d="M 100,550 L 100,600" stroke="url(#pipe-gradient)" strokeWidth="8" fill="none" />

        <path id="branch-z2-main" d="M 400,450 L 400,550" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />
        <path id="branch-z2-sub1" d="M 400,550 L 350,550" stroke="url(#pipe-gradient)" strokeWidth="8" fill="none" />
        <path id="branch-z2-v1" d="M 500,450 L 500,600" stroke="url(#pipe-gradient)" strokeWidth="10" fill="none" />

        {/* Junction Hubs */}
        <circle cx="200" cy="450" r="12" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="3" />
        <circle cx="200" cy="100" r="10" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="200" cy="300" r="10" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="200" cy="550" r="10" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="400" cy="450" r="10" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="500" cy="450" r="10" fill="url(#hub-gradient)" stroke="#ffffff" strokeWidth="2.5" />

        {/* Flow Particles */}
        {isFlowing && (
          <g className="flow-animations" opacity="0.9">
            <WaterParticle pathId="trunk-pipe" delay={0} duration={2.5 / flowSpeed} size={5} />
            <WaterParticle pathId="trunk-pipe" delay={0.8} duration={2.5 / flowSpeed} size={4} />
            <WaterParticle pathId="horizontal-branch" delay={0.3} duration={2 / flowSpeed} size={4.5} />
            <WaterParticle pathId="branch-z1-main" delay={0.2} duration={1.5 / flowSpeed} size={4} />
            <WaterParticle pathId="branch-z4-main" delay={0.4} duration={1.5 / flowSpeed} size={4} />
            <WaterParticle pathId="branch-z3-main" delay={0.6} duration={1.5 / flowSpeed} size={4} />
            <WaterParticle pathId="branch-z2-main" delay={0.5} duration={1.5 / flowSpeed} size={4} />
          </g>
        )}
      </g>

      <TooltipProvider>
        {/* Zones */}
        {[
          { id: zones[0].id, x: 50, y: 50, w: 300, h: 200, ox: 200, oy: 150 },
          { id: zones[3].id, x: 50, y: 250, w: 300, h: 200, ox: 200, oy: 350 },
          { id: zones[2].id, x: 50, y: 450, w: 300, h: 200, ox: 200, oy: 550 },
          { id: zones[1].id, x: 350, y: 350, w: 250, h: 300, ox: 475, oy: 500 }
        ].map(z => {
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
                    fill={styles.fill} stroke={styles.stroke} strokeWidth={hoveredZone === z.id ? 4 : styles.strokeWidth}
                  />
                  <text x={z.ox} y={z.oy - 5} className="text-sm font-bold fill-slate-800 dark:fill-slate-100 pointer-events-none" textAnchor="middle">
                    {zoneData.name}
                  </text>
                  <text x={z.ox} y={z.oy + 15} className="text-xs fill-slate-600 dark:fill-slate-400 pointer-events-none" textAnchor="middle">
                    {zoneData.area}
                  </text>
                </g>
              </TooltipTrigger>
              <TooltipContent side="top">
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
              <rect x="600" y="50" width="250" height="600" rx="8" fill="url(#pattern-soil)" stroke="#52525b" strokeWidth={hoveredZone === 'zone-5' ? 4 : 2} />
              <text x="725" y="340" className="text-sm font-bold fill-slate-400 pointer-events-none" textAnchor="middle">
                {unequippedArea.name}
              </text>
            </g>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="font-bold">{unequippedArea.name}</p>
            <p className="text-xs">{unequippedArea.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Sensors Layer */}
      <g className="sensors">
        <g transform="translate(200, 150)">
          <circle r="12" fill="white" stroke="#2563eb" strokeWidth="3" />
          <Droplets className="size-5 text-blue-600" x="-2.5" y="-2.5" />
        </g>
        <g transform="translate(475, 500)">
          <circle r="12" fill="white" stroke="#2563eb" strokeWidth="3" />
          <Droplets className="size-5 text-blue-600" x="-2.5" y="-2.5" />
        </g>
      </g>

      <g transform="translate(200, 685)">
        <circle r="15" fill="#1e40af" stroke="#60a5fa" strokeWidth="3" />
        <Waves className="size-6 text-white" x="-3" y="-3" />
      </g>
    </motion.svg>
  );
}
