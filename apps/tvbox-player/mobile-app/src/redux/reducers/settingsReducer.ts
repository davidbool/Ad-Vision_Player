import { SETTINGS_ACTIONS } from '../actions/types';
import { Settings } from '../../utils/types';

interface SettingsState {
  settings: Settings | null;
  isDarkMode: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  isDarkMode: false,
  isLoading: false,
  error: null,
};

export default function settingsReducer(state = initialState, action: any): SettingsState {
  switch (action.type) {
    case SETTINGS_ACTIONS.FETCH_SETTINGS_REQUEST:
    case SETTINGS_ACTIONS.UPDATE_SETTINGS_REQUEST:
      return { ...state, isLoading: true, error: null };
    
    case SETTINGS_ACTIONS.FETCH_SETTINGS_SUCCESS:
    case SETTINGS_ACTIONS.UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        settings: action.payload,
      };
    
    case SETTINGS_ACTIONS.FETCH_SETTINGS_FAILURE:
    case SETTINGS_ACTIONS.UPDATE_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case SETTINGS_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    
    default:
      return state;
  }
}
