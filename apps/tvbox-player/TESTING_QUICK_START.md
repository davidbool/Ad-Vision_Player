# Testing Quick Start Guide

This guide helps you quickly get started with testing the TV Box Player application.

## Prerequisites

- Node.js 18+ (for mobile app)
- JDK 17 (for Android TV app)
- Android Studio (optional, for Android development)
- Git

## Setup

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-org/tvbox-player.git
cd tvbox-player

# Install mobile app dependencies
cd mobile-app
npm install

# Back to root
cd ..
```

### 2. Configure Test Environment

**Mobile App** - No additional configuration needed

**Android App** - Sync Gradle dependencies:
```bash
cd android-tv-app
./gradlew build
```

## Running Tests

### Mobile App Tests

```bash
cd mobile-app

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- deviceActions.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should pair device"
```

**View Coverage Report**:
```bash
npm run test:coverage
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
```

### Android TV App Tests

```bash
cd android-tv-app

# Run all unit tests
./gradlew test

# Run specific test class
./gradlew test --tests PairingManagerTest

# Run specific test method
./gradlew test --tests PairingManagerTest.generatePIN*

# Run tests with coverage
./gradlew testDebugUnitTest jacocoTestReport

# Run instrumentation tests (requires emulator/device)
./gradlew connectedAndroidTest
```

**View Coverage Report**:
```bash
open app/build/reports/jacoco/testDebugUnitTest/html/index.html
```

## Test Structure

### Mobile App (`mobile-app/__tests__/`)

```
__tests__/
├── redux/
│   ├── deviceActions.test.ts       # Redux action tests
│   ├── deviceReducer.test.ts       # Redux reducer tests
│   └── ...
├── sagas/
│   ├── deviceSaga.test.ts          # Saga tests
│   └── ...
├── components/
│   ├── DeviceDiscoveryScreen.test.tsx  # Component tests
│   └── ...
└── services/
    ├── apiClient.test.ts           # Service tests
    └── ...
```

### Android TV App (`android-tv-app/app/src/test/`)

```
test/java/com/tvboxplayer/
├── manager/
│   └── PairingManagerTest.kt       # Pairing logic tests
├── cache/
│   └── CacheManagerTest.kt         # Cache management tests
├── sync/
│   └── ContentSyncServiceTest.kt   # Sync service tests
├── playback/
│   └── MediaPlayerManagerTest.kt   # Playback tests
└── database/
    └── DatabaseTest.kt              # Database tests
```

## Writing Your First Test

### Mobile App (Jest + React Testing Library)

```typescript
// __tests__/components/MyComponent.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should handle button press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPress} />);
    
    fireEvent.press(getByText('Click Me'));
    
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Android TV App (JUnit + MockK)

```kotlin
// app/src/test/java/com/tvboxplayer/MyServiceTest.kt
import io.mockk.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

@ExperimentalCoroutinesApi
class MyServiceTest {

    private lateinit var myService: MyService

    @Before
    fun setup() {
        myService = MyService()
    }

    @After
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `should process data correctly`() = runTest {
        val input = "test input"
        val expected = "PROCESSED: test input"
        
        val result = myService.processData(input)
        
        assertEquals(expected, result)
    }
}
```

## Common Testing Patterns

### 1. Testing Redux Actions

```typescript
import * as actions from '../../src/redux/actions/deviceActions';
import * as types from '../../src/redux/actions/types';

it('should create action to discover devices', () => {
  const expectedAction = {
    type: types.DISCOVER_DEVICES_REQUEST,
  };
  expect(actions.discoverDevices()).toEqual(expectedAction);
});
```

### 2. Testing Redux Reducers

```typescript
import reducer, { initialState } from '../../src/redux/reducers/deviceReducer';

it('should handle DISCOVER_DEVICES_SUCCESS', () => {
  const devices = [{ id: '1', name: 'TV Box 1' }];
  const action = { 
    type: 'DISCOVER_DEVICES_SUCCESS', 
    payload: devices 
  };
  
  const state = reducer(initialState, action);
  
  expect(state.availableDevices).toEqual(devices);
});
```

### 3. Testing Async Sagas

```typescript
import { runSaga } from 'redux-saga';
import { discoverDevicesSaga } from '../../src/sagas/deviceSaga';

it('should discover devices successfully', async () => {
  const devices = [{ id: '1', name: 'TV Box 1' }];
  const dispatched = [];
  
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
      getState: () => ({}),
    },
    discoverDevicesSaga
  ).toPromise();
  
  expect(dispatched).toContainEqual(
    discoverDevicesSuccess(devices)
  );
});
```

### 4. Testing Components with Redux

```typescript
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

it('should dispatch action on button press', () => {
  const store = mockStore({ device: initialState });
  store.dispatch = jest.fn();
  
  const { getByText } = render(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );
  
  fireEvent.press(getByText('Discover'));
  
  expect(store.dispatch).toHaveBeenCalled();
});
```

### 5. Testing API Calls

```typescript
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

it('should fetch devices', async () => {
  const devices = [{ id: '1', name: 'TV Box 1' }];
  mock.onGet('/api/devices').reply(200, devices);
  
  const result = await apiClient.getDevices();
  
  expect(result).toEqual(devices);
});
```

### 6. Testing Kotlin Coroutines

```kotlin
@Test
fun `should fetch data asynchronously`() = runTest {
    val mockData = "test data"
    coEvery { repository.fetchData() } returns mockData
    
    val result = service.getData()
    
    assertEquals(mockData, result)
}
```

### 7. Testing Room Database

```kotlin
@Test
fun insertAndRetrieve() = runTest {
    val item = MediaItem(id = "1", title = "Test")
    
    dao.insert(item)
    val retrieved = dao.getById("1").first()
    
    assertEquals(item, retrieved)
}
```

## Debugging Tests

### Mobile App

```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test file in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand MyTest.test.ts

# In Chrome, open: chrome://inspect
```

### Android App

```bash
# Run tests with stack traces
./gradlew test --stacktrace

# Run with info logging
./gradlew test --info

# Generate HTML test report
./gradlew test
open app/build/reports/tests/testDebugUnitTest/index.html
```

## Continuous Integration

Tests run automatically on GitHub Actions:

```yaml
# .github/workflows/test.yml
on: [push, pull_request]

jobs:
  test-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: cd mobile-app && npm ci
      - name: Run tests
        run: cd mobile-app && npm run test:ci

  test-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup JDK
        uses: actions/setup-java@v3
      - name: Run tests
        run: cd android-tv-app && ./gradlew test
```

## Tips and Tricks

### 1. Run Tests on File Change

**Mobile**:
```bash
npm run test:watch
```

**Android** (using entr):
```bash
find app/src -name "*.kt" | entr -c ./gradlew test
```

### 2. Run Only Failed Tests

**Mobile**:
```bash
npm test -- --onlyFailures
```

**Android**:
```bash
./gradlew test --rerun-tasks
```

### 3. Update Snapshots

**Mobile**:
```bash
npm test -- -u
```

### 4. Parallel Execution

**Mobile**:
```bash
npm test -- --maxWorkers=4
```

**Android**:
```bash
./gradlew test --parallel --max-workers=4
```

### 5. Test Specific Pattern

**Mobile**:
```bash
npm test -- --testNamePattern="pairing"
```

**Android**:
```bash
./gradlew test --tests "*Pairing*"
```

## Coverage Goals

Maintain these minimum coverage thresholds:

| Component | Lines | Branches | Functions | Statements |
|-----------|-------|----------|-----------|------------|
| Redux Actions | 90% | 85% | 90% | 90% |
| Redux Reducers | 95% | 90% | 95% | 95% |
| Sagas | 85% | 80% | 85% | 85% |
| Components | 75% | 70% | 75% | 75% |
| Services | 85% | 80% | 85% | 85% |
| **Overall** | **80%** | **80%** | **80%** | **80%** |

## Common Issues and Solutions

### Issue: `Cannot find module` error (Mobile)
**Solution**: Check `moduleNameMapper` in `jest.config.js`

### Issue: Tests timing out (Mobile)
**Solution**: Increase timeout:
```typescript
jest.setTimeout(10000);
```

### Issue: Android tests not finding resources
**Solution**: Add to `build.gradle`:
```kotlin
testOptions {
    unitTests.returnDefaultValues = true
}
```

### Issue: Snapshot tests failing after UI changes
**Solution**: Update snapshots:
```bash
npm test -- -u
```

## Next Steps

1. Read the full [TESTING.md](./TESTING.md) documentation
2. Review the [TEST_PLAN.md](./TEST_PLAN.md) for detailed scenarios
3. Explore existing test files for examples
4. Write tests for new features before implementation (TDD)
5. Maintain > 80% code coverage

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [JUnit 4 Documentation](https://junit.org/junit4/)
- [MockK Documentation](https://mockk.io/)
- [Kotlin Coroutines Test](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-test/)

## Support

Questions? Check:
1. This quick start guide
2. [TESTING.md](./TESTING.md)
3. [TEST_PLAN.md](./TEST_PLAN.md)
4. Existing test files
5. Open an issue in the repository

Happy Testing! 🎉
