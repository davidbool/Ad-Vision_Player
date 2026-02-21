package com.tvboxplayer.service.api

import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.IBinder
import timber.log.Timber

/**
 * API Server Service - Runs Ktor HTTP server for mobile app communication
 * 
 * This service provides REST API endpoints for:
 * - Device pairing
 * - Content management
 * - Playback control
 * - Device management
 */
class ApiServerService : Service() {

    override fun onCreate() {
        super.onCreate()
        Timber.i("API Server Service created")
        
        // TODO: Initialize and start Ktor server
        startApiServer()
    }

    private fun startApiServer() {
        Timber.d("Starting API server on port 8080")
        // TODO: Implement Ktor server startup
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Timber.d("API Server Service started")
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Timber.i("API Server Service destroyed")
        // TODO: Stop Ktor server
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, ApiServerService::class.java)
            context.startService(intent)
        }

        fun stop(context: Context) {
            val intent = Intent(context, ApiServerService::class.java)
            context.stopService(intent)
        }
    }
}
