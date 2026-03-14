
import { mockZones } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Settings2, 
  Thermometer, 
  Timer, 
  Waves,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function ZonesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Watering Zones</h1>
          <p className="text-muted-foreground font-body mt-1">Manage and monitor individual irrigation zones.</p>
        </div>
        <Button className="bg-primary">
          Add New Zone
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockZones.map((zone) => (
          <Card key={zone.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    zone.type === 'Drip' ? 'bg-sky-100 text-sky-600' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {zone.type === 'Drip' ? <Droplets className="size-6" /> : <Waves className="size-6" />}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{zone.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] py-0">{zone.type} System</Badge>
                      <Badge variant={zone.status === 'Watering' ? 'default' : 'outline'} className="text-[10px] py-0">{zone.status}</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/zones/${zone.id}`}><Settings2 className="size-5" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Soil Moisture</span>
                </div>
                <p className="text-2xl font-bold">{zone.soilMoisture}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Temperature</span>
                </div>
                <p className="text-2xl font-bold">{zone.temperature}°C</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Timer className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Last Watered</span>
                </div>
                <p className="text-sm font-medium">{zone.lastWatered}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Thirst Level</span>
                </div>
                <Badge 
                  className={`text-[10px] uppercase font-bold ${
                    zone.thirstLevel === 'URGENT' ? 'bg-red-500' : 
                    zone.thirstLevel === 'SKIP' ? 'bg-blue-400' : 'bg-green-500'
                  }`}
                >
                  {zone.thirstLevel}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-4 border-t flex gap-2">
              <Button className="flex-1 bg-primary text-white" variant="default" disabled={zone.status === 'Watering'}>
                Start Now
              </Button>
              <Button className="flex-1" variant="outline" asChild>
                <Link href={`/zones/${zone.id}`}>Full Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
