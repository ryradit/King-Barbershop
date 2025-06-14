// src/ai/flows/suggest-trending-haircuts.ts
'use server';

/**
 * @fileOverview Provides trending haircut suggestions for men in Indonesia in 2025.
 *
 * - suggestTrendingHaircuts - A function that returns the latest haircut trends for men in Indonesia in 2025.
 * - SuggestTrendingHaircutsInput - The input type for the suggestTrendingHaircuts function.
 * - SuggestTrendingHaircutsOutput - The return type for the suggestTrendingHaircuts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTrendingHaircutsInputSchema = z.object({
  language: z
    .string()
    .describe(
      'The language to use for the response.  Must be either Indonesian or English.'
    ),
});
export type SuggestTrendingHaircutsInput = z.infer<
  typeof SuggestTrendingHaircutsInputSchema
>;

const SuggestTrendingHaircutsOutputSchema = z.object({
  trends: z
    .string()
    .describe('A description of the latest haircut trends for men in Indonesia in 2025.'),
});
export type SuggestTrendingHaircutsOutput = z.infer<
  typeof SuggestTrendingHaircutsOutputSchema
>;

export async function suggestTrendingHaircuts(
  input: SuggestTrendingHaircutsInput
): Promise<SuggestTrendingHaircutsOutput> {
  return suggestTrendingHaircutsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTrendingHaircutsPrompt',
  input: {schema: SuggestTrendingHaircutsInputSchema},
  output: {schema: SuggestTrendingHaircutsOutputSchema},
  prompt: `You are a fashion expert specializing in men's haircuts in Indonesia.
  It is currently 2025.

  What are the latest haircut trends for men in Indonesia?

  Respond in {{language}}.
  Do not use double asterisks (**) for bolding in your response.
  `,
});

const suggestTrendingHaircutsFlow = ai.defineFlow(
  {
    name: 'suggestTrendingHaircutsFlow',
    inputSchema: SuggestTrendingHaircutsInputSchema,
    outputSchema: SuggestTrendingHaircutsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

