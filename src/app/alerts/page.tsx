import { mockAlerts } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, CheckCircle2, Info, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Notifications Log</h1>
          <p className="text-muted-foreground font-body mt-1">Review system alerts, events, and operational logs.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
           <Input className="pl-9 bg-card border-border" placeholder="Filter logs..." />
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg text-foreground">Recent Events</CardTitle>
          <CardDescription>Showing last 24 hours of activity.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="p-6 flex gap-6 hover:bg-muted/30 transition-colors">
                <div className={`p-3 rounded-xl flex-shrink-0 ${
                  alert.severity === 'high' ? 'bg-destructive/10 text-destructive' : 
                  alert.severity === 'medium' ? 'bg-amber-100/10 text-amber-600' : 
                  'bg-emerald-100/10 text-emerald-600'
                }`}>
                  {alert.severity === 'high' ? (
                    <AlertTriangle className="size-6" />
                  ) : alert.severity === 'medium' ? (
                    <Bell className="size-6" />
                  ) : (
                    <CheckCircle2 className="size-6" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-base text-foreground">{alert.type}</p>
                    <span className="text-xs font-medium text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{alert.message}</p>
                  <div className="pt-2">
                    <Badge variant="secondary" className="text-[10px] uppercase border-none bg-muted font-bold tracking-widest">{alert.severity} Priority</Badge>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-6 flex gap-6 hover:bg-muted/30 transition-colors">
               <div className="p-3 rounded-xl flex-shrink-0 bg-primary/10 text-primary">
                  <Info className="size-6" />
               </div>
               <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-base text-foreground">Schedule Applied</p>
                    <span className="text-xs font-medium text-muted-foreground">5 hours ago</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Automated Schedule "Morning Refresh" applied to 3 zones.</p>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}