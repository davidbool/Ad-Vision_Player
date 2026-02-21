import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Firebase project configuration.
 *
 * These are public, client-side values – NOT secrets.  Replace the placeholder
 * strings with your real Firebase project values before deploying.
 *
 * Recommended: load from environment variables via react-native-config or
 * a similar tool so the values are kept out of source control.
 */
const REQUIRED_KEYS = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
] as const;

if (__DEV__) {
  const missing = REQUIRED_KEYS.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.warn(
      '[Firebase] Missing environment variables – using placeholder values.\n' +
        'Set these before deploying: ' +
        missing.join(', ')
    );
  }
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY ?? 'YOUR_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? 'YOUR_PROJECT.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID ?? 'YOUR_PROJECT_ID',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? 'YOUR_PROJECT.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? 'YOUR_SENDER_ID',
  appId: process.env.FIREBASE_APP_ID ?? 'YOUR_APP_ID',
};

// Avoid re-initialising during hot-reload in development.
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Firebase Auth instance configured with AsyncStorage persistence so that
 * the user session survives app restarts on both iOS and Android.
 */
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Firestore database instance.
 */
export const db: Firestore = getFirestore(app);

export default app;
