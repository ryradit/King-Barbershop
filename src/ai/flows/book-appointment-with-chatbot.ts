// src/ai/flows/book-appointment-with-chatbot.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for booking appointments through an AI chatbot.
 *
 * - bookAppointmentWithChatbot -  A function that allows users to book appointments by specifying their preferred date and time through the AI chatbot.
 * - BookAppointmentWithChatbotInput - The input type for the bookAppointmentWithChatbot function.
 * - BookAppointmentWithChatbotOutput - The return type for the bookAppointmentWithChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BookAppointmentWithChatbotInputSchema = z.object({
  preferredDate: z.string().describe('The preferred date for the appointment (e.g., YYYY-MM-DD).'),
  preferredTime: z.string().describe('The preferred time for the appointment (e.g., HH:MM).'),
  customerName: z.string().describe('The name of the customer booking the appointment.'),
  contactNumber: z.string().describe('The contact number of the customer.'),
});
export type BookAppointmentWithChatbotInput = z.infer<typeof BookAppointmentWithChatbotInputSchema>;

const BookAppointmentWithChatbotOutputSchema = z.object({
  confirmationMessage: z.string().describe('A message confirming the appointment details, including date and time.'),
  appointmentDetails: z.string().describe('Summary of appointment details including date, time and customer name.')
});
export type BookAppointmentWithChatbotOutput = z.infer<typeof BookAppointmentWithChatbotOutputSchema>;

export async function bookAppointmentWithChatbot(input: BookAppointmentWithChatbotInput): Promise<BookAppointmentWithChatbotOutput> {
  return bookAppointmentWithChatbotFlow(input);
}

const bookAppointmentWithChatbotPrompt = ai.definePrompt({
  name: 'bookAppointmentWithChatbotPrompt',
  input: {schema: BookAppointmentWithChatbotInputSchema},
  output: {schema: BookAppointmentWithChatbotOutputSchema},
  prompt: `You are a booking assistant for King Barbershop - Kutabumi, a barbershop in Indonesia.
  Your primary language for interaction is Indonesian. However, if the customer communicates in English, you should respond in English.

  A customer wants to book an appointment. Here are the details:

  Customer Name: {{{customerName}}}
  Preferred Date: {{{preferredDate}}}
  Preferred Time: {{{preferredTime}}}
  Contact Number: {{{contactNumber}}}

  Generate a confirmation message and appointment details.
  Be sure to greet the customer by name.
  Confirm all appointment details including date and time.
  Respond in a friendly manner.
  Prioritize responding in Indonesian. For example, if the customer name is Budi, preferred date is 2025-10-10, and preferred time is 10:00, a good Indonesian confirmation would be: "Halo Budi, janji temu Anda pada tanggal 10 Oktober 2025 pukul 10:00 telah dikonfirmasi. Sampai jumpa!"
  If the customer used English for their details, you can respond in English, for example: "Hello John, your appointment on October 10, 2025, at 10:00 AM has been confirmed. See you then!"

  Do not ask for any more information, simply confirm the appointment.
  Do not use double asterisks (**) for bolding in your response.
  `,
});

const bookAppointmentWithChatbotFlow = ai.defineFlow(
  {
    name: 'bookAppointmentWithChatbotFlow',
    inputSchema: BookAppointmentWithChatbotInputSchema,
    outputSchema: BookAppointmentWithChatbotOutputSchema,
  },
  async input => {
    const {output} = await bookAppointmentWithChatbotPrompt(input);
    return output!;
  }
);

