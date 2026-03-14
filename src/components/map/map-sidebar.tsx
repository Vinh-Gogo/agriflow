"use client"

import { motion } from "framer-motion";
import { Droplets, Thermometer, Map as MapIcon, Timer, Activity, Waves, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapZone } from "@/lib/map-data";

interface MapSidebarProps {
  selectedZone: MapZone | undefined;
  activeCount: number;
  urgentCount: number;
}

export function MapSidebar({ selectedZone, activeCount, urgentCount }: MapSidebarProps) {
  return (
    <div className="space-y-4">
      {selectedZone ? (
        <motion.div
          key={selectedZone.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className={`h-2 w-full ${
              selectedZone.thirstLevel === 'URGENT' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              selectedZone.thirstLevel === 'SKIP' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              'bg-gradient-to-r from-emerald-500 to-emerald-600'
            }`} />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {selectedZone.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {selectedZone.description}
                  </CardDescription>
                </div>
                <Badge variant={selectedZone.thirstLevel === 'URGENT' ? 'destructive' : 'default'} className="rounded-full">
                  {selectedZone.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <Droplets size={12} />
                    <span className="text-[10px] font-bold uppercase">Ẩm độ đất</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{selectedZone.soilMoisture}%</span>
                  <Progress value={selectedZone.soilMoisture} className="h-2 mt-2" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <Thermometer size={12} />
                    <span className="text-[10px] font-bold uppercase">Nhiệt độ</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{selectedZone.temperature}°C</span>
                </div>
              </div>
              <Button className="w-full rounded-xl h-11 font-bold shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" asChild>
                <a href={`/zones/${selectedZone.id}`}>Xem Chi Tiết Zone</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <CardContent className="p-8 text-center">
            <MapIcon className="size-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Chọn Khu Vực</h3>
            <p className="text-sm text-slate-500 mt-2">Nhấp vào bất kỳ vùng nào trên bản đồ để xem chi tiết.</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-3xl overflow-hidden border border-blue-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2"><Waves className="size-4" /> Hệ Thống Thủy Lực</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <p className="text-[10px] font-bold opacity-70 uppercase">Lưu lượng</p>
              <p className="text-xl font-bold">1,240 <span className="text-sm font-normal">L/h</span></p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <p className="text-[10px] font-bold opacity-70 uppercase">Áp suất</p>
              <p className="text-xl font-bold">2.4 <span className="text-sm font-normal">bar</span></p>
            </div>
          </div>
          <div className="pt-2 border-t border-white/20">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="opacity-70">Hiệu suất hệ thống</span>
              <span className="font-bold">94%</span>
            </div>
            <Progress value={94} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Zap className="size-4 text-amber-500" /> Thống Kê Nhanh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Đang hoạt động</span>
            <span className="font-bold text-emerald-600">{activeCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Cần chú ý</span>
            <span className="font-bold text-red-600">{urgentCount}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}