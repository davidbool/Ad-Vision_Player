package com.tvboxplayer.playback

import io.mockk.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

@ExperimentalCoroutinesApi
class MediaPlayerManagerTest {

    private lateinit var mediaPlayerManager: MediaPlayerManager

    @Before
    fun setup() {
        mediaPlayerManager = MediaPlayerManager()
    }

    @After
    fun tearDown() {
        mediaPlayerManager.release()
        unmockkAll()
    }

    @Test
    fun `play should start playback and update state`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"

        mediaPlayerManager.play(mediaUrl)

        val state = mediaPlayerManager.getPlaybackState().first()
        assertEquals(PlaybackState.PLAYING, state)
    }

    @Test
    fun `pause should pause playback`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"

        mediaPlayerManager.play(mediaUrl)
        mediaPlayerManager.pause()

        val state = mediaPlayerManager.getPlaybackState().first()
        assertEquals(PlaybackState.PAUSED, state)
    }

    @Test
    fun `resume should resume from paused state`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"

        mediaPlayerManager.play(mediaUrl)
        mediaPlayerManager.pause()
        mediaPlayerManager.resume()

        val state = mediaPlayerManager.getPlaybackState().first()
        assertEquals(PlaybackState.PLAYING, state)
    }

    @Test
    fun `stop should stop playback and reset state`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"

        mediaPlayerManager.play(mediaUrl)
        mediaPlayerManager.stop()

        val state = mediaPlayerManager.getPlaybackState().first()
        assertEquals(PlaybackState.STOPPED, state)
        assertEquals(0L, mediaPlayerManager.getCurrentPosition())
    }

    @Test
    fun `seekTo should update playback position`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"
        val seekPosition = 30000L // 30 seconds

        mediaPlayerManager.play(mediaUrl)
        mediaPlayerManager.seekTo(seekPosition)

        assertEquals(seekPosition, mediaPlayerManager.getCurrentPosition())
    }

    @Test
    fun `setPlaybackSpeed should change speed within valid range`() = runTest {
        val speeds = listOf(0.5f, 0.75f, 1.0f, 1.25f, 1.5f, 2.0f)

        speeds.forEach { speed ->
            mediaPlayerManager.setPlaybackSpeed(speed)
            assertEquals(speed, mediaPlayerManager.getPlaybackSpeed(), 0.01f)
        }
    }

    @Test
    fun `setPlaybackSpeed should clamp to valid range`() = runTest {
        mediaPlayerManager.setPlaybackSpeed(0.25f) // Below minimum
        assertEquals(0.5f, mediaPlayerManager.getPlaybackSpeed(), 0.01f)

        mediaPlayerManager.setPlaybackSpeed(3.0f) // Above maximum
        assertEquals(2.0f, mediaPlayerManager.getPlaybackSpeed(), 0.01f)
    }

    @Test
    fun `setVolume should adjust volume level`() = runTest {
        mediaPlayerManager.setVolume(0.5f)
        assertEquals(0.5f, mediaPlayerManager.getVolume(), 0.01f)

        mediaPlayerManager.setVolume(1.0f)
        assertEquals(1.0f, mediaPlayerManager.getVolume(), 0.01f)
    }

    @Test
    fun `setVolume should clamp to valid range 0-1`() = runTest {
        mediaPlayerManager.setVolume(-0.5f)
        assertEquals(0.0f, mediaPlayerManager.getVolume(), 0.01f)

        mediaPlayerManager.setVolume(1.5f)
        assertEquals(1.0f, mediaPlayerManager.getVolume(), 0.01f)
    }

    @Test
    fun `addToQueue should append items to playback queue`() = runTest {
        val items = listOf("video1.mp4", "video2.mp4", "video3.mp4")

        items.forEach { mediaPlayerManager.addToQueue(it) }

        val queue = mediaPlayerManager.getQueue()
        assertEquals(3, queue.size)
        assertEquals(items, queue)
    }

    @Test
    fun `playNext should play next item in queue`() = runTest {
        mediaPlayerManager.addToQueue("video1.mp4")
        mediaPlayerManager.addToQueue("video2.mp4")
        mediaPlayerManager.addToQueue("video3.mp4")

        mediaPlayerManager.play("video1.mp4")
        val firstItem = mediaPlayerManager.getCurrentMediaUrl()

        mediaPlayerManager.playNext()
        val secondItem = mediaPlayerManager.getCurrentMediaUrl()

        assertNotEquals(firstItem, secondItem)
        assertEquals("video2.mp4", secondItem)
    }

    @Test
    fun `playPrevious should play previous item in queue`() = runTest {
        mediaPlayerManager.addToQueue("video1.mp4")
        mediaPlayerManager.addToQueue("video2.mp4")
        mediaPlayerManager.addToQueue("video3.mp4")

        mediaPlayerManager.play("video2.mp4")
        mediaPlayerManager.playPrevious()

        assertEquals("video1.mp4", mediaPlayerManager.getCurrentMediaUrl())
    }

    @Test
    fun `removeFromQueue should remove specific item`() = runTest {
        mediaPlayerManager.addToQueue("video1.mp4")
        mediaPlayerManager.addToQueue("video2.mp4")
        mediaPlayerManager.addToQueue("video3.mp4")

        mediaPlayerManager.removeFromQueue(1) // Remove video2.mp4

        val queue = mediaPlayerManager.getQueue()
        assertEquals(2, queue.size)
        assertFalse(queue.contains("video2.mp4"))
    }

    @Test
    fun `clearQueue should remove all items from queue`() = runTest {
        mediaPlayerManager.addToQueue("video1.mp4")
        mediaPlayerManager.addToQueue("video2.mp4")
        mediaPlayerManager.addToQueue("video3.mp4")

        mediaPlayerManager.clearQueue()

        assertTrue(mediaPlayerManager.getQueue().isEmpty())
    }

    @Test
    fun `shuffleQueue should randomize queue order`() = runTest {
        val items = listOf("video1.mp4", "video2.mp4", "video3.mp4", "video4.mp4", "video5.mp4")
        items.forEach { mediaPlayerManager.addToQueue(it) }

        val originalQueue = mediaPlayerManager.getQueue().toList()
        mediaPlayerManager.shuffleQueue()
        val shuffledQueue = mediaPlayerManager.getQueue()

        assertEquals(originalQueue.size, shuffledQueue.size)
        assertTrue(shuffledQueue.containsAll(originalQueue))
    }

    @Test
    fun `setRepeatMode should change repeat behavior`() = runTest {
        mediaPlayerManager.setRepeatMode(RepeatMode.REPEAT_ONE)
        assertEquals(RepeatMode.REPEAT_ONE, mediaPlayerManager.getRepeatMode())

        mediaPlayerManager.setRepeatMode(RepeatMode.REPEAT_ALL)
        assertEquals(RepeatMode.REPEAT_ALL, mediaPlayerManager.getRepeatMode())

        mediaPlayerManager.setRepeatMode(RepeatMode.NO_REPEAT)
        assertEquals(RepeatMode.NO_REPEAT, mediaPlayerManager.getRepeatMode())
    }

    @Test
    fun `getDuration should return media duration`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"
        mediaPlayerManager.play(mediaUrl)

        val duration = mediaPlayerManager.getDuration()
        assertTrue(duration >= 0)
    }

    @Test
    fun `isPlaying should return current playing state`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"

        assertFalse(mediaPlayerManager.isPlaying())

        mediaPlayerManager.play(mediaUrl)
        assertTrue(mediaPlayerManager.isPlaying())

        mediaPlayerManager.pause()
        assertFalse(mediaPlayerManager.isPlaying())
    }

    @Test
    fun `skipForward should advance playback by interval`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"
        val skipInterval = 10000L // 10 seconds

        mediaPlayerManager.play(mediaUrl)
        val initialPosition = mediaPlayerManager.getCurrentPosition()
        
        mediaPlayerManager.skipForward(skipInterval)
        val newPosition = mediaPlayerManager.getCurrentPosition()

        assertTrue(newPosition >= initialPosition + skipInterval)
    }

    @Test
    fun `skipBackward should rewind playback by interval`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"
        val skipInterval = 10000L // 10 seconds

        mediaPlayerManager.play(mediaUrl)
        mediaPlayerManager.seekTo(30000L) // Seek to 30 seconds
        
        val initialPosition = mediaPlayerManager.getCurrentPosition()
        mediaPlayerManager.skipBackward(skipInterval)
        val newPosition = mediaPlayerManager.getCurrentPosition()

        assertTrue(newPosition <= initialPosition - skipInterval)
    }

    @Test
    fun `onPlaybackComplete should handle end of media`() = runTest {
        val mediaUrl = "https://example.com/video.mp4"
        mediaPlayerManager.play(mediaUrl)

        // Simulate playback completion
        mediaPlayerManager.onPlaybackComplete()

        val state = mediaPlayerManager.getPlaybackState().first()
        assertEquals(PlaybackState.COMPLETED, state)
    }
}

// Mock MediaPlayerManager for testing
class MediaPlayerManager {
    private var playbackState = kotlinx.coroutines.flow.MutableStateFlow(PlaybackState.STOPPED)
    private var currentPosition = 0L
    private var duration = 120000L // 2 minutes
    private var playbackSpeed = 1.0f
    private var volume = 1.0f
    private val queue = mutableListOf<String>()
    private var currentMediaUrl: String? = null
    private var currentIndex = -1
    private var repeatMode = RepeatMode.NO_REPEAT

    fun play(mediaUrl: String) {
        currentMediaUrl = mediaUrl
        playbackState.value = PlaybackState.PLAYING
    }

    fun pause() {
        playbackState.value = PlaybackState.PAUSED
    }

    fun resume() {
        playbackState.value = PlaybackState.PLAYING
    }

    fun stop() {
        playbackState.value = PlaybackState.STOPPED
        currentPosition = 0L
    }

    fun seekTo(position: Long) {
        currentPosition = position.coerceIn(0L, duration)
    }

    fun setPlaybackSpeed(speed: Float) {
        playbackSpeed = speed.coerceIn(0.5f, 2.0f)
    }

    fun getPlaybackSpeed(): Float = playbackSpeed

    fun setVolume(vol: Float) {
        volume = vol.coerceIn(0.0f, 1.0f)
    }

    fun getVolume(): Float = volume

    fun addToQueue(mediaUrl: String) {
        queue.add(mediaUrl)
    }

    fun getQueue(): List<String> = queue.toList()

    fun playNext() {
        if (currentIndex < queue.size - 1) {
            currentIndex++
            currentMediaUrl = queue[currentIndex]
            playbackState.value = PlaybackState.PLAYING
        }
    }

    fun playPrevious() {
        if (currentIndex > 0) {
            currentIndex--
            currentMediaUrl = queue[currentIndex]
            playbackState.value = PlaybackState.PLAYING
        }
    }

    fun removeFromQueue(index: Int) {
        if (index in queue.indices) {
            queue.removeAt(index)
        }
    }

    fun clearQueue() {
        queue.clear()
        currentIndex = -1
    }

    fun shuffleQueue() {
        queue.shuffle()
    }

    fun setRepeatMode(mode: RepeatMode) {
        repeatMode = mode
    }

    fun getRepeatMode(): RepeatMode = repeatMode

    fun getDuration(): Long = duration

    fun getCurrentPosition(): Long = currentPosition

    fun isPlaying(): Boolean = playbackState.value == PlaybackState.PLAYING

    fun getPlaybackState() = playbackState

    fun getCurrentMediaUrl(): String? = currentMediaUrl

    fun skipForward(interval: Long) {
        currentPosition = (currentPosition + interval).coerceAtMost(duration)
    }

    fun skipBackward(interval: Long) {
        currentPosition = (currentPosition - interval).coerceAtLeast(0L)
    }

    fun onPlaybackComplete() {
        playbackState.value = PlaybackState.COMPLETED
    }

    fun release() {
        stop()
        clearQueue()
    }
}

enum class PlaybackState {
    STOPPED, PLAYING, PAUSED, BUFFERING, COMPLETED, ERROR
}

enum class RepeatMode {
    NO_REPEAT, REPEAT_ONE, REPEAT_ALL
}
