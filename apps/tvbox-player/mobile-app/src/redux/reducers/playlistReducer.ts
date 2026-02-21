import { PLAYLIST_ACTIONS } from '../actions/types';
import { Playlist } from '../../utils/types';

interface PlaylistState {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PlaylistState = {
  playlists: [],
  isLoading: false,
  error: null,
};

export default function playlistReducer(state = initialState, action: any): PlaylistState {
  switch (action.type) {
    case PLAYLIST_ACTIONS.FETCH_PLAYLISTS_REQUEST:
    case PLAYLIST_ACTIONS.CREATE_PLAYLIST_REQUEST:
    case PLAYLIST_ACTIONS.UPDATE_PLAYLIST_REQUEST:
    case PLAYLIST_ACTIONS.DELETE_PLAYLIST_REQUEST:
      return { ...state, isLoading: true, error: null };
    
    case PLAYLIST_ACTIONS.FETCH_PLAYLISTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        playlists: action.payload,
      };
    
    case PLAYLIST_ACTIONS.CREATE_PLAYLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        playlists: [...state.playlists, action.payload],
      };
    
    case PLAYLIST_ACTIONS.UPDATE_PLAYLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        playlists: state.playlists.map(p =>
          p.playlistId === action.payload.playlistId ? { ...p, ...action.payload } : p
        ),
      };
    
    case PLAYLIST_ACTIONS.DELETE_PLAYLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        playlists: state.playlists.filter(p => p.playlistId !== action.payload),
      };
    
    case PLAYLIST_ACTIONS.FETCH_PLAYLISTS_FAILURE:
    case PLAYLIST_ACTIONS.CREATE_PLAYLIST_FAILURE:
    case PLAYLIST_ACTIONS.UPDATE_PLAYLIST_FAILURE:
    case PLAYLIST_ACTIONS.DELETE_PLAYLIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    default:
      return state;
  }
}
