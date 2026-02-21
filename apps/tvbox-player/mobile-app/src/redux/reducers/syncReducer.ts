import { SYNC_ACTIONS } from '../actions/types';
import { SyncJob } from '../../utils/types';

interface SyncState {
  jobs: SyncJob[];
  activeJob: SyncJob | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SyncState = {
  jobs: [],
  activeJob: null,
  isLoading: false,
  error: null,
};

export default function syncReducer(state = initialState, action: any): SyncState {
  switch (action.type) {
    case SYNC_ACTIONS.START_SYNC_REQUEST:
    case SYNC_ACTIONS.FETCH_SYNC_STATUS_REQUEST:
      return { ...state, isLoading: true, error: null };
    
    case SYNC_ACTIONS.START_SYNC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        activeJob: action.payload,
        jobs: [action.payload, ...state.jobs],
      };
    
    case SYNC_ACTIONS.FETCH_SYNC_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        activeJob: action.payload,
        jobs: state.jobs.map(job =>
          job.syncJobId === action.payload.syncJobId ? action.payload : job
        ),
      };
    
    case SYNC_ACTIONS.UPDATE_SYNC_PROGRESS:
      return {
        ...state,
        activeJob: state.activeJob?.syncJobId === action.payload.jobId
          ? { ...state.activeJob, progress: { ...state.activeJob.progress, ...action.payload.progress } }
          : state.activeJob,
        jobs: state.jobs.map(job =>
          job.syncJobId === action.payload.jobId
            ? { ...job, progress: { ...job.progress, ...action.payload.progress } }
            : job
        ),
      };
    
    case SYNC_ACTIONS.CANCEL_SYNC_SUCCESS:
      return {
        ...state,
        activeJob: state.activeJob?.syncJobId === action.payload ? null : state.activeJob,
        jobs: state.jobs.map(job =>
          job.syncJobId === action.payload
            ? { ...job, status: 'cancelled' }
            : job
        ),
      };
    
    case SYNC_ACTIONS.START_SYNC_FAILURE:
    case SYNC_ACTIONS.FETCH_SYNC_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    default:
      return state;
  }
}
