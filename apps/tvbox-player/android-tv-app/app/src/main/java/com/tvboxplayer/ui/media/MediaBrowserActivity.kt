package com.tvboxplayer.ui.media

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.tvboxplayer.R
import timber.log.Timber

/**
 * Media browser activity for browsing and selecting media content
 */
class MediaBrowserActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_media_browser)
        
        Timber.i("MediaBrowserActivity created")
    }
}
