
// src/ai/flows/handle-customer-feedback-flow.ts
'use server';
/**
 * @fileOverview A Genkit flow for analyzing customer feedback for negative sentiment and generating an empathetic response.
 *
 * - handleCustomerFeedback - Analyzes text for complaints and suggests a response.
 * - HandleCustomerFeedbackInput - Input type for the flow.
 * - HandleCustomerFeedbackOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Language } from '@/contexts/LanguageContext';

const HandleCustomerFeedbackInputSchema = z.object({
  inputText: z.string().describe('The customer\'s feedback text.'),
  language: z.string().describe('The language for the response (e.g., "en" or "id").'),
  customerName: z.string().optional().describe('The name of the customer providing feedback.'),
  source: z.enum(['chatbot', 'review']).describe('The source of the feedback (chatbot or live review).')
});
export type HandleCustomerFeedbackInput = z.infer<typeof HandleCustomerFeedbackInputSchema>;

const HandleCustomerFeedbackOutputSchema = z.object({
  isNegative: z.boolean().describe('Whether the feedback is classified as negative or a complaint.'),
  response: z.string().nullable().describe('The AI-generated empathetic response, or null if not negative.'),
});
export type HandleCustomerFeedbackOutput = z.infer<typeof HandleCustomerFeedbackOutputSchema>;

export async function handleCustomerFeedback(input: HandleCustomerFeedbackInput): Promise<HandleCustomerFeedbackOutput> {
  return handleCustomerFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleCustomerFeedbackPrompt',
  input: {schema: HandleCustomerFeedbackInputSchema},
  output: {schema: HandleCustomerFeedbackOutputSchema},
  prompt: `You are an AI customer service representative for King Barbershop. Your primary goal is to identify negative feedback or complaints and draft an initial, brief, empathetic response.

Language for response: {{{language}}}
{{#if customerName}}Customer's Name: {{{customerName}}}{{/if}}
Source of feedback: {{{source}}}
Feedback text: "{{{inputText}}}"

Analyze the feedback text.
1.  Determine if the feedback expresses a significant complaint, strong dissatisfaction, or highly negative sentiment.
2.  If it IS a complaint or strongly negative:
    Set 'isNegative' to true.
    Craft a 'response' (1-2 concise sentences) in the specified {{{language}}}.
    -   Acknowledge their concern (e.g., "We're sorry to hear about your experience." or "Kami mohon maaf atas ketidaknyamanan Anda.").
    -   Be polite and empathetic. Do NOT be defensive, argumentative, or make specific promises you cannot guarantee.
    -   If the source is 'review', your response can gently guide them to direct contact for resolution, e.g., "We value your feedback and would like to understand more. Please reach out to us directly." or "Masukan Anda sangat berarti. Silakan hubungi kami langsung agar kami dapat tindak lanjuti."
    -   If the source is 'chatbot', your response can be more about understanding further, e.g., "I'm sorry to hear that. Could you please tell me a bit more about what happened so I can try to help?" or "Saya turut prihatin mendengarnya. Bisa ceritakan lebih detail apa yang terjadi agar saya bisa bantu?"
3.  If the feedback is NOT a complaint or strongly negative (e.g., it's neutral, positive, a general question, or a mild suggestion without strong negative emotion):
    Set 'isNegative' to false.
    Set 'response' to null.

Output ONLY the JSON object conforming to the HandleCustomerFeedbackOutputSchema. Do not include any other text or explanations.
Example for negative review in English:
{ "isNegative": true, "response": "We're very sorry to hear about your experience. We value your feedback and would like to understand more. Please reach out to us directly so we can address your concerns." }

Example for negative chatbot message in Indonesian:
{ "isNegative": true, "response": "Saya mohon maaf atas pengalaman kurang menyenangkan Anda. Bisa ceritakan lebih detail apa yang terjadi agar saya dapat mencoba membantu?" }

Example for neutral/positive feedback:
{ "isNegative": false, "response": null }
`,
});

const handleCustomerFeedbackFlow = ai.defineFlow(
  {
    name: 'handleCustomerFeedbackFlow',
    inputSchema: HandleCustomerFeedbackInputSchema,
    outputSchema: HandleCustomerFeedbackOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (output) {
        return output;
      }
      // Fallback if LLM output is not as expected
      console.warn("HandleCustomerFeedbackFlow: LLM output was null or undefined. Defaulting to not negative.");
      return { isNegative: false, response: null };
    } catch (error) {
      console.error("Error in handleCustomerFeedbackFlow:", error);
      // Fallback in case of error during LLM call
      return { isNegative: false, response: null };
    }
  }
);
