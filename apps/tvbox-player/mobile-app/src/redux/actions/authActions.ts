import { AUTH_ACTIONS } from './types';
import { AuthUser } from '../../services/firebase/authService';

export const loginRequest = (email: string, password: string) => ({
  type: AUTH_ACTIONS.LOGIN_REQUEST,
  payload: { email, password },
} as const);

export const loginWithGoogle = () => ({
  type: AUTH_ACTIONS.LOGIN_WITH_GOOGLE,
} as const);

export const loginSuccess = (user: AuthUser) => ({
  type: AUTH_ACTIONS.LOGIN_SUCCESS,
  payload: user,
} as const);

export const loginFailure = (error: string) => ({
  type: AUTH_ACTIONS.LOGIN_FAILURE,
  payload: error,
} as const);

export const registerRequest = (email: string, password: string) => ({
  type: AUTH_ACTIONS.REGISTER_REQUEST,
  payload: { email, password },
} as const);

export const registerSuccess = (user: AuthUser) => ({
  type: AUTH_ACTIONS.REGISTER_SUCCESS,
  payload: user,
} as const);

export const registerFailure = (error: string) => ({
  type: AUTH_ACTIONS.REGISTER_FAILURE,
  payload: error,
} as const);

export const logout = () => ({
  type: AUTH_ACTIONS.LOGOUT,
} as const);

export const logoutSuccess = () => ({
  type: AUTH_ACTIONS.LOGOUT_SUCCESS,
} as const);

export const authStateChanged = (user: AuthUser | null) => ({
  type: AUTH_ACTIONS.AUTH_STATE_CHANGED,
  payload: user,
} as const);
