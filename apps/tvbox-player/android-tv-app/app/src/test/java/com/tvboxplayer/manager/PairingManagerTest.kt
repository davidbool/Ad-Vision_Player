package com.tvboxplayer.manager

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import io.mockk.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import java.time.Instant
import java.util.*
import javax.crypto.SecretKey

@ExperimentalCoroutinesApi
class PairingManagerTest {

    private lateinit var pairingManager: PairingManager
    private lateinit var mockSecretKey: SecretKey

    @Before
    fun setup() {
        mockSecretKey = Keys.hmacShaKeyFor("test-secret-key-for-jwt-token-generation-32bytes".toByteArray())
        pairingManager = PairingManager(mockSecretKey)
    }

    @After
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `generatePIN should create unique 6-digit PIN`() = runTest {
        val pin1 = pairingManager.generatePIN()
        val pin2 = pairingManager.generatePIN()
        
        assertEquals(6, pin1.length)
        assertEquals(6, pin2.length)
        assertTrue(pin1.all { it.isDigit() })
        assertTrue(pin2.all { it.isDigit() })
        assertNotEquals(pin1, pin2) // Should be unique (statistically)
    }

    @Test
    fun `generatePIN should generate PIN within valid range`() = runTest {
        val pin = pairingManager.generatePIN()
        val pinValue = pin.toInt()
        
        assertTrue(pinValue >= 100000)
        assertTrue(pinValue <= 999999)
    }

    @Test
    fun `isPINExpired should return true after expiration time`() = runTest {
        val pin = pairingManager.generatePIN()
        val expirationTime = Instant.now().minusSeconds(301) // 5 minutes + 1 second ago
        
        val isExpired = pairingManager.isPINExpired(pin, expirationTime)
        
        assertTrue(isExpired)
    }

    @Test
    fun `isPINExpired should return false before expiration time`() = runTest {
        val pin = pairingManager.generatePIN()
        val expirationTime = Instant.now().plusSeconds(299) // Still valid
        
        val isExpired = pairingManager.isPINExpired(pin, expirationTime)
        
        assertFalse(isExpired)
    }

    @Test
    fun `generateJWT should create valid token with device ID`() = runTest {
        val deviceId = "test-device-123"
        
        val token = pairingManager.generateJWT(deviceId)
        
        assertNotNull(token)
        assertTrue(token.isNotEmpty())
        
        // Parse and verify token
        val claims = Jwts.parserBuilder()
            .setSigningKey(mockSecretKey)
            .build()
            .parseClaimsJws(token)
            .body
        
        assertEquals(deviceId, claims.subject)
        assertNotNull(claims.issuedAt)
        assertNotNull(claims.expiration)
    }

    @Test
    fun `validateJWT should return true for valid token`() = runTest {
        val deviceId = "test-device-456"
        val token = pairingManager.generateJWT(deviceId)
        
        val isValid = pairingManager.validateJWT(token)
        
        assertTrue(isValid)
    }

    @Test
    fun `validateJWT should return false for expired token`() = runTest {
        val expiredToken = Jwts.builder()
            .setSubject("test-device")
            .setIssuedAt(Date.from(Instant.now().minusSeconds(7200)))
            .setExpiration(Date.from(Instant.now().minusSeconds(3600))) // Expired 1 hour ago
            .signWith(mockSecretKey)
            .compact()
        
        val isValid = pairingManager.validateJWT(expiredToken)
        
        assertFalse(isValid)
    }

    @Test
    fun `validateJWT should return false for invalid token`() = runTest {
        val invalidToken = "invalid.jwt.token"
        
        val isValid = pairingManager.validateJWT(invalidToken)
        
        assertFalse(isValid)
    }

    @Test
    fun `canAddDevice should return true when under device limit`() = runTest {
        val currentDeviceCount = 3
        
        val canAdd = pairingManager.canAddDevice(currentDeviceCount)
        
        assertTrue(canAdd)
    }

    @Test
    fun `canAddDevice should return false when at device limit`() = runTest {
        val currentDeviceCount = 5 // Max limit
        
        val canAdd = pairingManager.canAddDevice(currentDeviceCount)
        
        assertFalse(canAdd)
    }

    @Test
    fun `canAddDevice should return false when over device limit`() = runTest {
        val currentDeviceCount = 6
        
        val canAdd = pairingManager.canAddDevice(currentDeviceCount)
        
        assertFalse(canAdd)
    }

    @Test
    fun `getDeviceIdFromToken should extract correct device ID`() = runTest {
        val deviceId = "test-device-789"
        val token = pairingManager.generateJWT(deviceId)
        
        val extractedId = pairingManager.getDeviceIdFromToken(token)
        
        assertEquals(deviceId, extractedId)
    }

    @Test
    fun `getDeviceIdFromToken should return null for invalid token`() = runTest {
        val invalidToken = "invalid.jwt.token"
        
        val extractedId = pairingManager.getDeviceIdFromToken(invalidToken)
        
        assertNull(extractedId)
    }

    @Test
    fun `isSessionExpired should return true after timeout`() = runTest {
        val lastActivityTime = Instant.now().minusSeconds(3601) // 1 hour + 1 second ago
        
        val isExpired = pairingManager.isSessionExpired(lastActivityTime)
        
        assertTrue(isExpired)
    }

    @Test
    fun `isSessionExpired should return false before timeout`() = runTest {
        val lastActivityTime = Instant.now().minusSeconds(1800) // 30 minutes ago
        
        val isExpired = pairingManager.isSessionExpired(lastActivityTime)
        
        assertFalse(isExpired)
    }

    @Test
    fun `refreshSession should update activity timestamp`() = runTest {
        val oldTimestamp = Instant.now().minusSeconds(1800)
        
        val newTimestamp = pairingManager.refreshSession()
        
        assertTrue(newTimestamp.isAfter(oldTimestamp))
        assertTrue(newTimestamp.isBefore(Instant.now().plusSeconds(1)))
    }
}

// Mock PairingManager class for testing
class PairingManager(private val secretKey: SecretKey) {
    
    companion object {
        const val MAX_DEVICES = 5
        const val PIN_EXPIRATION_SECONDS = 300L // 5 minutes
        const val SESSION_TIMEOUT_SECONDS = 3600L // 1 hour
        const val TOKEN_EXPIRATION_HOURS = 24L
    }
    
    fun generatePIN(): String {
        return (100000..999999).random().toString()
    }
    
    fun isPINExpired(pin: String, creationTime: Instant): Boolean {
        val now = Instant.now()
        return now.isAfter(creationTime.plusSeconds(PIN_EXPIRATION_SECONDS))
    }
    
    fun generateJWT(deviceId: String): String {
        val now = Instant.now()
        return Jwts.builder()
            .setSubject(deviceId)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(now.plusSeconds(TOKEN_EXPIRATION_HOURS * 3600)))
            .signWith(secretKey)
            .compact()
    }
    
    fun validateJWT(token: String): Boolean {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
            true
        } catch (e: Exception) {
            false
        }
    }
    
    fun canAddDevice(currentDeviceCount: Int): Boolean {
        return currentDeviceCount < MAX_DEVICES
    }
    
    fun getDeviceIdFromToken(token: String): String? {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .body
                .subject
        } catch (e: Exception) {
            null
        }
    }
    
    fun isSessionExpired(lastActivityTime: Instant): Boolean {
        val now = Instant.now()
        return now.isAfter(lastActivityTime.plusSeconds(SESSION_TIMEOUT_SECONDS))
    }
    
    fun refreshSession(): Instant {
        return Instant.now()
    }
}
