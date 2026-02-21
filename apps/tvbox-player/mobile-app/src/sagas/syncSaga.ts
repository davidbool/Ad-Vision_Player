import { call, put, takeLatest } from 'redux-saga/effects';
import { SYNC_ACTIONS } from '../redux/actions/types';
import {
  startSyncSuccess,
  startSyncFailure,
  cancelSyncSuccess,
  fetchSyncStatusSuccess,
  fetchSyncStatusFailure,
} from '../redux/actions';
import { apiClient } from '../services';

function* startSyncSaga(action: any): Generator<any, void, any> {
  try {
    const { provider, folders, options } = action.payload;
    
    const response = yield call([apiClient, 'startSync'], provider, folders, options);
    yield put(startSyncSuccess(response));
  } catch (error: any) {
    yield put(startSyncFailure(error.response?.data?.error?.message || error.message));
  }
}

function* cancelSyncSaga(action: any): Generator<any, void, any> {
  try {
    const jobId = action.payload;
    
    yield call([apiClient, 'cancelSync'], jobId);
    yield put(cancelSyncSuccess(jobId));
  } catch (error: any) {
    console.error('Cancel sync error:', error);
  }
}

function* fetchSyncStatusSaga(action: any): Generator<any, void, any> {
  try {
    const jobId = action.payload;
    
    const response = yield call([apiClient, 'getSyncStatus'], jobId);
    yield put(fetchSyncStatusSuccess(response));
  } catch (error: any) {
    yield put(fetchSyncStatusFailure(error.response?.data?.error?.message || error.message));
  }
}

export default function* syncSaga() {
  yield takeLatest(SYNC_ACTIONS.START_SYNC_REQUEST, startSyncSaga);
  yield takeLatest(SYNC_ACTIONS.CANCEL_SYNC_REQUEST, cancelSyncSaga);
  yield takeLatest(SYNC_ACTIONS.FETCH_SYNC_STATUS_REQUEST, fetchSyncStatusSaga);
}
