
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

console.log('%c[Firebase Config] Attempting to load Firebase config...', 'color: blue; font-weight: bold;');

const essentialConfigMissing = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (essentialConfigMissing) {
  console.error(
    '%c[Firebase Config CRITICAL ERROR] Essential Firebase configuration (NEXT_PUBLIC_FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING or UNDEFINED. Firebase will NOT initialize, and features like Live Comments will fail. Ensure these are set in your .env file (for local development) or environment variables (for deployment) and that your Next.js development server was RESTARTED after changes.',
    'color: red; font-weight: bold; font-size: 1.3em; border: 2px solid red; padding: 5px;'
  );
}

console.log('[Firebase Config] NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded' : 'MISSING or UNDEFINED');
console.log('[Firebase Config] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Loaded' : 'MISSING or UNDEFINED');
console.log('[Firebase Config] NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Loaded' : 'MISSING or UNDEFINED');
console.log('[Firebase Config] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Loaded' : 'MISSING or UNDEFINED');
console.log('[Firebase Config] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Loaded' : 'MISSING or UNDEFINED');
console.log('[Firebase Config] NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Loaded' : 'MISSING or UNDEFINED');
console.log('[Firebase Config] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? 'Loaded (Optional)' : 'MISSING or UNDEFINED (Optional)');

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app; // Will remain undefined if config is critically missing
let db;  // Will remain undefined if app or firestore init fails

if (essentialConfigMissing) {
  console.error('%c[Firebase Init] SKIPPING Firebase initialization due to missing critical config. `db` will be undefined.', 'color: red; font-weight: bold; font-size: 1.1em;');
} else {
  if (!getApps().length) {
    console.log('%c[Firebase Init] No Firebase apps initialized. Calling initializeApp().', 'color: blue; font-weight: bold;');
    try {
      app = initializeApp(firebaseConfig);
      console.log('%c[Firebase Init] initializeApp() successful.', 'color: green; font-weight: bold;');
    } catch (e) {
      console.error('%c[Firebase Init CRITICAL ERROR] initializeApp() failed:', 'color: red; font-weight: bold;', e);
      // app will remain undefined
    }
  } else {
    console.log('%c[Firebase Init] Existing Firebase app found. Calling getApp().', 'color: blue; font-weight: bold;');
    app = getApp();
  }

  if (app) {
    try {
      db = getFirestore(app);
      console.log('%c[Firestore Init] getFirestore() successful. Firestore database instance (db) created.', 'color: green; font-weight: bold;');
    } catch (e) {
      console.error("%c[Firestore Init CRITICAL ERROR] Failed to initialize Firestore with getFirestore():", 'color: red; font-weight: bold;', e);
      console.error("[Firestore Init CRITICAL ERROR] This usually means there's a problem with the Firebase app instance or the project configuration passed to initializeApp. `db` will be undefined.");
      // db will remain undefined
    }
  } else {
    console.error("%c[Firestore Init] Firebase app instance is undefined. Cannot initialize Firestore. This is likely due to a failed initializeApp() call or missing critical config. `db` will be undefined. Check previous Firebase Init logs.", 'color: red; font-weight: bold;');
  }
}

export { app, db };
