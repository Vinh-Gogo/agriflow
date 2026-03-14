
"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pipette, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapLegend() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-6 left-6 p-5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-3 min-w-[240px]">
      <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        <div className="flex items-center gap-2">
          <Pipette className="size-4" /> Chú Thích Hệ Thống
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-6 h-6 w-6" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </Button>
      </div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="size-4 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/50" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Đủ nước</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-4 rounded bg-gradient-to-br from-lime-400 to-lime-600 shadow-sm shadow-lime-500/50" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ẩm độ thấp</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-4 rounded bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm shadow-orange-500/50" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Đang tưới</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-4 rounded bg-gradient-to-br from-red-400 to-red-600 shadow-sm shadow-red-500/50" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Khẩn cấp</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-4 rounded bg-zinc-600 border border-zinc-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Chưa lắp đặt</span>
            </div>
            
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="w-10 h-2.5 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 rounded-full shadow-sm" />
                <span>Ống dẫn chính (Xanh Dương)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-white shadow-sm" />
                <span>Trạm phân phối</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
                <span>Cảm biến độ ẩm</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="w-4 h-2 rounded bg-blue-800 border border-blue-500" />
                <span>Van điều tiết</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
