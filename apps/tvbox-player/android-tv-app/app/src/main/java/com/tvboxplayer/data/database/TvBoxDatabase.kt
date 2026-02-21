package com.tvboxplayer.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.tvboxplayer.data.model.*

/**
 * Main Room database for TV Box Player application
 */
@Database(
    entities = [
        Device::class,
        MediaItem::class,
        Playlist::class,
        PlaylistItem::class,
        SyncJob::class,
        PlaybackHistory::class
    ],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class TvBoxDatabase : RoomDatabase() {
    
    abstract fun deviceDao(): DeviceDao
    abstract fun mediaItemDao(): MediaItemDao
    abstract fun playlistDao(): PlaylistDao
    abstract fun syncJobDao(): SyncJobDao
    abstract fun playbackHistoryDao(): PlaybackHistoryDao
    
    companion object {
        private const val DATABASE_NAME = "tvbox.db"
        
        @Volatile
        private var INSTANCE: TvBoxDatabase? = null
        
        fun getInstance(context: Context): TvBoxDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    TvBoxDatabase::class.java,
                    DATABASE_NAME
                )
                    .fallbackToDestructiveMigration() // For development only, remove in production
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
