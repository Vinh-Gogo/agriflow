
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {mockZones.map((zone) => (
          <Card key={zone.id} className="border-none shadow-sm bg-white overflow-hidden hover:ring-1 hover:ring-primary/20 transition-all">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">{zone.name}</CardTitle>
                <CardDescription>{zone.type} System • {zone.description}</CardDescription>
              </div>
              <Badge variant={
                zone.status === 'Watering' ? 'default' : 
                zone.status === 'Warning' ? 'destructive' : 
                'outline'
              }>
                {zone.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 uppercase">
                    <Droplets className="size-3 text-primary" /> Moisture
                  </p>
                  <p className="text-lg font-bold">{zone.soilMoisture}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 uppercase">
                    <Thermometer className="size-3 text-amber-500" /> Temp
                  </p>
                  <p className="text-lg font-bold">{zone.temperature}°C</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 uppercase">
                    <Gauge className="size-3 text-accent" /> Pressure
                  </p>
                  <p className="text-lg font-bold">{zone.pressure} bar</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs text-muted-foreground italic">Last watered: {zone.lastWatered}</p>
                <Button variant="ghost" size="sm" className="text-primary font-bold group" asChild>
                  <Link href={`/zones/${zone.id}`}>
                    Details <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
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
