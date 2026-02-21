package com.tvboxplayer.data.database

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.tvboxplayer.data.model.MediaType
import com.tvboxplayer.data.model.Permission
import com.tvboxplayer.data.model.RepeatMode
import com.tvboxplayer.data.model.SyncStatus

/**
 * Type converters for Room database
 */
class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromMediaType(value: MediaType): String = value.name

    @TypeConverter
    fun toMediaType(value: String): MediaType = MediaType.valueOf(value)

    @TypeConverter
    fun fromSyncStatus(value: SyncStatus): String = value.name

    @TypeConverter
    fun toSyncStatus(value: String): SyncStatus = SyncStatus.valueOf(value)

    @TypeConverter
    fun fromRepeatMode(value: RepeatMode): String = value.name

    @TypeConverter
    fun toRepeatMode(value: String): RepeatMode = RepeatMode.valueOf(value)

    @TypeConverter
    fun fromPermissionList(permissions: List<Permission>): String {
        return gson.toJson(permissions.map { it.name })
    }

    @TypeConverter
    fun toPermissionList(json: String): List<Permission> {
        val type = object : TypeToken<List<String>>() {}.type
        val names: List<String> = gson.fromJson(json, type)
        return names.map { Permission.valueOf(it) }
    }
}
