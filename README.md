# HydroSense Hub (AgriFlow)

HydroSense Hub is a professional-grade smart irrigation management system built with Next.js, Genkit, and Tailwind CSS. It combines real-time sensor data with generative AI to provide intelligent watering recommendations and system analytics.

## 🚀 Features

- **Real-time Monitoring**: Track soil moisture, temperature, and system pressure across multiple irrigation zones.
- **AI-Powered "Thirst Index"**: Uses Genkit and Gemini 2.5 Flash to analyze environmental data and provide natural language explanations for watering needs.
- **System Analytics**: AI-generated weekly reports summarizing performance, water consumption, and actionable optimizations.
- **Responsive Dashboard**: A modern, "dev-to" inspired feed layout that highlights the most relevant system updates and anomalies.
- **Automated Scheduling**: Manage complex irrigation routines tailored to specific plant types (e.g., Drip, Sprinkler, Hybrid).
- **Manual Control**: Sticky control bar for instant start/stop overrides on a per-zone basis.
- **Dark Mode**: Full support for light and dark themes via `next-themes`.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: Shadcn UI & Tailwind CSS
- **AI Engine**: Genkit with Google Generative AI (Gemini 2.5 Flash)
- **Charts**: Recharts with Shadcn Chart wrappers
- **Icons**: Lucide React
- **Animation**: Framer Motion

## 📁 Project Structure

- `src/app`: Next.js pages and layouts.
- `src/ai/flows`: Genkit AI flow definitions for intelligent reasoning.
- `src/components`: Reusable UI components (Sidebar, Dashboard cards, etc.).
- `src/lib`: Mock data and utility functions.
- `memory-bank/`: Project documentation and context for AI-assisted development.

## 🚦 Getting Started

1. **Environment Setup**: Ensure your `.env` file contains a valid `GEMINI_API_KEY`.
2. **Development**:
   ```bash
   npm run dev
   ```
3. **Genkit UI**:
   ```bash
   npm run genkit:dev
   ```

## 📝 Documentation

For detailed information on the project architecture, patterns, and progress, refer to the files in the `memory-bank/` directory.
