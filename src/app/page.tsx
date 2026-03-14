"use client"

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Zap, 
  AlertTriangle,
  ArrowUpRight,
  Gauge,
  Play,
  Pause,
  Clock,
  ExternalLink,
  ChevronRight,
  Settings as SettingsIcon
} from "lucide-react";
import { mockZones, mockAlerts } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const mockHistoryData = [
  { time: '00:00', usage: 0 }, { time: '04:00', usage: 120 },
  { time: '08:00', usage: 450 }, { time: '12:00', usage: 380 },
  { time: '16:00', usage: 520 }, { time: '20:00', usage: 200 },
];

export default function Dashboard() {
  const activeWateringCount = mockZones.filter(z => z.status === 'Watering').length;
  const avgMoisture = Math.round(mockZones.reduce((acc, z) => acc + z.soilMoisture, 0) / mockZones.length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Sidebar Stats */}
      <div className="hidden lg:flex flex-col gap-4">
        <div className="article-card !p-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">System Vitality</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2 text-foreground/80"><Droplets className="size-4 text-primary" /> Moisture</span>
              <span className="font-bold text-foreground">{avgMoisture}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2 text-foreground/80"><Activity className="size-4 text-green-500" /> Active</span>
              <span className="font-bold text-foreground">{activeWateringCount} Zones</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2 text-foreground/80"><Gauge className="size-4 text-amber-500" /> Pressure</span>
              <span className="font-bold text-foreground">2.4 bar</span>
            </div>
          </div>
        </div>

        <div className="article-card !p-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Shortcuts</h3>
          <nav className="space-y-1">
            <Link href="/zones" className="sidebar-link active"><Droplets className="size-4" /> My Zones</Link>
            <Link href="/schedules" className="sidebar-link"><Zap className="size-4" /> Automation</Link>
            <Link href="/analytics" className="sidebar-link"><Activity className="size-4" /> Analytics</Link>
          </nav>
        </div>
      </div>

      {/* Main Content Feed */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" className="font-bold border-b-2 border-primary rounded-none px-0 h-auto pb-2 text-foreground">Relevant</Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary px-0 h-auto pb-2">Latest Updates</Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary px-0 h-auto pb-2">Anomalies</Button>
        </div>

        {/* AI Suggestion Card */}
        <div className="article-card border-2 border-primary/20 bg-primary/5 shadow-sm">
          <div className="flex items-center gap-2 text-primary font-bold mb-3">
            <Zap className="size-4 fill-current" />
            <span className="text-xs uppercase tracking-widest">Smart Irrigation Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold hover:text-primary transition-colors cursor-pointer mb-2 text-foreground">
            AI Optimization: Recommended Skip for Zone 4 (Side Lawn)
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Analysis of real-time weather patterns predicts a 30% rain probability at 14:00. 
            Skipping the scheduled 15:00 cycle will save approximately 45L of water while maintaining optimal soil moisture levels.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Efficiency</Badge>
              <Badge variant="secondary" className="border-none">Weather</Badge>
            </div>
            <Button size="sm">Apply Optimization</Button>
          </div>
        </div>

        {/* Zones Feed */}
        {mockZones.map((zone) => (
          <div key={zone.id} className="article-card group shadow-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className={`size-12 rounded-full flex items-center justify-center ${
                  zone.status === 'Watering' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  <Droplets className="size-6" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground/80 uppercase tracking-wider">Controller #{zone.id.split('-')[1]}</span>
                  <span>•</span>
                  <span>Last Watering {zone.lastWatered}</span>
                </div>
                <Link href={`/zones/${zone.id}`}>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2 cursor-pointer text-foreground">
                    {zone.name}: {zone.description}
                  </h3>
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag-badge">#{zone.type.toLowerCase()}</span>
                  <span className="tag-badge">#{zone.thirstLevel.toLowerCase()}</span>
                  <span className="tag-badge">#sensor-v2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Droplets className="size-4 text-primary" /> {zone.soilMoisture}%</span>
                    <span className="flex items-center gap-1"><Thermometer className="size-4 text-amber-500" /> {zone.temperature}°C</span>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary text-muted-foreground" asChild>
                    <Link href={`/zones/${zone.id}`}>
                      Details <ChevronRight className="ml-1 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Sidebar Widgets */}
      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center justify-between text-foreground">
              Consumption <ArrowUpRight className="size-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockHistoryData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Today</span>
              <span className="text-primary text-sm tracking-tight">450.5 L</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">System Health</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y border-t">
              {mockAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-bold leading-tight text-foreground/90 line-clamp-2">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 uppercase font-bold tracking-wider">
                    <Clock className="size-3" /> {alert.time}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-xs font-bold rounded-none h-10 border-t text-muted-foreground hover:text-primary" asChild>
              <Link href="/alerts">View Full Logs</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="article-card !bg-transparent border-dashed border-2 flex flex-col items-center justify-center p-8 text-center space-y-3 shadow-none">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center">
            <SettingsIcon className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">Add New Zone</p>
            <p className="text-xs text-muted-foreground">Expand your AgriFlow network.</p>
          </div>
          <Button variant="outline" size="sm" className="w-full">Initialize Device</Button>
        </div>
      </div>
    </div>
  );
}