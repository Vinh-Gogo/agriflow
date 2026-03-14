'use server';
/**
 * @fileOverview Provides an AI-generated weekly summary of the irrigation system's performance.
 *
 * - weeklyIrrigationSummary - A function that fetches data and generates a weekly irrigation report.
 * - WeeklyIrrigationSummaryInput - The input type for the weeklyIrrigationSummary function.
 * - WeeklyIrrigationSummaryOutput - The return type for the weeklyIrrigationSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeeklyIrrigationSummaryInputSchema = z.object({
  weekNumber: z.number().describe('The week number for which the summary is generated.'),
  year: z.number().describe('The year for which the summary is generated.'),
  reportDate: z.string().describe('The end date of the reporting week in YYYY-MM-DD format.'),
  zoneSummaries: z.array(
    z.object({
      zoneId: z.string().describe('Unique identifier for the irrigation zone (e.g., "Zone 1 Drip").'),
      plantType: z.string().describe('Type of plants in this zone (e.g., "fruit trees", "vegetables", "lawn").'),
      avgSoilMoisturePercentage: z.number().describe('Average soil moisture percentage for the week.'),
      minSoilMoisturePercentage: z.number().describe('Minimum recorded soil moisture percentage for the week.'),
      maxSoilMoisturePercentage: z.number().describe('Maximum recorded soil moisture percentage for the week.'),
      avgTemperatureCelsius: z.number().describe('Average ambient temperature in Celsius for the week.'),
      totalWateringEvents: z.number().describe('Total number of watering sessions in the week.'),
      totalWaterConsumedLiters: z.number().describe('Total liters of water consumed in this zone for the week.'),
      totalWateringDurationMinutes: z.number().describe('Total duration of watering in minutes for the week.'),
      dominantWateringMode: z.string().describe('The primary watering mode used (e.g., "Drip", "Sprinkler", "Hybrid").'),
      peakWateringDay: z.string().optional().describe('The day with the most significant watering event (e.g., "Tuesday").'),
      significantEvents: z.array(z.string()).optional().describe('Any significant events or anomalies in the zone (e.g., "low pressure detected", "manual override").'),
    })
  ).describe('An array of aggregated data for each irrigation zone for the week.'),
});
export type WeeklyIrrigationSummaryInput = z.infer<typeof WeeklyIrrigationSummaryInputSchema>;

const WeeklyIrrigationSummaryOutputSchema = z.object({
  overallSummary: z.string().describe('A concise overall summary of the irrigation system performance for the week.'),
  zoneSummaries: z.array(
    z.object({
      zoneId: z.string().describe('The unique identifier of the irrigation zone.'),
      summary: z.string().describe('A brief summary of the performance and key metrics for this specific zone.'),
    })
  ).describe('An array of summaries for each individual irrigation zone.'),
  recommendations: z.array(z.string()).describe('Actionable recommendations for optimizing water usage and maintaining garden health for the upcoming week.'),
});
export type WeeklyIrrigationSummaryOutput = z.infer<typeof WeeklyIrrigationSummaryOutputSchema>;

export async function weeklyIrrigationSummary(input: WeeklyIrrigationSummaryInput): Promise<WeeklyIrrigationSummaryOutput> {
  return weeklyIrrigationSummaryFlow(input);
}

const weeklyIrrigationSummaryPrompt = ai.definePrompt({
  name: 'weeklyIrrigationSummaryPrompt',
  input: {schema: WeeklyIrrigationSummaryInputSchema},
  output: {schema: WeeklyIrrigationSummaryOutputSchema},
  prompt: `You are an expert in smart irrigation systems and agricultural efficiency, capable of analyzing environmental data and watering patterns to provide concise, actionable insights.

Analyze the provided weekly irrigation data for week {{{weekNumber}}} of {{{year}}}, ending on {{{reportDate}}}.

Based on this data, provide:
1.  An overall summary of the entire irrigation system's performance.
2.  A brief summary for each individual zone, highlighting its performance and key metrics.
3.  Actionable recommendations for optimizing water usage and maintaining garden health for the upcoming week.

---
Weekly Irrigation Data:

{{#each zoneSummaries}}
### Zone ID: {{{zoneId}}} (Plant Type: {{{plantType}}})
- Average Soil Moisture: {{{avgSoilMoisturePercentage}}}% (Min: {{{minSoilMoisturePercentage}}}%, Max: {{{maxSoilMoisturePercentage}}}%)
- Average Temperature: {{{avgTemperatureCelsius}}}°C
- Total Watering Events: {{{totalWateringEvents}}}
- Total Water Consumed: {{{totalWaterConsumedLiters}}} Liters
- Total Watering Duration: {{{totalWateringDurationMinutes}}} Minutes
- Dominant Watering Mode: {{{dominantWateringMode}}}
{{#if peakWateringDay}}- Peak Watering Day: {{{peakWateringDay}}}{{/if}}
{{#if significantEvents}}
- Significant Events:
    {{#each significantEvents}}
    - {{{this}}}
    {{/each}}
{{/if}}
---
{{/each}}

Please structure your response according to the following JSON schema, ensuring all fields are populated appropriately:
\`\`\`json
{{jsonSchema WeeklyIrrigationSummaryOutputSchema}}
\`\`\`
`,
});

const weeklyIrrigationSummaryFlow = ai.defineFlow(
  {
    name: 'weeklyIrrigationSummaryFlow',
    inputSchema: WeeklyIrrigationSummaryInputSchema,
    outputSchema: WeeklyIrrigationSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await weeklyIrrigationSummaryPrompt(input);
    return output!;
  }
);