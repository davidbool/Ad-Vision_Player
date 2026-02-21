# Testing Guide - TV Box Player

This document provides comprehensive guidance for testing the TV Box Player application, covering both Android TV and mobile components.

## Table of Contents

- [Overview](#overview)
- [Testing Strategy](#testing-strategy)
- [Test Infrastructure](#test-infrastructure)
- [Android TV App Testing](#android-tv-app-testing)
- [Mobile App Testing](#mobile-app-testing)
- [Running Tests](#running-tests)
- [Code Coverage](#code-coverage)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The TV Box Player project follows a comprehensive testing strategy with the following coverage targets:

- **Overall code coverage**: > 80%
- **Critical paths coverage**: > 95%
- **Business logic coverage**: > 90%
- **UI component coverage**: > 70%

### Test Pyramid

Our testing approach follows the test pyramid:

```
        /\
       /  \        E2E Tests (10%)
      /----\
     /      \      Integration Tests (20%)
    /--------\
   /          \    Unit Tests (70%)
  /____________\
```

## Testing Strategy

### 1. Unit Testing
- Test individual functions, classes, and components in isolation
- Mock external dependencies
- Fast execution (milliseconds per test)
- Run on every commit

### 2. Integration Testing
- Test interaction between components
- Verify API contracts
- Test database operations
- Run before PR merge

### 3. E2E Testing
- Test complete user workflows
- Run on real devices
- Execute before releases

## Test Infrastructure

### Android TV App

**Framework**: JUnit 4, MockK, Kotlin Coroutines Test  
**Location**: `android-tv-app/app/src/test/java/com/tvboxplayer/`

**Dependencies**:
```kotlin
testImplementation("junit:junit:4.13.2")
testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
testImplementation("androidx.arch.core:core-testing:2.2.0")
testImplementation("io.mockk:mockk:1.13.9")
androidTestImplementation("androidx.test.ext:junit:1.1.5")
androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
androidTestImplementation("androidx.room:room-testing:2.6.1")
```

### Mobile App

**Framework**: Jest, React Testing Library, Redux Mock Store  
**Location**: `mobile-app/__tests__/`

**Dependencies**:
```json
{
  "@testing-library/react-native": "^12.4.3",
  "@testing-library/jest-native": "^5.4.3",
  "axios-mock-adapter": "^1.22.0",
  "redux-mock-store": "^1.5.4",
  "jest": "^29.7.0"
}
```

## Android TV App Testing

### Unit Tests

#### 1. PairingManager Tests
Location: `android-tv-app/app/src/test/java/com/tvboxplayer/manager/PairingManagerTest.kt`

**Coverage**:
- PIN generation (6-digit, unique)
- PIN expiration (5 minutes)
- JWT token generation and validation
- Device limit enforcement (max 5 devices)
- Session timeout (1 hour)

**Example**:
```kotlin
@Test
fun `generatePIN should create unique 6-digit PIN`() = runTest {
    val pin1 = pairingManager.generatePIN()
    val pin2 = pairingManager.generatePIN()
    
    assertEquals(6, pin1.length)
    assertTrue(pin1.all { it.isDigit() })
    assertNotEquals(pin1, pin2)
}
```

#### 2. CacheManager Tests
Location: `android-tv-app/app/src/test/java/com/tvboxplayer/cache/CacheManagerTest.kt`

**Coverage**:
- LRU eviction policy
- Cache size limits (5GB default)
- Storage space monitoring
- Cleanup of old files (7 days)
- Concurrent access handling

**Example**:
```kotlin
@Test
fun `evictLRU should remove least recently used item`() = runTest {
    cacheManager.addToCache("item-1", "/cache/1.mp4", 2GB)
    cacheManager.addToCache("item-2", "/cache/2.mp4", 2GB)
    cacheManager.addToCache("item-3", "/cache/3.mp4", 2GB) // Triggers eviction

    assertFalse(cacheManager.isInCache("item-1"))
}
```

#### 3. ContentSyncService Tests
Location: `android-tv-app/app/src/test/java/com/tvboxplayer/sync/ContentSyncServiceTest.kt`

**Coverage**:
- Download job creation and tracking
- Resume interrupted downloads
- Progress monitoring
- Metadata extraction
- Thumbnail generation

#### 4. MediaPlayerManager Tests
Location: `android-tv-app/app/src/test/java/com/tvboxplayer/playback/MediaPlayerManagerTest.kt`

**Coverage**:
- Playback state management (play, pause, stop)
- Queue management (add, remove, shuffle)
- Speed control (0.5x - 2.0x)
- Volume control (0.0 - 1.0)
- Seek operations

#### 5. Database Tests
Location: `android-tv-app/app/src/test/java/com/tvboxplayer/database/DatabaseTest.kt`

**Coverage**:
- CRUD operations for all entities
- Query performance
- Relationship integrity
- Concurrent access

### Running Android Tests

```bash
cd android-tv-app

# Run all unit tests
./gradlew test

# Run specific test class
./gradlew test --tests PairingManagerTest

# Run tests with coverage
./gradlew testDebugUnitTest jacocoTestReport

# Run instrumentation tests
./gradlew connectedAndroidTest
```

## Mobile App Testing

### Unit Tests

#### 1. Redux Actions Tests
Location: `mobile-app/__tests__/redux/deviceActions.test.ts`

**Coverage**:
- Action creator functions
- Action payload validation
- Action type constants

#### 2. Redux Reducers Tests
Location: `mobile-app/__tests__/redux/deviceReducer.test.ts`

**Coverage**:
- State transitions
- Immutability
- Initial state
- Error handling

**Example**:
```typescript
it('should store discovered devices', () => {
  const devices = [
    { id: '1', name: 'TV Box 1' },
  ];
  const action = { type: DISCOVER_DEVICES_SUCCESS, payload: devices };
  const state = deviceReducer(initialState, action);

  expect(state.availableDevices).toEqual(devices);
});
```

#### 3. Redux Saga Tests
Location: `mobile-app/__tests__/sagas/deviceSaga.test.ts`

**Coverage**:
- API call flows
- Error handling
- Retry logic
- Side effects

#### 4. Component Tests
Location: `mobile-app/__tests__/components/`

**Coverage**:
- Component rendering
- User interactions
- Props handling
- State updates

**Example**:
```typescript
it('should dispatch discover action when scan button is pressed', () => {
  const { getByText } = render(
    <Provider store={store}>
      <DeviceDiscoveryScreen />
    </Provider>
  );

  fireEvent.press(getByText(/Scan for Devices/i));
  expect(store.dispatch).toHaveBeenCalledWith(discoverDevices());
});
```

#### 5. Service Tests
Location: `mobile-app/__tests__/services/apiClient.test.ts`

**Coverage**:
- API request formatting
- Response parsing
- Error handling
- Token refresh
- Network errors

### Running Mobile Tests

```bash
cd mobile-app

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run specific test file
npm test -- deviceActions.test.ts

# Update snapshots
npm test -- -u
```

## Code Coverage

### Viewing Coverage Reports

**Android**:
```bash
cd android-tv-app
./gradlew testDebugUnitTest jacocoTestReport
open app/build/reports/jacoco/testDebugUnitTest/html/index.html
```

**Mobile**:
```bash
cd mobile-app
npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage Thresholds

The following minimum coverage thresholds are enforced:

**Mobile App** (Jest):
```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

**Android App**:
- Minimum 80% line coverage
- Minimum 80% branch coverage

## Best Practices

### General

1. **Test Naming**: Use descriptive test names that explain what is being tested
   ```kotlin
   // Good
   @Test
   fun `should throw error when PIN expires after 5 minutes`()
   
   // Bad
   @Test
   fun testPIN()
   ```

2. **Arrange-Act-Assert**: Structure tests clearly
   ```typescript
   it('should add item to cache', () => {
     // Arrange
     const item = { id: '1', data: 'test' };
     
     // Act
     cache.add(item);
     
     // Assert
     expect(cache.get('1')).toEqual(item);
   });
   ```

3. **One Assertion per Test**: Focus each test on a single behavior
   - Exception: When testing state consistency

4. **Avoid Test Dependencies**: Each test should run independently

5. **Mock External Dependencies**: Don't make real network calls or database operations in unit tests

### Android Testing

1. **Use Coroutines Test**: For testing suspend functions
   ```kotlin
   @Test
   fun myTest() = runTest {
     val result = myService.fetchData()
     assertEquals(expected, result)
   }
   ```

2. **MockK**: Prefer MockK over Mockito for Kotlin
   ```kotlin
   val mock = mockk<MyService>()
   every { mock.getData() } returns testData
   ```

3. **Room Testing**: Use in-memory database
   ```kotlin
   database = Room.inMemoryDatabaseBuilder(
     context,
     MyDatabase::class.java
   ).build()
   ```

### Mobile Testing

1. **React Testing Library**: Query by user-visible text
   ```typescript
   const button = getByText('Submit');
   fireEvent.press(button);
   ```

2. **Redux Mock Store**: Test Redux-connected components
   ```typescript
   const store = mockStore({ device: initialState });
   render(<Provider store={store}><MyComponent /></Provider>);
   ```

3. **Async Testing**: Use `waitFor` for async operations
   ```typescript
   await waitFor(() => {
     expect(getByText('Success')).toBeTruthy();
   });
   ```

## Troubleshooting

### Common Issues

#### Android

**Issue**: Tests fail with `java.lang.IllegalStateException: Not mocked`  
**Solution**: Add to gradle:
```kotlin
testOptions {
    unitTests.returnDefaultValues = true
}
```

**Issue**: Coroutine test timeout  
**Solution**: Use `runTest` from `kotlinx-coroutines-test`

**Issue**: Room database errors in tests  
**Solution**: Use in-memory database and `allowMainThreadQueries()` for tests

#### Mobile

**Issue**: `Cannot find module` errors  
**Solution**: Check `moduleNameMapper` in `jest.config.js`

**Issue**: React Native component not found  
**Solution**: Add to `transformIgnorePatterns` in Jest config

**Issue**: Redux saga tests hanging  
**Solution**: Ensure saga is cancelled after test:
```typescript
saga.cancel();
await saga.toPromise();
```

### Performance

**Slow tests**:
- Reduce test data size
- Use `jest.mock()` for heavy modules
- Run tests in parallel: `jest --maxWorkers=4`

**Android build slow**:
- Use `./gradlew test --parallel`
- Increase Gradle memory: `org.gradle.jvmargs=-Xmx4096m`

## Continuous Integration

### GitHub Actions Integration

Tests are automatically run on:
- Every push to feature branches
- Pull request creation/update
- Before merge to main branch

**Workflow**:
```yaml
- name: Run Android Tests
  run: cd android-tv-app && ./gradlew test

- name: Run Mobile Tests
  run: cd mobile-app && npm run test:ci
```

## Additional Resources

- [JUnit Documentation](https://junit.org/junit4/)
- [MockK Documentation](https://mockk.io/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Redux Testing Guide](https://redux.js.org/usage/writing-tests)

## Support

For testing questions or issues:
1. Check this documentation
2. Review existing test files for examples
3. Consult the [TEST_PLAN.md](./TEST_PLAN.md) for specific scenarios
4. Open an issue in the project repository
