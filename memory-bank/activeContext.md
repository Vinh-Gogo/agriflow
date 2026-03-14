# Active Context: HydroSense Hub

## Current Focus
- Upgrading the Architectural Map with organic visuals and precise infrastructure tracking.
- Ensuring water flow animations strictly follow pipe paths for realistic visualization.
- Maintaining project documentation integrity.

## Recent Changes
- **Refined Flow Animations**: Linked SVG flow particles to the primary `id` of pipe paths using `<mpath>`, ensuring water travels strictly within the distribution network.
- **Upgraded System Map**: Implemented an advanced version of the 2D architectural map using spline curves, gradients, and animated SVG elements.
- **Improved Map UI**: Added a detailed info sidebar with AnimatePresence transitions and a network status overview.
- Fixed `DialogContent` accessibility warning in `src/components/ui/sheet.tsx` using `VisuallyHidden`.
- Integrated `next-themes` and full dark mode support across all components.
- Modernized the UI to follow a professional, data-driven "feed" aesthetic inspired by dev-to-clone.

## Next Steps
- Implement actual Firebase backend integration (currently using mock data).
- Enhance the "Schedules" page with form logic for creating new routines.
- Refine the AI prompts for better precision in watering recommendations.
