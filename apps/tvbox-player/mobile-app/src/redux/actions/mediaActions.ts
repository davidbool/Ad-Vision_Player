import { MEDIA_ACTIONS } from './types';
import { MediaItem } from '../../utils/types';

export const fetchMediaRequest = (filters?: any) => ({
  type: MEDIA_ACTIONS.FETCH_MEDIA_REQUEST,
  payload: filters,
});

export const fetchMediaSuccess = (items: MediaItem[], totalCount: number) => ({
  type: MEDIA_ACTIONS.FETCH_MEDIA_SUCCESS,
  payload: { items, totalCount },
});

export const fetchMediaFailure = (error: string) => ({
  type: MEDIA_ACTIONS.FETCH_MEDIA_FAILURE,
  payload: error,
});

export const deleteMediaRequest = (mediaId: string) => ({
  type: MEDIA_ACTIONS.DELETE_MEDIA_REQUEST,
  payload: mediaId,
});

export const deleteMediaSuccess = (mediaId: string) => ({
  type: MEDIA_ACTIONS.DELETE_MEDIA_SUCCESS,
  payload: mediaId,
});

export const setMediaFilter = (filter: string, value: any) => ({
  type: MEDIA_ACTIONS.SET_MEDIA_FILTER,
  payload: { filter, value },
});

export const setMediaSort = (sort: string, order: string) => ({
  type: MEDIA_ACTIONS.SET_MEDIA_SORT,
  payload: { sort, order },
});
