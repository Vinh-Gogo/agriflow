'use server';
/**
 * @fileOverview This file implements a Genkit flow to explain watering recommendations
 * based on the 'Thirst Index' data for the HydroSense Hub.
 *
 * - explainThirstIndex - A function that provides clear, personalized, and actionable watering recommendations.
 * - ThirstIndexExplainerInput - The input type for the explainThirstIndex function.
 * - ThirstIndexExplainerOutput - The return type for the explainThirstIndex function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ThirstIndexExplainerInputSchema = z.object({
  zoneId: z.string().describe('Unique identifier for the watering zone.'),
  zoneName: z.string().describe('The name of the watering zone (e.g., "Front Yard", "Vegetable Patch").'),
  zoneType: z.enum(['Drip', 'Sprinkler', 'Hybrid']).describe('The type of irrigation system in this zone.'),
  currentSoilMoisture: z.number().min(0).max(100).describe('Current soil moisture level in percentage.'),
  currentTemperature: z.number().describe('Current ambient temperature in Celsius.'),
  currentHumidity: z.number().min(0).max(100).describe('Current ambient humidity in percentage.'),
  currentET0: z.number().min(0).describe('Reference evapotranspiration (ET0) in mm/day.'),
  rainProbability: z.number().min(0).max(100).describe('Probability of rain in percentage.'),
  windSpeed: z.number().min(0).describe('Current wind speed in meters per second (m/s).'),
  thirstIndexLevel: z.enum(['URGENT', 'NORMAL', 'LOW', 'SKIP']).describe('The calculated Thirst Index level for the zone.'),
  kc: z.number().min(0).describe('Crop coefficient used in the Thirst Index calculation.'),
  efficiency: z.number().min(0).max(1).describe('Irrigation system efficiency for the current mode (0 to 1).'),
  weatherPenaltiesApplied: z.boolean().describe('Indicates if weather-based watering penalties were applied by the system.'),
  optimalWateringTime: z.string().describe('The suggested optimal time of day for watering (e.g., "05:00 AM").'),
  recommendedWateringDurationMinutes: z.number().min(0).describe('Recommended watering duration in minutes.'),
  recommendedWaterAmountLiters: z.number().min(0).describe('Recommended water amount in liters.'),
  recommendedWateringMode: z.enum(['Drip', 'Sprinkler', 'Auto']).describe('Recommended watering mode (Drip, Sprinkler, or Auto).'),
});
export type ThirstIndexExplainerInput = z.infer<typeof ThirstIndexExplainerInputSchema>;

const ThirstIndexExplainerOutputSchema = z.object({
  thirstIndexLevel: z.enum(['URGENT', 'NORMAL', 'LOW', 'SKIP']).describe('The Thirst Index level for which the explanation is provided.'),
  recommendedWateringMode: z.enum(['Drip', 'Sprinkler', 'Auto']).describe('The recommended watering mode.'),
  optimalWateringTime: z.string().describe('The recommended optimal time for watering.'),
  recommendedWateringDurationMinutes: z.number().describe('The recommended watering duration in minutes.'),
  recommendedWaterAmountLiters: z.number().describe('The recommended water amount in liters.'),
  naturalLanguageExplanation: z.string().describe('A clear, personalized, and actionable natural language explanation for the watering recommendation, based on all provided data.'),
});
export type ThirstIndexExplainerOutput = z.infer<typeof ThirstIndexExplainerOutputSchema>;

export async function explainThirstIndex(input: ThirstIndexExplainerInput): Promise<ThirstIndexExplainerOutput> {
  return thirstIndexExplainerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'thirstIndexExplainerPrompt',
  input: { schema: ThirstIndexExplainerInputSchema },
  output: { schema: ThirstIndexExplainerOutputSchema },
  prompt: `You are an expert in smart irrigation systems, designed to provide clear, personalized, and actionable watering recommendations.
Your task is to explain the system's watering recommendations for a specific zone based on the provided 'Thirst Index' and environmental data.
Focus on explaining *why* the system made its recommendation, linking it to the sensor data and weather conditions.
Be concise, easy to understand, and persuasive, helping the user trust the system's advice.

Here is the current data for the zone:
- Zone ID: {{{zoneId}}}
- Zone Name: {{{zoneName}}}
- Zone Type: {{{zoneType}}}
- Current Soil Moisture: {{{currentSoilMoisture}}}%
- Current Temperature: {{{currentTemperature}}}°C
- Current Humidity: {{{currentHumidity}}}%
- Reference Evapotranspiration (ET0): {{{currentET0}}} mm/day
- Rain Probability: {{{rainProbability}}}%
- Wind Speed: {{{windSpeed}}} m/s
- Calculated Thirst Index Level: {{{thirstIndexLevel}}}
- Crop Coefficient (Kc): {{{kc}}}
- System Efficiency: {{{efficiency}}}
- Weather Penalties Applied: {{#if weatherPenaltiesApplied}}Yes{{else}}No{{/if}}

The system's recommendation is:
- Recommended Watering Mode: {{{recommendedWateringMode}}}
- Optimal Watering Time: {{{optimalWateringTime}}}
- Recommended Watering Duration: {{{recommendedWateringDurationMinutes}}} minutes
- Recommended Water Amount: {{{recommendedWaterAmountLiters}}} liters

Please provide a natural language explanation for these recommendations. Explain why the 'Thirst Index' is at its current level and how the environmental factors and system parameters influenced the watering suggestion. Ensure the explanation is personalized for the "{{{zoneName}}}" zone.`,
});

const thirstIndexExplainerFlow = ai.defineFlow(
  {
    name: 'thirstIndexExplainerFlow',
    inputSchema: ThirstIndexExplainerInputSchema,
    outputSchema: ThirstIndexExplainerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get an explanation from the AI model.');
    }
    return output;
  }
);
