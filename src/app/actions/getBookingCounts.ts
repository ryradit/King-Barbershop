
// src/app/actions/getBookingCounts.ts
'use server';

import { collection, query, where, getCountFromServer, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// This list must be kept in sync with the availableTimes in src/app/book/page.tsx
const ALL_POSSIBLE_TIMES = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export async function getBookingCountsForDate(date: string): Promise<Record<string, number>> {
  if (!db) {
    console.error('Firestore database is not initialized.');
    throw new Error('Database service not available.');
  }
  if (!date) {
     console.warn('getBookingCountsForDate called without a date.');
     const initialCounts: Record<string, number> = {};
     ALL_POSSIBLE_TIMES.forEach(time => initialCounts[time] = 0);
     return initialCounts;
  }

  try {
    const counts: Record<string, number> = {};
    // Initialize counts for all possible time slots to 0
    ALL_POSSIBLE_TIMES.forEach(time => counts[time] = 0);

    // Fetch counts for each time slot individually for better performance with getCountFromServer
    for (const time of ALL_POSSIBLE_TIMES) {
      const q = query(
        collection(db, 'appointments'),
        where('bookingDate', '==', date), // date is expected in YYYY-MM-DD format
        where('bookingTime', '==', time)
      );
      const snapshot = await getCountFromServer(q);
      counts[time] = snapshot.data().count;
    }
    
    return counts;
  } catch (error) {
    // Log the detailed error for server-side debugging
    console.error('Firestore error in getBookingCountsForDate: ', error); 

    // Default user-facing message
    let userFacingMessage = 'Failed to fetch booking availability. Please try again. Check server logs for more details.';

    // Attempt to give a more specific hint based on common Firestore issues
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'failed-precondition') {
        userFacingMessage = 'Failed to fetch booking availability. This could be due to a missing Firestore index. Please check your Firebase console (server logs or Firestore Indexes tab) for suggestions related to the "appointments" collection, typically needing an index on bookingDate and bookingTime.';
        console.error(
            'POSSIBLE MISSING INDEX: The "Failed to fetch booking availability" error might be due to a missing Firestore index. ' +
            'Check your Firebase console (Firestore > Indexes tab) or server logs for a link to create an index for the "appointments" collection on fields "bookingDate" and "bookingTime". ' +
            'Original error details are logged above.'
        );
      } else if (errorCode === 'permission-denied') {
        userFacingMessage = 'Failed to fetch booking availability. This might be due to Firestore security rules. Please check the rules for the "appointments" collection in your Firebase console.';
        console.error(
            'PERMISSION DENIED: The "Failed to fetch booking availability" error is likely due to Firestore security rules. ' +
            'Please review your rules for the "appointments" collection in the Firebase console to ensure read access (get/list/count) is allowed for this operation. ' +
            'The operation attempts to count appointments based on "bookingDate" and "bookingTime". ' +
            'Original error details are logged above.'
        );
      }
    }
    
    // The error thrown here will be caught by the client-side component.
    throw new Error(userFacingMessage);
  }
}

