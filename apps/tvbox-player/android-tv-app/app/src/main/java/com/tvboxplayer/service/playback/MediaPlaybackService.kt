package com.tvboxplayer.service.playback

import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import timber.log.Timber

/**
 * Media Playback Service - Handles media playback with ExoPlayer
 * 
 * This service manages:
 * - ExoPlayer instance
 * - Playback session
 * - Playlist queue
 * - Remote control
 */
class MediaPlaybackService : MediaSessionService() {

    private var mediaSession: MediaSession? = null

    override fun onCreate() {
        super.onCreate()
        Timber.i("Media Playback Service created")
        
        // TODO: Initialize ExoPlayer and MediaSession
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? {
        return mediaSession
    }

    override fun onDestroy() {
        mediaSession?.run {
            player.release()
            release()
            mediaSession = null
        }
        super.onDestroy()
        Timber.i("Media Playback Service destroyed")
    }
}
