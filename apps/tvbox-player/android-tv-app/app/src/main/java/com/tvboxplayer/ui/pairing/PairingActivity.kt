package com.tvboxplayer.ui.pairing

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.tvboxplayer.R
import timber.log.Timber

/**
 * Pairing activity that displays a PIN code for mobile device pairing
 */
class PairingActivity : AppCompatActivity() {

    private lateinit var pinTextView: TextView
    private lateinit var instructionTextView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pairing)
        
        Timber.i("PairingActivity created")
        
        initializeViews()
        startPairingSession()
    }

    private fun initializeViews() {
        pinTextView = findViewById(R.id.pin_code_text)
        instructionTextView = findViewById(R.id.instruction_text)
        
        instructionTextView.text = getString(R.string.pairing_instruction)
    }

    private fun startPairingSession() {
        // TODO: Request PIN from PairingManager
        // For now, display placeholder
        displayPin("000000")
        Timber.d("Pairing session started")
    }

    private fun displayPin(pin: String) {
        pinTextView.text = pin
        Timber.i("Displaying PIN: $pin")
    }

    override fun onDestroy() {
        super.onDestroy()
        Timber.d("PairingActivity destroyed")
    }
}
