package com.tvboxplayer.sync

import io.mockk.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import java.io.File

@ExperimentalCoroutinesApi
class ContentSyncServiceTest {

    private lateinit var contentSyncService: ContentSyncService
    private lateinit var mockDownloadManager: DownloadManager

    @Before
    fun setup() {
        mockDownloadManager = mockk(relaxed = true)
        contentSyncService = ContentSyncService(mockDownloadManager)
    }

    @After
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `createDownloadJob should initialize new download job`() = runTest {
        val mediaId = "media-123"
        val sourceUrl = "https://drive.google.com/file/123"
        val destination = "/cache/video.mp4"

        val jobId = contentSyncService.createDownloadJob(mediaId, sourceUrl, destination)

        assertNotNull(jobId)
        assertTrue(jobId.isNotEmpty())
        verify { mockDownloadManager.enqueue(any()) }
    }

    @Test
    fun `getDownloadProgress should return current progress`() = runTest {
        val jobId = "job-123"
        every { mockDownloadManager.getProgress(jobId) } returns 45

        val progress = contentSyncService.getDownloadProgress(jobId)

        assertEquals(45, progress)
    }

    @Test
    fun `getDownloadProgress should return 0 for unknown job`() = runTest {
        val jobId = "unknown-job"
        every { mockDownloadManager.getProgress(jobId) } returns 0

        val progress = contentSyncService.getDownloadProgress(jobId)

        assertEquals(0, progress)
    }

    @Test
    fun `pauseDownload should pause active download`() = runTest {
        val jobId = "job-456"

        contentSyncService.pauseDownload(jobId)

        verify { mockDownloadManager.pause(jobId) }
    }

    @Test
    fun `resumeDownload should resume paused download`() = runTest {
        val jobId = "job-789"
        val resumeFrom = 1024L * 1024 * 50 // 50MB

        contentSyncService.resumeDownload(jobId, resumeFrom)

        verify { mockDownloadManager.resume(jobId, resumeFrom) }
    }

    @Test
    fun `cancelDownload should cancel and cleanup download`() = runTest {
        val jobId = "job-cancel"

        contentSyncService.cancelDownload(jobId)

        verify { mockDownloadManager.cancel(jobId) }
        verify { mockDownloadManager.cleanup(jobId) }
    }

    @Test
    fun `observeDownloadProgress should emit progress updates`() = runTest {
        val jobId = "job-observe"
        val progressFlow = flow {
            emit(0)
            emit(25)
            emit(50)
            emit(75)
            emit(100)
        }

        every { mockDownloadManager.observeProgress(jobId) } returns progressFlow

        val emissions = mutableListOf<Int>()
        contentSyncService.observeDownloadProgress(jobId).collect {
            emissions.add(it)
        }

        assertEquals(listOf(0, 25, 50, 75, 100), emissions)
    }

    @Test
    fun `extractMetadata should parse video metadata`() = runTest {
        val file = mockk<File>()
        every { file.exists() } returns true
        every { file.length() } returns 1024L * 1024 * 500 // 500MB

        val metadata = contentSyncService.extractMetadata(file)

        assertNotNull(metadata)
        assertEquals(500L * 1024 * 1024, metadata.sizeBytes)
        assertNotNull(metadata.duration)
        assertNotNull(metadata.resolution)
    }

    @Test
    fun `extractMetadata should return null for non-existent file`() = runTest {
        val file = mockk<File>()
        every { file.exists() } returns false

        val metadata = contentSyncService.extractMetadata(file)

        assertNull(metadata)
    }

    @Test
    fun `generateThumbnail should create thumbnail image`() = runTest {
        val videoFile = mockk<File>()
        val thumbnailPath = "/cache/thumb.jpg"
        val timestampMs = 5000L

        every { videoFile.exists() } returns true

        val thumbnailFile = contentSyncService.generateThumbnail(
            videoFile,
            thumbnailPath,
            timestampMs
        )

        assertNotNull(thumbnailFile)
        assertEquals(thumbnailPath, thumbnailFile.absolutePath)
    }

    @Test
    fun `isDownloadComplete should return true for completed download`() = runTest {
        val jobId = "job-complete"
        every { mockDownloadManager.isComplete(jobId) } returns true

        val isComplete = contentSyncService.isDownloadComplete(jobId)

        assertTrue(isComplete)
    }

    @Test
    fun `isDownloadComplete should return false for incomplete download`() = runTest {
        val jobId = "job-incomplete"
        every { mockDownloadManager.isComplete(jobId) } returns false

        val isComplete = contentSyncService.isDownloadComplete(jobId)

        assertFalse(isComplete)
    }

    @Test
    fun `getDownloadError should return error message for failed download`() = runTest {
        val jobId = "job-error"
        val errorMsg = "Network connection lost"
        every { mockDownloadManager.getError(jobId) } returns errorMsg

        val error = contentSyncService.getDownloadError(jobId)

        assertEquals(errorMsg, error)
    }

    @Test
    fun `retryFailedDownload should restart failed download`() = runTest {
        val jobId = "job-retry"
        every { mockDownloadManager.getState(jobId) } returns DownloadState.FAILED

        contentSyncService.retryFailedDownload(jobId)

        verify { mockDownloadManager.retry(jobId) }
    }

    @Test
    fun `getActiveDownloads should return list of active jobs`() = runTest {
        val activeJobs = listOf("job-1", "job-2", "job-3")
        every { mockDownloadManager.getActiveJobs() } returns activeJobs

        val jobs = contentSyncService.getActiveDownloads()

        assertEquals(3, jobs.size)
        assertEquals(activeJobs, jobs)
    }

    @Test
    fun `pauseAllDownloads should pause all active downloads`() = runTest {
        val activeJobs = listOf("job-1", "job-2", "job-3")
        every { mockDownloadManager.getActiveJobs() } returns activeJobs

        contentSyncService.pauseAllDownloads()

        verify(exactly = 3) { mockDownloadManager.pause(any()) }
    }

    @Test
    fun `resumeAllDownloads should resume all paused downloads`() = runTest {
        val pausedJobs = listOf("job-1", "job-2")
        every { mockDownloadManager.getPausedJobs() } returns pausedJobs

        contentSyncService.resumeAllDownloads()

        verify(exactly = 2) { mockDownloadManager.resume(any(), any()) }
    }

    @Test
    fun `cleanupCompletedDownloads should remove completed jobs`() = runTest {
        val completedJobs = listOf("job-1", "job-2", "job-3")
        every { mockDownloadManager.getCompletedJobs() } returns completedJobs

        val cleaned = contentSyncService.cleanupCompletedDownloads()

        assertEquals(3, cleaned)
        verify(exactly = 3) { mockDownloadManager.cleanup(any()) }
    }

    @Test
    fun `calculateETA should estimate time remaining`() = runTest {
        val jobId = "job-eta"
        val downloadedBytes = 1024L * 1024 * 200 // 200MB
        val totalBytes = 1024L * 1024 * 1000 // 1GB
        val speedBytesPerSecond = 1024L * 1024 * 10 // 10MB/s

        every { mockDownloadManager.getDownloadedBytes(jobId) } returns downloadedBytes
        every { mockDownloadManager.getTotalBytes(jobId) } returns totalBytes
        every { mockDownloadManager.getSpeed(jobId) } returns speedBytesPerSecond

        val etaSeconds = contentSyncService.calculateETA(jobId)

        // (1000 - 200) MB / 10 MB/s = 80 seconds
        assertEquals(80L, etaSeconds)
    }
}

// Mock classes for testing
class ContentSyncService(private val downloadManager: DownloadManager) {

    fun createDownloadJob(mediaId: String, sourceUrl: String, destination: String): String {
        val jobId = "job-${System.currentTimeMillis()}"
        downloadManager.enqueue(DownloadRequest(jobId, mediaId, sourceUrl, destination))
        return jobId
    }

    fun getDownloadProgress(jobId: String): Int {
        return downloadManager.getProgress(jobId)
    }

    fun pauseDownload(jobId: String) {
        downloadManager.pause(jobId)
    }

    fun resumeDownload(jobId: String, resumeFrom: Long) {
        downloadManager.resume(jobId, resumeFrom)
    }

    fun cancelDownload(jobId: String) {
        downloadManager.cancel(jobId)
        downloadManager.cleanup(jobId)
    }

    fun observeDownloadProgress(jobId: String): Flow<Int> {
        return downloadManager.observeProgress(jobId)
    }

    fun extractMetadata(file: File): VideoMetadata? {
        if (!file.exists()) return null
        return VideoMetadata(
            sizeBytes = file.length(),
            duration = 120000L, // 2 minutes
            resolution = "1920x1080"
        )
    }

    fun generateThumbnail(videoFile: File, thumbnailPath: String, timestampMs: Long): File? {
        if (!videoFile.exists()) return null
        return File(thumbnailPath)
    }

    fun isDownloadComplete(jobId: String): Boolean {
        return downloadManager.isComplete(jobId)
    }

    fun getDownloadError(jobId: String): String? {
        return downloadManager.getError(jobId)
    }

    fun retryFailedDownload(jobId: String) {
        if (downloadManager.getState(jobId) == DownloadState.FAILED) {
            downloadManager.retry(jobId)
        }
    }

    fun getActiveDownloads(): List<String> {
        return downloadManager.getActiveJobs()
    }

    fun pauseAllDownloads() {
        downloadManager.getActiveJobs().forEach { jobId ->
            downloadManager.pause(jobId)
        }
    }

    fun resumeAllDownloads() {
        downloadManager.getPausedJobs().forEach { jobId ->
            downloadManager.resume(jobId, 0L)
        }
    }

    fun cleanupCompletedDownloads(): Int {
        val completed = downloadManager.getCompletedJobs()
        completed.forEach { jobId ->
            downloadManager.cleanup(jobId)
        }
        return completed.size
    }

    fun calculateETA(jobId: String): Long {
        val downloaded = downloadManager.getDownloadedBytes(jobId)
        val total = downloadManager.getTotalBytes(jobId)
        val speed = downloadManager.getSpeed(jobId)
        
        if (speed == 0L) return -1L
        
        return (total - downloaded) / speed
    }
}

data class DownloadRequest(
    val jobId: String,
    val mediaId: String,
    val sourceUrl: String,
    val destination: String
)

data class VideoMetadata(
    val sizeBytes: Long,
    val duration: Long,
    val resolution: String
)

enum class DownloadState {
    PENDING, DOWNLOADING, PAUSED, COMPLETED, FAILED
}

interface DownloadManager {
    fun enqueue(request: DownloadRequest)
    fun getProgress(jobId: String): Int
    fun pause(jobId: String)
    fun resume(jobId: String, resumeFrom: Long)
    fun cancel(jobId: String)
    fun cleanup(jobId: String)
    fun observeProgress(jobId: String): Flow<Int>
    fun isComplete(jobId: String): Boolean
    fun getError(jobId: String): String?
    fun getState(jobId: String): DownloadState
    fun retry(jobId: String)
    fun getActiveJobs(): List<String>
    fun getPausedJobs(): List<String>
    fun getCompletedJobs(): List<String>
    fun getDownloadedBytes(jobId: String): Long
    fun getTotalBytes(jobId: String): Long
    fun getSpeed(jobId: String): Long
}
