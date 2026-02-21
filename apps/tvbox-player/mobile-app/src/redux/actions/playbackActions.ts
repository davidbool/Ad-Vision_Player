import { PLAYBACK_ACTIONS } from './types';
import { PlaybackStatus } from '../../utils/types';

export const startPlaybackRequest = (playlistId: string, startPosition = 0) => ({
  type: PLAYBACK_ACTIONS.START_PLAYBACK_REQUEST,
  payload: { playlistId, startPosition },
});

export const startPlaybackSuccess = (session: any) => ({
  type: PLAYBACK_ACTIONS.START_PLAYBACK_SUCCESS,
  payload: session,
});

export const startPlaybackFailure = (error: string) => ({
  type: PLAYBACK_ACTIONS.START_PLAYBACK_FAILURE,
  payload: error,
});

export const stopPlaybackRequest = () => ({
  type: PLAYBACK_ACTIONS.STOP_PLAYBACK_REQUEST,
});

export const stopPlaybackSuccess = () => ({
  type: PLAYBACK_ACTIONS.STOP_PLAYBACK_SUCCESS,
});

export const controlPlaybackRequest = (action: string, params?: any) => ({
  type: PLAYBACK_ACTIONS.CONTROL_PLAYBACK_REQUEST,
  payload: { action, params },
});

export const controlPlaybackSuccess = () => ({
  type: PLAYBACK_ACTIONS.CONTROL_PLAYBACK_SUCCESS,
});

export const fetchPlaybackStatusRequest = () => ({
  type: PLAYBACK_ACTIONS.FETCH_PLAYBACK_STATUS_REQUEST,
});

export const fetchPlaybackStatusSuccess = (status: PlaybackStatus) => ({
  type: PLAYBACK_ACTIONS.FETCH_PLAYBACK_STATUS_SUCCESS,
  payload: status,
});

export const updatePlaybackStatus = (status: Partial<PlaybackStatus>) => ({
  type: PLAYBACK_ACTIONS.UPDATE_PLAYBACK_STATUS,
  payload: status,
});
