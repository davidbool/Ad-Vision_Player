import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from './firebaseConfig';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/** Map a Firebase User object to the lean AuthUser type used by Redux. */
export function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

/**
 * Sign in with email and password.
 * Throws a Firebase AuthError on failure.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const credential: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return toAuthUser(credential.user);
}

/**
 * Create a new account with email and password.
 * Throws a Firebase AuthError on failure.
 */
export async function registerWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const credential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return toAuthUser(credential.user);
}

/**
 * Sign in using Google (requires @react-native-google-signin/google-signin).
 * Configure GoogleSignin.configure({ webClientId: '...' }) once at app startup
 * before calling this.
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error('Google Sign-In did not return an ID token.');
  }
  const googleCredential = GoogleAuthProvider.credential(idToken);
  const credential: UserCredential = await signInWithCredential(
    auth,
    googleCredential
  );
  return toAuthUser(credential.user);
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to Firebase auth-state changes.
 * Returns an unsubscribe function – call it in a cleanup effect.
 *
 * @param callback  Called with an AuthUser when signed in, or null when signed out.
 */
export function subscribeToAuthState(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, firebaseUser => {
    callback(firebaseUser ? toAuthUser(firebaseUser) : null);
  });
}
