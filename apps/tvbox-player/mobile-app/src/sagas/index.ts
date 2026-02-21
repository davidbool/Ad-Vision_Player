import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import deviceSaga from './deviceSaga';
import playbackSaga from './playbackSaga';
import playlistSaga from './playlistSaga';
import mediaSaga from './mediaSaga';
import syncSaga from './syncSaga';
import settingsSaga from './settingsSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(deviceSaga),
    fork(playbackSaga),
    fork(playlistSaga),
    fork(mediaSaga),
    fork(syncSaga),
    fork(settingsSaga),
  ]);
}
