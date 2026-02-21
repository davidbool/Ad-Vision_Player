import { MEDIA_ACTIONS } from '../actions/types';
import { MediaItem } from '../../utils/types';

interface MediaState {
  items: MediaItem[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    type?: string;
    search?: string;
  };
  sort: {
    field: string;
    order: string;
  };
}

const initialState: MediaState = {
  items: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  filters: {},
  sort: {
    field: 'date',
    order: 'desc',
  },
};

export default function mediaReducer(state = initialState, action: any): MediaState {
  switch (action.type) {
    case MEDIA_ACTIONS.FETCH_MEDIA_REQUEST:
    case MEDIA_ACTIONS.DELETE_MEDIA_REQUEST:
      return { ...state, isLoading: true, error: null };
    
    case MEDIA_ACTIONS.FETCH_MEDIA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload.items,
        totalCount: action.payload.totalCount,
      };
    
    case MEDIA_ACTIONS.DELETE_MEDIA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: state.items.filter(item => item.mediaId !== action.payload),
        totalCount: state.totalCount - 1,
      };
    
    case MEDIA_ACTIONS.FETCH_MEDIA_FAILURE:
    case MEDIA_ACTIONS.DELETE_MEDIA_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case MEDIA_ACTIONS.SET_MEDIA_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filter]: action.payload.value,
        },
      };
    
    case MEDIA_ACTIONS.SET_MEDIA_SORT:
      return {
        ...state,
        sort: {
          field: action.payload.sort,
          order: action.payload.order,
        },
      };
    
    default:
      return state;
  }
}
