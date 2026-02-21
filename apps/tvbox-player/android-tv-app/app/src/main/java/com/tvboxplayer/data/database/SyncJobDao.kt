package com.tvboxplayer.data.database

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.tvboxplayer.data.model.PlaybackHistory
import com.tvboxplayer.data.model.SyncJob
import com.tvboxplayer.data.model.SyncStatus
import kotlinx.coroutines.flow.Flow

/**
 * DAO for SyncJob operations
 */
@Dao
interface SyncJobDao {
    
    @Query("SELECT * FROM sync_jobs ORDER BY startedAt DESC")
    fun getAllSyncJobs(): Flow<List<SyncJob>>
    
    @Query("SELECT * FROM sync_jobs WHERE status = :status")
    fun getSyncJobsByStatus(status: SyncStatus): Flow<List<SyncJob>>
    
    @Query("SELECT * FROM sync_jobs WHERE id = :id")
    suspend fun getSyncJobById(id: String): SyncJob?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSyncJob(syncJob: SyncJob)
    
    @Update
    suspend fun updateSyncJob(syncJob: SyncJob)
    
    @Query("DELETE FROM sync_jobs WHERE id = :id")
    suspend fun deleteSyncJob(id: String)
    
    @Query("DELETE FROM sync_jobs WHERE completedAt < :timestamp AND status IN (:statuses)")
    suspend fun cleanupOldJobs(timestamp: Long, statuses: List<SyncStatus>)
}

/**
 * DAO for PlaybackHistory operations
 */
@Dao
interface PlaybackHistoryDao {
    
    @Query("SELECT * FROM playback_history ORDER BY startedAt DESC LIMIT :limit")
    fun getRecentPlaybackHistory(limit: Int = 50): Flow<List<PlaybackHistory>>
    
    @Query("SELECT * FROM playback_history WHERE mediaItemId = :mediaItemId ORDER BY startedAt DESC")
    fun getPlaybackHistoryForMedia(mediaItemId: String): Flow<List<PlaybackHistory>>
    
    @Query("SELECT * FROM playback_history WHERE id = :id")
    suspend fun getPlaybackHistoryById(id: String): PlaybackHistory?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlaybackHistory(history: PlaybackHistory)
    
    @Update
    suspend fun updatePlaybackHistory(history: PlaybackHistory)
    
    @Query("DELETE FROM playback_history WHERE startedAt < :timestamp")
    suspend fun cleanupOldHistory(timestamp: Long)
    
    @Query("SELECT * FROM playback_history WHERE mediaItemId = :mediaItemId AND deviceId = :deviceId ORDER BY startedAt DESC LIMIT 1")
    suspend fun getLastPlaybackPosition(mediaItemId: String, deviceId: String): PlaybackHistory?
}
