# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.

# Keep data classes and models
-keep class com.tvboxplayer.data.model.** { *; }

# Keep Retrofit interfaces
-keep interface com.tvboxplayer.network.** { *; }

# Gson specific classes
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Ktor
-keep class io.ktor.** { *; }
-keep class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.atomicfu.**
-dontwarn io.netty.**
-dontwarn com.typesafe.**

# JWT
-keep class io.jsonwebtoken.** { *; }
-keepattributes InnerClasses

# Room
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-dontwarn androidx.room.paging.**

# ExoPlayer / Media3
-keep class androidx.media3.** { *; }
-dontwarn androidx.media3.**

# Google APIs
-keep class com.google.api.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.api.**

# JmDNS
-keep class javax.jmdns.** { *; }

# Keep Kotlin metadata
-keep class kotlin.Metadata { *; }
