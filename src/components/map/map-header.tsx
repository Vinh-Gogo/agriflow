"use client"

import { Map as MapIcon, Maximize2, Minimize2, Waves, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MapHeaderProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  isFlowing: boolean;
  setIsFlowing: (isFlowing: boolean) => void;
  activeCount: number;
  urgentCount: number;
}

export function MapHeader({ zoom, setZoom, isFlowing, setIsFlowing, activeCount, urgentCount }: MapHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200/60 dark:border-slate-700/60">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-500/30">
          <MapIcon className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Bản Đồ Hệ Thống Phân Phối Nước
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Mạng lưới ống dẫn và {activeCount} zone đang hoạt động
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Minimize2 className="size-4" />
          </Button>
          <span className="text-sm font-bold w-14 text-center tabular-nums text-slate-700 dark:text-slate-300">
            {Math.round(zoom * 100)}%
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Maximize2 className="size-4" />
          </Button>
        </div>

        <Button 
          variant={isFlowing ? "default" : "outline"}
          size="sm"
          onClick={() => setIsFlowing(!isFlowing)}
          className="gap-2"
        >
          <Waves className="size-4" />
          {isFlowing ? 'Đang chảy' : 'Tạm dừng'}
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="size-3" />
            {activeCount} Active
          </Badge>
          {urgentCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="size-3" />
              {urgentCount} Urgent
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}