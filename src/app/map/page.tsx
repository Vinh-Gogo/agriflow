
"use client"

import { useState } from "react";
import { Waves, Activity, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockMapZones } from "@/lib/map-data";
import { MapHeader } from "@/components/map/map-header";
import { MapLegend } from "@/components/map/map-legend";
import { SystemMapSvg } from "@/components/map/system-map-svg";
import { MapSidebar } from "@/components/map/map-sidebar";

export default function SystemMapPage() {
  const [zoom, setZoom] = useState(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [flowSpeed, setFlowSpeed] = useState(1);
  const [isFlowing, setIsFlowing] = useState(true);

  const activeZones = mockMapZones.filter(z => z.status !== 'Offline');
  const urgentZones = mockMapZones.filter(z => z.thirstLevel === 'URGENT');
  const currentSelectedZone = mockMapZones.find(z => z.id === selectedZone);

  return (
    <div className="space-y-6">
      <MapHeader 
        zoom={zoom} 
        setZoom={setZoom} 
        isFlowing={isFlowing} 
        setIsFlowing={setIsFlowing}
        activeCount={activeZones.length}
        urgentCount={urgentZones.length}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <Card className="xl:col-span-3 border-0 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden h-[750px] relative rounded-3xl border border-slate-200 dark:border-slate-800">
          <CardContent className="p-0 h-full relative bg-gradient-to-b from-sky-100/40 via-blue-50/30 to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
            <SystemMapSvg 
              zoom={zoom}
              isFlowing={isFlowing}
              flowSpeed={flowSpeed}
              zones={mockMapZones}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              hoveredZone={hoveredZone}
              setHoveredZone={setHoveredZone}
            />

            <MapLegend />

            {/* Floating Quick Stats */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="relative p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Waves className="size-5 text-blue-600" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse border-2 border-white dark:border-slate-800" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Áp Suất</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">2.4 bar</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="relative p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <Activity className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Lưu Lượng</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">1,240 L/h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flow Speed Controls */}
            <div className="absolute bottom-6 right-6 p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl">
              <div className="flex items-center gap-3">
                <Timer className="size-4 text-slate-500" />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFlowSpeed(Math.max(0.5, flowSpeed - 0.25))} className="h-7 w-7 p-0">-</Button>
                  <span className="text-sm font-bold w-12 text-center">{flowSpeed}x</span>
                  <Button variant="outline" size="sm" onClick={() => setFlowSpeed(Math.min(3, flowSpeed + 0.25))} className="h-7 w-7 p-0">+</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <MapSidebar 
          selectedZone={currentSelectedZone}
          activeCount={activeZones.length}
          urgentCount={urgentZones.length}
        />
      </div>
    </div>
  );
}
