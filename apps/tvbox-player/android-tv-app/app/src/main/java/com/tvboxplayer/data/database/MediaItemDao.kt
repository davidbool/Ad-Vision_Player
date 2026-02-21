package com.tvboxplayer.data.database

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Update
import com.tvboxplayer.data.model.MediaItem
import com.tvboxplayer.data.model.MediaType
import kotlinx.coroutines.flow.Flow

/**
 * DAO for MediaItem operations
 */
@Dao
interface MediaItemDao {
    
    @Query("SELECT * FROM media_items ORDER BY addedAt DESC")
    fun getAllMediaItems(): Flow<List<MediaItem>>
    
    @Query("SELECT * FROM media_items WHERE type = :type ORDER BY addedAt DESC")
    fun getMediaItemsByType(type: MediaType): Flow<List<MediaItem>>
    
    @Query("SELECT * FROM media_items WHERE id = :id")
    suspend fun getMediaItemById(id: String): MediaItem?
    
    @Query("SELECT * FROM media_items WHERE isCached = 1")
    fun getCachedMediaItems(): Flow<List<MediaItem>>
    
    @Query("SELECT SUM(sizeBytes) FROM media_items WHERE isCached = 1")
    suspend fun getTotalCachedSize(): Long?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMediaItem(mediaItem: MediaItem)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMediaItems(mediaItems: List<MediaItem>)
    
    @Update
    suspend fun updateMediaItem(mediaItem: MediaItem)
    
    @Query("UPDATE media_items SET isCached = :isCached, localPath = :localPath, cacheProgress = :progress WHERE id = :id")
    suspend fun updateCacheStatus(id: String, isCached: Boolean, localPath: String?, progress: Int)
    
    @Query("UPDATE media_items SET lastAccessedAt = :timestamp WHERE id = :id")
    suspend fun updateLastAccessed(id: String, timestamp: Long)
    
    @Query("DELETE FROM media_items WHERE id = :id")
    suspend fun deleteMediaItem(id: String)
    
    @Query("SELECT * FROM media_items WHERE isCached = 1 ORDER BY lastAccessedAt ASC")
    suspend fun getLeastRecentlyUsedCachedItems(): List<MediaItem>
}
