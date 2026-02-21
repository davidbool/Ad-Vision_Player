package com.tvboxplayer.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Sync job entity for tracking content synchronization
 */
@Entity(tableName = "sync_jobs")
data class SyncJob(
    @PrimaryKey
    val id: String,
    val driveFileId: String?,
    val driveFolderPath: String?,
    val status: SyncStatus,
    val progress: Int = 0, // 0-100
    val totalItems: Int = 0,
    val completedItems: Int = 0,
    val failedItems: Int = 0,
    val startedAt: Long,
    val completedAt: Long?,
    val errorMessage: String?,
    val triggeredBy: String // device_id
)

/**
 * Sync job status
 */
enum class SyncStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    FAILED,
    CANCELLED
}

/**
 * Playback history entity
 */
@Entity(tableName = "playback_history")
data class PlaybackHistory(
    @PrimaryKey
    val id: String,
    val mediaItemId: String,
    val playlistId: String?,
    val deviceId: String,
    val startedAt: Long,
    val endedAt: Long?,
    val positionMs: Long,
    val durationMs: Long,
    val completionPercentage: Int // 0-100
)

/**
 * App settings (stored in SharedPreferences, but defined for clarity)
 */
data class AppSettings(
    val cacheMaxSizeGB: Int = 10,
    val autoSyncEnabled: Boolean = true,
    val wifiOnlySync: Boolean = true,
    val hdmiResolution: String = "auto", // "auto", "720p", "1080p", "4K"
    val sleepTimerMinutes: Int = 0, // 0 = disabled
    val slideshowDurationSeconds: Int = 5,
    val enableHardwareAcceleration: Boolean = true,
    val apiPort: Int = 8080,
    val requirePinForPairing: Boolean = true,
    val sessionTimeoutHours: Int = 24
)
