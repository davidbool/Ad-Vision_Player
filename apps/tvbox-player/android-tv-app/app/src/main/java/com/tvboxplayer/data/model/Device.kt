package com.tvboxplayer.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Device entity representing a paired mobile device
 */
@Entity(tableName = "devices")
data class Device(
    @PrimaryKey
    val deviceId: String,
    val deviceName: String,
    val deviceType: String, // "mobile", "tablet"
    val platform: String, // "ios", "android"
    val appVersion: String,
    val pairedAt: Long,
    val lastSeen: Long,
    val isPrimary: Boolean = false,
    val permissions: String, // JSON array of permissions
    val refreshToken: String? = null,
    val isActive: Boolean = true
)

/**
 * Represents device permissions
 */
enum class Permission {
    READ,      // View content
    CONTROL,   // Control playback
    SYNC,      // Trigger content sync
    ADMIN      // Manage devices, settings
}

/**
 * Device information for pairing
 */
data class DeviceInfo(
    val deviceId: String,
    val deviceName: String,
    val deviceType: String,
    val platform: String,
    val appVersion: String
)

/**
 * Pairing session data
 */
data class PairingSession(
    val sessionId: String,
    val pinCode: String,
    val expiresAt: Long, // Epoch milliseconds
    val createdAt: Long = System.currentTimeMillis()
)

/**
 * Result of pairing attempt
 */
sealed class PairingResult {
    data class Success(
        val accessToken: String,
        val refreshToken: String,
        val deviceId: String
    ) : PairingResult()
    
    data class Error(val message: String) : PairingResult()
}
