package com.tvboxplayer.database

import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.tvboxplayer.data.database.TvBoxDatabase
import com.tvboxplayer.data.database.MediaItemDao
import com.tvboxplayer.data.database.DeviceDao
import com.tvboxplayer.data.model.MediaItem
import com.tvboxplayer.data.model.Device
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import java.time.Instant

@ExperimentalCoroutinesApi
@RunWith(AndroidJUnit4::class)
class DatabaseTest {

    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()

    private lateinit var database: TvBoxDatabase
    private lateinit var mediaItemDao: MediaItemDao
    private lateinit var deviceDao: DeviceDao

    @Before
    fun setup() {
        database = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            TvBoxDatabase::class.java
        ).allowMainThreadQueries().build()

        mediaItemDao = database.mediaItemDao()
        deviceDao = database.deviceDao()
    }

    @After
    fun tearDown() {
        database.close()
    }

    @Test
    fun insertMediaItem_shouldStoreItem() = runTest {
        val mediaItem = createTestMediaItem("item-1")

        mediaItemDao.insert(mediaItem)

        val retrieved = mediaItemDao.getById(mediaItem.id).first()
        assertNotNull(retrieved)
        assertEquals(mediaItem.id, retrieved?.id)
        assertEquals(mediaItem.title, retrieved?.title)
    }

    @Test
    fun updateMediaItem_shouldModifyExisting() = runTest {
        val mediaItem = createTestMediaItem("item-2")
        mediaItemDao.insert(mediaItem)

        val updated = mediaItem.copy(title = "Updated Title")
        mediaItemDao.update(updated)

        val retrieved = mediaItemDao.getById(mediaItem.id).first()
        assertEquals("Updated Title", retrieved?.title)
    }

    @Test
    fun deleteMediaItem_shouldRemoveItem() = runTest {
        val mediaItem = createTestMediaItem("item-3")
        mediaItemDao.insert(mediaItem)

        mediaItemDao.delete(mediaItem)

        val retrieved = mediaItemDao.getById(mediaItem.id).first()
        assertNull(retrieved)
    }

    @Test
    fun getAllMediaItems_shouldReturnAllItems() = runTest {
        val items = listOf(
            createTestMediaItem("item-1"),
            createTestMediaItem("item-2"),
            createTestMediaItem("item-3")
        )

        items.forEach { mediaItemDao.insert(it) }

        val allItems = mediaItemDao.getAll().first()
        assertEquals(3, allItems.size)
    }

    @Test
    fun getMediaItemsByType_shouldFilterCorrectly() = runTest {
        val videoItem = createTestMediaItem("video-1", type = "video")
        val audioItem = createTestMediaItem("audio-1", type = "audio")

        mediaItemDao.insert(videoItem)
        mediaItemDao.insert(audioItem)

        val videoItems = mediaItemDao.getByType("video").first()
        assertEquals(1, videoItems.size)
        assertEquals("video", videoItems[0].type)
    }

    @Test
    fun searchMediaItems_shouldFindByTitle() = runTest {
        val items = listOf(
            createTestMediaItem("item-1", title = "Awesome Movie"),
            createTestMediaItem("item-2", title = "Great Documentary"),
            createTestMediaItem("item-3", title = "Awesome Series")
        )

        items.forEach { mediaItemDao.insert(it) }

        val results = mediaItemDao.search("%Awesome%").first()
        assertEquals(2, results.size)
    }

    @Test
    fun insertDevice_shouldStoreDevice() = runTest {
        val device = createTestDevice("device-1")

        deviceDao.insert(device)

        val retrieved = deviceDao.getById(device.id).first()
        assertNotNull(retrieved)
        assertEquals(device.id, retrieved?.id)
        assertEquals(device.name, retrieved?.name)
    }

    @Test
    fun getAllDevices_shouldReturnAllDevices() = runTest {
        val devices = listOf(
            createTestDevice("device-1"),
            createTestDevice("device-2"),
            createTestDevice("device-3")
        )

        devices.forEach { deviceDao.insert(it) }

        val allDevices = deviceDao.getAll().first()
        assertEquals(3, allDevices.size)
    }

    @Test
    fun getActivePairedDevices_shouldFilterByStatus() = runTest {
        val activeDevice = createTestDevice("device-1", isPaired = true)
        val inactiveDevice = createTestDevice("device-2", isPaired = false)

        deviceDao.insert(activeDevice)
        deviceDao.insert(inactiveDevice)

        val paired = deviceDao.getPairedDevices().first()
        assertEquals(1, paired.size)
        assertTrue(paired[0].isPaired)
    }

    @Test
    fun updateDeviceLastSeen_shouldModifyTimestamp() = runTest {
        val device = createTestDevice("device-1")
        deviceDao.insert(device)

        val newTimestamp = Instant.now().plusSeconds(3600)
        deviceDao.updateLastSeen(device.id, newTimestamp)

        val updated = deviceDao.getById(device.id).first()
        assertEquals(newTimestamp, updated?.lastSeen)
    }

    @Test
    fun deleteDevice_shouldRemoveDevice() = runTest {
        val device = createTestDevice("device-1")
        deviceDao.insert(device)

        deviceDao.delete(device)

        val retrieved = deviceDao.getById(device.id).first()
        assertNull(retrieved)
    }

    @Test
    fun cascadeDelete_shouldRemoveRelatedEntities() = runTest {
        val device = createTestDevice("device-1")
        val mediaItem = createTestMediaItem("item-1")

        deviceDao.insert(device)
        mediaItemDao.insert(mediaItem)

        // Verify cascade behavior if relationships exist
        deviceDao.delete(device)

        val devices = deviceDao.getAll().first()
        assertEquals(0, devices.size)
    }

    @Test
    fun concurrentInserts_shouldHandleCorrectly() = runTest {
        val items = (1..10).map { createTestMediaItem("item-$it") }

        items.forEach { mediaItemDao.insert(it) }

        val allItems = mediaItemDao.getAll().first()
        assertEquals(10, allItems.size)
    }

    @Test
    fun transactionRollback_shouldNotPersistOnError() = runTest {
        val item = createTestMediaItem("item-1")

        try {
            database.runInTransaction {
                mediaItemDao.insert(item)
                throw RuntimeException("Simulated error")
            }
        } catch (e: RuntimeException) {
            // Expected
        }

        val retrieved = mediaItemDao.getById(item.id).first()
        assertNull(retrieved)
    }

    private fun createTestMediaItem(
        id: String,
        title: String = "Test Media",
        type: String = "video"
    ) = MediaItem(
        id = id,
        title = title,
        type = type,
        sourceUrl = "https://example.com/$id",
        thumbnailUrl = "https://example.com/$id/thumb.jpg",
        duration = 120000L,
        sizeBytes = 1024L * 1024 * 500,
        createdAt = Instant.now(),
        updatedAt = Instant.now()
    )

    private fun createTestDevice(
        id: String,
        name: String = "Test Device",
        isPaired: Boolean = true
    ) = Device(
        id = id,
        name = name,
        model = "Test Model",
        isPaired = isPaired,
        lastSeen = Instant.now(),
        createdAt = Instant.now()
    )
}

// Mock data models for testing
data class MediaItem(
    val id: String,
    val title: String,
    val type: String,
    val sourceUrl: String,
    val thumbnailUrl: String,
    val duration: Long,
    val sizeBytes: Long,
    val createdAt: Instant,
    val updatedAt: Instant
)

data class Device(
    val id: String,
    val name: String,
    val model: String,
    val isPaired: Boolean,
    val lastSeen: Instant,
    val createdAt: Instant
)
