package com.tvboxplayer

import android.app.Application
import android.os.StrictMode
import androidx.work.Configuration
import com.tvboxplayer.service.api.ApiServerService
import com.tvboxplayer.service.mdns.MdnsService
import timber.log.Timber

/**
 * Main Application class for TV Box Player
 * 
 * Responsibilities:
 * - Initialize application-wide dependencies
 * - Start essential services (API Server, mDNS)
 * - Configure logging and debugging tools
 * - Set up WorkManager for background tasks
 */
class TvBoxApplication : Application(), Configuration.Provider {

    override fun onCreate() {
        super.onCreate()
        
        // Initialize logging
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
            enableStrictMode()
        } else {
            // TODO: Plant crash reporting tree (Firebase Crashlytics, etc.)
        }
        
        Timber.i("TV Box Player application started")
        
        // Initialize services
        initializeServices()
    }

    private fun initializeServices() {
        Timber.d("Initializing application services")
        
        // Start API Server Service
        ApiServerService.start(this)
        
        // Start mDNS Service for device discovery
        MdnsService.start(this)
    }

    private fun enableStrictMode() {
        StrictMode.setThreadPolicy(
            StrictMode.ThreadPolicy.Builder()
                .detectAll()
                .penaltyLog()
                .build()
        )
        StrictMode.setVmPolicy(
            StrictMode.VmPolicy.Builder()
                .detectAll()
                .penaltyLog()
                .build()
        )
    }

    override val workManagerConfiguration: Configuration
        get() = Configuration.Builder()
            .setMinimumLoggingLevel(if (BuildConfig.DEBUG) android.util.Log.DEBUG else android.util.Log.INFO)
            .build()

    companion object {
        const val TAG = "TvBoxApplication"
        const val API_VERSION = "v1"
        const val DEFAULT_API_PORT = 8080
    }
}
