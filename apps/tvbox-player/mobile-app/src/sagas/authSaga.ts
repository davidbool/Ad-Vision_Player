import { call, put, takeLatest, take, fork, cancel } from 'redux-saga/effects';
import { eventChannel, EventChannel, END } from 'redux-saga';
import { AUTH_ACTIONS } from '../redux/actions/types';
import {
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  authStateChanged,
} from '../redux/actions/authActions';
import {
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signOutUser,
  subscribeToAuthState,
  AuthUser,
} from '../services/firebase/authService';
import { createUserProfile } from '../services/firebase/firestoreService';

// ─────────────────────────────────────────────────────────────────────────────
// Auth state channel – bridges Firebase's callback API into redux-saga events.
// ─────────────────────────────────────────────────────────────────────────────

// Wrapper type to distinguish "signed out" (null user) from channel closure.
type AuthEvent = { user: AuthUser | null };

function createAuthStateChannel(): EventChannel<AuthEvent> {
  return eventChannel(emit => {
    const unsubscribe = subscribeToAuthState(user => {
      // Always emit a wrapped event so null (signed-out) is a valid payload.
      emit({ user });
    });
    // Return the Firebase unsubscribe as the eventChannel cleanup function.
    return () => {
      unsubscribe();
      emit(END);
    };
  });
}

function* watchAuthState(): Generator<any, void, any> {
  const channel: EventChannel<AuthEvent> = yield call(createAuthStateChannel);
  try {
    while (true) {
      const event: AuthEvent = yield take(channel);
      yield put(authStateChanged(event.user));
    }
  } finally {
    channel.close();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual auth operation sagas
// ─────────────────────────────────────────────────────────────────────────────

function* loginSaga(action: any): Generator<any, void, any> {
  try {
    const { email, password } = action.payload;
    const user: AuthUser = yield call(signInWithEmail, email, password);
    yield put(loginSuccess(user));
  } catch (error: any) {
    yield put(loginFailure(error.message ?? 'Login failed'));
  }
}

function* loginWithGoogleSaga(): Generator<any, void, any> {
  try {
    const user: AuthUser = yield call(signInWithGoogle);
    yield put(loginSuccess(user));
  } catch (error: any) {
    yield put(loginFailure(error.message ?? 'Google sign-in failed'));
  }
}

function* registerSaga(action: any): Generator<any, void, any> {
  try {
    const { email, password } = action.payload;
    const user: AuthUser = yield call(registerWithEmail, email, password);
    // Create the Firestore user profile on registration.
    yield call(createUserProfile, user.uid, user.email, user.displayName);
    yield put(registerSuccess(user));
  } catch (error: any) {
    yield put(registerFailure(error.message ?? 'Registration failed'));
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call(signOutUser);
    yield put(logoutSuccess());
  } catch (error: any) {
    // Even on error, clear local state.
    yield put(logoutSuccess());
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Root auth saga
// ─────────────────────────────────────────────────────────────────────────────

export default function* authSaga() {
  // Start listening for Firebase auth state changes immediately.
  // The task is forked so it runs concurrently with action watchers.
  yield fork(watchAuthState);

  yield takeLatest(AUTH_ACTIONS.LOGIN_REQUEST, loginSaga);
  yield takeLatest(AUTH_ACTIONS.LOGIN_WITH_GOOGLE, loginWithGoogleSaga);
  yield takeLatest(AUTH_ACTIONS.REGISTER_REQUEST, registerSaga);
  yield takeLatest(AUTH_ACTIONS.LOGOUT, logoutSaga);
}
