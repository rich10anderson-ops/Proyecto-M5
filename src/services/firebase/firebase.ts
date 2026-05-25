import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Helper to sanitize environment variables (removes accidental quotes, commas, and spaces)
const sanitizeEnvVar = (value: string | undefined): string => {
  if (!value) return '';
  return value
    .trim()
    .replace(/^["']|["']$/g, '') // remove surrounding double or single quotes
    .replace(/,$/, '')           // remove trailing comma
    .trim()
    .replace(/^["']|["']$/g, ''); // run again in case of spaces inside quotes
};

const firebaseConfig = {
  apiKey: sanitizeEnvVar(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: sanitizeEnvVar(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: sanitizeEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: sanitizeEnvVar(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: sanitizeEnvVar(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: sanitizeEnvVar(import.meta.env.VITE_FIREBASE_APP_ID),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

if (import.meta.env.DEV) {
  (window as any).__db = db;
}