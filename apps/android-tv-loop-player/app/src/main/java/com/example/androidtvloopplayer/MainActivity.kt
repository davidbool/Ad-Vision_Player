package com.example.androidtvloopplayer

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var imageView: ImageView
    private lateinit var overlayText: TextView
    private lateinit var debugOverlayText: TextView

    private var imageLoopJob: Job? = null
    private var remoteSyncJob: Job? = null

    private var currentImageIndex = 0
    private var activePlaybackItems: List<PlaybackItem> = emptyList()
    private var currentPlaylistSource = PLAYBACK_SOURCE_FOLDER

    private var lastManifestVersion: Long? = null
    private var lastCheckedLabel = "-"
    private var lastSuccessfulSyncLabel = "-"
    private var syncStatusMessage = "idle"

    private data class PlaybackItem(
        val file: File,
        val durationMs: Long
    )

    private data class ImageLookupResult(
        val playbackItems: List<PlaybackItem>,
        val sourceLabel: String,
        val directoryPath: String,
        val directoryError: Boolean
    )

    private data class RemoteManifestItem(
        val file: String,
        val url: String,
        val durationMs: Long
    )

    private data class RemoteManifest(
        val version: Long,
        val items: List<RemoteManifestItem>
    )

    private sealed class SyncResult {
        data class Updated(val version: Long, val playbackItems: List<PlaybackItem>) : SyncResult()
        data class Unchanged(val version: Long) : SyncResult()
        data class Error(val message: String) : SyncResult()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        setContentView(R.layout.activity_main)

        imageView = findViewById(R.id.mainImageView)
        overlayText = findViewById(R.id.overlayText)
        debugOverlayText = findViewById(R.id.debugOverlayText)

        hideSystemUi()
    }

    override fun onStart() {
        super.onStart()
        hideSystemUi()

        if (REMOTE_MODE) {
            startRemoteMode()
        } else {
            startLocalMode()
        }
    }

    override fun onStop() {
        remoteSyncJob?.cancel()
        remoteSyncJob = null
        imageLoopJob?.cancel()
        imageLoopJob = null
        super.onStop()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            hideSystemUi()
        }
    }

    private fun startLocalMode() {
        lifecycleScope.launch {
            val lookupResult = withContext(Dispatchers.IO) { loadLocalPlaybackItems() }
            if (lookupResult.directoryError) {
                imageView.setImageDrawable(null)
                debugOverlayText.visibility = View.GONE
                overlayText.text = getString(
                    R.string.image_directory_error,
                    lookupResult.directoryPath,
                    lookupResult.directoryPath
                )
                overlayText.visibility = View.VISIBLE
                return@launch
            }

            if (lookupResult.playbackItems.isEmpty()) {
                imageView.setImageDrawable(null)
                debugOverlayText.visibility = View.GONE
                overlayText.text = getString(R.string.no_images_found_with_path, lookupResult.directoryPath)
                overlayText.visibility = View.VISIBLE
                return@launch
            }

            syncStatusMessage = "n/a"
            applyPlaybackItems(lookupResult.playbackItems, lookupResult.sourceLabel, restartFromFirst = false)
        }
    }

    private fun startRemoteMode() {
        overlayText.visibility = View.GONE
        syncStatusMessage = "sync: idle"

        lifecycleScope.launch {
            val cacheState = withContext(Dispatchers.IO) { loadRemoteStateFromCache() }
            if (cacheState != null && cacheState.playbackItems.isNotEmpty()) {
                lastManifestVersion = cacheState.version
                applyPlaybackItems(cacheState.playbackItems, PLAYBACK_SOURCE_REMOTE_CACHE, restartFromFirst = false)
                lastSuccessfulSyncLabel = "cached"
                syncStatusMessage = "sync: using cached playlist"
                refreshDebugOverlay()
            } else {
                showEmptyRemoteState()
            }
        }

        remoteSyncJob?.cancel()
        remoteSyncJob = lifecycleScope.launch {
            while (isActive) {
                val nowLabel = formatNowLabel()
                lastCheckedLabel = nowLabel

                val syncResult = withContext(Dispatchers.IO) {
                    syncRemoteManifest(lastManifestVersion)
                }

                when (syncResult) {
                    is SyncResult.Updated -> {
                        lastManifestVersion = syncResult.version
                        lastSuccessfulSyncLabel = nowLabel
                        syncStatusMessage = "sync: ok (v${syncResult.version})"
                        overlayText.visibility = View.GONE
                        applyPlaybackItems(syncResult.playbackItems, PLAYBACK_SOURCE_REMOTE_CACHE, restartFromFirst = true)
                        saveRemoteState(syncResult.version, syncResult.playbackItems)
                    }

                    is SyncResult.Unchanged -> {
                        lastManifestVersion = syncResult.version
                        syncStatusMessage = "sync: unchanged (v${syncResult.version})"
                        refreshDebugOverlay()
                    }

                    is SyncResult.Error -> {
                        syncStatusMessage = "sync: error ${syncResult.message}"
                        if (activePlaybackItems.isEmpty()) {
                            overlayText.text = syncStatusMessage
                            overlayText.visibility = View.VISIBLE
                        }
                        refreshDebugOverlay()
                    }
                }

                delay(REMOTE_POLL_INTERVAL_MS)
            }
        }
    }

    private fun showEmptyRemoteState() {
        imageView.setImageDrawable(null)
        overlayText.text = getString(R.string.no_remote_cache)
        overlayText.visibility = View.VISIBLE
        refreshDebugOverlay()
    }

    private fun loadLocalPlaybackItems(): ImageLookupResult {
        val imageDir = File(getExternalFilesDir(null), IMAGE_DIRECTORY_NAME)
        if (!imageDir.exists() && !imageDir.mkdirs()) {
            return ImageLookupResult(
                playbackItems = emptyList(),
                sourceLabel = PLAYBACK_SOURCE_FOLDER,
                directoryPath = imageDir.absolutePath,
                directoryError = true
            )
        }

        if (!imageDir.isDirectory) {
            return ImageLookupResult(
                playbackItems = emptyList(),
                sourceLabel = PLAYBACK_SOURCE_FOLDER,
                directoryPath = imageDir.absolutePath,
                directoryError = true
            )
        }

        val playlistFile = File(imageDir, PLAYLIST_FILE_NAME)
        val playlistItems = parsePlaylistFile(playlistFile, imageDir)
        if (playlistItems != null) {
            return ImageLookupResult(
                playbackItems = playlistItems,
                sourceLabel = PLAYBACK_SOURCE_PLAYLIST,
                directoryPath = imageDir.absolutePath,
                directoryError = false
            )
        }

        val imageFiles = imageDir
            .listFiles { file ->
                file.isFile && (file.extension.equals("jpg", ignoreCase = true) ||
                    file.extension.equals("png", ignoreCase = true))
            }
            ?.sortedBy { it.name.lowercase() }
            ?: emptyList()

        val folderItems = imageFiles.map { imageFile ->
            PlaybackItem(file = imageFile, durationMs = DEFAULT_ITEM_DURATION_MS)
        }

        return ImageLookupResult(
            playbackItems = folderItems,
            sourceLabel = PLAYBACK_SOURCE_FOLDER,
            directoryPath = imageDir.absolutePath,
            directoryError = false
        )
    }

    private fun applyPlaybackItems(items: List<PlaybackItem>, sourceLabel: String, restartFromFirst: Boolean) {
        if (items.isEmpty()) {
            return
        }

        activePlaybackItems = items
        currentPlaylistSource = sourceLabel
        if (restartFromFirst || currentImageIndex >= activePlaybackItems.size) {
            currentImageIndex = 0
        }

        imageLoopJob?.cancel()
        imageLoopJob = lifecycleScope.launch {
            while (isActive && activePlaybackItems.isNotEmpty()) {
                val currentItem = activePlaybackItems[currentImageIndex]
                val decodedBitmap = withContext(Dispatchers.IO) {
                    decodeSampledBitmap(currentItem.file, imageView.width, imageView.height)
                }

                if (decodedBitmap != null) {
                    imageView.setImageBitmap(decodedBitmap)
                    overlayText.visibility = View.GONE
                } else {
                    Log.w(TAG, "Failed to decode image: ${currentItem.file.absolutePath}")
                }

                refreshDebugOverlay()

                currentImageIndex = (currentImageIndex + 1) % activePlaybackItems.size
                delay(currentItem.durationMs)
            }
        }
    }

    private fun loadRemoteStateFromCache(): RemoteManifest? {
        val cacheDir = File(getExternalFilesDir(null), REMOTE_CACHE_DIR)
        val stateFile = File(cacheDir, REMOTE_STATE_FILE)
        if (!stateFile.exists()) {
            return null
        }

        return try {
            val json = JSONObject(stateFile.readText())
            parseManifest(json)
        } catch (e: Exception) {
            Log.w(TAG, "Failed to parse cached remote state", e)
            null
        }
    }

    private fun saveRemoteState(version: Long, playbackItems: List<PlaybackItem>) {
        lifecycleScope.launch(Dispatchers.IO) {
            val cacheDir = File(getExternalFilesDir(null), REMOTE_CACHE_DIR)
            if (!cacheDir.exists() && !cacheDir.mkdirs()) {
                Log.w(TAG, "Failed to create cache directory for state: ${cacheDir.absolutePath}")
                return@launch
            }

            val jsonItems = JSONArray()
            playbackItems.forEach { item ->
                jsonItems.put(
                    JSONObject()
                        .put("file", item.file.name)
                        .put("url", "")
                        .put("durationMs", item.durationMs)
                )
            }

            val json = JSONObject()
                .put("version", version)
                .put("items", jsonItems)

            val tmpFile = File(cacheDir, "$REMOTE_STATE_FILE.tmp")
            tmpFile.writeText(json.toString())
            val finalFile = File(cacheDir, REMOTE_STATE_FILE)
            if (!tmpFile.renameTo(finalFile)) {
                Log.w(TAG, "Failed to replace remote state file")
            }
        }
    }

    private fun syncRemoteManifest(previousVersion: Long?): SyncResult {
        return try {
            val manifestJson = httpGetJson(REMOTE_MANIFEST_URL)
            val remoteManifest = parseManifest(manifestJson)

            if (previousVersion != null && previousVersion == remoteManifest.version) {
                return SyncResult.Unchanged(remoteManifest.version)
            }

            val cacheDir = File(getExternalFilesDir(null), REMOTE_CACHE_DIR)
            if (!cacheDir.exists() && !cacheDir.mkdirs()) {
                return SyncResult.Error("unable to create cache dir")
            }

            for (item in remoteManifest.items) {
                val safeFileName = File(item.file).name
                val destinationFile = File(cacheDir, safeFileName)
                if (destinationFile.exists() && destinationFile.isFile) {
                    continue
                }

                val success = downloadFileAtomically(item.url, destinationFile)
                if (!success) {
                    return SyncResult.Error("download failed: $safeFileName")
                }
            }

            val expectedNames = remoteManifest.items.map { File(it.file).name }.toSet()
            cacheDir.listFiles()?.forEach { existing ->
                if (!existing.isFile) {
                    return@forEach
                }
                if (existing.name == REMOTE_STATE_FILE || existing.name.endsWith(".tmp")) {
                    return@forEach
                }
                if (!expectedNames.contains(existing.name)) {
                    existing.delete()
                }
            }

            val playbackItems = remoteManifest.items.mapNotNull { item ->
                val safeFileName = File(item.file).name
                val localFile = File(cacheDir, safeFileName)
                if (!localFile.exists() || !localFile.isFile) {
                    null
                } else {
                    PlaybackItem(file = localFile, durationMs = item.durationMs)
                }
            }

            if (playbackItems.isEmpty()) {
                SyncResult.Error("manifest has no playable files")
            } else {
                SyncResult.Updated(remoteManifest.version, playbackItems)
            }
        } catch (e: Exception) {
            Log.w(TAG, "Remote sync failed", e)
            SyncResult.Error(e.message ?: "request failed")
        }
    }

    private fun parseManifest(json: JSONObject): RemoteManifest {
        val version = json.optLong("version", -1L)
        if (version < 0) {
            throw IllegalArgumentException("manifest missing valid version")
        }

        val itemsArray = json.optJSONArray("items") ?: JSONArray()
        val items = mutableListOf<RemoteManifestItem>()

        for (index in 0 until itemsArray.length()) {
            val entry = itemsArray.optJSONObject(index) ?: continue
            val file = entry.optString("file", "").trim()
            val url = entry.optString("url", "").trim()
            if (file.isEmpty() || url.isEmpty()) {
                continue
            }

            val duration = if (entry.has("durationMs")) {
                entry.optLong("durationMs", DEFAULT_ITEM_DURATION_MS)
            } else {
                DEFAULT_ITEM_DURATION_MS
            }.coerceIn(MIN_ITEM_DURATION_MS, MAX_ITEM_DURATION_MS)

            items.add(RemoteManifestItem(file = file, url = url, durationMs = duration))
        }

        return RemoteManifest(version = version, items = items)
    }

    private fun httpGetJson(url: String): JSONObject {
        val connection = (URL(url).openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = NETWORK_TIMEOUT_MS
            readTimeout = NETWORK_TIMEOUT_MS
            doInput = true
            setRequestProperty("Accept", "application/json")
        }

        try {
            val code = connection.responseCode
            if (code !in 200..299) {
                throw IllegalStateException("HTTP $code")
            }
            val content = connection.inputStream.bufferedReader().use { reader -> reader.readText() }
            return JSONObject(content)
        } finally {
            connection.disconnect()
        }
    }

    private fun downloadFileAtomically(url: String, destination: File): Boolean {
        val parent = destination.parentFile ?: return false
        if (!parent.exists() && !parent.mkdirs()) {
            return false
        }

        val tmpFile = File(parent, "${destination.name}.tmp")
        if (tmpFile.exists()) {
            tmpFile.delete()
        }

        val connection = (URL(url).openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = NETWORK_TIMEOUT_MS
            readTimeout = NETWORK_TIMEOUT_MS
            doInput = true
        }

        return try {
            try {
                val code = connection.responseCode
                if (code !in 200..299) {
                    return false
                }

                connection.inputStream.use { input ->
                    FileOutputStream(tmpFile).use { output ->
                        input.copyTo(output)
                        output.fd.sync()
                    }
                }
            } finally {
                connection.disconnect()
            }

            if (destination.exists()) {
                destination.delete()
            }

            if (!tmpFile.renameTo(destination)) {
                tmpFile.delete()
                return false
            }

            true
        } catch (e: Exception) {
            Log.w(TAG, "Failed to download file: $url", e)
            tmpFile.delete()
            false
        }
    }

    private fun parsePlaylistFile(playlistFile: File, imageDir: File): List<PlaybackItem>? {
        if (!playlistFile.exists()) {
            return null
        }

        return try {
            val rawText = playlistFile.readText()
            val jsonArray = JSONArray(rawText)
            val items = mutableListOf<PlaybackItem>()

            for (index in 0 until jsonArray.length()) {
                val entry = jsonArray.optJSONObject(index)
                if (entry == null) {
                    Log.w(TAG, "Skipping playlist entry $index: not a JSON object")
                    continue
                }

                val fileName = entry.optString("file", "").trim()
                if (fileName.isEmpty()) {
                    Log.w(TAG, "Skipping playlist entry $index: missing file")
                    continue
                }

                val imageFile = File(imageDir, fileName)
                if (!imageFile.exists() || !imageFile.isFile) {
                    Log.w(TAG, "Skipping playlist entry $index: file does not exist (${imageFile.absolutePath})")
                    continue
                }

                val durationMs = if (entry.has("durationMs")) {
                    entry.optLong("durationMs", DEFAULT_ITEM_DURATION_MS)
                } else {
                    DEFAULT_ITEM_DURATION_MS
                }.coerceIn(MIN_ITEM_DURATION_MS, MAX_ITEM_DURATION_MS)

                items.add(PlaybackItem(file = imageFile, durationMs = durationMs))
            }

            items
        } catch (e: Exception) {
            Log.w(TAG, "Invalid playlist.json. Falling back to folder scan.", e)
            null
        }
    }

    private fun decodeSampledBitmap(file: File, reqWidth: Int, reqHeight: Int): Bitmap? {
        val targetWidth = if (reqWidth > 0) reqWidth else resources.displayMetrics.widthPixels
        val targetHeight = if (reqHeight > 0) reqHeight else resources.displayMetrics.heightPixels

        val boundsOptions = BitmapFactory.Options().apply {
            inJustDecodeBounds = true
        }
        BitmapFactory.decodeFile(file.absolutePath, boundsOptions)

        val decodeOptions = BitmapFactory.Options().apply {
            inSampleSize = calculateInSampleSize(boundsOptions, targetWidth, targetHeight)
            inPreferredConfig = Bitmap.Config.RGB_565
        }

        return BitmapFactory.decodeFile(file.absolutePath, decodeOptions)
    }

    private fun calculateInSampleSize(options: BitmapFactory.Options, reqWidth: Int, reqHeight: Int): Int {
        val height = options.outHeight
        val width = options.outWidth
        var inSampleSize = 1

        if (height > reqHeight || width > reqWidth) {
            val halfHeight = height / 2
            val halfWidth = width / 2

            while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2
            }
        }

        return inSampleSize
    }

    private fun refreshDebugOverlay() {
        val mode = if (REMOTE_MODE) "remote" else "local"
        val total = activePlaybackItems.size
        val index = if (total == 0) 0 else ((currentImageIndex % total) + 1)
        debugOverlayText.text = getString(
            R.string.image_debug_status_extended,
            mode,
            lastCheckedLabel,
            lastSuccessfulSyncLabel,
            currentPlaylistSource,
            index,
            total,
            syncStatusMessage
        )
        debugOverlayText.visibility = View.VISIBLE
    }

    private fun formatNowLabel(): String {
        val formatter = SimpleDateFormat("HH:mm:ss", Locale.US)
        return formatter.format(Date())
    }

    private fun hideSystemUi() {
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars())
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

        @Suppress("DEPRECATION")
        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
    }

    companion object {
        private const val TAG = "MainActivity"

        private const val REMOTE_MODE = true

        private const val IMAGE_DIRECTORY_NAME = "advision_demo"
        private const val PLAYLIST_FILE_NAME = "playlist.json"
        private const val PLAYBACK_SOURCE_PLAYLIST = "playlist"
        private const val PLAYBACK_SOURCE_FOLDER = "folder"
        private const val PLAYBACK_SOURCE_REMOTE_CACHE = "remote-cache"

        private const val REMOTE_CACHE_DIR = "advision_cache"
        private const val REMOTE_STATE_FILE = "remote_state.json"
        private const val REMOTE_MANIFEST_URL = "https://davidbool.github.io/advision-demo-content/manifest.json"
        private const val REMOTE_POLL_INTERVAL_MS = 60_000L
        private const val NETWORK_TIMEOUT_MS = 10_000

        private const val DEFAULT_ITEM_DURATION_MS = 5_000L
        private const val MIN_ITEM_DURATION_MS = 1_000L
        private const val MAX_ITEM_DURATION_MS = 60_000L
    }
}
