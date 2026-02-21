# Test Plan - TV Box Player

## Document Information

**Version**: 1.0  
**Last Updated**: 2026-02-18  
**Status**: Active  

## 1. Introduction

### 1.1 Purpose
This document outlines the comprehensive test plan for the TV Box Player application, covering all critical functionality across Android TV and mobile platforms.

### 1.2 Scope
- Android TV Box application testing
- Mobile companion app testing (iOS & Android)
- Integration testing between components
- Performance and security testing

### 1.3 Test Objectives
- Ensure 80%+ code coverage
- Verify all critical user flows
- Validate performance benchmarks
- Confirm security requirements
- Ensure device compatibility

## 2. Test Strategy

### 2.1 Testing Levels

#### Unit Testing (70% of tests)
- Individual functions and classes
- Business logic validation
- Data transformations
- Utility functions

#### Integration Testing (20% of tests)
- Component interactions
- API contracts
- Database operations
- External service integration

#### E2E Testing (10% of tests)
- Complete user workflows
- Cross-component flows
- Real device testing

### 2.2 Testing Types

- **Functional Testing**: Feature correctness
- **Performance Testing**: Speed and resource usage
- **Security Testing**: Authentication and authorization
- **Compatibility Testing**: Multiple devices and OS versions
- **Regression Testing**: Existing functionality after changes

## 3. Test Scenarios

### 3.1 Device Pairing Flow

#### Scenario 1: Successful Device Pairing
**Priority**: Critical  
**Preconditions**: 
- TV Box and mobile device on same network
- TV Box displaying 6-digit PIN

**Test Steps**:
1. Open mobile app
2. Tap "Discover Devices"
3. Select TV Box from list
4. Enter 6-digit PIN
5. Tap "Pair Device"

**Expected Results**:
- Device appears in discovered list within 5 seconds
- PIN input accepts 6 digits
- Pairing completes in < 10 seconds
- Success message displayed
- Device added to paired devices list
- JWT token stored securely

**Test Data**:
- Valid PIN: "123456"
- Invalid PIN: "999999"

**Coverage**:
- Mobile: `DeviceDiscoveryScreen`, `PairingScreen`, `deviceSaga`
- Android: `PairingActivity`, `PairingManager`, `ApiServerService`

---

#### Scenario 2: PIN Expiration
**Priority**: High  
**Preconditions**: TV Box displaying PIN

**Test Steps**:
1. Display PIN on TV Box
2. Wait 5 minutes
3. Attempt to pair with expired PIN

**Expected Results**:
- PIN expires after exactly 5 minutes
- Error message: "PIN expired. Please request a new PIN."
- New PIN can be generated

**Test Data**:
- Expired PIN timestamp: `Instant.now().minusSeconds(301)`

---

#### Scenario 3: Device Limit Enforcement
**Priority**: High  
**Preconditions**: 5 devices already paired

**Test Steps**:
1. Attempt to pair 6th device
2. Enter valid PIN

**Expected Results**:
- Pairing rejected
- Error message: "Maximum device limit (5) reached"
- Suggestion to unpair a device

---

#### Scenario 4: Invalid PIN
**Priority**: High  
**Test Steps**:
1. Enter incorrect PIN
2. Tap "Pair Device"

**Expected Results**:
- Error message: "Invalid PIN"
- Retry allowed
- No token generated

---

### 3.2 Content Sync Flow

#### Scenario 5: Download Video from Cloud
**Priority**: Critical  
**Preconditions**: 
- Google Drive authenticated
- TV Box has 1GB free space

**Test Steps**:
1. Open mobile app
2. Navigate to "My Content"
3. Select video from Google Drive
4. Tap "Download to TV Box"
5. Select target device

**Expected Results**:
- Download starts immediately
- Progress bar shows percentage
- Download speed displayed (MB/s)
- ETA calculated and displayed
- File appears in TV Box library on completion
- Metadata extracted (duration, resolution)
- Thumbnail generated

**Performance Metrics**:
- Download start: < 2 seconds
- Progress update: Every 1 second
- 4K video (2GB): < 5 minutes on 100Mbps connection

---

#### Scenario 6: Resume Interrupted Download
**Priority**: High  
**Preconditions**: Download in progress

**Test Steps**:
1. Start large file download (1GB+)
2. Stop WiFi connection
3. Wait 10 seconds
4. Restore WiFi connection

**Expected Results**:
- Download pauses when connection lost
- Error notification shown
- Auto-resume when connection restored
- Download continues from last byte
- No file corruption

---

#### Scenario 7: Cache Eviction (LRU)
**Priority**: High  
**Preconditions**: Cache at 90% capacity (4.5GB of 5GB)

**Test Steps**:
1. Download new video (1GB)
2. Observe cache behavior

**Expected Results**:
- Least recently accessed file evicted
- New file downloaded successfully
- Cache size remains ≤ 5GB
- No playback interruption for active files

**Test Data**:
```
File 1: Accessed 10 days ago, 1GB
File 2: Accessed 5 days ago, 1.5GB
File 3: Accessed 1 day ago, 2GB
New File: 1GB
```

**Expected Eviction**: File 1

---

#### Scenario 8: Old File Cleanup
**Priority**: Medium  
**Preconditions**: Files with various ages in cache

**Test Steps**:
1. Run cleanup job
2. Check cache contents

**Expected Results**:
- Files older than 7 days deleted
- Recent files (< 7 days) retained
- Storage reclaimed
- Log entry created

---

### 3.3 Media Playback Flow

#### Scenario 9: Play Video from Cache
**Priority**: Critical  
**Preconditions**: Video cached on TV Box

**Test Steps**:
1. Select video from library
2. Tap "Play"

**Expected Results**:
- Playback starts in < 2 seconds
- Video plays smoothly (60fps)
- Audio synced with video
- Playback controls responsive

**Performance Metrics**:
- Playback start: < 2 seconds
- Frame rate: 60fps
- Audio sync: ±50ms
- Control latency: < 500ms

---

#### Scenario 10: Remote Control Playback
**Priority**: Critical  
**Preconditions**: 
- Video playing on TV Box
- Mobile app connected

**Test Steps**:
1. Tap "Pause" on mobile remote
2. Wait 2 seconds
3. Tap "Play"
4. Tap "Skip Forward 10s"
5. Adjust volume to 50%

**Expected Results**:
- Each command executes in < 500ms
- Playback state syncs to mobile
- Volume changes reflected immediately
- Seek operation smooth

---

#### Scenario 11: Playback Speed Control
**Priority**: Medium  
**Test Steps**:
1. Set speed to 0.5x
2. Verify playback
3. Set speed to 1.5x
4. Verify playback
5. Set speed to 2.0x

**Expected Results**:
- Audio pitch preserved at all speeds
- Smooth playback at 0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x
- Speed indicator displayed
- Invalid speeds rejected (< 0.5x, > 2.0x)

---

#### Scenario 12: Queue Management
**Priority**: High  
**Test Steps**:
1. Create playlist with 5 videos
2. Play first video
3. Skip to next
4. Shuffle queue
5. Enable repeat mode

**Expected Results**:
- Queue displays all videos
- "Next" plays subsequent video
- Shuffle randomizes order
- Repeat modes work: None, One, All

---

### 3.4 Multi-Device Scenarios

#### Scenario 13: Control from Multiple Mobiles
**Priority**: High  
**Preconditions**: 2 mobile devices paired

**Test Steps**:
1. Start playback from Mobile A
2. Pause from Mobile B
3. Resume from Mobile A
4. Verify state sync

**Expected Results**:
- Both mobiles show current state
- Commands accepted from both
- State updates in real-time
- No conflicts

---

#### Scenario 14: Session Timeout
**Priority**: Medium  
**Preconditions**: Device paired and idle

**Test Steps**:
1. Pair device
2. Wait 1 hour with no activity
3. Attempt to send command

**Expected Results**:
- Session expires after 1 hour
- Re-authentication required
- Error message: "Session expired"
- Seamless re-pairing

---

### 3.5 Error Handling

#### Scenario 15: Network Disconnection During Playback
**Priority**: Critical  
**Test Steps**:
1. Play cached video
2. Disconnect WiFi
3. Continue playback

**Expected Results**:
- Cached video continues playing
- Warning notification shown
- Remote control unavailable
- Auto-reconnect when WiFi restored

---

#### Scenario 16: Insufficient Storage
**Priority**: High  
**Test Steps**:
1. Attempt to download 3GB file
2. TV Box has 1GB free

**Expected Results**:
- Error before download starts
- Message: "Insufficient storage (3GB required, 1GB available)"
- Option to clear cache
- Option to select different device

---

#### Scenario 17: Corrupted File Handling
**Priority**: Medium  
**Test Steps**:
1. Simulate corrupted video file
2. Attempt playback

**Expected Results**:
- Error detected before playback
- Message: "File corrupted or unreadable"
- Option to re-download
- File removed from cache

---

### 3.6 Performance Testing

#### Scenario 18: Large Playlist Handling
**Priority**: Medium  
**Test Data**: Playlist with 100+ videos

**Test Steps**:
1. Create playlist with 100 videos
2. Open playlist
3. Scroll through list
4. Select video #50

**Expected Results**:
- List loads in < 2 seconds
- Smooth scrolling (60fps)
- Thumbnails load progressively
- Selection responsive

**Performance Metrics**:
- Initial load: < 2 seconds
- Scroll FPS: 60fps
- Thumbnail load: < 500ms each
- Memory usage: < 500MB

---

#### Scenario 19: Concurrent Downloads
**Priority**: Medium  
**Test Steps**:
1. Queue 5 downloads simultaneously
2. Monitor progress

**Expected Results**:
- All downloads progress concurrently
- Bandwidth shared evenly
- No timeouts
- UI remains responsive

**Performance Metrics**:
- Max concurrent: 3 downloads
- Others queued
- Total bandwidth utilized: 90%+

---

### 3.7 Security Testing

#### Scenario 20: JWT Token Validation
**Priority**: Critical  
**Test Steps**:
1. Capture valid JWT token
2. Modify token payload
3. Attempt API call with modified token

**Expected Results**:
- Modified token rejected
- HTTP 401 Unauthorized
- No data exposed
- Re-authentication required

---

#### Scenario 21: Man-in-the-Middle Attack Prevention
**Priority**: Critical  
**Test Steps**:
1. Intercept HTTPS traffic
2. Attempt to modify requests

**Expected Results**:
- TLS 1.3 encryption active
- Certificate pinning enforced
- Tampering detected
- Connection refused

---

#### Scenario 22: PIN Brute Force Protection
**Priority**: High  
**Test Steps**:
1. Attempt 10 invalid PINs rapidly

**Expected Results**:
- Rate limiting activated after 5 attempts
- Delay increases exponentially (1s, 2s, 4s, 8s, 16s)
- PIN regenerated after 10 failed attempts
- IP temporarily blocked (5 minutes)

---

## 4. Test Data

### 4.1 Test Users
```
User 1: test-user-1@example.com
User 2: test-user-2@example.com
```

### 4.2 Test Devices
```
TV Box 1: TB-001 (Android 12, 4GB RAM)
TV Box 2: TB-002 (Android 11, 2GB RAM)
Mobile 1: iPhone 13 (iOS 16)
Mobile 2: Samsung Galaxy S22 (Android 13)
```

### 4.3 Test Media Files
```
Video 1: video-small.mp4 (100MB, 1080p, 10min)
Video 2: video-medium.mp4 (500MB, 1080p, 30min)
Video 3: video-large.mp4 (2GB, 4K, 2hr)
Video 4: video-corrupted.mp4 (Invalid format)
```

### 4.4 Test Network Conditions
```
Fast: 100 Mbps, 10ms latency
Medium: 50 Mbps, 50ms latency
Slow: 10 Mbps, 100ms latency
Intermittent: Random disconnections
```

## 5. Test Environment

### 5.1 Android TV Setup
- **Devices**: Minimum 5 different TV Box models
- **Android Versions**: 6.0, 9.0, 11.0, 12.0, 13.0
- **RAM**: 2GB, 4GB, 8GB variants
- **Storage**: 16GB, 32GB, 64GB
- **Network**: WiFi 5, WiFi 6, Ethernet

### 5.2 Mobile Setup
- **iOS**: iPhone 8, 11, 13, 14
- **Android**: Samsung, Xiaomi, OnePlus, Pixel
- **OS Versions**: iOS 14-17, Android 10-14
- **Screen Sizes**: 4.7", 5.8", 6.5", 12.9" (tablet)

### 5.3 Network Setup
- Local network with router
- Isolated test subnet (192.168.100.0/24)
- Network simulator for latency/packet loss
- Bandwidth throttling capability

## 6. Test Schedule

### 6.1 Daily (Automated)
- Unit tests on every commit
- Code coverage checks
- Linting and static analysis

### 6.2 Weekly (Automated + Manual)
- Integration test suite
- Performance regression tests
- Security scans (OWASP ZAP)
- Compatibility matrix (1 device each)

### 6.3 Pre-Release (Manual + Automated)
- Complete E2E test suite
- All device compatibility testing
- Performance benchmarking
- Security penetration testing
- User acceptance testing
- Load testing

## 7. Entry and Exit Criteria

### 7.1 Entry Criteria
- Code compiled successfully
- Unit tests passing
- Code review approved
- No critical bugs in backlog

### 7.2 Exit Criteria
- All planned tests executed
- Pass rate ≥ 95%
- No critical or high-severity bugs
- Code coverage ≥ 80%
- Performance benchmarks met
- Security scan clean

## 8. Defect Management

### 8.1 Severity Levels

**Critical (P0)**:
- App crashes
- Data loss
- Security vulnerabilities
- Core functionality broken

**High (P1)**:
- Major feature not working
- Significant performance degradation
- Workaround not intuitive

**Medium (P2)**:
- Minor feature issues
- UI inconsistencies
- Easy workaround available

**Low (P3)**:
- Cosmetic issues
- Minor UI improvements
- Edge cases

### 8.2 Bug Report Template

```markdown
**Title**: [Clear, concise description]

**Severity**: P0/P1/P2/P3

**Environment**:
- Device: [Model]
- OS Version: [Version]
- App Version: [Version]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]

**Actual Result**: [What actually happens]

**Screenshots/Videos**: [Attach if applicable]

**Logs**: [Relevant logs]

**Reproducibility**: Always / Sometimes / Once
```

## 9. Test Metrics

### 9.1 Key Metrics
- **Test Pass Rate**: (Passed / Total) × 100
- **Code Coverage**: Lines covered / Total lines
- **Defect Density**: Defects / KLOC
- **Defect Resolution Time**: Average time to fix
- **Test Execution Time**: Total time for all tests

### 9.2 Target Metrics
- Test Pass Rate: ≥ 95%
- Code Coverage: ≥ 80%
- Critical Bug Resolution: < 24 hours
- High Bug Resolution: < 3 days
- Medium Bug Resolution: < 1 week

## 10. Risk Management

### 10.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Device fragmentation | High | High | Test on 5+ devices per platform |
| Network instability | High | Medium | Implement robust retry logic |
| Storage limitations | Medium | Medium | Cache management with eviction |
| API rate limiting | Medium | Low | Implement client-side throttling |

### 10.2 Schedule Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Test environment unavailable | High | Low | Cloud testing infrastructure backup |
| Insufficient test coverage | High | Medium | Automated coverage checks in CI |
| Late bug discovery | High | Medium | Continuous integration testing |

## 11. Tools and Technologies

### 11.1 Test Frameworks
- **Android**: JUnit 4, MockK, Espresso, Room Testing
- **iOS/Android Mobile**: Jest, React Testing Library, Detox
- **API Testing**: Postman, Newman
- **Performance**: Android Profiler, Chrome DevTools
- **Security**: OWASP ZAP, Burp Suite

### 11.2 CI/CD Integration
- **Platform**: GitHub Actions
- **Build**: Gradle (Android), npm (Mobile)
- **Coverage**: JaCoCo (Android), Istanbul (Mobile)
- **Reporting**: Allure, HTML reports

## 12. Test Deliverables

- Test Plan (this document)
- Test Cases (detailed in code)
- Test Reports (after each run)
- Coverage Reports (HTML format)
- Bug Reports (in issue tracker)
- Performance Benchmarks
- Security Audit Report

## 13. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Development Lead | | | |
| Product Manager | | | |

---

**Document End**
