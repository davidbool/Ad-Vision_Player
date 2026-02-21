import { PLAYBACK_ACTIONS } from '../actions/types';
import { PlaybackStatus } from '../../utils/types';

interface PlaybackState {
  status: PlaybackStatus;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlaybackState = {
  status: {
    status: 'idle',
    playbackPosition: 0,
    volume: 75,
    playbackSpeed: 1.0,
    shuffle: false,
    repeat: false,
    buffering: false,
    bufferPercent: 0,
  },
  isLoading: false,
  error: null,
};

export default function playbackReducer(state = initialState, action: any): PlaybackState {
  switch (action.type) {
    case PLAYBACK_ACTIONS.START_PLAYBACK_REQUEST:
    case PLAYBACK_ACTIONS.CONTROL_PLAYBACK_REQUEST:
    case PLAYBACK_ACTIONS.FETCH_PLAYBACK_STATUS_REQUEST:
      return { ...state, isLoading: true, error: null };
    
    case PLAYBACK_ACTIONS.START_PLAYBACK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        status: {
          ...state.status,
          ...action.payload,
          status: 'playing',
        },
      };
    
    case PLAYBACK_ACTIONS.STOP_PLAYBACK_SUCCESS:
      return {
        ...state,
        status: {
          ...initialState.status,
          status: 'idle',
        },
      };
    
    case PLAYBACK_ACTIONS.FETCH_PLAYBACK_STATUS_SUCCESS:
    case PLAYBACK_ACTIONS.UPDATE_PLAYBACK_STATUS:
      return {
        ...state,
        isLoading: false,
        status: {
          ...state.status,
          ...action.payload,
        },
      };
    
    case PLAYBACK_ACTIONS.START_PLAYBACK_FAILURE:
    case PLAYBACK_ACTIONS.CONTROL_PLAYBACK_FAILURE:
    case PLAYBACK_ACTIONS.FETCH_PLAYBACK_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case PLAYBACK_ACTIONS.CONTROL_PLAYBACK_SUCCESS:
      return { ...state, isLoading: false };
    
    default:
      return state;
  }
}
