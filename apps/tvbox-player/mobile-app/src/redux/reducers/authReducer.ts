import { AUTH_ACTIONS } from '../actions/types';
import { AuthUser } from '../../services/firebase/authService';

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  /** True once the initial Firebase auth-state check has completed. */
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export default function authReducer(
  state = initialState,
  action: any
): AuthState {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_REQUEST:
    case AUTH_ACTIONS.LOGIN_WITH_GOOGLE:
    case AUTH_ACTIONS.REGISTER_REQUEST:
      return { ...state, isLoading: true, error: null };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        error: null,
        isInitialized: true,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isInitialized: true,
      };

    case AUTH_ACTIONS.LOGOUT:
      return { ...state, isLoading: true, error: null };

    case AUTH_ACTIONS.LOGOUT_SUCCESS:
      return { ...state, isLoading: false, user: null, error: null };

    case AUTH_ACTIONS.AUTH_STATE_CHANGED:
      return {
        ...state,
        user: action.payload,
        isInitialized: true,
        isLoading: false,
      };

    default:
      return state;
  }
}
