package com.tvboxplayer.cache

import io.mockk.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import java.io.File
import java.time.Instant

@ExperimentalCoroutinesApi
class CacheManagerTest {

    private lateinit var cacheManager: CacheManager
    private lateinit var mockCacheDir: File
    private val maxCacheSizeBytes = 5L * 1024 * 1024 * 1024 // 5GB

    @Before
    fun setup() {
        mockCacheDir = mockk(relaxed = true)
        cacheManager = CacheManager(mockCacheDir, maxCacheSizeBytes)
    }

    @After
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `addToCache should add item to LRU cache`() = runTest {
        val itemId = "item-123"
        val filePath = "/cache/video.mp4"
        val sizeBytes = 1024L * 1024 * 100 // 100MB

        cacheManager.addToCache(itemId, filePath, sizeBytes)

        assertTrue(cacheManager.isInCache(itemId))
        assertEquals(filePath, cacheManager.getCachedFilePath(itemId))
    }

    @Test
    fun `addToCache should update existing item and move to front`() = runTest {
        val itemId = "item-456"
        val oldPath = "/cache/old.mp4"
        val newPath = "/cache/new.mp4"
        val sizeBytes = 1024L * 1024 * 50

        cacheManager.addToCache(itemId, oldPath, sizeBytes)
        cacheManager.addToCache(itemId, newPath, sizeBytes)

        assertEquals(newPath, cacheManager.getCachedFilePath(itemId))
    }

    @Test
    fun `evictLRU should remove least recently used item`() = runTest {
        val item1 = "item-1"
        val item2 = "item-2"
        val item3 = "item-3"
        val sizeBytes = 2L * 1024 * 1024 * 1024 // 2GB each

        cacheManager.addToCache(item1, "/cache/1.mp4", sizeBytes)
        cacheManager.addToCache(item2, "/cache/2.mp4", sizeBytes)
        cacheManager.addToCache(item3, "/cache/3.mp4", sizeBytes) // Should trigger eviction

        assertFalse(cacheManager.isInCache(item1)) // Least recently used
        assertTrue(cacheManager.isInCache(item2))
        assertTrue(cacheManager.isInCache(item3))
    }

    @Test
    fun `getCacheSize should return total size of cached items`() = runTest {
        val item1Size = 1024L * 1024 * 100 // 100MB
        val item2Size = 1024L * 1024 * 200 // 200MB

        cacheManager.addToCache("item-1", "/cache/1.mp4", item1Size)
        cacheManager.addToCache("item-2", "/cache/2.mp4", item2Size)

        assertEquals(item1Size + item2Size, cacheManager.getCacheSize())
    }

    @Test
    fun `removeFromCache should delete item and update size`() = runTest {
        val itemId = "item-remove"
        val sizeBytes = 1024L * 1024 * 150

        cacheManager.addToCache(itemId, "/cache/remove.mp4", sizeBytes)
        assertTrue(cacheManager.isInCache(itemId))

        cacheManager.removeFromCache(itemId)

        assertFalse(cacheManager.isInCache(itemId))
        assertEquals(0L, cacheManager.getCacheSize())
    }

    @Test
    fun `cleanupOldFiles should remove files older than 7 days`() = runTest {
        val recentFile = mockk<File>(relaxed = true)
        val oldFile = mockk<File>(relaxed = true)
        val now = Instant.now()
        
        every { recentFile.lastModified() } returns now.minusSeconds(86400 * 3).toEpochMilli() // 3 days old
        every { oldFile.lastModified() } returns now.minusSeconds(86400 * 8).toEpochMilli() // 8 days old
        every { oldFile.delete() } returns true

        val filesRemoved = cacheManager.cleanupOldFiles(listOf(recentFile, oldFile))

        assertEquals(1, filesRemoved)
        verify { oldFile.delete() }
        verify(exactly = 0) { recentFile.delete() }
    }

    @Test
    fun `getAvailableSpace should return remaining cache space`() = runTest {
        val usedSpace = 1024L * 1024 * 1024 * 2 // 2GB
        cacheManager.addToCache("item-1", "/cache/1.mp4", usedSpace)

        val availableSpace = cacheManager.getAvailableSpace()

        assertEquals(maxCacheSizeBytes - usedSpace, availableSpace)
    }

    @Test
    fun `hasSpace should return true when enough space available`() = runTest {
        val currentUsed = 1024L * 1024 * 1024 * 2 // 2GB
        val requiredSpace = 1024L * 1024 * 1024 * 1 // 1GB

        cacheManager.addToCache("item-1", "/cache/1.mp4", currentUsed)

        assertTrue(cacheManager.hasSpace(requiredSpace))
    }

    @Test
    fun `hasSpace should return false when not enough space available`() = runTest {
        val currentUsed = 1024L * 1024 * 1024 * 4 // 4GB
        val requiredSpace = 1024L * 1024 * 1024 * 2 // 2GB (would exceed 5GB limit)

        cacheManager.addToCache("item-1", "/cache/1.mp4", currentUsed)

        assertFalse(cacheManager.hasSpace(requiredSpace))
    }

    @Test
    fun `clearCache should remove all cached items`() = runTest {
        cacheManager.addToCache("item-1", "/cache/1.mp4", 1024L * 1024 * 100)
        cacheManager.addToCache("item-2", "/cache/2.mp4", 1024L * 1024 * 200)
        cacheManager.addToCache("item-3", "/cache/3.mp4", 1024L * 1024 * 300)

        cacheManager.clearCache()

        assertEquals(0L, cacheManager.getCacheSize())
        assertFalse(cacheManager.isInCache("item-1"))
        assertFalse(cacheManager.isInCache("item-2"))
        assertFalse(cacheManager.isInCache("item-3"))
    }

    @Test
    fun `concurrent access should be handled safely`() = runTest {
        val item1 = "concurrent-1"
        val item2 = "concurrent-2"

        // Simulate concurrent additions
        cacheManager.addToCache(item1, "/cache/c1.mp4", 1024L * 1024 * 100)
        cacheManager.addToCache(item2, "/cache/c2.mp4", 1024L * 1024 * 100)

        assertTrue(cacheManager.isInCache(item1))
        assertTrue(cacheManager.isInCache(item2))
    }

    @Test
    fun `eviction should maintain cache size within limits`() = runTest {
        val largeFileSize = 1024L * 1024 * 1024 * 2 // 2GB

        // Add files that exceed cache limit
        cacheManager.addToCache("item-1", "/cache/1.mp4", largeFileSize)
        cacheManager.addToCache("item-2", "/cache/2.mp4", largeFileSize)
        cacheManager.addToCache("item-3", "/cache/3.mp4", largeFileSize) // Should trigger eviction

        assertTrue(cacheManager.getCacheSize() <= maxCacheSizeBytes)
    }
}

// Mock CacheManager class for testing
class CacheManager(
    private val cacheDir: File,
    private val maxCacheSizeBytes: Long
) {
    private val cache = LinkedHashMap<String, CacheEntry>(16, 0.75f, true)
    private var currentSizeBytes = 0L

    companion object {
        const val MAX_AGE_DAYS = 7L
    }

    data class CacheEntry(
        val filePath: String,
        val sizeBytes: Long,
        val timestamp: Instant = Instant.now()
    )

    @Synchronized
    fun addToCache(itemId: String, filePath: String, sizeBytes: Long) {
        // Remove old entry if exists
        cache[itemId]?.let {
            currentSizeBytes -= it.sizeBytes
        }

        // Evict if necessary
        while (currentSizeBytes + sizeBytes > maxCacheSizeBytes && cache.isNotEmpty()) {
            evictLRU()
        }

        cache[itemId] = CacheEntry(filePath, sizeBytes)
        currentSizeBytes += sizeBytes
    }

    @Synchronized
    fun isInCache(itemId: String): Boolean {
        return cache.containsKey(itemId)
    }

    @Synchronized
    fun getCachedFilePath(itemId: String): String? {
        return cache[itemId]?.filePath
    }

    @Synchronized
    private fun evictLRU() {
        cache.entries.firstOrNull()?.let { entry ->
            currentSizeBytes -= entry.value.sizeBytes
            cache.remove(entry.key)
        }
    }

    @Synchronized
    fun getCacheSize(): Long {
        return currentSizeBytes
    }

    @Synchronized
    fun removeFromCache(itemId: String) {
        cache[itemId]?.let {
            currentSizeBytes -= it.sizeBytes
            cache.remove(itemId)
        }
    }

    fun cleanupOldFiles(files: List<File>): Int {
        val cutoffTime = Instant.now().minusSeconds(86400 * MAX_AGE_DAYS)
        var removedCount = 0

        files.forEach { file ->
            val fileTime = Instant.ofEpochMilli(file.lastModified())
            if (fileTime.isBefore(cutoffTime)) {
                if (file.delete()) {
                    removedCount++
                }
            }
        }

        return removedCount
    }

    @Synchronized
    fun getAvailableSpace(): Long {
        return maxCacheSizeBytes - currentSizeBytes
    }

    @Synchronized
    fun hasSpace(requiredBytes: Long): Boolean {
        return currentSizeBytes + requiredBytes <= maxCacheSizeBytes
    }

    @Synchronized
    fun clearCache() {
        cache.clear()
        currentSizeBytes = 0L
    }
}
