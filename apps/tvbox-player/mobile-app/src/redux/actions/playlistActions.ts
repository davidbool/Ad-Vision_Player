import { PLAYLIST_ACTIONS } from './types';
import { Playlist } from '../../utils/types';

export const fetchPlaylistsRequest = () => ({
  type: PLAYLIST_ACTIONS.FETCH_PLAYLISTS_REQUEST,
});

export const fetchPlaylistsSuccess = (playlists: Playlist[]) => ({
  type: PLAYLIST_ACTIONS.FETCH_PLAYLISTS_SUCCESS,
  payload: playlists,
});

export const fetchPlaylistsFailure = (error: string) => ({
  type: PLAYLIST_ACTIONS.FETCH_PLAYLISTS_FAILURE,
  payload: error,
});

export const createPlaylistRequest = (name: string, description?: string, mediaIds?: string[]) => ({
  type: PLAYLIST_ACTIONS.CREATE_PLAYLIST_REQUEST,
  payload: { name, description, mediaIds },
});

export const createPlaylistSuccess = (playlist: Playlist) => ({
  type: PLAYLIST_ACTIONS.CREATE_PLAYLIST_SUCCESS,
  payload: playlist,
});

export const updatePlaylistRequest = (playlistId: string, updates: Partial<Playlist>) => ({
  type: PLAYLIST_ACTIONS.UPDATE_PLAYLIST_REQUEST,
  payload: { playlistId, updates },
});

export const deletePlaylistRequest = (playlistId: string) => ({
  type: PLAYLIST_ACTIONS.DELETE_PLAYLIST_REQUEST,
  payload: playlistId,
});

export const deletePlaylistSuccess = (playlistId: string) => ({
  type: PLAYLIST_ACTIONS.DELETE_PLAYLIST_SUCCESS,
  payload: playlistId,
});

export const addItemsToPlaylist = (playlistId: string, mediaIds: string[]) => ({
  type: PLAYLIST_ACTIONS.ADD_ITEMS_TO_PLAYLIST,
  payload: { playlistId, mediaIds },
});

export const removeItemsFromPlaylist = (playlistId: string, mediaIds: string[]) => ({
  type: PLAYLIST_ACTIONS.REMOVE_ITEMS_FROM_PLAYLIST,
  payload: { playlistId, mediaIds },
});

export const reorderPlaylistItems = (playlistId: string, mediaIds: string[]) => ({
  type: PLAYLIST_ACTIONS.REORDER_PLAYLIST_ITEMS,
  payload: { playlistId, mediaIds },
});
