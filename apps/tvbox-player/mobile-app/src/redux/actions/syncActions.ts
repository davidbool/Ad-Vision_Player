import { SYNC_ACTIONS } from './types';
import { SyncJob } from '../../utils/types';

export const startSyncRequest = (provider: string, folders: any[], options?: any) => ({
  type: SYNC_ACTIONS.START_SYNC_REQUEST,
  payload: { provider, folders, options },
});

export const startSyncSuccess = (job: SyncJob) => ({
  type: SYNC_ACTIONS.START_SYNC_SUCCESS,
  payload: job,
});

export const startSyncFailure = (error: string) => ({
  type: SYNC_ACTIONS.START_SYNC_FAILURE,
  payload: error,
});

export const cancelSyncRequest = (jobId: string) => ({
  type: SYNC_ACTIONS.CANCEL_SYNC_REQUEST,
  payload: jobId,
});

export const cancelSyncSuccess = (jobId: string) => ({
  type: SYNC_ACTIONS.CANCEL_SYNC_SUCCESS,
  payload: jobId,
});

export const fetchSyncStatusRequest = (jobId: string) => ({
  type: SYNC_ACTIONS.FETCH_SYNC_STATUS_REQUEST,
  payload: jobId,
});

export const fetchSyncStatusSuccess = (job: SyncJob) => ({
  type: SYNC_ACTIONS.FETCH_SYNC_STATUS_SUCCESS,
  payload: job,
});

export const updateSyncProgress = (jobId: string, progress: any) => ({
  type: SYNC_ACTIONS.UPDATE_SYNC_PROGRESS,
  payload: { jobId, progress },
});
