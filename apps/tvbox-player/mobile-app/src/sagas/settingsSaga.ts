import { call, put, takeLatest } from 'redux-saga/effects';
import { SETTINGS_ACTIONS } from '../redux/actions/types';
import {
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateSettingsSuccess,
  updateSettingsFailure,
} from '../redux/actions';
import { apiClient } from '../services';

function* fetchSettingsSaga(): Generator<any, void, any> {
  try {
    const response = yield call([apiClient, 'getSettings']);
    yield put(fetchSettingsSuccess(response));
  } catch (error: any) {
    yield put(fetchSettingsFailure(error.response?.data?.error?.message || error.message));
  }
}

function* updateSettingsSaga(action: any): Generator<any, void, any> {
  try {
    const updates = action.payload;
    
    const response = yield call([apiClient, 'updateSettings'], updates);
    yield put(updateSettingsSuccess(response));
  } catch (error: any) {
    yield put(updateSettingsFailure(error.response?.data?.error?.message || error.message));
  }
}

export default function* settingsSaga() {
  yield takeLatest(SETTINGS_ACTIONS.FETCH_SETTINGS_REQUEST, fetchSettingsSaga);
  yield takeLatest(SETTINGS_ACTIONS.UPDATE_SETTINGS_REQUEST, updateSettingsSaga);
}
