# Technical Implementation Details - TV Box Player Application

## 1. TV Box Application Implementation (Kotlin/Android)

### 1.1 Project Structure

```
tvbox-app/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tvboxplayer/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── pairing/
│   │   │   │   │   ├── media/
│   │   │   │   │   ├── playback/
│   │   │   │   │   └── settings/
│   │   │   │   ├── service/
│   │   │   │   │   ├── api/
│   │   │   │   │   ├── sync/
│   │   │   │   │   ├── playback/
│   │   │   │   │   └── mdns/
│   │   │   │   ├── data/
│   │   │   │   │   ├── database/
│   │   │   │   │   ├── repository/
│   │   │   │   │   └── model/
│   │   │   │   ├── network/
│   │   │   │   ├── player/
│   │   │   │   ├── cache/
│   │   │   │   └── util/
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   ├── drawable/
│   │   │   │   └── values/
│   │   │   └── AndroidManifest.xml
│   │   └── test/
│   └── build.gradle.kts
└── build.gradle.kts
```

### 1.2 Key Dependencies

```kotlin
// build.gradle.kts
dependencies {
    // AndroidX
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.leanback:leanback:1.2.0-alpha02")
    
    // Lifecycle & ViewModel
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")
    
    // ExoPlayer
    implementation("androidx.media3:media3-exoplayer:1.2.1")
    implementation("androidx.media3:media3-ui:1.2.1")
    implementation("androidx.media3:media3-session:1.2.1")
    
    // Networking
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // HTTP Server
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.7")
    implementation("io.ktor:ktor-serialization-gson:2.3.7")
    
    // mDNS
    implementation("javax.jmdns:jmdns:3.5.8")
    
    // Image Loading
    implementation("io.coil-kt:coil:2.5.0")
    
    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-gson:0.12.3")
    
    // Security
    implementation("androidx.security:security-crypto:1.1.0-alpha06")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
```

### 1.3 Pairing Manager Implementation

```kotlin
class PairingManager @Inject constructor(
    private val deviceRepository: DeviceRepository,
    private val jwtTokenProvider: JwtTokenProvider,
    private val encryptedPreferences: EncryptedSharedPreferences
) {
    private val activeSessions = ConcurrentHashMap<String, PairingSession>()
    private val pinGenerator = SecureRandom()
    
    suspend fun createPairingSession(): PairingSession {
        val sessionId = UUID.randomUUID().toString()
        val pinCode = generateSixDigitPin()
        val expiresAt = Instant.now().plusSeconds(300) // 5 minutes
        
        val session = PairingSession(
            sessionId = sessionId,
            pinCode = pinCode,
            expiresAt = expiresAt
        )
        
        activeSessions[sessionId] = session
        
        // Schedule cleanup
        scheduleSessionCleanup(sessionId, 300_000L)
        
        return session
    }
    
    private fun generateSixDigitPin(): String {
        return String.format("%06d", pinGenerator.nextInt(1_000_000))
    }
    
    suspend fun validateAndPair(
        sessionId: String,
        pinCode: String,
        deviceInfo: DeviceInfo
    ): PairingResult {
        val session = activeSessions[sessionId]
            ?: return PairingResult.Error("Session not found")
        
        if (Instant.now().isAfter(session.expiresAt)) {
            activeSessions.remove(sessionId)
            return PairingResult.Error("PIN expired")
        }
        
        if (session.pinCode != pinCode) {
            return PairingResult.Error("Invalid PIN")
        }
        
        // Check max devices limit
        val pairedDevices = deviceRepository.getActiveDeviceCount()
        if (pairedDevices >= MAX_PAIRED_DEVICES) {
            return PairingResult.Error("Maximum devices reached")
        }
        
        // Create device record
        val device = Device(
            deviceId = deviceInfo.deviceId,
            deviceName = deviceInfo.deviceName,
            deviceType = deviceInfo.deviceType,
            platform = deviceInfo.platform,
            appVersion = deviceInfo.appVersion,
            pairedAt = Instant.now(),
            lastSeen = Instant.now(),
            isPrimary = pairedDevices == 0, // First device is primary
            permissions = getDefaultPermissions(pairedDevices == 0)
        )
        
        deviceRepository.insertDevice(device)
        
        // Generate tokens
        val accessToken = jwtTokenProvider.generateAccessToken(device)
        val refreshToken = jwtTokenProvider.generateRefreshToken(device)
        
        // Store refresh token
        deviceRepository.updateRefreshToken(device.deviceId, refreshToken)
        
        // Cleanup session
        activeSessions.remove(sessionId)
        
        return PairingResult.Success(
            accessToken = accessToken,
            refreshToken = refreshToken,
            deviceId = device.deviceId
        )
    }
    
    private fun getDefaultPermissions(isPrimary: Boolean): Set<Permission> {
        return if (isPrimary) {
            setOf(Permission.READ, Permission.CONTROL, Permission.SYNC, Permission.ADMIN)
        } else {
            setOf(Permission.READ, Permission.CONTROL)
        }
    }
    
    companion object {
        const val MAX_PAIRED_DEVICES = 5
    }
}
```

### 1.4 Content Sync Service Implementation

```kotlin
@AndroidEntryPoint
class ContentSyncService : Service() {
    
    @Inject lateinit var cloudClient: CloudClient
    @Inject lateinit var cacheManager: CacheManager
    @Inject lateinit var mediaRepository: MediaRepository
    @Inject lateinit var syncJobRepository: SyncJobRepository
    
    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val downloadJobs = ConcurrentHashMap<String, Job>()
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val syncJobId = intent?.getStringExtra(EXTRA_SYNC_JOB_ID) ?: return START_NOT_STICKY
        
        serviceScope.launch {
            executeSyncJob(syncJobId)
        }
        
        return START_STICKY
    }
    
    private suspend fun executeSyncJob(syncJobId: String) {
        val syncJob = syncJobRepository.getSyncJob(syncJobId) ?: return
        
        try {
            // Update status
            syncJobRepository.updateStatus(syncJobId, SyncStatus.IN_PROGRESS)
            
            // Get file list from cloud
            val files = cloudClient.listFiles(syncJob.folderIds)
            
            syncJobRepository.updateTotalFiles(syncJobId, files.size)
            
            // Filter by media type
            val mediaFiles = files.filter { isMediaFile(it.mimeType) }
            
            // Download files with intelligent caching
            val downloadJob = launch {
                mediaFiles.forEachIndexed { index, file ->
                    try {
                        downloadAndCacheFile(syncJobId, file, index)
                    } catch (e: Exception) {
                        Log.e(TAG, "Failed to download file: ${file.name}", e)
                        syncJobRepository.incrementFailedFiles(syncJobId)
                    }
                }
            }
            
            downloadJobs[syncJobId] = downloadJob
            downloadJob.join()
            
            // Update status
            syncJobRepository.updateStatus(syncJobId, SyncStatus.COMPLETED)
            syncJobRepository.updateCompletedAt(syncJobId, Instant.now())
            
            // Send notification
            showSyncCompleteNotification(syncJobId)
            
        } catch (e: Exception) {
            Log.e(TAG, "Sync job failed: $syncJobId", e)
            syncJobRepository.updateStatus(syncJobId, SyncStatus.FAILED)
            syncJobRepository.updateErrorMessage(syncJobId, e.message)
        } finally {
            downloadJobs.remove(syncJobId)
        }
    }
    
    private suspend fun downloadAndCacheFile(
        syncJobId: String,
        file: CloudFile,
        index: Int
    ) {
        // Check cache space
        cacheManager.ensureSpaceAvailable(file.size)
        
        // Determine cache path
        val cachePath = cacheManager.getCachePath(file.id, file.name)
        
        // Download file with progress
        cloudClient.downloadFile(
            fileId = file.id,
            destination = cachePath,
            progressCallback = { downloaded, total ->
                serviceScope.launch {
                    syncJobRepository.updateCurrentFile(
                        syncJobId,
                        CurrentFileInfo(file.name, total, downloaded)
                    )
                }
            }
        )
        
        // Extract metadata
        val metadata = extractMediaMetadata(cachePath, file.mimeType)
        
        // Generate thumbnail for video
        val thumbnailPath = if (file.mimeType.startsWith("video/")) {
            generateVideoThumbnail(cachePath)
        } else null
        
        // Create media item record
        val mediaItem = MediaItem(
            mediaId = UUID.randomUUID().toString(),
            filename = file.name,
            mediaType = getMediaType(file.mimeType),
            mimeType = file.mimeType,
            size = file.size,
            duration = metadata.duration,
            resolution = metadata.resolution,
            codec = metadata.codec,
            thumbnailPath = thumbnailPath,
            cloudProvider = CloudProvider.GOOGLE_DRIVE,
            cloudId = file.id,
            cloudPath = file.path,
            syncedAt = Instant.now(),
            cached = true,
            cachePath = cachePath.absolutePath
        )
        
        mediaRepository.insertMediaItem(mediaItem)
        
        // Update sync progress
        syncJobRepository.incrementDownloadedFiles(syncJobId)
        syncJobRepository.incrementDownloadedBytes(syncJobId, file.size)
    }
    
    suspend fun cancelSyncJob(syncJobId: String) {
        downloadJobs[syncJobId]?.cancel()
        syncJobRepository.updateStatus(syncJobId, SyncStatus.CANCELLED)
    }
    
    companion object {
        private const val TAG = "ContentSyncService"
        const val EXTRA_SYNC_JOB_ID = "sync_job_id"
    }
}
```

### 1.5 Media Player Service Implementation

```kotlin
@AndroidEntryPoint
class MediaPlayerService : MediaSessionService() {
    
    private lateinit var player: ExoPlayer
    private lateinit var mediaSession: MediaSession
    
    @Inject lateinit var mediaRepository: MediaRepository
    @Inject lateinit var playbackHistoryRepository: PlaybackHistoryRepository
    
    override fun onCreate() {
        super.onCreate()
        
        // Initialize ExoPlayer
        player = ExoPlayer.Builder(this)
            .setMediaSourceFactory(createMediaSourceFactory())
            .setLoadControl(createLoadControl())
            .build()
            .apply {
                addListener(PlayerListener())
            }
        
        // Create media session
        mediaSession = MediaSession.Builder(this, player)
            .setCallback(MediaSessionCallback())
            .build()
    }
    
    private fun createMediaSourceFactory(): MediaSource.Factory {
        return DefaultMediaSourceFactory(this)
            .setDataSourceFactory(
                DefaultDataSource.Factory(
                    this,
                    OkHttpDataSource.Factory(OkHttpClient())
                )
            )
    }
    
    private fun createLoadControl(): LoadControl {
        return DefaultLoadControl.Builder()
            .setBufferDurationsMs(
                minBufferMs = 15_000,
                maxBufferMs = 30_000,
                bufferForPlaybackMs = 2_000,
                bufferForPlaybackAfterRebufferMs = 5_000
            )
            .build()
    }
    
    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession {
        return mediaSession
    }
    
    private inner class MediaSessionCallback : MediaSession.Callback {
        override fun onAddMediaItems(
            mediaSession: MediaSession,
            controller: MediaSession.ControllerInfo,
            mediaItems: List<MediaItem>
        ): ListenableFuture<List<MediaItem>> {
            val updatedMediaItems = mediaItems.map { mediaItem ->
                mediaItem.buildUpon()
                    .setUri(getMediaUri(mediaItem.mediaId))
                    .build()
            }
            return Futures.immediateFuture(updatedMediaItems)
        }
    }
    
    private fun getMediaUri(mediaId: String): Uri {
        // Get media item from repository
        val mediaItem = runBlocking {
            mediaRepository.getMediaItem(mediaId)
        }
        
        return if (mediaItem?.cached == true && mediaItem.cachePath != null) {
            Uri.fromFile(File(mediaItem.cachePath))
        } else {
            // Stream from cloud (if implemented)
            Uri.parse("https://cloud-provider.com/file/${mediaItem?.cloudId}")
        }
    }
    
    private inner class PlayerListener : Player.Listener {
        override fun onPlaybackStateChanged(playbackState: Int) {
            when (playbackState) {
                Player.STATE_READY -> {
                    // Media is ready to play
                }
                Player.STATE_BUFFERING -> {
                    // Buffering
                }
                Player.STATE_ENDED -> {
                    // Playback ended
                    onPlaybackEnded()
                }
                Player.STATE_IDLE -> {
                    // Player is idle
                }
            }
        }
        
        override fun onIsPlayingChanged(isPlaying: Boolean) {
            if (isPlaying) {
                startForegroundService()
            }
        }
        
        override fun onPlayerError(error: PlaybackException) {
            Log.e(TAG, "Playback error", error)
            // Handle error
        }
    }
    
    private fun startForegroundService() {
        val notification = createPlaybackNotification()
        startForeground(NOTIFICATION_ID, notification)
    }
    
    private fun onPlaybackEnded() {
        // Record playback history
        // Auto-play next if enabled
    }
    
    override fun onDestroy() {
        mediaSession.release()
        player.release()
        super.onDestroy()
    }
    
    companion object {
        private const val TAG = "MediaPlayerService"
        private const val NOTIFICATION_ID = 1001
    }
}
```

### 1.6 Local API Server Implementation

```kotlin
class LocalApiServer(
    private val port: Int = 8080,
    private val pairingManager: PairingManager,
    private val deviceManager: DeviceManager,
    private val mediaRepository: MediaRepository,
    private val playlistRepository: PlaylistRepository,
    private val playbackController: PlaybackController,
    private val settingsManager: SettingsManager,
    private val jwtTokenProvider: JwtTokenProvider
) {
    private var server: NettyApplicationEngine? = null
    
    fun start() {
        server = embeddedServer(Netty, port = port) {
            install(ContentNegotiation) {
                gson {
                    setPrettyPrinting()
                    setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                }
            }
            
            install(StatusPages) {
                exception<Throwable> { call, cause ->
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        ErrorResponse(
                            code = "INTERNAL_ERROR",
                            message = cause.message ?: "Internal server error"
                        )
                    )
                }
            }
            
            routing {
                // CORS for local network
                install(CORS) {
                    anyHost()
                }
                
                // Authentication
                authenticate {
                    route("/api/v1") {
                        // Pairing endpoints
                        post("/pairing/request") {
                            val request = call.receive<PairingRequest>()
                            val session = pairingManager.createPairingSession()
                            call.respond(session)
                        }
                        
                        post("/pairing/submit") {
                            val request = call.receive<PairingSubmitRequest>()
                            val result = pairingManager.validateAndPair(
                                request.sessionId,
                                request.pinCode,
                                request.toDeviceInfo()
                            )
                            
                            when (result) {
                                is PairingResult.Success -> call.respond(result)
                                is PairingResult.Error -> call.respond(
                                    HttpStatusCode.BadRequest,
                                    ErrorResponse("INVALID_PIN", result.message)
                                )
                            }
                        }
                        
                        // Protected endpoints
                        authenticate("jwt") {
                            // Device management
                            get("/devices") {
                                val devices = deviceManager.getDevices()
                                call.respond(devices)
                            }
                            
                            // Media library
                            get("/media") {
                                val type = call.request.queryParameters["type"]
                                val limit = call.request.queryParameters["limit"]?.toInt() ?: 50
                                val offset = call.request.queryParameters["offset"]?.toInt() ?: 0
                                
                                val media = mediaRepository.getMediaItems(
                                    type = type?.let { MediaType.valueOf(it.uppercase()) },
                                    limit = limit,
                                    offset = offset
                                )
                                
                                call.respond(media)
                            }
                            
                            // Playlists
                            get("/playlists") {
                                val playlists = playlistRepository.getPlaylists()
                                call.respond(playlists)
                            }
                            
                            post("/playlists") {
                                val request = call.receive<CreatePlaylistRequest>()
                                val playlist = playlistRepository.createPlaylist(request)
                                call.respond(HttpStatusCode.Created, playlist)
                            }
                            
                            // Playback control
                            post("/playback/start") {
                                val request = call.receive<StartPlaybackRequest>()
                                val session = playbackController.startPlayback(request)
                                call.respond(session)
                            }
                            
                            get("/playback/status") {
                                val status = playbackController.getStatus()
                                call.respond(status)
                            }
                            
                            post("/playback/control") {
                                val request = call.receive<PlaybackControlRequest>()
                                val result = playbackController.control(request)
                                call.respond(result)
                            }
                            
                            // Settings
                            get("/settings") {
                                val settings = settingsManager.getSettings()
                                call.respond(settings)
                            }
                            
                            patch("/settings") {
                                val request = call.receive<UpdateSettingsRequest>()
                                settingsManager.updateSettings(request)
                                call.respond(mapOf("updated" to true))
                            }
                            
                            // System info
                            get("/system/info") {
                                val info = getSystemInfo()
                                call.respond(info)
                            }
                        }
                    }
                }
            }
        }.start(wait = false)
    }
    
    fun stop() {
        server?.stop(1000, 2000)
    }
}
```

### 1.7 Cache Manager Implementation

```kotlin
class CacheManager @Inject constructor(
    private val context: Context,
    private val mediaRepository: MediaRepository,
    private val settingsManager: SettingsManager
) {
    private val cacheDir = File(context.cacheDir, "media")
    private val thumbnailDir = File(context.cacheDir, "thumbnails")
    
    init {
        cacheDir.mkdirs()
        thumbnailDir.mkdirs()
    }
    
    suspend fun ensureSpaceAvailable(requiredBytes: Long) {
        val settings = settingsManager.getCacheSettings()
        val maxCacheSize = settings.maxSize
        
        val currentSize = getCurrentCacheSize()
        val availableSpace = maxCacheSize - currentSize
        
        if (availableSpace < requiredBytes) {
            val bytesToFree = requiredBytes - availableSpace
            evictLRUItems(bytesToFree)
        }
        
        // Also check system storage
        val systemAvailable = getAvailableSystemStorage()
        if (systemAvailable < RESERVED_SYSTEM_SPACE + requiredBytes) {
            throw InsufficientStorageException("Not enough system storage available")
        }
    }
    
    private suspend fun evictLRUItems(bytesToFree: Long) {
        var freedBytes = 0L
        
        // Get LRU items
        val lruItems = mediaRepository.getMediaItemsOrderedByAccess()
        
        for (item in lruItems) {
            if (freedBytes >= bytesToFree) break
            
            if (item.cached && item.cachePath != null) {
                val file = File(item.cachePath)
                if (file.exists()) {
                    val fileSize = file.length()
                    file.delete()
                    
                    // Delete thumbnail if exists
                    item.thumbnailPath?.let { path ->
                        File(path).delete()
                    }
                    
                    // Update database
                    mediaRepository.updateCacheStatus(
                        item.mediaId,
                        cached = false,
                        cachePath = null
                    )
                    
                    freedBytes += fileSize
                }
            }
        }
    }
    
    fun getCachePath(fileId: String, filename: String): File {
        val extension = filename.substringAfterLast('.', "")
        val sanitizedName = "${fileId}.${extension}"
        return File(cacheDir, sanitizedName)
    }
    
    fun getThumbnailPath(mediaId: String): File {
        return File(thumbnailDir, "${mediaId}.jpg")
    }
    
    private fun getCurrentCacheSize(): Long {
        return cacheDir.walkTopDown()
            .filter { it.isFile }
            .map { it.length() }
            .sum()
    }
    
    private fun getAvailableSystemStorage(): Long {
        val statFs = StatFs(context.filesDir.absolutePath)
        return statFs.availableBytes
    }
    
    suspend fun cleanupOldTempFiles() {
        val tempDir = File(context.cacheDir, "temp")
        if (!tempDir.exists()) return
        
        val cutoffTime = Instant.now().minusSeconds(7 * 24 * 60 * 60) // 7 days
        
        tempDir.listFiles()?.forEach { file ->
            val lastModified = Instant.ofEpochMilli(file.lastModified())
            if (lastModified.isBefore(cutoffTime)) {
                file.delete()
            }
        }
    }
    
    companion object {
        private const val RESERVED_SYSTEM_SPACE = 2L * 1024 * 1024 * 1024 // 2GB
    }
}
```

### 1.8 mDNS Service Implementation

```kotlin
class MdnsService @Inject constructor(
    private val context: Context,
    private val settingsManager: SettingsManager,
    private val deviceManager: DeviceManager
) {
    private var jmdns: JmDNS? = null
    private var serviceInfo: ServiceInfo? = null
    
    suspend fun start() {
        try {
            val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as WifiManager
            val multicastLock = wifiManager.createMulticastLock("tvboxplayer_mdns")
            multicastLock.acquire()
            
            val ipAddress = getLocalIpAddress()
            jmdns = JmDNS.create(InetAddress.getByName(ipAddress))
            
            val port = settingsManager.getApiPort()
            val deviceName = settingsManager.getDeviceName()
            val deviceId = settingsManager.getDeviceId()
            
            val properties = HashMap<String, String>().apply {
                put("version", BuildConfig.VERSION_NAME)
                put("api_version", "v1")
                put("device_name", deviceName)
                put("device_id", deviceId)
                put("model", Build.MODEL)
                put("capabilities", "video,audio,image,4k")
                put("max_devices", "5")
                put("paired_count", deviceManager.getActiveDeviceCount().toString())
            }
            
            serviceInfo = ServiceInfo.create(
                "_tvboxplayer._tcp.local.",
                deviceName,
                port,
                0,
                0,
                properties
            )
            
            jmdns?.registerService(serviceInfo)
            
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start mDNS service", e)
        }
    }
    
    fun stop() {
        try {
            serviceInfo?.let { jmdns?.unregisterService(it) }
            jmdns?.close()
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping mDNS service", e)
        }
    }
    
    private fun getLocalIpAddress(): String {
        val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as WifiManager
        val ipInt = wifiManager.connectionInfo.ipAddress
        return String.format(
            "%d.%d.%d.%d",
            ipInt and 0xff,
            ipInt shr 8 and 0xff,
            ipInt shr 16 and 0xff,
            ipInt shr 24 and 0xff
        )
    }
    
    companion object {
        private const val TAG = "MdnsService"
    }
}
```

## 2. Mobile Application Implementation (React Native)

### 2.1 Project Structure

```
mobile-app/
├── src/
│   ├── screens/
│   │   ├── DevicePairingScreen.tsx
│   │   ├── RemoteControlScreen.tsx
│   │   ├── MediaBrowserScreen.tsx
│   │   ├── PlaylistScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── DeviceDiscovery/
│   │   ├── RemoteControl/
│   │   ├── MediaGrid/
│   │   └── PlaylistManager/
│   ├── store/
│   │   ├── reducers/
│   │   ├── actions/
│   │   ├── sagas/
│   │   └── selectors/
│   ├── services/
│   │   ├── api/
│   │   ├── discovery/
│   │   ├── cloudProvider/
│   │   └── storage/
│   ├── navigation/
│   ├── utils/
│   └── types/
├── android/
├── ios/
└── package.json
```

### 2.2 Key Dependencies

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.2",
    "react-navigation": "^6.0.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/stack": "^6.3.20",
    "redux": "^5.0.0",
    "react-redux": "^9.0.0",
    "redux-saga": "^1.2.3",
    "axios": "^1.6.2",
    "react-native-zeroconf": "^0.13.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-google-signin": "^11.0.0",
    "@react-native-google-drive/api-wrapper": "^1.0.0",
    "react-native-gesture-handler": "^2.14.1",
    "react-native-reanimated": "^3.6.1",
    "react-native-svg": "^14.1.0"
  }
}
```

### 2.3 Device Discovery Service

```typescript
// src/services/discovery/MdnsDiscoveryService.ts
import Zeroconf from 'react-native-zeroconf';

export interface DiscoveredDevice {
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  port: number;
  version: string;
  capabilities: string[];
  pairedCount: number;
  maxDevices: number;
}

class MdnsDiscoveryService {
  private zeroconf: Zeroconf;
  private devices: Map<string, DiscoveredDevice> = new Map();
  private listeners: ((devices: DiscoveredDevice[]) => void)[] = [];
  
  constructor() {
    this.zeroconf = new Zeroconf();
    this.setupListeners();
  }
  
  private setupListeners() {
    this.zeroconf.on('resolved', (service: any) => {
      const device = this.parseService(service);
      if (device) {
        this.devices.set(device.deviceId, device);
        this.notifyListeners();
      }
    });
    
    this.zeroconf.on('removed', (service: any) => {
      const deviceId = service.txt?.device_id;
      if (deviceId) {
        this.devices.delete(deviceId);
        this.notifyListeners();
      }
    });
  }
  
  startDiscovery() {
    this.zeroconf.scan('tvboxplayer', 'tcp', 'local.');
  }
  
  stopDiscovery() {
    this.zeroconf.stop();
  }
  
  private parseService(service: any): DiscoveredDevice | null {
    const txt = service.txt || {};
    
    if (!txt.device_id) return null;
    
    return {
      deviceId: txt.device_id,
      deviceName: txt.device_name || service.name,
      ipAddress: service.addresses?.[0] || '',
      port: service.port,
      version: txt.version || '1.0.0',
      capabilities: (txt.capabilities || '').split(','),
      pairedCount: parseInt(txt.paired_count || '0'),
      maxDevices: parseInt(txt.max_devices || '5'),
    };
  }
  
  addListener(callback: (devices: DiscoveredDevice[]) => void) {
    this.listeners.push(callback);
  }
  
  removeListener(callback: (devices: DiscoveredDevice[]) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }
  
  private notifyListeners() {
    const devices = Array.from(this.devices.values());
    this.listeners.forEach(listener => listener(devices));
  }
  
  getDiscoveredDevices(): DiscoveredDevice[] {
    return Array.from(this.devices.values());
  }
}

export default new MdnsDiscoveryService();
```

### 2.4 TV Box API Client

```typescript
// src/services/api/TvBoxApiClient.ts
import axios, { AxiosInstance } from 'axios';
import { storageService } from '../storage/StorageService';

export class TvBoxApiClient {
  private client: AxiosInstance;
  private baseUrl: string;
  
  constructor(ipAddress: string, port: number) {
    this.baseUrl = `https://${ipAddress}:${port}/api/v1`;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(async (config) => {
      const token = await storageService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = await storageService.getRefreshToken();
            const response = await this.refreshToken(refreshToken);
            
            await storageService.setAccessToken(response.access_token);
            
            originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to pairing
            await storageService.clearTokens();
            // Navigate to pairing screen
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  // Pairing
  async requestPairing(deviceInfo: DeviceInfo): Promise<PairingSession> {
    const response = await this.client.post('/pairing/request', deviceInfo);
    return response.data;
  }
  
  async submitPin(sessionId: string, pinCode: string, deviceInfo: DeviceInfo): Promise<PairingResult> {
    const response = await this.client.post('/pairing/submit', {
      session_id: sessionId,
      pin_code: pinCode,
      ...deviceInfo,
    });
    return response.data;
  }
  
  private async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    const response = await this.client.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  }
  
  // Media
  async getMediaItems(params: MediaQueryParams): Promise<MediaListResponse> {
    const response = await this.client.get('/media', { params });
    return response.data;
  }
  
  async getMediaItem(mediaId: string): Promise<MediaItem> {
    const response = await this.client.get(`/media/${mediaId}`);
    return response.data;
  }
  
  // Playlists
  async getPlaylists(): Promise<PlaylistsResponse> {
    const response = await this.client.get('/playlists');
    return response.data;
  }
  
  async createPlaylist(playlist: CreatePlaylistRequest): Promise<Playlist> {
    const response = await this.client.post('/playlists', playlist);
    return response.data;
  }
  
  async getPlaylist(playlistId: string): Promise<Playlist> {
    const response = await this.client.get(`/playlists/${playlistId}`);
    return response.data;
  }
  
  // Playback Control
  async startPlayback(playlistId: string, startPosition: number = 0): Promise<PlaybackSession> {
    const response = await this.client.post('/playback/start', {
      playlist_id: playlistId,
      start_position: startPosition,
      autoplay: true,
    });
    return response.data;
  }
  
  async getPlaybackStatus(): Promise<PlaybackStatus> {
    const response = await this.client.get('/playback/status');
    return response.data;
  }
  
  async controlPlayback(action: PlaybackAction, params?: any): Promise<PlaybackControlResponse> {
    const response = await this.client.post('/playback/control', {
      action,
      ...params,
    });
    return response.data;
  }
  
  async stopPlayback(): Promise<void> {
    await this.client.post('/playback/stop');
  }
  
  // Sync
  async startSync(syncRequest: StartSyncRequest): Promise<SyncJob> {
    const response = await this.client.post('/sync/start', syncRequest);
    return response.data;
  }
  
  async getSyncStatus(syncJobId: string): Promise<SyncJob> {
    const response = await this.client.get(`/sync/jobs/${syncJobId}`);
    return response.data;
  }
  
  async cancelSync(syncJobId: string): Promise<void> {
    await this.client.post(`/sync/jobs/${syncJobId}/cancel`);
  }
}
```

### 2.5 Redux Store Setup

```typescript
// src/store/index.ts
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
```

```typescript
// src/store/reducers/devices.ts
import { DeviceActionTypes } from '../actions/devices';

interface DevicesState {
  discovered: DiscoveredDevice[];
  paired: PairedDevice[];
  activeDevice: PairedDevice | null;
  discovering: boolean;
}

const initialState: DevicesState = {
  discovered: [],
  paired: [],
  activeDevice: null,
  discovering: false,
};

export default function devicesReducer(
  state = initialState,
  action: any
): DevicesState {
  switch (action.type) {
    case DeviceActionTypes.START_DISCOVERY:
      return { ...state, discovering: true };
      
    case DeviceActionTypes.STOP_DISCOVERY:
      return { ...state, discovering: false };
      
    case DeviceActionTypes.DEVICES_DISCOVERED:
      return { ...state, discovered: action.payload };
      
    case DeviceActionTypes.SET_ACTIVE_DEVICE:
      return { ...state, activeDevice: action.payload };
      
    default:
      return state;
  }
}
```

```typescript
// src/store/sagas/devices.ts
import { takeEvery, put, call } from 'redux-saga/effects';
import mdnsDiscoveryService from '../../services/discovery/MdnsDiscoveryService';
import { DeviceActionTypes } from '../actions/devices';

function* startDiscoverySaga() {
  mdnsDiscoveryService.startDiscovery();
  
  mdnsDiscoveryService.addListener((devices) => {
    // Dispatch action with discovered devices
    store.dispatch({
      type: DeviceActionTypes.DEVICES_DISCOVERED,
      payload: devices,
    });
  });
}

function* stopDiscoverySaga() {
  mdnsDiscoveryService.stopDiscovery();
}

export default function* devicesSaga() {
  yield takeEvery(DeviceActionTypes.START_DISCOVERY, startDiscoverySaga);
  yield takeEvery(DeviceActionTypes.STOP_DISCOVERY, stopDiscoverySaga);
}
```

## 3. Security Implementation

### 3.1 JWT Token Generation (Kotlin)

```kotlin
class JwtTokenProvider @Inject constructor(
    private val keyManager: KeyManager
) {
    fun generateAccessToken(device: Device): String {
        val now = Instant.now()
        val expiresAt = now.plusSeconds(ACCESS_TOKEN_LIFETIME)
        
        return Jwts.builder()
            .setIssuer("tvboxplayer")
            .setSubject(device.deviceId)
            .setAudience("tvboxplayer-api")
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expiresAt))
            .setNotBefore(Date.from(now))
            .setId(UUID.randomUUID().toString())
            .claim("device_id", device.deviceId)
            .claim("device_name", device.deviceName)
            .claim("permissions", device.permissions.map { it.name })
            .claim("is_primary", device.isPrimary)
            .signWith(keyManager.getPrivateKey(), SignatureAlgorithm.RS256)
            .compact()
    }
    
    fun generateRefreshToken(device: Device): String {
        val now = Instant.now()
        val expiresAt = now.plusSeconds(REFRESH_TOKEN_LIFETIME)
        
        return Jwts.builder()
            .setIssuer("tvboxplayer")
            .setSubject(device.deviceId)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expiresAt))
            .setId(UUID.randomUUID().toString())
            .signWith(keyManager.getPrivateKey(), SignatureAlgorithm.RS256)
            .compact()
    }
    
    fun validateToken(token: String): Device? {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(keyManager.getPublicKey())
                .build()
                .parseClaimsJws(token)
                .body
            
            // Extract device info from claims
            // ...
            
        } catch (e: Exception) {
            null
        }
    }
    
    companion object {
        private const val ACCESS_TOKEN_LIFETIME = 86400L // 24 hours
        private const val REFRESH_TOKEN_LIFETIME = 2592000L // 30 days
    }
}
```

### 3.2 Encryption (Android Keystore)

```kotlin
class KeyManager @Inject constructor(
    private val context: Context
) {
    private val keyStore = KeyStore.getInstance("AndroidKeyStore").apply {
        load(null)
    }
    
    init {
        generateKeyPairIfNeeded()
    }
    
    private fun generateKeyPairIfNeeded() {
        if (!keyStore.containsAlias(KEY_ALIAS)) {
            val keyPairGenerator = KeyPairGenerator.getInstance(
                KeyProperties.KEY_ALGORITHM_RSA,
                "AndroidKeyStore"
            )
            
            val spec = KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
            )
                .setDigests(KeyProperties.DIGEST_SHA256)
                .setSignaturePaddings(KeyProperties.SIGNATURE_PADDING_RSA_PKCS1)
                .setKeySize(2048)
                .build()
            
            keyPairGenerator.initialize(spec)
            keyPairGenerator.generateKeyPair()
        }
    }
    
    fun getPrivateKey(): PrivateKey {
        return keyStore.getKey(KEY_ALIAS, null) as PrivateKey
    }
    
    fun getPublicKey(): PublicKey {
        return keyStore.getCertificate(KEY_ALIAS).publicKey
    }
    
    companion object {
        private const val KEY_ALIAS = "tvboxplayer_jwt_key"
    }
}
```

### 3.3 Content Encryption

```kotlin
class ContentEncryption @Inject constructor(
    private val keyManager: KeyManager
) {
    fun encryptFile(inputFile: File, outputFile: File) {
        val key = generateAESKey()
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, key)
        
        val iv = cipher.iv
        
        FileInputStream(inputFile).use { input ->
            FileOutputStream(outputFile).use { output ->
                // Write IV first
                output.write(iv.size)
                output.write(iv)
                
                // Encrypt content
                val cipherOutputStream = CipherOutputStream(output, cipher)
                input.copyTo(cipherOutputStream)
                cipherOutputStream.close()
            }
        }
    }
    
    fun decryptFile(inputFile: File, outputFile: File) {
        FileInputStream(inputFile).use { input ->
            // Read IV
            val ivSize = input.read()
            val iv = ByteArray(ivSize)
            input.read(iv)
            
            val key = getStoredAESKey()
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.DECRYPT_MODE, key, GCMParameterSpec(128, iv))
            
            FileOutputStream(outputFile).use { output ->
                val cipherInputStream = CipherInputStream(input, cipher)
                cipherInputStream.copyTo(output)
            }
        }
    }
    
    private fun generateAESKey(): SecretKey {
        val keyGenerator = KeyGenerator.getInstance("AES")
        keyGenerator.init(256)
        return keyGenerator.generateKey()
    }
}
```

## 4. Performance Optimization

### 4.1 Database Indexing

```kotlin
@Database(
    entities = [
        Device::class,
        MediaItem::class,
        Playlist::class,
        PlaylistItem::class,
        SyncJob::class,
        PlaybackHistory::class
    ],
    version = 1
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun deviceDao(): DeviceDao
    abstract fun mediaItemDao(): MediaItemDao
    abstract fun playlistDao(): PlaylistDao
    abstract fun syncJobDao(): SyncJobDao
    abstract fun playbackHistoryDao(): PlaybackHistoryDao
}

@Dao
interface MediaItemDao {
    @Query("""
        SELECT * FROM media_items 
        WHERE media_type = :type 
        ORDER BY created_at DESC 
        LIMIT :limit OFFSET :offset
    """)
    suspend fun getMediaItemsByType(
        type: String,
        limit: Int,
        offset: Int
    ): List<MediaItem>
    
    @Query("""
        SELECT * FROM media_items 
        WHERE cached = 1 
        ORDER BY last_accessed ASC
    """)
    suspend fun getLRUCachedItems(): List<MediaItem>
}
```

### 4.2 Image Loading Optimization

```kotlin
// Using Coil for efficient image loading
ImageLoader.Builder(context)
    .memoryCache {
        MemoryCache.Builder(context)
            .maxSizePercent(0.25)
            .build()
    }
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .maxSizePercent(0.02)
            .build()
    }
    .build()
```

### 4.3 Lazy Loading in Mobile App

```typescript
// src/components/MediaGrid/MediaGrid.tsx
import React from 'react';
import { FlatList } from 'react-native';

const MediaGrid: React.FC<MediaGridProps> = ({ items, onLoadMore }) => {
  const renderItem = ({ item }: { item: MediaItem }) => (
    <MediaCard item={item} />
  );
  
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.media_id}
      numColumns={3}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};
```

## 5. Testing Strategy

### 5.1 Unit Tests (TV Box App)

```kotlin
@RunWith(MockitoJUnitRunner::class)
class PairingManagerTest {
    
    @Mock
    private lateinit var deviceRepository: DeviceRepository
    
    @Mock
    private lateinit var jwtTokenProvider: JwtTokenProvider
    
    private lateinit var pairingManager: PairingManager
    
    @Before
    fun setup() {
        pairingManager = PairingManager(
            deviceRepository,
            jwtTokenProvider,
            encryptedPreferences
        )
    }
    
    @Test
    fun `createPairingSession generates valid 6-digit PIN`() = runTest {
        val session = pairingManager.createPairingSession()
        
        assertTrue(session.pinCode.length == 6)
        assertTrue(session.pinCode.all { it.isDigit() })
    }
    
    @Test
    fun `validateAndPair rejects expired PIN`() = runTest {
        val session = pairingManager.createPairingSession()
        
        // Wait for expiration
        delay(310_000) // 5 minutes + buffer
        
        val result = pairingManager.validateAndPair(
            session.sessionId,
            session.pinCode,
            mockDeviceInfo
        )
        
        assertTrue(result is PairingResult.Error)
    }
}
```

### 5.2 Integration Tests

```kotlin
@RunWith(AndroidJUnit4::class)
class ContentSyncIntegrationTest {
    
    @Test
    fun `sync downloads and caches media files`() = runTest {
        // Setup mock cloud provider
        val mockFiles = listOf(
            createMockFile("video1.mp4", 1024 * 1024 * 10),
            createMockFile("video2.mp4", 1024 * 1024 * 15)
        )
        
        // Start sync
        val syncJob = contentSyncService.startSync(mockFolders)
        
        // Wait for completion
        withTimeout(60_000) {
            while (syncJob.status != SyncStatus.COMPLETED) {
                delay(1000)
            }
        }
        
        // Verify media items are cached
        val cachedItems = mediaRepository.getCachedMediaItems()
        assertEquals(2, cachedItems.size)
    }
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-18  
**Status**: Technical Specification  
**Relates To**: PRODUCT_SPECIFICATION.md, ARCHITECTURE.md, API_AND_DATA_STRUCTURES.md
