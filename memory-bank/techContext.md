# Tech Context: HydroSense Hub

## Technologies Used
- **Frontend**: Next.js 15.5.9, React 19, Tailwind CSS.
- **UI Library**: Shadcn UI (Radix, Lucide Icons).
- **Charts**: Recharts with Shadcn Chart wrapper.
- **AI**: Genkit 1.28.0 with Google Generative AI (Gemini 2.5 Flash).
- **State/Theming**: `next-themes` for dark mode support.
- **Icons**: `lucide-react`.

## Development Setup
- Port: 9002.
- Environment: Node.js with Turbopack.
- Configuration: `next.config.ts` handles image remote patterns for placeholders.

## Technical Constraints
- All Firebase operations must use the client SDK (once implemented).
- AI flows must be defined in `src/ai/flows/`.
- Images should use `next/image` and reference `placeholder-images.json`.
