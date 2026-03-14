
"use client"

import { useParams } from "next/navigation";
import { mockZones } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Thermometer, Wind, Gauge, ArrowLeft, Play, Square, Sparkles, Activity, History } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { explainThirstIndex, ThirstIndexExplainerOutput } from "@/ai/flows/thirst-index-explainer";

const chartData = [
  { time: "08:00", moisture: 45, temp: 22 },
  { time: "10:00", moisture: 42, temp: 25 },
  { time: "12:00", moisture: 38, temp: 29 },
  { time: "14:00", moisture: 35, temp: 31 },
  { time: "16:00", moisture: 32, temp: 30 },
  { time: "18:00", moisture: 40, temp: 27 },
];

const wateringLogs = [
  { date: "Oct 24, 05:00 AM", duration: "15 min", amount: "45L", mode: "Drip" },
  { date: "Oct 22, 05:00 AM", duration: "20 min", amount: "60L", mode: "Drip" },
  { date: "Oct 20, 06:15 AM", duration: "10 min", amount: "30L", mode: "Drip" },
];

export default function ZoneDetailPage() {
  const { id } = useParams();
  const zone = mockZones.find(z => z.id === id);
  const [aiExplanation, setAiExplanation] = useState<ThirstIndexExplainerOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    async function getAiReasoning() {
      if (!zone) return;
      setLoadingAi(true);
      try {
        const explanation = await explainThirstIndex({
          zoneId: zone.id,
          zoneName: zone.name,
          zoneType: zone.type as any,
          currentSoilMoisture: zone.soilMoisture,
          currentTemperature: zone.temperature,
          currentHumidity: zone.humidity,
          currentET0: 4.5,
          rainProbability: 10,
          windSpeed: 2.5,
          thirstIndexLevel: zone.thirstLevel as any,
          kc: 0.85,
          efficiency: 0.9,
          weatherPenaltiesApplied: false,
          optimalWateringTime: "05:00 AM",
          recommendedWateringDurationMinutes: 15,
          recommendedWaterAmountLiters: 45,
          recommendedWateringMode: zone.type as any
        });
        setAiExplanation(explanation);
      } catch (err) {
        // Error handled centrally by error emitter if needed, but for flows we just log
        console.error("AI flow error:", err);
      } finally {
        setLoadingAi(false);
      }
    }
    getAiReasoning();
  }, [zone]);

  if (!zone) return <div className="p-8 text-center">Zone not found</div>;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full shadow-sm">
          <Link href="/zones"><ArrowLeft className="size-5" /></Link>
        </Button>
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">{zone.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">{zone.type} System</Badge>
            <Badge variant={zone.status === 'Watering' ? 'default' : 'outline'} className={
              zone.status === 'Watering' ? 'bg-primary' : ''
            }>{zone.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Real-time Stats Cards */}
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Droplets className="size-4 text-primary" /> Soil Moisture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zone.soilMoisture}%</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Status: {zone.soilMoisture < 35 ? 'Dry' : 'Optimal'}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Thermometer className="size-4 text-amber-500" /> Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zone.temperature}°C</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Ambient conditions</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Gauge className="size-4 text-accent" /> Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zone.pressure} bar</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Main line pressure</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* History Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Sensor Trends (24h)</CardTitle>
                <CardDescription>Visualizing moisture and temperature variations.</CardDescription>
              </div>
              <Activity className="size-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="moisture" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2 }} activeDot={{ r: 6 }} name="Moisture %" />
                  <Line type="monotone" dataKey="temp" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--accent))", strokeWidth: 2 }} activeDot={{ r: 6 }} name="Temp °C" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-none shadow-sm bg-primary/5 border-primary/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
             <Sparkles className="size-5 text-primary opacity-30" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              AI Thirst Index
            </CardTitle>
            <CardDescription>Intelligent watering logic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
               <span className={`text-5xl font-black ${
                  zone.thirstLevel === 'URGENT' ? 'text-red-500' : 'text-primary'
               }`}>{zone.thirstLevel}</span>
               <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-[0.2em]">Current Recommendation</span>
            </div>

            <div className="space-y-3">
              {loadingAi ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-slate-700 bg-white/50 p-4 rounded-xl">
                  {aiExplanation?.naturalLanguageExplanation || "Analyzing environmental data for recommendations..."}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Duration</span>
                  <span className="text-base font-bold text-primary">{aiExplanation?.recommendedWateringDurationMinutes || 15}m</span>
               </div>
               <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Schedule</span>
                  <span className="text-base font-bold text-primary">{aiExplanation?.optimalWateringTime || '05:00 AM'}</span>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Watering History Log */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-white">
          <CardHeader>
             <div className="flex items-center gap-2">
               <History className="size-5 text-muted-foreground" />
               <CardTitle className="text-lg">Recent Activity Log</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-muted-foreground font-medium">
                    <th className="pb-3 px-2">Date & Time</th>
                    <th className="pb-3 px-2">Duration</th>
                    <th className="pb-3 px-2">Water Used</th>
                    <th className="pb-3 px-2">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {wateringLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2 font-medium">{log.date}</td>
                      <td className="py-4 px-2 text-muted-foreground">{log.duration}</td>
                      <td className="py-4 px-2 font-bold text-primary">{log.amount}</td>
                      <td className="py-4 px-2">
                        <Badge variant="outline" className="text-[10px] uppercase">{log.mode}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Controls Sticky Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
        <Card className="border shadow-2xl bg-white/95 backdrop-blur-md rounded-full overflow-hidden">
          <CardContent className="p-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 ml-4">
              <div className={`size-3 rounded-full ${zone.status === 'Watering' ? 'bg-primary animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-sm font-bold uppercase tracking-tight">System {zone.status}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-12 px-6 rounded-full border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                <Square className="mr-2 size-4 fill-current" /> Stop
              </Button>
              <Button size="sm" className="h-12 px-10 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Play className="mr-2 size-4 fill-current" /> Start
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
