
"use client"

import {
  LayoutDashboard,
  Droplets,
  CalendarDays,
  Bell,
  LineChart,
  Settings,
  X,
  User,
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
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Watering Zones",
    url: "/zones",
    icon: Droplets,
  },
  {
    title: "Schedules",
    url: "/schedules",
    icon: CalendarDays,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: LineChart,
  },
  {
    title: "Alerts Log",
    url: "/alerts",
    icon: Bell,
  },
  {
    title: "Configuration",
    url: "/settings",
    icon: Settings,
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
            <span className="font-headline font-black text-xl text-primary tracking-tight">AgriFlow</span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Hydrosense Hub</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={`h-11 rounded-xl transition-all duration-200 ${
                       pathname === item.url 
                       ? "bg-primary/10 text-primary shadow-sm" 
                       : "hover:bg-slate-50"
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
      </SidebarContent>
      <SidebarFooter className="p-4 border-t bg-slate-50/50">
         <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border shadow-sm group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:border-none">
            <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
               <User className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
               <span className="font-bold text-sm truncate">Garden Manager</span>
               <span className="text-[10px] text-muted-foreground truncate">Home Garden Hub</span>
            </div>
         </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
