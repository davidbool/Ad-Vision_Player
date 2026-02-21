import { SETTINGS_ACTIONS } from './types';
import { Settings } from '../../utils/types';

export const fetchSettingsRequest = () => ({
  type: SETTINGS_ACTIONS.FETCH_SETTINGS_REQUEST,
});

export const fetchSettingsSuccess = (settings: Settings) => ({
  type: SETTINGS_ACTIONS.FETCH_SETTINGS_SUCCESS,
  payload: settings,
});

export const fetchSettingsFailure = (error: string) => ({
  type: SETTINGS_ACTIONS.FETCH_SETTINGS_FAILURE,
  payload: error,
});

export const updateSettingsRequest = (updates: Partial<Settings>) => ({
  type: SETTINGS_ACTIONS.UPDATE_SETTINGS_REQUEST,
  payload: updates,
});

export const updateSettingsSuccess = (settings: Settings) => ({
  type: SETTINGS_ACTIONS.UPDATE_SETTINGS_SUCCESS,
  payload: settings,
});

export const updateSettingsFailure = (error: string) => ({
  type: SETTINGS_ACTIONS.UPDATE_SETTINGS_FAILURE,
  payload: error,
});

export const toggleTheme = () => ({
  type: SETTINGS_ACTIONS.TOGGLE_THEME,
});
