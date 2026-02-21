package com.tvboxplayer.data.database

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Update
import com.tvboxplayer.data.model.Playlist
import com.tvboxplayer.data.model.PlaylistItem
import kotlinx.coroutines.flow.Flow

/**
 * DAO for Playlist operations
 */
@Dao
interface PlaylistDao {
    
    @Query("SELECT * FROM playlists ORDER BY updatedAt DESC")
    fun getAllPlaylists(): Flow<List<Playlist>>
    
    @Query("SELECT * FROM playlists WHERE id = :id")
    suspend fun getPlaylistById(id: String): Playlist?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlaylist(playlist: Playlist)
    
    @Update
    suspend fun updatePlaylist(playlist: Playlist)
    
    @Query("DELETE FROM playlists WHERE id = :id")
    suspend fun deletePlaylist(id: String)
    
    // Playlist items
    @Query("SELECT * FROM playlist_items WHERE playlistId = :playlistId ORDER BY position ASC")
    suspend fun getPlaylistItems(playlistId: String): List<PlaylistItem>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlaylistItem(item: PlaylistItem)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlaylistItems(items: List<PlaylistItem>)
    
    @Query("DELETE FROM playlist_items WHERE playlistId = :playlistId AND mediaItemId = :mediaItemId")
    suspend fun deletePlaylistItem(playlistId: String, mediaItemId: String)
    
    @Query("DELETE FROM playlist_items WHERE playlistId = :playlistId")
    suspend fun clearPlaylistItems(playlistId: String)
    
    @Transaction
    suspend fun updatePlaylistWithItems(playlist: Playlist, items: List<PlaylistItem>) {
        updatePlaylist(playlist)
        clearPlaylistItems(playlist.id)
        insertPlaylistItems(items)
    }
}
