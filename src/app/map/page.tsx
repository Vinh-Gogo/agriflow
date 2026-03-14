
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
  TreePine,
  Leaf,
  Flower2,
  Tractor,
  AlertTriangle,
  CheckCircle2,
  Timer
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
    glow: 'none',
    opacity: 0.9
  };
  
  if (thirstLevel === 'URGENT') return {
    fill: 'url(#gradient-urgent)',
    stroke: '#dc2626',
    glow: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.6))',
    opacity: 0.85
  };
  
  if (thirstLevel === 'NORMAL') return {
    fill: 'url(#gradient-healthy)',
    stroke: '#16a34a',
    glow: 'drop-shadow(0 0 6px rgba(22, 163, 74, 0.4))',
    opacity: 0.9
  };
  
  if (thirstLevel === 'SKIP') return {
    fill: 'url(#gradient-transition)',
    stroke: '#ea580c',
    glow: 'drop-shadow(0 0 6px rgba(234, 88, 12, 0.4))',
    opacity: 0.85
  };
  
  if (thirstLevel === 'LOW') return {
    fill: 'url(#gradient-low)',
    stroke: '#65a30d',
    glow: 'drop-shadow(0 0 4px rgba(101, 163, 13, 0.3))',
    opacity: 0.9
  };
  
  return {
    fill: '#27272a',
    stroke: '#52525b',
    glow: 'none',
    opacity: 1
  };
};

// Organic shape generators using spline curves
const generateOrganicPath = (points: string) => {
  const coords = points.split(' ').map(p => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
  });
  
  let path = `M ${coords[0].x},${coords[0].y}`;
  
  for (let i = 0; i < coords.length; i++) {
    const curr = coords[i];
    const next = coords[(i + 1) % coords.length];
    const prev = coords[(i - 1 + coords.length) % coords.length];
    
    // Calculate control points for smooth curves
    const cp1x = curr.x + (next.x - prev.x) * 0.15;
    const cp1y = curr.y + (next.y - prev.y) * 0.15;
    const cp2x = next.x - (coords[(i + 2) % coords.length].x - curr.x) * 0.15;
    const cp2y = next.y - (coords[(i + 2) % coords.length].y - curr.y) * 0.15;
    
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
  }
  
  return path + ' Z';
};

export default function SystemMapPage() {
  const [zoom, setZoom] = useState(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Unequipped area - Storage/Buffer zone
  const unequippedArea = {
    id: 'zone-5',
    name: 'Kho Bãi & Vùng Đệm',
    description: 'Khu vực chưa lắp đặt hệ thống tưới tự động',
    // Positioned to ensure no overlap
    points: "650,50 750,60 830,80 840,180 800,260 720,270 650,240 620,150",
    type: 'storage'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
            <MapIcon className="size-6 text-white" />
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
        
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="hover:bg-white dark:hover:bg-slate-700 shadow-sm"
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
            className="hover:bg-white dark:hover:bg-slate-700 shadow-sm"
          >
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Map Viewport */}
        <Card className="xl:col-span-3 border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden h-[700px] relative rounded-3xl">
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
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.7" />
                </linearGradient>
                
                <linearGradient id="gradient-urgent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#f87171" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
                </linearGradient>
                
                <linearGradient id="gradient-transition" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fdba74" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#fb923c" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />
                </linearGradient>
                
                <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bef264" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0.6" />
                </linearGradient>
                
                {/* Soil pattern for unequipped areas */}
                <pattern id="pattern-soil" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#3f3f46" />
                  <circle cx="2" cy="2" r="1" fill="#52525b" opacity="0.5" />
                  <circle cx="10" cy="12" r="1.5" fill="#52525b" opacity="0.3" />
                  <circle cx="18" cy="5" r="1" fill="#52525b" opacity="0.4" />
                </pattern>
                
                {/* Filters */}
                <filter id="glow-healthy" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Plot Boundary with terrain texture */}
              <path 
                d="M 50,50 Q 450,30 850,50 Q 870,350 850,650 Q 450,670 50,650 Q 30,350 50,50 Z"
                fill="#f8fafc" 
                stroke="#e2e8f0" 
                strokeWidth="2"
                className="dark:fill-slate-950 dark:stroke-slate-800"
              />
              
              {/* Topographic lines for depth */}
              <g className="opacity-20 text-slate-400" stroke="currentColor" strokeWidth="0.5" fill="none">
                <path d="M 100,100 Q 450,80 800,100" />
                <path d="M 80,200 Q 450,180 820,200" />
                <path d="M 60,300 Q 450,280 840,300" />
                <path d="M 80,400 Q 450,380 820,400" />
                <path d="M 100,500 Q 450,480 800,500" />
                <path d="M 150,600 Q 450,580 750,600" />
              </g>

              {/* Water Distribution Network - Underground pipes */}
              <g className="pipes">
                <path 
                  d="M 450,620 C 450,500 450,400 450,350 C 450,300 400,300 350,300 C 300,300 300,250 300,200 C 300,150 250,150 200,150"
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  className="opacity-40"
                />
                <path d="M 450,350 C 450,350 550,350 600,400 C 650,450 650,450 650,450" fill="none" stroke="#0ea5e9" strokeWidth="4" className="opacity-30" strokeDasharray="5,5" />
                
                {/* Water pump station */}
                <g transform="translate(430, 610)">
                  <circle r="15" fill="#0284c7" className="animate-pulse" />
                  <circle r="8" fill="#bae6fd" />
                  <Waves className="text-sky-900" x="-6" y="-6" size={12} />
                </g>
                
                {/* Flow animation */}
                <circle r="3" fill="#38bdf8">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 450,620 C 450,500 450,400 450,350" />
                </circle>
              </g>

              {/* Zone 1: Organic Vegetable Garden Shape (Top Left) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer transition-all duration-500"
                      onClick={() => setSelectedZone(mockZones[0].id)}
                      onMouseEnter={() => setHoveredZone(mockZones[0].id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ filter: hoveredZone === mockZones[0].id ? getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).glow : 'none' }}
                    >
                      <path 
                        d={generateOrganicPath("60,60 150,50 240,60 280,100 280,180 240,220 150,230 60,220 40,140")}
                        className={`transition-all duration-300 ${hoveredZone === mockZones[0].id ? 'opacity-100' : 'opacity-90'}`}
                        fill={getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).fill}
                        stroke={getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).stroke}
                        strokeWidth={hoveredZone === mockZones[0].id ? 3 : 2}
                      />
                      <g className="pointer-events-none">
                        <circle cx="120" cy="120" r="3" fill="currentColor" className="text-emerald-700 opacity-60" />
                        <circle cx="180" cy="140" r="4" fill="currentColor" className="text-emerald-700 opacity-50" />
                      </g>
                      <text x="150" y="150" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[0].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl">
                    <div className="space-y-1">
                      <p className="font-bold text-emerald-600">{mockZones[0].name}</p>
                      <p className="text-xs text-slate-500">Ẩm độ: {mockZones[0].soilMoisture}%</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 4: Lawn (Top Center-ish) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer transition-all duration-500"
                      onClick={() => setSelectedZone(mockZones[3].id)}
                      onMouseEnter={() => setHoveredZone(mockZones[3].id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ filter: hoveredZone === mockZones[3].id ? getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).glow : 'none' }}
                    >
                      <path 
                        d={generateOrganicPath("350,60 450,50 550,60 580,100 580,200 550,240 450,250 350,240 320,150")}
                        className={`transition-all duration-300 ${hoveredZone === mockZones[3].id ? 'opacity-100' : 'opacity-90'}`}
                        fill={getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).fill}
                        stroke={getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).stroke}
                        strokeWidth={hoveredZone === mockZones[3].id ? 3 : 2}
                      />
                      <text x="450" y="150" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[3].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-emerald-200 dark:border-emerald-900 p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-emerald-600">{mockZones[3].name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 5: Unequipped Storage Area (Top Right) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredZone(unequippedArea.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                    >
                      <path 
                        d={generateOrganicPath(unequippedArea.points)}
                        fill="url(#pattern-soil)"
                        stroke="#52525b"
                        strokeWidth={hoveredZone === unequippedArea.id ? 3 : 2}
                        className="opacity-90"
                      />
                      <g className="pointer-events-none opacity-50">
                        <Tractor x="680" y="150" size={32} className="text-slate-600" />
                      </g>
                      <text x="730" y="210" className="text-[10px] font-bold fill-slate-500 pointer-events-none" textAnchor="middle">
                        {unequippedArea.name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-800 text-white p-3 rounded-xl">
                    <p className="font-bold text-slate-300">{unequippedArea.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 3: Flower Garden (Bottom Left) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer transition-all duration-500"
                      onClick={() => setSelectedZone(mockZones[2].id)}
                      onMouseEnter={() => setHoveredZone(mockZones[2].id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ filter: hoveredZone === mockZones[2].id ? getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).glow : 'none' }}
                    >
                      <path 
                        d={generateOrganicPath("60,320 160,310 260,320 320,360 320,480 260,530 160,540 60,530 40,420")}
                        className={`transition-all duration-300 ${hoveredZone === mockZones[2].id ? 'opacity-100' : 'opacity-85'}`}
                        fill={getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).fill}
                        stroke={getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).stroke}
                        strokeWidth={hoveredZone === mockZones[2].id ? 3 : 2}
                      />
                      <text x="180" y="420" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[2].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-orange-200 dark:border-orange-900 p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-orange-600">{mockZones[2].name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 2: Orchard (Bottom Right) */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer transition-all duration-500"
                      onClick={() => setSelectedZone(mockZones[1].id)}
                      onMouseEnter={() => setHoveredZone(mockZones[1].id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      style={{ filter: hoveredZone === mockZones[1].id ? getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).glow : 'none' }}
                    >
                      <path 
                        d={generateOrganicPath("420,320 550,310 700,320 780,380 780,550 700,610 550,620 420,610 380,450")}
                        className={`transition-all duration-300 ${hoveredZone === mockZones[1].id ? 'opacity-100' : 'opacity-85'}`}
                        fill={getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).fill}
                        stroke={getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).stroke}
                        strokeWidth={hoveredZone === mockZones[1].id ? 3 : 2}
                      />
                      <text x="600" y="480" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[1].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-red-200 dark:border-red-900 p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-red-600">{mockZones[1].name}</p>
                    <p className="text-xs text-slate-500">Cần tưới gấp!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Sensors Layer */}
              <g className="sensors">
                <g transform="translate(150, 150)">
                  <circle r="6" fill="white" stroke="#0ea5e9" strokeWidth="2" className="drop-shadow-sm" />
                  <text y="2" x="0" className="text-[6px] font-bold fill-sky-600 text-center" textAnchor="middle">S1</text>
                  <circle r="10" fill="none" stroke="#0ea5e9" strokeWidth="1" className="animate-ping opacity-30" />
                </g>
                <g transform="translate(600, 480)">
                  <circle r="6" fill="white" stroke="#0ea5e9" strokeWidth="2" className="drop-shadow-sm" />
                  <text y="2" x="0" className="text-[6px] font-bold fill-sky-600 text-center" textAnchor="middle">S2</text>
                  <circle r="10" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping opacity-50" />
                </g>
              </g>

            </motion.svg>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-3 min-w-[200px]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                <Pipette className="size-4" /> Chú Thích Bản Đồ
              </div>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="size-4 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm border border-emerald-500/50" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Đủ nước</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-4 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm border border-orange-500/50" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Đang tưới</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-4 rounded-lg bg-gradient-to-br from-red-400 to-red-600 shadow-sm border border-red-500/50" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Khẩn cấp</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-4 rounded-lg bg-zinc-700 shadow-sm border border-zinc-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Chưa lắp đặt</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Overlay */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Zap size={14} className="text-yellow-500" />
                  <span>Hệ thống</span>
                </div>
                <p className="text-lg font-bold text-emerald-600">Hoạt động</p>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                  <div className={`h-2 w-full ${
                    mockZones.find(z => z.id === selectedZone)?.thirstLevel === 'URGENT' ? 'bg-red-500' :
                    mockZones.find(z => z.id === selectedZone)?.thirstLevel === 'SKIP' ? 'bg-orange-500' :
                    'bg-emerald-500'
                  }`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                          {mockZones.find(z => z.id === selectedZone)?.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          {mockZones.find(z => z.id === selectedZone)?.description}
                        </CardDescription>
                      </div>
                      <Badge className="rounded-full px-3 py-1">
                        {mockZones.find(z => z.id === selectedZone)?.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Droplets size={14} />
                          <span className="text-[10px] font-bold uppercase">Độ ẩm</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          {mockZones.find(z => z.id === selectedZone)?.soilMoisture}%
                        </span>
                        <Progress value={mockZones.find(z => z.id === selectedZone)?.soilMoisture} className="h-1.5 mt-2" />
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <Thermometer size={14} />
                          <span className="text-[10px] font-bold uppercase">Nhiệt độ</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          {mockZones.find(z => z.id === selectedZone)?.temperature}°C
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Cây trồng</p>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        {mockZones.find(z => z.id === selectedZone)?.crop}
                      </p>
                    </div>

                    <Button className="w-full rounded-xl h-12 font-bold shadow-lg" asChild>
                      <a href={`/zones/${selectedZone}`}>Mở Bảng Điều Khiển</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapIcon className="size-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Chọn khu vực</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Nhấp vào bất kỳ khu vực nào trên bản đồ để xem dữ liệu thời gian thực.
                  </p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>

          <Card className="border-none shadow-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-white/90">
                <Waves className="size-4" /> Mạng Lưới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <p className="text-[10px] font-bold text-white/70 uppercase">Lưu lượng</p>
                  <p className="text-lg font-bold">1,240 L/h</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                  <p className="text-[10px] font-bold text-white/70 uppercase">Áp suất</p>
                  <p className="text-lg font-bold">2.4 bar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
