import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, Clock, Plus, Trash2, Edit2 } from "lucide-react";

export default function SchedulesPage() {
  const schedules = [
    { id: 1, name: "Morning Refresh", time: "05:00 AM", days: ["Mon", "Wed", "Fri"], zones: "All Zones", active: true },
    { id: 2, name: "Evening Sprinkler", time: "07:30 PM", days: ["Tue", "Thu", "Sat"], zones: "Backyard Orchard", active: false },
    { id: 3, name: "Veggie Drip", time: "06:00 AM", days: ["Daily"], zones: "Vegetable Patch", active: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Watering Schedules</h1>
          <p className="text-muted-foreground font-body mt-1">Set up recurring irrigation sessions for your garden.</p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 size-4" /> Create Schedule
        </Button>
      </div>

      <div className="grid gap-6">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="border-none shadow-sm bg-card overflow-hidden hover:ring-1 hover:ring-primary/20 transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${schedule.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <CalendarDays className="size-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-foreground">{schedule.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                       <span className="flex items-center gap-1"><Clock className="size-3" /> {schedule.time}</span>
                       <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {schedule.days.join(", ")}</span>
                       <Badge variant="secondary" className="text-[10px] bg-muted/50 border-none">{schedule.zones}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${schedule.active ? 'text-primary' : 'text-muted-foreground'}`}>
                      {schedule.active ? 'Active' : 'Paused'}
                    </span>
                    <Switch checked={schedule.active} />
                  </div>
                  <div className="h-8 w-px bg-border hidden md:block" />
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"><Edit2 className="size-5" /></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"><Trash2 className="size-5" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2 border-border bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
           <div className="p-4 bg-card rounded-full shadow-sm">
              <Plus className="size-8 text-muted-foreground/40" />
           </div>
           <div>
              <p className="font-bold text-muted-foreground">Add a new automated routine</p>
              <p className="text-sm text-muted-foreground/60">Combine multiple zones into a single efficient schedule.</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}