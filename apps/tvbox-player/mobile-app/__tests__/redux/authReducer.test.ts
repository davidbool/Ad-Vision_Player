import authReducer, { AuthState } from '../../src/redux/reducers/authReducer';
import {
  loginRequest,
  loginWithGoogle,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logout,
  logoutSuccess,
  authStateChanged,
} from '../../src/redux/actions/authActions';

const mockUser = {
  uid: 'uid-abc',
  email: 'user@example.com',
  displayName: 'Jane Doe',
  photoURL: null,
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

describe('authReducer', () => {
  it('returns the initial state for unknown actions', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('login flow', () => {
    it('sets isLoading=true on LOGIN_REQUEST', () => {
      const state = authReducer(initialState, loginRequest('a@b.com', 'pw'));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('sets isLoading=true on LOGIN_WITH_GOOGLE', () => {
      const state = authReducer(initialState, loginWithGoogle());
      expect(state.isLoading).toBe(true);
    });

    it('stores user and clears loading on LOGIN_SUCCESS', () => {
      const loading = { ...initialState, isLoading: true };
      const state = authReducer(loading, loginSuccess(mockUser));
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
      expect(state.isInitialized).toBe(true);
    });

    it('stores error and clears loading on LOGIN_FAILURE', () => {
      const loading = { ...initialState, isLoading: true };
      const state = authReducer(loading, loginFailure('Invalid credentials'));
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe('Invalid credentials');
      expect(state.isInitialized).toBe(true);
    });
  });

  describe('register flow', () => {
    it('sets isLoading=true on REGISTER_REQUEST', () => {
      const state = authReducer(initialState, registerRequest('a@b.com', 'pw'));
      expect(state.isLoading).toBe(true);
    });

    it('stores user on REGISTER_SUCCESS', () => {
      const loading = { ...initialState, isLoading: true };
      const state = authReducer(loading, registerSuccess(mockUser));
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('stores error on REGISTER_FAILURE', () => {
      const loading = { ...initialState, isLoading: true };
      const state = authReducer(loading, registerFailure('Email in use'));
      expect(state.error).toBe('Email in use');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logout flow', () => {
    it('sets isLoading=true and clears error on LOGOUT', () => {
      const loggedIn: AuthState = {
        user: mockUser,
        isLoading: false,
        error: 'Previous error',
        isInitialized: true,
      };
      const state = authReducer(loggedIn, logout());
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('clears user on LOGOUT_SUCCESS', () => {
      const loggedIn: AuthState = {
        user: mockUser,
        isLoading: true,
        error: null,
        isInitialized: true,
      };
      const state = authReducer(loggedIn, logoutSuccess());
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('auth state changes', () => {
    it('sets user when AUTH_STATE_CHANGED fires with a user', () => {
      const state = authReducer(initialState, authStateChanged(mockUser));
      expect(state.user).toEqual(mockUser);
      expect(state.isInitialized).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('clears user when AUTH_STATE_CHANGED fires with null', () => {
      const loggedIn: AuthState = {
        user: mockUser,
        isLoading: false,
        error: null,
        isInitialized: true,
      };
      const state = authReducer(loggedIn, authStateChanged(null));
      expect(state.user).toBeNull();
      expect(state.isInitialized).toBe(true);
    });
  });
});
