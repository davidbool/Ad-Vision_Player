package com.tvboxplayer.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.tvboxplayer.R
import com.tvboxplayer.data.database.TvBoxDatabase
import com.tvboxplayer.ui.pairing.PairingActivity
import kotlinx.coroutines.launch
import timber.log.Timber

/**
 * Main launcher activity for TV Box Player
 * 
 * This activity handles:
 * - Initial app launch
 * - Checking if device is already paired
 * - Navigating to appropriate screen
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        Timber.i("MainActivity created")
        
        // Check if any devices are paired
        checkPairingStatus()
    }

    private fun checkPairingStatus() {
        lifecycleScope.launch {
            val database = TvBoxDatabase.getInstance(applicationContext)
            val deviceCount = database.deviceDao().getActiveDeviceCount()
            
            Timber.d("Active devices: $deviceCount")
            
            if (deviceCount == 0) {
                // No devices paired, show pairing screen
                navigateToPairing()
            } else {
                // Devices paired, show main interface
                // TODO: Navigate to media browser or home screen
                Timber.i("Devices already paired, showing home screen")
            }
        }
    }

    private fun navigateToPairing() {
        Timber.i("No paired devices, navigating to pairing screen")
        val intent = Intent(this, PairingActivity::class.java)
        startActivity(intent)
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        Timber.d("MainActivity destroyed")
    }
}
