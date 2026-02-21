package com.tvboxplayer.ui.settings

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.tvboxplayer.R
import timber.log.Timber

/**
 * Settings activity for app configuration
 */
class SettingsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)
        
        Timber.i("SettingsActivity created")
    }
}
