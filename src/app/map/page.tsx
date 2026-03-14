"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map as MapIcon, 
  Droplets, 
  Thermometer, 
  Waves, 
  Zap, 
  Maximize2, 
  Minimize2,
  Pipette,
  AlertTriangle,
  CheckCircle2,
  Timer,
  ChevronDown,
  ChevronUp,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

// Enhanced mock data with realistic terrain info
const mockZones = [
  {
    id: 'zone-1',
    name: 'Vườn Rau Hữu Cơ',
    description: 'Khu vực trồng rau xanh với hệ thống tưới nhỏ giọt hiện đại',
    thirstLevel: 'NORMAL',
    status: 'Active',
    soilMoisture: 68,
    temperature: 24,
    humidity: 72,
    type: 'vegetable',
    area: '450m²',
    crop: 'Rau cải, Xà lách, Cà chua',
    lastWatered: '2 giờ trước',
    nextWatering: '6 giờ nữa'
  },
  {
    id: 'zone-2',
    name: 'Vườn Cây Ăn Quả',
    description: 'Vườn cây ăn quả lâu năm với bưởi, cam, quýt',
    thirstLevel: 'URGENT',
    status: 'Warning',
    soilMoisture: 23,
    temperature: 26,
    humidity: 45,
    type: 'orchard',
    area: '800m²',
    crop: 'Bưởi Diễn, Cam Vinh, Quýt',
    lastWatered: '3 ngày trước',
    nextWatering: 'Ngay bây giờ'
  },
  {
    id: 'zone-3',
    name: 'Khu Vườn Hoa & Cảnh',
    description: 'Khu vực trồng hoa cảnh và cây cảnh trang trí',
    thirstLevel: 'SKIP',
    status: 'Transitioning',
    soilMoisture: 45,
    temperature: 25,
    humidity: 60,
    type: 'flower',
    area: '320m²',
    crop: 'Hoa hồng, Lavender, Cẩm tú cầu',
    lastWatered: '1 giờ trước',
    nextWatering: 'Đang tưới...'
  },
  {
    id: 'zone-4',
    name: 'Thảm Cỏ & Sân Vườn',
    description: 'Khu vực cỏ xanh và không gian thư giãn ngoài trời',
    thirstLevel: 'LOW',
    status: 'Active',
    soilMoisture: 55,
    temperature: 23,
    humidity: 65,
    type: 'lawn',
    area: '600m²',
    crop: 'Cỏ Bermuda, Cỏ Nhung',
    lastWatered: '5 giờ trước',
    nextWatering: '12 giờ nữa'
  }
];

// Color mapping with enhanced gradients
const getStatusStyles = (thirstLevel: string, status: string) => {
  if (status === 'Offline') return {
    fill: 'url(#pattern-soil)',
    stroke: '#3f3f46',
    strokeWidth: 2,
    glow: 'none'
  };
  
  if (thirstLevel === 'URGENT') return {
    fill: 'url(#gradient-urgent)',
    stroke: '#dc2626',
    strokeWidth: 3,
    glow: 'drop-shadow(0 0 12px rgba(220, 38, 38, 0.6))'
  };
  
  if (thirstLevel === 'NORMAL') return {
    fill: 'url(#gradient-healthy)',
    stroke: '#16a34a',
    strokeWidth: 2,
    glow: 'drop-shadow(0 0 8px rgba(22, 163, 74, 0.4))'
  };
  
  if (thirstLevel === 'SKIP') return {
    fill: 'url(#gradient-transition)',
    stroke: '#ea580c',
    strokeWidth: 2,
    glow: 'drop-shadow(0 0 8px rgba(234, 88, 12, 0.4))'
  };
  
  if (thirstLevel === 'LOW') return {
    fill: 'url(#gradient-low)',
    stroke: '#65a30d',
    strokeWidth: 2,
    glow: 'drop-shadow(0 0 6px rgba(101, 163, 13, 0.3))'
  };
  
  return {
    fill: '#27272a',
    stroke: '#52525b',
    strokeWidth: 2,
    glow: 'none'
  };
};

export default function SystemMapPage() {
  const [zoom, setZoom] = useState(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  // Unequipped area - Storage/Buffer zone
  const unequippedArea = {
    id: 'zone-5',
    name: 'Kho Bãi & Vùng Đệm',
    description: 'Khu vực chưa lắp đặt hệ thống tưới tự động',
    type: 'storage'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <MapIcon className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Bản Đồ Kiến Trúc Hệ Thống
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Sơ đồ 2D toàn bộ khu đất, cảm biến và hệ thống phân phối nước
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-muted p-2 rounded-xl border border-border">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="hover:bg-card shadow-sm"
          >
            <Minimize2 className="size-4" />
          </Button>
          <span className="text-sm font-bold w-16 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="hover:bg-card shadow-sm"
          >
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Map Viewport */}
        <Card className="xl:col-span-3 border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden h-[700px] relative rounded-3xl border border-border">
          <CardContent className="p-0 h-full relative bg-gradient-to-b from-sky-50/30 to-emerald-50/30 dark:from-slate-950 dark:to-slate-900">
            
            {/* SVG Map */}
            <motion.svg 
              viewBox="0 0 900 700" 
              className="w-full h-full"
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ transformOrigin: 'center center' }}
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="gradient-healthy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.8" />
                </linearGradient>
                
                <linearGradient id="gradient-urgent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f87171" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
                </linearGradient>
                
                <linearGradient id="gradient-transition" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fdba74" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#fb923c" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.9" />
                </linearGradient>
                
                <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bef264" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0.7" />
                </linearGradient>
                
                {/* Soil pattern for unequipped areas */}
                <pattern id="pattern-soil" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#3f3f46" />
                  <circle cx="2" cy="2" r="1" fill="#52525b" opacity="0.5" />
                  <circle cx="10" cy="12" r="1.5" fill="#52525b" opacity="0.3" />
                  <circle cx="18" cy="5" r="1" fill="#52525b" opacity="0.4" />
                </pattern>

                {/* Pipe gradient */}
                <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Plot Boundary - Contiguous land shape */}
              <path 
                d="M 50,50 L 350,50 L 350,350 L 600,350 L 600,50 L 850,50 L 850,650 L 50,650 Z"
                fill="#f8fafc" 
                stroke="#cbd5e1" 
                strokeWidth="3"
                className="dark:fill-slate-950 dark:stroke-slate-700"
              />

              {/* SEAMLESS PIPE NETWORK */}
              <g className="pipes" strokeLinecap="round" strokeLinejoin="round">
                {/* Main Trunk Pipeline */}
                <path 
                  d="M 200,650 L 200,50" 
                  stroke="url(#pipe-gradient)" 
                  strokeWidth="12" 
                  fill="none"
                  className="drop-shadow-lg"
                />
                
                {/* Main Horizontal Branch with seamless T-junction */}
                <path 
                  d="M 200,450 L 600,450" 
                  stroke="url(#pipe-gradient)" 
                  strokeWidth="10" 
                  fill="none"
                  className="drop-shadow-lg"
                />

                {/* Zone 1 & 4 Branching - perfectly connected paths */}
                <path d="M 200,100 L 100,100 M 200,100 L 300,100" stroke="#0ea5e9" strokeWidth="6" fill="none" className="opacity-80" />
                <path d="M 200,200 L 100,200 M 200,200 L 300,200" stroke="#0ea5e9" strokeWidth="6" fill="none" className="opacity-80" />
                <path d="M 200,350 L 100,350 M 200,350 L 300,350" stroke="#0ea5e9" strokeWidth="6" fill="none" className="opacity-80" />
                
                {/* Micro distribution lines connected to branches */}
                <path d="M 100,100 L 100,50 M 300,100 L 300,50" stroke="#38bdf8" strokeWidth="3" fill="none" className="opacity-60" />
                <path d="M 100,200 L 100,250 M 300,200 L 300,250" stroke="#38bdf8" strokeWidth="3" fill="none" className="opacity-60" />

                {/* Zone 3 connectivity */}
                <path d="M 200,550 L 100,550 M 200,550 L 300,550" stroke="#0ea5e9" strokeWidth="6" fill="none" className="opacity-80" />
                <path d="M 200,600 L 100,600 M 200,600 L 300,600" stroke="#0ea5e9" strokeWidth="6" fill="none" className="opacity-80" />

                {/* Zone 2 Connectivity - Vertical sub-trunk from horizontal branch */}
                <path d="M 400,450 L 400,650 M 500,450 L 500,650" stroke="#0ea5e9" strokeWidth="6" fill="none" className="opacity-80" />
                <path d="M 350,400 L 600,400 M 350,500 L 600,500 M 350,600 L 600,600" stroke="#38bdf8" strokeWidth="4" fill="none" className="opacity-70" />

                {/* Junction Hubs for seamless visual transition */}
                <circle cx="200" cy="450" r="8" fill="#0284c7" stroke="white" strokeWidth="2" className="drop-shadow-md" />
                <circle cx="200" cy="100" r="6" fill="#0284c7" stroke="white" strokeWidth="2" className="drop-shadow-md" />
                <circle cx="200" cy="200" r="6" fill="#0284c7" stroke="white" strokeWidth="2" className="drop-shadow-md" />
                <circle cx="200" cy="350" r="6" fill="#0284c7" stroke="white" strokeWidth="2" className="drop-shadow-md" />
                <circle cx="200" cy="550" r="6" fill="#0284c7" stroke="white" strokeWidth="2" className="drop-shadow-md" />
                <circle cx="400" cy="450" r="6" fill="#0284c7" stroke="white" strokeWidth="2" className="drop-shadow-md" />
                <circle cx="500" cy="450" r="6" fill="#0284c7" stroke="white" strokeWidth="2" className="drop-shadow-md" />

                {/* FLOW ANIMATIONS */}
                <circle r="4" fill="#7dd3fc" filter="drop-shadow(0 0 4px #38bdf8)">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 200,650 L 200,50" />
                </circle>
                <circle r="3" fill="#7dd3fc">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 200,450 L 600,450" />
                </circle>
                <circle r="2.5" fill="#7dd3fc">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path="M 200,100 L 100,100" />
                </circle>
                <circle r="2.5" fill="#7dd3fc">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 400,450 L 400,650" />
                </circle>
              </g>

              {/* Zone 1: Vegetable Garden */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedZone(mockZones[0].id)}
                      onMouseEnter={() => setHoveredZone(mockZones[0].id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ filter: hoveredZone === mockZones[0].id ? getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).glow : 'none' }}
                    >
                      <rect 
                        x="50" y="50" width="300" height="200" rx="4"
                        className="transition-all duration-300"
                        fill={getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).fill}
                        stroke={getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).stroke}
                        strokeWidth={hoveredZone === mockZones[0].id ? 4 : getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).strokeWidth}
                      />
                      <g stroke="currentColor" strokeWidth="0.5" opacity="0.2" className="pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <line key={`h1-${i}`} x1="60" y1={70 + i * 30} x2="340" y2={70 + i * 30} />
                        ))}
                      </g>
                      <text x="200" y="155" className="text-sm font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[0].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-popover text-popover-foreground p-3 rounded-xl shadow-xl border border-border">
                    <p className="font-bold text-emerald-600">{mockZones[0].name}</p>
                    <p className="text-xs">{mockZones[0].area}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 4: Lawn */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedZone(mockZones[3].id)}
                      onMouseEnter={() => setHoveredZone(mockZones[3].id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ filter: hoveredZone === mockZones[3].id ? getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).glow : 'none' }}
                    >
                      <rect 
                        x="50" y="250" width="300" height="200" rx="4"
                        className="transition-all duration-300"
                        fill={getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).fill}
                        stroke={getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).stroke}
                        strokeWidth={hoveredZone === mockZones[3].id ? 4 : getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).strokeWidth}
                      />
                      <text x="200" y="355" className="text-sm font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[3].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-popover text-popover-foreground p-3 rounded-xl shadow-xl border border-border">
                    <p className="font-bold text-emerald-600">{mockZones[3].name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 3: Flower Garden */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedZone(mockZones[2].id)}
                      onMouseEnter={() => setHoveredZone(mockZones[2].id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ filter: hoveredZone === mockZones[2].id ? getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).glow : 'none' }}
                    >
                      <rect 
                        x="50" y="450" width="300" height="200" rx="4"
                        className="transition-all duration-300"
                        fill={getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).fill}
                        stroke={getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).stroke}
                        strokeWidth={hoveredZone === mockZones[2].id ? 4 : getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).strokeWidth}
                      />
                      <text x="200" y="555" className="text-sm font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[2].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-popover text-popover-foreground p-3 rounded-xl shadow-xl border border-border">
                    <p className="font-bold text-orange-600">{mockZones[2].name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 2: Orchard */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedZone(mockZones[1].id)}
                      onMouseEnter={() => setHoveredZone(mockZones[1].id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ filter: hoveredZone === mockZones[1].id ? getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).glow : 'none' }}
                    >
                      <rect 
                        x="350" y="350" width="250" height="300" rx="4"
                        className="transition-all duration-300"
                        fill={getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).fill}
                        stroke={getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).stroke}
                        strokeWidth={hoveredZone === mockZones[1].id ? 4 : getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).strokeWidth}
                      />
                      <text x="475" y="520" className="text-sm font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[1].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-popover text-popover-foreground p-3 rounded-xl shadow-xl border border-border">
                    <p className="font-bold text-red-600">{mockZones[1].name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 5: Unequipped */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredZone(unequippedArea.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                    >
                      <rect 
                        x="600" y="50" width="250" height="600" rx="4"
                        fill="url(#pattern-soil)"
                        stroke="#52525b"
                        strokeWidth={hoveredZone === unequippedArea.id ? 4 : 2}
                        className="transition-all duration-300"
                      />
                      <text x="725" y="500" className="text-sm font-bold fill-slate-400 pointer-events-none" textAnchor="middle">
                        {unequippedArea.name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700">
                    <p className="font-bold">{unequippedArea.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Sensors Overlay */}
              <g className="sensors">
                <g transform="translate(200, 150)">
                  <circle r="10" fill="white" stroke="#0ea5e9" strokeWidth="3" className="drop-shadow-lg" />
                  <text y="3" x="0" className="text-[9px] font-bold fill-sky-600" textAnchor="middle">S1</text>
                </g>
                <g transform="translate(475, 500)">
                  <circle r="10" fill="white" stroke="#0ea5e9" strokeWidth="3" className="drop-shadow-lg" />
                  <text y="3" x="0" className="text-[9px] font-bold fill-sky-600" textAnchor="middle">S2</text>
                </g>
              </g>

            </motion.svg>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 p-5 bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl space-y-3 min-w-[220px]">
              <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Pipette className="size-4" /> Chú Thích
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-6 h-6 w-6" 
                  onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
                >
                  {isLegendCollapsed ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </Button>
              </div>
              
              <AnimatePresence>
                {!isLegendCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-4 rounded bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      <span className="text-sm font-medium">Đủ nước</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-4 rounded bg-orange-500 shadow-sm shadow-orange-500/50" />
                      <span className="text-sm font-medium">Đang tưới</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-4 rounded bg-red-500 shadow-sm shadow-red-500/50" />
                      <span className="text-sm font-medium">Khẩn cấp</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-4 rounded bg-zinc-700 border border-zinc-600" />
                      <span className="text-sm font-medium">Chưa lắp đặt</span>
                    </div>
                    
                    <div className="pt-3 border-t border-border space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <div className="w-8 h-2 bg-gradient-to-r from-sky-600 to-sky-400 rounded-full" />
                        <span>Mạch nước ngầm</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-sky-500" />
                        <span>Trạm cảm biến</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status Overlay */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <div className="bg-card/95 backdrop-blur-xl p-4 rounded-2xl border border-border shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Waves className="size-5 text-primary" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Áp suất</p>
                    <p className="text-xl font-bold">2.4 bar</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div
                key={selectedZone}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-2xl bg-card rounded-3xl overflow-hidden border border-border">
                  <div className={`h-2 w-full ${
                    mockZones.find(z => z.id === selectedZone)?.thirstLevel === 'URGENT' ? 'bg-red-500' :
                    'bg-emerald-500'
                  }`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">
                          {mockZones.find(z => z.id === selectedZone)?.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs">
                          {mockZones.find(z => z.id === selectedZone)?.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={mockZones.find(z => z.id === selectedZone)?.thirstLevel === 'URGENT' ? 'destructive' : 'default'}
                        className="rounded-full"
                      >
                        {mockZones.find(z => z.id === selectedZone)?.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted p-3 rounded-xl border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Droplets size={12} />
                          <span className="text-[10px] font-bold uppercase">Ẩm độ</span>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-bold">
                            {mockZones.find(z => z.id === selectedZone)?.soilMoisture}%
                          </span>
                        </div>
                        <Progress 
                          value={mockZones.find(z => z.id === selectedZone)?.soilMoisture} 
                          className="h-1.5 mt-2"
                        />
                      </div>
                      
                      <div className="bg-muted p-3 rounded-xl border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Thermometer size={12} />
                          <span className="text-[10px] font-bold uppercase">Nhiệt độ</span>
                        </div>
                        <span className="text-2xl font-bold">
                          {mockZones.find(z => z.id === selectedZone)?.temperature}°C
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <Activity size={12} />
                        <span className="text-[10px] font-bold uppercase">Tiếp theo</span>
                      </div>
                      <p className="text-sm font-bold">
                        {mockZones.find(z => z.id === selectedZone)?.nextWatering}
                      </p>
                    </div>

                    <Button className="w-full rounded-xl h-11 font-bold shadow-lg" asChild>
                      <a href={`/zones/${selectedZone}`}>Chi Tiết Zone</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-none shadow-2xl bg-card rounded-3xl border border-border">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapIcon className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Chọn Khu Vực</h3>
                    <p className="text-sm text-muted-foreground">
                      Nhấp vào bất kỳ vùng nào trên bản đồ để xem chi tiết kỹ thuật.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Network Health */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-blue-700 text-primary-foreground rounded-3xl overflow-hidden border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Waves className="size-4" /> Hệ Thống Thủy Lực
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <p className="text-[10px] font-bold opacity-70 uppercase">Lưu lượng</p>
                  <p className="text-xl font-bold">1,240 <span className="text-sm font-normal">L/h</span></p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <p className="text-[10px] font-bold opacity-70 uppercase">Áp suất</p>
                  <p className="text-xl font-bold">2.4 <span className="text-sm font-normal">bar</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs bg-white/10 rounded-lg p-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Hoạt động ổn định</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
