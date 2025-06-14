// src/ai/flows/answer-hairstyle-question.ts
'use server';
/**
 * @fileOverview A Genkit flow for answering general hairstyle-related questions.
 *
 * - answerHairstyleQuestion - A function that provides answers to user questions about hairstyles.
 * - AnswerHairstyleQuestionInput - The input type for the answerHairstyleQuestion function.
 * - AnswerHairstyleQuestionOutput - The return type for the answerHairstyleQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerHairstyleQuestionInputSchema = z.object({
  question: z.string().describe('The user\'s question about hairstyles or related topics.'),
  language: z.string().describe('The language for the response (e.g., "en" or "id").'),
});
export type AnswerHairstyleQuestionInput = z.infer<typeof AnswerHairstyleQuestionInputSchema>;

const AnswerHairstyleQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the hairstyle-related question.'),
});
export type AnswerHairstyleQuestionOutput = z.infer<typeof AnswerHairstyleQuestionOutputSchema>;

export async function answerHairstyleQuestion(input: AnswerHairstyleQuestionInput): Promise<AnswerHairstyleQuestionOutput> {
  return answerHairstyleQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerHairstyleQuestionPrompt',
  input: {schema: AnswerHairstyleQuestionInputSchema},
  output: {schema: AnswerHairstyleQuestionOutputSchema},
  prompt: `You are KingBot, a friendly and highly knowledgeable AI assistant for King Barbershop - Kutabumi, specializing in all aspects of men's hairstyles.
A customer has a question: "{{{question}}}"

Your primary goal is to provide helpful, informative, and concise answers related to men's hairstyles, hair care, styling products, hair health, and specific haircut details.
- If the question is directly about a hairstyle, describe it, discuss its suitability for different hair types/face shapes if relevant, and offer styling tips.
- If the question is about hair care, provide practical advice.
- If the question is about a styling product, explain its use and benefits.
- If the question is very broad (e.g., "what's a good haircut?"), you can ask for more details like their face shape, hair type, or style preference to give a more tailored response, or provide a few general popular options.
- If the question is unclear, ask for clarification.
- If the question is completely unrelated to hairstyles, hair, or barbershop services, politely state that you specialize in these areas and cannot assist with unrelated topics.

Respond in {{language}}.
Do not use double asterisks (**) for bolding in your response.
Keep your answer focused and avoid making up information.
`,
});

const answerHairstyleQuestionFlow = ai.defineFlow(
  {
    name: 'answerHairstyleQuestionFlow',
    inputSchema: AnswerHairstyleQuestionInputSchema,
    outputSchema: AnswerHairstyleQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
