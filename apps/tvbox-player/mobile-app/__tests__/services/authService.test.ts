import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signOutUser,
  subscribeToAuthState,
  toAuthUser,
} from '../../src/services/firebase/authService';

const mockUser = {
  uid: 'uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
};

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toAuthUser', () => {
    it('maps a Firebase user object to AuthUser', () => {
      const result = toAuthUser(mockUser as any);
      expect(result).toEqual({
        uid: 'uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
      });
    });
  });

  describe('signInWithEmail', () => {
    it('returns an AuthUser on success', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });

      const result = await signInWithEmail('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(result.uid).toBe('uid-123');
      expect(result.email).toBe('test@example.com');
    });

    it('propagates Firebase errors', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
        new Error('auth/wrong-password')
      );

      await expect(signInWithEmail('test@example.com', 'wrong')).rejects.toThrow(
        'auth/wrong-password'
      );
    });
  });

  describe('registerWithEmail', () => {
    it('creates a new user and returns AuthUser', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });

      const result = await registerWithEmail('new@example.com', 'secure123');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(result.uid).toBe('uid-123');
    });

    it('propagates registration errors', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
        new Error('auth/email-already-in-use')
      );

      await expect(
        registerWithEmail('existing@example.com', 'password')
      ).rejects.toThrow('auth/email-already-in-use');
    });
  });

  describe('signInWithGoogle', () => {
    it('returns an AuthUser after Google sign-in', async () => {
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValueOnce(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValueOnce({
        data: { idToken: 'google-id-token', user: {} },
      });
      (signInWithCredential as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });

      const result = await signInWithGoogle();

      expect(result.uid).toBe('uid-123');
    });

    it('throws when Google does not return an idToken', async () => {
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValueOnce(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValueOnce({
        data: { idToken: null },
      });

      await expect(signInWithGoogle()).rejects.toThrow(
        'Google Sign-In did not return an ID token.'
      );
    });
  });

  describe('signOutUser', () => {
    it('calls Firebase signOut', async () => {
      (signOut as jest.Mock).mockResolvedValueOnce(undefined);

      await signOutUser();

      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeToAuthState', () => {
    it('calls the callback with AuthUser when signed in', () => {
      (onAuthStateChanged as jest.Mock).mockImplementationOnce(
        (_auth: any, callback: (user: any) => void) => {
          callback(mockUser);
          return jest.fn();
        }
      );

      const callback = jest.fn();
      subscribeToAuthState(callback);

      expect(callback).toHaveBeenCalledWith({
        uid: 'uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
      });
    });

    it('calls the callback with null when signed out', () => {
      (onAuthStateChanged as jest.Mock).mockImplementationOnce(
        (_auth: any, callback: (user: any) => void) => {
          callback(null);
          return jest.fn();
        }
      );

      const callback = jest.fn();
      subscribeToAuthState(callback);

      expect(callback).toHaveBeenCalledWith(null);
    });

    it('returns an unsubscribe function', () => {
      const unsubscribeMock = jest.fn();
      (onAuthStateChanged as jest.Mock).mockReturnValueOnce(unsubscribeMock);

      const unsubscribe = subscribeToAuthState(jest.fn());

      expect(typeof unsubscribe).toBe('function');
    });
  });
});
