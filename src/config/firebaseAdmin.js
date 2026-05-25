/**
 * WARNING: This file is designed to run in a Node.js server environment or CLI scripts.
 * DO NOT import this file in any frontend React component (client-side code)
 * as it relies on 'firebase-admin' which is a server-only SDK and will break Vite.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

let app;

// Prevent initializing multiple apps in hot-reloading or script environments
if (getApps().length === 0) {
  if (projectId && clientEmail && privateKey) {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    console.log("🔥 Firebase Admin initialized with service account credentials.");
  } else {
    // Fallback to Application Default Credentials (ADC) or environmental defaults
    app = initializeApp();
    console.log("🔥 Firebase Admin initialized with default application credentials.");
  }
} else {
  app = getApps()[0];
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export { app };
