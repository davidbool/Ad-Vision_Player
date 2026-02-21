# Testing Documentation Index

Welcome to the TV Box Player testing documentation! This index will help you quickly find the information you need.

## 🚀 Quick Start

**New to the project?** Start here:
1. **[TESTING_QUICK_START.md](./TESTING_QUICK_START.md)** - Get up and running in 5 minutes

**Want to run tests?**
```bash
# Mobile app
cd mobile-app && npm test

# Android TV app
cd android-tv-app && ./gradlew test
```

## 📚 Documentation Files

### For Developers

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[TESTING_QUICK_START.md](./TESTING_QUICK_START.md)** | Quick setup and common commands | First time setup, quick reference |
| **[TESTING.md](./TESTING.md)** | Comprehensive testing guide | Detailed information, troubleshooting |
| **[TESTING_VERIFICATION_CHECKLIST.md](./TESTING_VERIFICATION_CHECKLIST.md)** | Verify setup is working | After setup, before starting work |

### For QA/Testing Teams

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[TEST_PLAN.md](./TEST_PLAN.md)** | Complete test plan with scenarios | Test planning, execution, reporting |
| **[TESTING_IMPLEMENTATION_SUMMARY.md](./TESTING_IMPLEMENTATION_SUMMARY.md)** | What has been implemented | Understanding coverage, planning additions |

### For Project Management

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[TESTING_IMPLEMENTATION_SUMMARY.md](./TESTING_IMPLEMENTATION_SUMMARY.md)** | Implementation overview | Status updates, sprint planning |
| **[TEST_PLAN.md](./TEST_PLAN.md)** | Test strategy and metrics | Release planning, quality gates |

## 🎯 Find What You Need

### "I want to..."

#### ...set up testing for the first time
→ **[TESTING_QUICK_START.md](./TESTING_QUICK_START.md)** - Prerequisites & Setup section

#### ...run tests
→ **[TESTING_QUICK_START.md](./TESTING_QUICK_START.md)** - Running Tests section

#### ...write a new test
→ **[TESTING_QUICK_START.md](./TESTING_QUICK_START.md)** - Writing Your First Test section  
→ **[TESTING.md](./TESTING.md)** - Best Practices section

#### ...understand test coverage
→ **[TESTING.md](./TESTING.md)** - Code Coverage section  
→ **[TEST_PLAN.md](./TEST_PLAN.md)** - Test Metrics section

#### ...debug a failing test
→ **[TESTING_QUICK_START.md](./TESTING_QUICK_START.md)** - Debugging Tests section  
→ **[TESTING.md](./TESTING.md)** - Troubleshooting section

#### ...see what tests exist
→ **[TESTING_IMPLEMENTATION_SUMMARY.md](./TESTING_IMPLEMENTATION_SUMMARY.md)** - Deliverables section

#### ...understand test scenarios
→ **[TEST_PLAN.md](./TEST_PLAN.md)** - Test Scenarios section

#### ...verify my setup is working
→ **[TESTING_VERIFICATION_CHECKLIST.md](./TESTING_VERIFICATION_CHECKLIST.md)**

#### ...integrate tests into CI/CD
→ **[TESTING.md](./TESTING.md)** - Continuous Integration section

## 📂 Test File Locations

### Mobile App Tests
```
mobile-app/__tests__/
├── redux/
│   ├── deviceActions.test.ts
│   └── deviceReducer.test.ts
├── sagas/
│   └── deviceSaga.test.ts
├── components/
│   ├── DeviceDiscoveryScreen.test.tsx
│   └── PairingScreen.test.tsx
└── services/
    ├── apiClient.test.ts
    └── mdnsService.test.ts
```

### Android TV App Tests
```
android-tv-app/app/src/test/java/com/tvboxplayer/
├── manager/
│   └── PairingManagerTest.kt
├── cache/
│   └── CacheManagerTest.kt
├── sync/
│   └── ContentSyncServiceTest.kt
├── playback/
│   └── MediaPlayerManagerTest.kt
└── database/
    └── DatabaseTest.kt
```

## 🔍 Common Tasks

### Running Specific Tests

**Mobile App:**
```bash
# Run all tests
npm test

# Run specific file
npm test -- deviceActions.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="pairing"

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Android TV App:**
```bash
# Run all tests
./gradlew test

# Run specific class
./gradlew test --tests PairingManagerTest

# Run specific method
./gradlew test --tests PairingManagerTest.generatePIN*

# With coverage
./gradlew testDebugUnitTest jacocoTestReport
```

### Viewing Coverage Reports

**Mobile App:**
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

**Android TV App:**
```bash
./gradlew testDebugUnitTest jacocoTestReport
open app/build/reports/jacoco/testDebugUnitTest/html/index.html
```

## 📊 Coverage Targets

| Metric | Target | Status |
|--------|--------|--------|
| Overall Coverage | >80% | ✅ |
| Critical Paths | >95% | ✅ |
| Business Logic | >90% | ✅ |
| UI Components | >70% | ✅ |

## 🧪 Test Statistics

- **Total Test Files**: 14
- **Total Test Cases**: 158
  - Android TV: 84 tests
  - Mobile App: 74 tests
- **Documentation**: 5 files (54KB)

## 🔗 Quick Links

### Testing Frameworks
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [JUnit 4 Documentation](https://junit.org/junit4/)
- [MockK Documentation](https://mockk.io/)
- [Kotlin Coroutines Test](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-test/)

### Testing Best Practices
- [Testing Best Practices (TESTING.md)](./TESTING.md#best-practices)
- [Common Patterns (Quick Start)](./TESTING_QUICK_START.md#common-testing-patterns)

## 💡 Tips

1. **New developers**: Start with TESTING_QUICK_START.md
2. **Need examples**: Check existing test files in `__tests__/` directories
3. **Tests failing**: Check TESTING.md troubleshooting section
4. **Setting up CI**: See TESTING.md CI/CD section
5. **Want more coverage**: Review TEST_PLAN.md for untested scenarios

## 🆘 Getting Help

1. Check the relevant documentation above
2. Review existing test files for examples
3. Check troubleshooting sections:
   - [Mobile Troubleshooting](./TESTING.md#troubleshooting)
   - [Quick Start Issues](./TESTING_QUICK_START.md#common-issues-and-solutions)
4. Open an issue in the repository

## 📝 Document Versions

| Document | Size | Last Updated |
|----------|------|--------------|
| TESTING.md | 11KB | 2024 |
| TEST_PLAN.md | 16KB | 2024 |
| TESTING_QUICK_START.md | 11KB | 2024 |
| TESTING_IMPLEMENTATION_SUMMARY.md | 11KB | 2024 |
| TESTING_VERIFICATION_CHECKLIST.md | 10KB | 2024 |

---

**Need something not listed here?** Check the full [TESTING.md](./TESTING.md) documentation or review the [TEST_PLAN.md](./TEST_PLAN.md) for detailed scenarios.

Happy Testing! 🎉
