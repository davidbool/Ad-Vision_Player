package com.tvboxplayer.data.database

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.tvboxplayer.data.model.Device
import kotlinx.coroutines.flow.Flow

/**
 * DAO for Device operations
 */
@Dao
interface DeviceDao {
    
    @Query("SELECT * FROM devices WHERE isActive = 1")
    fun getAllActiveDevices(): Flow<List<Device>>
    
    @Query("SELECT * FROM devices WHERE deviceId = :deviceId")
    suspend fun getDeviceById(deviceId: String): Device?
    
    @Query("SELECT COUNT(*) FROM devices WHERE isActive = 1")
    suspend fun getActiveDeviceCount(): Int
    
    @Query("SELECT * FROM devices WHERE isPrimary = 1 AND isActive = 1 LIMIT 1")
    suspend fun getPrimaryDevice(): Device?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDevice(device: Device)
    
    @Update
    suspend fun updateDevice(device: Device)
    
    @Query("UPDATE devices SET isActive = 0 WHERE deviceId = :deviceId")
    suspend fun deactivateDevice(deviceId: String)
    
    @Query("UPDATE devices SET lastSeen = :timestamp WHERE deviceId = :deviceId")
    suspend fun updateLastSeen(deviceId: String, timestamp: Long)
    
    @Query("UPDATE devices SET refreshToken = :token WHERE deviceId = :deviceId")
    suspend fun updateRefreshToken(deviceId: String, token: String)
    
    @Delete
    suspend fun deleteDevice(device: Device)
    
    @Query("DELETE FROM devices WHERE isActive = 0 AND lastSeen < :timestamp")
    suspend fun cleanupInactiveDevices(timestamp: Long)
}
