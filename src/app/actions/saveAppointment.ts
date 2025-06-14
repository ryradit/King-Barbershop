
// src/app/actions/saveAppointment.ts
'use server';

import { collection, addDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming db is your initialized Firestore instance
import type { Language } from '@/contexts/LanguageContext';

interface AppointmentDetails {
  customerName: string;
  bookingDate: string; // Should be a string representation, e.g., "2024-07-20"
  bookingTime: string; // e.g., "10:00"
  customerPhone: string;
  paymentMethod: string;
  language: Language;
}

export async function saveAppointmentToFirestore(details: AppointmentDetails): Promise<{ success: boolean; messageKey: { en: string; id: string }; appointmentId?: string }> {
  if (!db) {
    console.error('Firestore database is not initialized.');
    return { 
      success: false, 
      messageKey: { 
        en: 'Database service not available. Appointment not saved.', 
        id: 'Layanan database tidak tersedia. Janji temu tidak disimpan.' 
      } 
    };
  }

  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...details,
      createdAt: serverTimestamp() as Timestamp, // Adds a server-side timestamp
    });
    console.log('Appointment saved to Firestore with ID: ', docRef.id);
    return { 
      success: true, 
      messageKey: { 
        en: 'Appointment successfully saved to our records.', 
        id: 'Janji temu berhasil disimpan di catatan kami.' 
      },
      appointmentId: docRef.id 
    };
  } catch (error) {
    console.error('Error saving appointment to Firestore: ', error);
    let errorMessage = 'Failed to save appointment. Please try again.';
    let errorMessageId = 'Gagal menyimpan janji temu. Silakan coba lagi.';
    if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
        errorMessage = 'Failed to save appointment due to permission issues. Please contact support.';
        errorMessageId = 'Gagal menyimpan janji temu karena masalah izin. Harap hubungi dukungan.';
        console.error('Firestore security rules might be misconfigured or too restrictive for the "appointments" collection.');
    }
    return { 
      success: false, 
      messageKey: { 
        en: errorMessage, 
        id: errorMessageId 
      } 
    };
  }
}

    