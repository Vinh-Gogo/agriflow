"use client"

import { mockZones } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Thermometer, 
  Gauge,
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ZonesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Watering Zones</h1>
          <p className="text-muted-foreground font-body mt-1">Manage and monitor your individual irrigation zones.</p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 size-4" /> Add New Zone
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockZones.map((zone) => (
          <Card key={zone.id} className="border-none shadow-sm bg-card overflow-hidden hover:ring-1 hover:ring-primary/20 transition-all group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold text-foreground">{zone.name}</CardTitle>
                <CardDescription className="text-muted-foreground/80">{zone.type} System • {zone.description}</CardDescription>
              </div>
              <Badge variant={
                zone.status === 'Watering' ? 'default' : 
                zone.status === 'Warning' ? 'destructive' : 
                'outline'
              } className="border-none uppercase tracking-widest text-[10px] font-bold">
                {zone.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mt-4 bg-muted/30 p-4 rounded-xl">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                    <Droplets className="size-3 text-primary" /> Moisture
                  </p>
                  <p className="text-lg font-bold text-foreground">{zone.soilMoisture}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                    <Thermometer className="size-3 text-amber-500" /> Temp
                  </p>
                  <p className="text-lg font-bold text-foreground">{zone.temperature}°C</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                    <Gauge className="size-3 text-accent" /> Pressure
                  </p>
                  <p className="text-lg font-bold text-foreground">{zone.pressure} bar</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Last watered: {zone.lastWatered}</p>
                <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5" asChild>
                  <Link href={`/zones/${zone.id}`}>
                    Manage <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}