import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { Droplets } from "lucide-react";

export const metadata: Metadata = {
  title: 'HydroSense Hub | Smart Irrigation Control',
  description: 'AI-Powered Automated Irrigation System for Gardens and Farms',
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
      <body className="font-body antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              {/* Mobile-only Header with Sidebar Trigger */}
              <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:hidden sticky top-0 z-10 bg-background/95 backdrop-blur">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex items-center gap-2">
                  <Droplets className="size-4 text-primary" />
                  <span className="font-semibold text-sm tracking-tight">HydroSense Hub</span>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto max-w-7xl p-6 lg:p-8">
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
