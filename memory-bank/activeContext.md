# Active Context: HydroSense Hub

## Current Focus
- Establishing the baseline application structure with core pages (Dashboard, Zones, Schedules, Analytics, Settings).
- Integrating Genkit flows for Thirst Index explanations and Weekly Summaries.
- Fixing initial UI and parsing errors to stabilize the development environment.

## Recent Changes
- Created **Dashboard** with system overview cards and active zone tracking.
- Implemented **Zone Details** page with Recharts visualization and AI reasoning.
- Added **Analytics** page featuring AI-generated weekly reports.
- Integrated **Theme Support** (Light/Dark mode) using `next-themes`.
- Fixed JSX parsing error in `src/app/page.tsx` related to unescaped `>` characters.
- Fixed `useChart` runtime error in `ZoneDetailPage` by ensuring correct `ChartContainer` usage.

## Next Steps
- Implement actual Firebase backend integration (currently using mock data).
- Enhance the "Schedules" page with form logic for creating new routines.
- Refine the AI prompts for better precision in watering recommendations.
