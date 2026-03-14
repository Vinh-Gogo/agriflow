
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
  Timer,
  ChevronDown,
  ChevronUp
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
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  // Unequipped area - Storage/Buffer zone (Far right part of the base)
  const unequippedArea = {
    id: 'zone-5',
    name: 'Kho Bãi & Vùng Đệm',
    description: 'Khu vực chưa lắp đặt hệ thống tưới tự động',
    points: "600,350 850,350 850,650 600,650",
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

              {/* Contiguous Plot Boundary with terrain texture */}
              <path 
                d="M 50,50 L 350,50 L 350,350 L 850,350 L 850,650 L 50,650 Z"
                fill="#f8fafc" 
                stroke="#e2e8f0" 
                strokeWidth="2"
                className="dark:fill-slate-950 dark:stroke-slate-800"
              />

              {/* Dense Water Distribution Network */}
              <g className="pipes">
                {/* Main Pipeline (Trunk) */}
                <path 
                  d="M 200,650 L 200,50"
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className="opacity-50"
                />
                <path 
                  d="M 200,450 L 850,450"
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  className="opacity-40"
                />

                {/* Secondary Branches for Zone 1 */}
                <path d="M 200,100 L 100,100 M 200,100 L 300,100" stroke="#0ea5e9" strokeWidth="3" className="opacity-30" />
                <path d="M 200,200 L 100,200 M 200,200 L 300,200" stroke="#0ea5e9" strokeWidth="3" className="opacity-30" />
                {/* Tertiary Micro-branches for Zone 1 */}
                <path d="M 100,100 L 100,80 M 100,100 L 100,120 M 300,100 L 300,80 M 300,100 L 300,120" stroke="#0ea5e9" strokeWidth="1" className="opacity-20" />

                {/* Secondary Branches for Zone 4 */}
                <path d="M 200,300 L 120,300 M 200,300 L 280,300" stroke="#0ea5e9" strokeWidth="3" className="opacity-30" />
                <path d="M 200,400 L 120,400 M 200,400 L 280,400" stroke="#0ea5e9" strokeWidth="3" className="opacity-30" />

                {/* Secondary Branches for Zone 3 */}
                <path d="M 200,500 L 100,500 M 200,500 L 300,500" stroke="#0ea5e9" strokeWidth="3" className="opacity-30" />
                <path d="M 200,600 L 100,600 M 200,600 L 300,600" stroke="#0ea5e9" strokeWidth="3" className="opacity-30" />

                {/* Secondary Branches for Zone 2 */}
                <path d="M 400,450 L 400,400 M 400,450 L 400,600" stroke="#0ea5e9" strokeWidth="3" className="opacity-30" />
                <path d="M 550,450 L 550,400 M 550,450 L 550,600" stroke="#0ea5e9" strokeWidth="3" className="opacity-30" />
                {/* Tertiary Micro-branches for Zone 2 */}
                <path d="M 400,400 L 380,400 M 400,400 L 420,400 M 400,600 L 380,600 M 400,600 L 420,600" stroke="#0ea5e9" strokeWidth="1" className="opacity-20" />

                {/* Animated Flow Nodes */}
                <circle r="3" fill="#38bdf8">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M 200,650 L 200,50" />
                </circle>
                <circle r="2.5" fill="#38bdf8" opacity="0.7">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 200,450 L 850,450" />
                </circle>
              </g>

              {/* Zone 1: Vegetable Garden */}
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
                        d={generateOrganicPath("50,50 350,50 350,250 50,250")}
                        className={`transition-all duration-300 ${hoveredZone === mockZones[0].id ? 'opacity-100' : 'opacity-90'}`}
                        fill={getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).fill}
                        stroke={getStatusStyles(mockZones[0].thirstLevel, mockZones[0].status).stroke}
                        strokeWidth={hoveredZone === mockZones[0].id ? 3 : 2}
                      />
                      <text x="200" y="150" className="text-xs font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[0].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-emerald-600">{mockZones[0].name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 4: Lawn */}
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
                        d={generateOrganicPath("50,250 350,250 350,450 50,450")}
                        className={`transition-all duration-300 ${hoveredZone === mockZones[3].id ? 'opacity-100' : 'opacity-90'}`}
                        fill={getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).fill}
                        stroke={getStatusStyles(mockZones[3].thirstLevel, mockZones[3].status).stroke}
                        strokeWidth={hoveredZone === mockZones[3].id ? 3 : 2}
                      />
                      <text x="200" y="350" className="text-xs font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[3].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-emerald-200 dark:border-emerald-900 p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-emerald-600">{mockZones[3].name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 3: Flower Garden */}
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
                        d={generateOrganicPath("50,450 350,450 350,650 50,650")}
                        className={`transition-all duration-300 ${hoveredZone === mockZones[2].id ? 'opacity-100' : 'opacity-85'}`}
                        fill={getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).fill}
                        stroke={getStatusStyles(mockZones[2].thirstLevel, mockZones[2].status).stroke}
                        strokeWidth={hoveredZone === mockZones[2].id ? 3 : 2}
                      />
                      <text x="200" y="550" className="text-xs font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[2].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-orange-200 dark:border-orange-900 p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-orange-600">{mockZones[2].name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Zone 2: Orchard */}
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
                        d={generateOrganicPath("350,350 600,350 600,650 350,650")}
                        className={`transition-all duration-300 ${hoveredZone === mockZones[1].id ? 'opacity-100' : 'opacity-85'}`}
                        fill={getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).fill}
                        stroke={getStatusStyles(mockZones[1].thirstLevel, mockZones[1].status).stroke}
                        strokeWidth={hoveredZone === mockZones[1].id ? 3 : 2}
                      />
                      <text x="475" y="500" className="text-xs font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none" textAnchor="middle">
                        {mockZones[1].name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-red-200 dark:border-red-900 p-3 rounded-xl shadow-xl">
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
                      <path 
                        d={generateOrganicPath(unequippedArea.points)}
                        fill="url(#pattern-soil)"
                        stroke="#52525b"
                        strokeWidth={hoveredZone === unequippedArea.id ? 3 : 2}
                        className="opacity-90"
                      />
                      <text x="725" y="500" className="text-xs font-bold fill-slate-500 pointer-events-none" textAnchor="middle">
                        {unequippedArea.name}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-800 text-white p-3 rounded-xl">
                    <p className="font-bold text-slate-300">{unequippedArea.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </motion.svg>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-3 min-w-[200px]">
              <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                <div className="flex items-center gap-2">
                  <Pipette className="size-4" /> Chú Thích Bản Đồ
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
                    className="overflow-hidden space-y-2.5"
                  >
                    <div className="flex items-center gap-3"><div className="size-4 rounded-lg bg-emerald-500" /><span className="text-sm">Đủ nước</span></div>
                    <div className="flex items-center gap-3"><div className="size-4 rounded-lg bg-orange-500" /><span className="text-sm">Đang tưới</span></div>
                    <div className="flex items-center gap-3"><div className="size-4 rounded-lg bg-red-500" /><span className="text-sm">Khẩn cấp</span></div>
                    <div className="flex items-center gap-3"><div className="size-4 rounded-lg bg-zinc-700" /><span className="text-sm">Chưa lắp đặt</span></div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <div className="w-6 h-1 bg-sky-500/50 rounded-full" />
                        <span>Hệ thống ống dẫn</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              >
                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                  <div className={`h-2 w-full ${
                    mockZones.find(z => z.id === selectedZone)?.thirstLevel === 'URGENT' ? 'bg-red-500' : 'bg-emerald-500'
                  }`} />
                  <CardHeader>
                    <CardTitle>{mockZones.find(z => z.id === selectedZone)?.name}</CardTitle>
                    <CardDescription>{mockZones.find(z => z.id === selectedZone)?.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 mb-1"><Droplets size={14} /><span className="text-[10px] font-bold">ẨM ĐỘ</span></div>
                        <span className="text-2xl font-bold">{mockZones.find(z => z.id === selectedZone)?.soilMoisture}%</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 mb-1"><Thermometer size={14} /><span className="text-[10px] font-bold">NHIỆT ĐỘ</span></div>
                        <span className="text-2xl font-bold">{mockZones.find(z => z.id === selectedZone)?.temperature}°C</span>
                      </div>
                    </div>
                    <Button className="w-full rounded-xl h-12 font-bold" asChild>
                      <a href={`/zones/${selectedZone}`}>Mở Bảng Điều Khiển</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl">
                <CardContent className="p-8 text-center text-muted-foreground">Chọn khu vực để xem chi tiết.</CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

