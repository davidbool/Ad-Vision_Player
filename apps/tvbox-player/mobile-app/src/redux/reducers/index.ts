import { combineReducers } from 'redux';
import deviceReducer from './deviceReducer';
import playbackReducer from './playbackReducer';
import playlistReducer from './playlistReducer';
import mediaReducer from './mediaReducer';
import syncReducer from './syncReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  device: deviceReducer,
  playback: playbackReducer,
  playlist: playlistReducer,
  media: mediaReducer,
  sync: syncReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
