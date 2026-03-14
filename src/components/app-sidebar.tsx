"use client"

import {
  LayoutDashboard,
  Droplets,
  CalendarDays,
  Bell,
  LineChart,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Watering Zones",
    url: "/zones",
    icon: Droplets,
  },
  {
    title: "Automations",
    url: "/schedules",
    icon: Zap,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: LineChart,
  },
  {
    title: "System Alerts",
    url: "/alerts",
    icon: Bell,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Droplets className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-black text-xl text-primary tracking-tighter">AgriFlow</span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">Irrigation Hub</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={`h-11 transition-all duration-200 ${
                       pathname === item.url 
                       ? "bg-primary/10 text-primary" 
                       : "hover:bg-muted"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={`size-5 ${pathname === item.url ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-bold text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-11 hover:bg-muted transition-all">
                  <Link href="/settings" className="flex items-center gap-3">
                    <Settings className="size-5 text-muted-foreground" />
                    <span className="font-bold text-sm">Hardware Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-11 hover:bg-muted transition-all">
                  <Link href="#" className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-muted-foreground" />
                    <span className="font-bold text-sm">Security Policy</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
         <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg group-data-[collapsible=icon]:p-1">
            <div className="size-8 rounded bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
               <ShieldCheck className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
               <span className="font-bold text-xs truncate">Encrypted Node</span>
               <span className="text-[9px] text-muted-foreground tracking-widest uppercase">ESP32-V4</span>
            </div>
         </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}