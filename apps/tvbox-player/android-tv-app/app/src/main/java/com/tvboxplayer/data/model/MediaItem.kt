package com.tvboxplayer.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Media item entity representing cached content
 */
@Entity(tableName = "media_items")
data class MediaItem(
    @PrimaryKey
    val id: String,
    val name: String,
    val type: MediaType,
    val driveFileId: String?,
    val localPath: String?,
    val thumbnailPath: String?,
    val mimeType: String,
    val sizeBytes: Long,
    val durationMs: Long?,
    val resolution: String?,
    val codec: String?,
    val addedAt: Long,
    val lastAccessedAt: Long?,
    val isCached: Boolean = false,
    val cacheProgress: Int = 0 // 0-100
)

/**
 * Media type enumeration
 */
enum class MediaType {
    VIDEO,
    IMAGE,
    AUDIO,
    PLAYLIST
}

/**
 * Playlist entity
 */
@Entity(tableName = "playlists")
data class Playlist(
    @PrimaryKey
    val id: String,
    val name: String,
    val description: String?,
    val createdAt: Long,
    val updatedAt: Long,
    val createdBy: String, // device_id
    val itemCount: Int = 0,
    val totalDurationMs: Long = 0,
    val isShuffled: Boolean = false,
    val repeatMode: RepeatMode = RepeatMode.NONE
)

/**
 * Playlist item junction entity
 */
@Entity(
    tableName = "playlist_items",
    primaryKeys = ["playlistId", "position"]
)
data class PlaylistItem(
    val playlistId: String,
    val mediaItemId: String,
    val position: Int,
    val addedAt: Long
)

/**
 * Repeat mode for playlists
 */
enum class RepeatMode {
    NONE,
    ONE,
    ALL
}
