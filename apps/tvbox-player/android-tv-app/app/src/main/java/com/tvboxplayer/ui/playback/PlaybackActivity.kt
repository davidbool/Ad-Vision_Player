package com.tvboxplayer.ui.playback

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.tvboxplayer.R
import timber.log.Timber

/**
 * Playback activity for media playback with ExoPlayer
 */
class PlaybackActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_playback)
        
        Timber.i("PlaybackActivity created")
    }
}
