
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Smartphone, HardDrive, Wifi, Cloud, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">System Configuration</h1>
        <p className="text-muted-foreground font-body mt-1">Manage global system parameters and device settings.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-8">
          <TabsTrigger value="general" className="px-8">General</TabsTrigger>
          <TabsTrigger value="gateways" className="px-8">Gateways</TabsTrigger>
          <TabsTrigger value="safety" className="px-8">Safety & Limits</TabsTrigger>
          <TabsTrigger value="cloud" className="px-8">Cloud Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Smartphone className="size-5" /> Interface Settings</CardTitle>
              <CardDescription>Personalize how you interact with the HydroSense Hub.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Adjust display colors for night use.</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive real-time alerts on your mobile device.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Measurement Unit</Label>
                  <Input placeholder="Metric (Celsius, Liters)" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Input placeholder="English" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateways" className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><HardDrive className="size-5" /> Gateway Devices</CardTitle>
              <CardDescription>Manage your ESP32 and Raspberry Pi nodes.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y">
                  <div className="p-6 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="size-10 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                           <Wifi className="size-6" />
                        </div>
                        <div>
                           <p className="font-bold">GW-Main-RaspberryPi</p>
                           <p className="text-xs text-muted-foreground">IP: 192.168.1.45 • Status: Online</p>
                        </div>
                     </div>
                     <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="p-6 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="size-10 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                           <Wifi className="size-6" />
                        </div>
                        <div>
                           <p className="font-bold">ESP32-ZoneController-01</p>
                           <p className="text-xs text-muted-foreground">Firmware: v2.4.1 • Status: Online</p>
                        </div>
                     </div>
                     <Button variant="outline" size="sm">Update</Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-destructive"><Shield className="size-5" /> Safety Protocols</CardTitle>
              <CardDescription>Define system emergency stop thresholds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Max Main Line Pressure (bar)</Label>
                  <Input defaultValue="3.5" type="number" />
                  <p className="text-[10px] text-muted-foreground">System will auto-stop if exceeded.</p>
                </div>
                <div className="space-y-2">
                  <Label>Max Wind Speed for Sprinklers (m/s)</Label>
                  <Input defaultValue="5.0" type="number" />
                  <p className="text-[10px] text-muted-foreground">Sprinklers will pause during high winds.</p>
                </div>
                <div className="space-y-2">
                  <Label>Leak Sensitivity (%)</Label>
                  <Input defaultValue="15" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Number</Label>
                  <Input placeholder="+84 ..." />
                </div>
              </div>
              <div className="pt-4">
                <Button className="w-full bg-primary">Save Safety Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
