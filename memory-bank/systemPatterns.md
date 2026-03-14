# System Patterns: HydroSense Hub

## Architecture
- **Framework**: Next.js 15 (App Router).
- **UI Components**: Shadcn UI (Radix-based) for consistency and accessibility.
- **Styling**: Tailwind CSS with a custom HSL-based theme defined in `globals.css`.
- **AI Integration**: Genkit flows hosted as Server Actions for secure and efficient LLM communication.
- **Data Flow**: Mock data in `src/lib/mock-data.ts` currently simulates the state, to be replaced by Firestore.

## Key Design Patterns
- **Server Actions for AI**: All Genkit flows are wrapped in `'use server'` functions for easy client-side invocation.
- **Context Providers**: `ThemeProvider` and `SidebarProvider` handle global UI state.
- **Dynamic Routing**: `src/app/zones/[id]/page.tsx` handles detailed views for specific irrigation nodes.
- **Responsive Layout**: Sidebar-centric navigation that collapses on mobile devices.
