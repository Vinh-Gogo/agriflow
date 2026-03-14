import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { Droplets, Search, Bell, Settings as SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'AgriFlow | Smart Irrigation Management',
  description: 'Pro-grade automated irrigation monitoring and control.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-foreground selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              <header className="header-sticky px-4 md:px-8 justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="hidden lg:flex items-center gap-2 mr-4">
                    <Droplets className="size-6 text-primary" />
                    <span className="font-bold text-xl tracking-tighter">AgriFlow</span>
                  </div>
                  <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search system logs, zones..." 
                      className="pl-10 h-10 bg-muted/50 border-border focus-visible:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Bell className="size-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <SettingsIcon className="size-5" />
                  </Button>
                  <Button className="ml-2 hidden sm:flex">Run Diagnostic</Button>
                </div>
              </header>
              <main className="flex-1">
                <div className="container mx-auto max-w-6xl p-4 md:p-8">
                  {children}
                </div>
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}