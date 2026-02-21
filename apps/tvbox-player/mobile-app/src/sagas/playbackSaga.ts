import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PLAYBACK_ACTIONS } from '../redux/actions/types';
import {
  startPlaybackSuccess,
  startPlaybackFailure,
  stopPlaybackSuccess,
  controlPlaybackSuccess,
  controlPlaybackFailure,
  fetchPlaybackStatusSuccess,
  fetchPlaybackStatusFailure,
} from '../redux/actions';
import { apiClient } from '../services';
import { RootState } from '../redux/reducers';

function* startPlaybackSaga(action: any): Generator<any, void, any> {
  try {
    const { playlistId, startPosition } = action.payload;
    
    const response = yield call([apiClient, 'startPlayback'], playlistId, startPosition);
    yield put(startPlaybackSuccess(response));
  } catch (error: any) {
    yield put(startPlaybackFailure(error.response?.data?.error?.message || error.message));
  }
}

function* stopPlaybackSaga(): Generator<any, void, any> {
  try {
    yield call([apiClient, 'stopPlayback']);
    yield put(stopPlaybackSuccess());
  } catch (error: any) {
    console.error('Stop playback error:', error);
  }
}

function* controlPlaybackSaga(action: any): Generator<any, void, any> {
  try {
    const { action: playbackAction, params } = action.payload;
    
    yield call([apiClient, 'controlPlayback'], playbackAction, params);
    yield put(controlPlaybackSuccess());
    
    const status = yield call([apiClient, 'getPlaybackStatus']);
    yield put(fetchPlaybackStatusSuccess(status));
  } catch (error: any) {
    yield put(controlPlaybackFailure(error.response?.data?.error?.message || error.message));
  }
}

function* fetchPlaybackStatusSaga(): Generator<any, void, any> {
  try {
    const status = yield call([apiClient, 'getPlaybackStatus']);
    yield put(fetchPlaybackStatusSuccess(status));
  } catch (error: any) {
    yield put(fetchPlaybackStatusFailure(error.response?.data?.error?.message || error.message));
  }
}

export default function* playbackSaga() {
  yield takeLatest(PLAYBACK_ACTIONS.START_PLAYBACK_REQUEST, startPlaybackSaga);
  yield takeLatest(PLAYBACK_ACTIONS.STOP_PLAYBACK_REQUEST, stopPlaybackSaga);
  yield takeLatest(PLAYBACK_ACTIONS.CONTROL_PLAYBACK_REQUEST, controlPlaybackSaga);
  yield takeLatest(PLAYBACK_ACTIONS.FETCH_PLAYBACK_STATUS_REQUEST, fetchPlaybackStatusSaga);
}
