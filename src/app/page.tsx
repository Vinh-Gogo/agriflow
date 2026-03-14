
"use client"

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  CloudRain,
  Zap,
  Gauge,
  Sun,
  Play,
  Pause
} from "lucide-react";
import { mockZones, mockAlerts } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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

const StatWidget = ({ title, value, unit, icon: Icon, trend, colorClass }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="p-5 border-none shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
          <h4 className="text-2xl font-bold tracking-tight">
            {value} <span className="text-sm text-muted-foreground font-normal">{unit}</span>
          </h4>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
          <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs">
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-muted-foreground ml-1">vs yesterday</span>
        </div>
      )}
    </Card>
  </motion.div>
);

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const activeWateringCount = mockZones.filter(z => z.status === 'Watering').length;
  const avgMoisture = Math.round(mockZones.reduce((acc, z) => acc + z.soilMoisture, 0) / mockZones.length);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Welcome Back! 👋</h1>
          <p className="text-muted-foreground font-body mt-1">
            System is stable. {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-2 px-3 border-r">
            <Sun className="text-amber-500 size-5" />
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Weather</p>
              <p className="text-sm font-bold">29°C, 65% hum</p>
            </div>
          </div>
          <div className="px-3">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Rain Prob</p>
            <p className="text-sm font-bold">10%</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatWidget 
          title="Water Usage" 
          value="450.5" 
          unit="L/h" 
          icon={Droplets} 
          trend={12} 
          colorClass="bg-blue-500" 
        />
        <StatWidget 
          title="Active Zones" 
          value={activeWateringCount} 
          unit={`/ ${mockZones.length}`} 
          icon={Activity} 
          colorClass="bg-green-500" 
        />
        <StatWidget 
          title="Avg. Moisture" 
          value={avgMoisture} 
          unit="%" 
          icon={Thermometer} 
          trend={-2}
          colorClass="bg-accent" 
        />
        <StatWidget 
          title="Water Savings" 
          value="18.5" 
          unit="%" 
          icon={Zap} 
          trend={5} 
          colorClass="bg-purple-500" 
        />
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Main Content: Usage Chart & Zones */}
        <div className="md:col-span-4 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden bg-white">
             <CardHeader className="pb-2">
               <CardTitle className="text-lg font-bold">Water Usage Trends</CardTitle>
               <CardDescription>Real-time consumption for the last 24 hours.</CardDescription>
             </CardHeader>
             <CardContent className="pt-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockHistoryData}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>

          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-bold text-gray-800">Zone Overview</h3>
                <Button variant="link" size="sm" asChild className="text-primary font-bold">
                   <Link href="/zones">View All <ArrowUpRight className="ml-1 size-4" /></Link>
                </Button>
             </div>
             <div className="grid gap-4 sm:grid-cols-2">
                {mockZones.slice(0, 4).map((zone) => (
                  <motion.div key={zone.id} whileHover={{ y: -4 }}>
                    <Card className="relative overflow-hidden border-none shadow-sm group">
                       <div className={`absolute top-0 left-0 w-1 h-full ${
                          zone.status === 'Watering' ? 'bg-green-500' : 
                          zone.status === 'Warning' ? 'bg-red-500' : 'bg-slate-200'
                       }`} />
                       <CardHeader className="p-5 pb-2">
                          <div className="flex items-start justify-between">
                             <div>
                                <CardTitle className="text-base font-bold">{zone.name}</CardTitle>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">{zone.type} System</p>
                             </div>
                             <div className={`p-2 rounded-lg ${zone.status === 'Watering' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                {zone.status === 'Watering' ? <Pause size={16} /> : <Play size={16} />}
                             </div>
                          </div>
                       </CardHeader>
                       <CardContent className="p-5 pt-0">
                          <div className="grid grid-cols-2 gap-3 my-4">
                             <div className="bg-slate-50 p-2 rounded-xl">
                                <p className="text-[9px] text-muted-foreground font-bold uppercase mb-1">Moisture</p>
                                <p className="text-lg font-bold">{zone.soilMoisture}%</p>
                             </div>
                             <div className="bg-slate-50 p-2 rounded-xl">
                                <p className="text-[9px] text-muted-foreground font-bold uppercase mb-1">Pressure</p>
                                <p className="text-lg font-bold">{zone.status === 'Watering' ? zone.pressure : '0.0'} <span className="text-[10px] font-normal">bar</span></p>
                             </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                             <span>Last: {zone.lastWatered}</span>
                             <Badge variant={zone.status === 'Watering' ? 'default' : 'outline'} className="text-[8px] h-4 px-1.5 uppercase font-black">
                                {zone.status}
                             </Badge>
                          </div>
                       </CardContent>
                    </Card>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Sidebar: AI & Alerts */}
        <div className="md:col-span-3 space-y-8">
           <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center gap-2 mb-4">
                 <Zap className="text-yellow-300 size-5" />
                 <h3 className="font-bold text-lg">Smart Suggestion</h3>
              </div>
              <p className="text-primary-foreground/90 text-sm leading-relaxed mb-6">
                 Based on the 10% rain probability at 14:00, the AI recommends <strong>skipping Zone 4</strong> today to save 45L of water.
              </p>
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md rounded-xl font-bold">
                 Apply Suggestion
              </Button>
           </Card>

           <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-2">
                 <CardTitle className="text-lg font-bold">System Health</CardTitle>
                 <CardDescription>Gateway & sensor connectivity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-3">
                       <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-sm font-bold">ESP32 Gateway Main</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Online (4G)</span>
                 </div>
                 <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-3">
                       <div className="size-2 rounded-full bg-green-500" />
                       <span className="text-sm font-bold">Main 550W Pump</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Ready</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="size-2 rounded-full bg-amber-500" />
                       <span className="text-sm font-bold">Rain Sensor #1</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Calib. Needed</span>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-white overflow-hidden">
             <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Activity Log</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y">
                   {mockAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                         <div className="mt-1">
                            {alert.severity === 'high' ? (
                               <AlertTriangle className="size-4 text-red-500" />
                            ) : (
                               <CheckCircle2 className="size-4 text-green-500" />
                            )}
                         </div>
                         <div>
                            <p className="text-xs font-bold leading-tight">{alert.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{alert.time}</p>
                         </div>
                      </div>
                   ))}
                </div>
                <Button variant="ghost" className="w-full text-xs font-bold rounded-none h-10 border-t" asChild>
                   <Link href="/alerts">View Full Logs</Link>
                </Button>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
