import { call, put, takeLatest } from 'redux-saga/effects';
import { PLAYLIST_ACTIONS } from '../redux/actions/types';
import {
  fetchPlaylistsSuccess,
  fetchPlaylistsFailure,
  createPlaylistSuccess,
  deletePlaylistSuccess,
} from '../redux/actions';
import { apiClient } from '../services';

function* fetchPlaylistsSaga(): Generator<any, void, any> {
  try {
    const response = yield call([apiClient, 'getPlaylists']);
    yield put(fetchPlaylistsSuccess(response.playlists));
  } catch (error: any) {
    yield put(fetchPlaylistsFailure(error.response?.data?.error?.message || error.message));
  }
}

function* createPlaylistSaga(action: any): Generator<any, void, any> {
  try {
    const { name, description, mediaIds } = action.payload;
    
    const response = yield call([apiClient, 'createPlaylist'], name, description, mediaIds);
    yield put(createPlaylistSuccess(response));
  } catch (error: any) {
    console.error('Create playlist error:', error);
  }
}

function* updatePlaylistSaga(action: any): Generator<any, void, any> {
  try {
    const { playlistId, updates } = action.payload;
    
    yield call([apiClient, 'updatePlaylist'], playlistId, updates);
    yield call(fetchPlaylistsSaga);
  } catch (error: any) {
    console.error('Update playlist error:', error);
  }
}

function* deletePlaylistSaga(action: any): Generator<any, void, any> {
  try {
    const playlistId = action.payload;
    
    yield call([apiClient, 'deletePlaylist'], playlistId);
    yield put(deletePlaylistSuccess(playlistId));
  } catch (error: any) {
    console.error('Delete playlist error:', error);
  }
}

function* addItemsToPlaylistSaga(action: any): Generator<any, void, any> {
  try {
    const { playlistId, mediaIds } = action.payload;
    
    yield call([apiClient, 'addItemsToPlaylist'], playlistId, mediaIds);
    yield call(fetchPlaylistsSaga);
  } catch (error: any) {
    console.error('Add items to playlist error:', error);
  }
}

function* removeItemsFromPlaylistSaga(action: any): Generator<any, void, any> {
  try {
    const { playlistId, mediaIds } = action.payload;
    
    yield call([apiClient, 'removeItemsFromPlaylist'], playlistId, mediaIds);
    yield call(fetchPlaylistsSaga);
  } catch (error: any) {
    console.error('Remove items from playlist error:', error);
  }
}

function* reorderPlaylistItemsSaga(action: any): Generator<any, void, any> {
  try {
    const { playlistId, mediaIds } = action.payload;
    
    yield call([apiClient, 'reorderPlaylistItems'], playlistId, mediaIds);
    yield call(fetchPlaylistsSaga);
  } catch (error: any) {
    console.error('Reorder playlist items error:', error);
  }
}

export default function* playlistSaga() {
  yield takeLatest(PLAYLIST_ACTIONS.FETCH_PLAYLISTS_REQUEST, fetchPlaylistsSaga);
  yield takeLatest(PLAYLIST_ACTIONS.CREATE_PLAYLIST_REQUEST, createPlaylistSaga);
  yield takeLatest(PLAYLIST_ACTIONS.UPDATE_PLAYLIST_REQUEST, updatePlaylistSaga);
  yield takeLatest(PLAYLIST_ACTIONS.DELETE_PLAYLIST_REQUEST, deletePlaylistSaga);
  yield takeLatest(PLAYLIST_ACTIONS.ADD_ITEMS_TO_PLAYLIST, addItemsToPlaylistSaga);
  yield takeLatest(PLAYLIST_ACTIONS.REMOVE_ITEMS_FROM_PLAYLIST, removeItemsFromPlaylistSaga);
  yield takeLatest(PLAYLIST_ACTIONS.REORDER_PLAYLIST_ITEMS, reorderPlaylistItemsSaga);
}
