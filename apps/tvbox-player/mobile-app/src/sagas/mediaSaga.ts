import { call, put, takeLatest, select } from 'redux-saga/effects';
import { MEDIA_ACTIONS } from '../redux/actions/types';
import {
  fetchMediaSuccess,
  fetchMediaFailure,
  deleteMediaSuccess,
} from '../redux/actions';
import { apiClient } from '../services';
import { RootState } from '../redux/reducers';

function* fetchMediaSaga(action: any): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const { filters, sort } = state.media;
    
    const params = {
      ...action.payload,
      type: filters.type,
      search: filters.search,
      sort: sort.field,
      order: sort.order,
    };
    
    const response = yield call([apiClient, 'getMedia'], params);
    yield put(fetchMediaSuccess(response.items, response.total_count));
  } catch (error: any) {
    yield put(fetchMediaFailure(error.response?.data?.error?.message || error.message));
  }
}

function* deleteMediaSaga(action: any): Generator<any, void, any> {
  try {
    const mediaId = action.payload;
    
    yield call([apiClient, 'deleteMedia'], mediaId, false);
    yield put(deleteMediaSuccess(mediaId));
  } catch (error: any) {
    console.error('Delete media error:', error);
  }
}

export default function* mediaSaga() {
  yield takeLatest(MEDIA_ACTIONS.FETCH_MEDIA_REQUEST, fetchMediaSaga);
  yield takeLatest(MEDIA_ACTIONS.DELETE_MEDIA_REQUEST, deleteMediaSaga);
  yield takeLatest(MEDIA_ACTIONS.SET_MEDIA_FILTER, fetchMediaSaga);
  yield takeLatest(MEDIA_ACTIONS.SET_MEDIA_SORT, fetchMediaSaga);
}
