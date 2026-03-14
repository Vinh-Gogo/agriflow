
"use client"

import { useParams } from "next/navigation";
import { mockZones } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Thermometer, Wind, Gauge, ArrowLeft, Play, Square, Sparkles } from "lucide-react";
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
          currentET0: 4.5, // Mock value
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
        console.error("AI flow error:", err);
      } finally {
        setLoadingAi(false);
      }
    }
    getAiReasoning();
  }, [zone]);

  if (!zone) return <div>Zone not found</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/zones"><ArrowLeft className="size-5" /></Link>
        </Button>
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">{zone.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{zone.type} System</Badge>
            <Badge variant={zone.status === 'Watering' ? 'default' : 'outline'}>{zone.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Real-time Stats Cards */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Droplets className="size-4 text-primary" /> Soil Moisture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zone.soilMoisture}%</div>
            <p className="text-xs text-muted-foreground mt-1">Status: {zone.soilMoisture < 35 ? 'Dry' : 'Optimal'}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Thermometer className="size-4 text-amber-500" /> Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zone.temperature}°C</div>
            <p className="text-xs text-muted-foreground mt-1">Ambient conditions</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Gauge className="size-4 text-accent" /> Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{zone.pressure} bar</div>
            <p className="text-xs text-muted-foreground mt-1">Main line pressure</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* History Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Sensor Trends (24h)</CardTitle>
            <CardDescription>Visualizing moisture and temperature variations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="moisture" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} name="Moisture %" />
                  <Line type="monotone" dataKey="temp" stroke="hsl(var(--accent))" strokeWidth={3} dot={false} name="Temp °C" />
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
            <CardDescription>Personalized watering logic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border">
               <span className={`text-4xl font-black ${
                  zone.thirstLevel === 'URGENT' ? 'text-red-500' : 'text-primary'
               }`}>{zone.thirstLevel}</span>
               <span className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Recommended Status</span>
            </div>

            <div className="space-y-3">
              {loadingAi ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-slate-700">
                  {aiExplanation?.naturalLanguageExplanation || "Analyzing environmental data for recommendations..."}
                </p>
              )}
            </div>

            <div className="pt-4 grid grid-cols-2 gap-2 text-[10px] font-bold text-muted-foreground uppercase">
               <div className="p-2 bg-white rounded border flex flex-col items-center">
                  <span>Duration</span>
                  <span className="text-sm text-foreground mt-0.5">{aiExplanation?.recommendedWateringDurationMinutes || 15}m</span>
               </div>
               <div className="p-2 bg-white rounded border flex flex-col items-center">
                  <span>Best Time</span>
                  <span className="text-sm text-foreground mt-0.5">{aiExplanation?.optimalWateringTime || '05:00 AM'}</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Controls Sticky Bar (Visual only for now) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <Card className="border shadow-2xl bg-white/95 backdrop-blur-md">
          <CardContent className="p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 ml-2">
              <div className="size-3 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Mode: {zone.type}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-10 px-6 rounded-full">
                <Square className="mr-2 size-4 fill-current" /> Stop
              </Button>
              <Button size="sm" className="h-10 px-8 rounded-full bg-primary hover:bg-primary/90">
                <Play className="mr-2 size-4 fill-current" /> Start
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
