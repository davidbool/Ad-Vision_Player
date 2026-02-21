# Contributing to TV Box Player

Thank you for your interest in contributing to TV Box Player! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **JDK** 17 or higher
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Git**

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tvbox-player.git
   cd tvbox-player
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/alexbol99/tvbox-player.git
   ```

## Development Setup

### Initial Setup

Use our automated setup script:

```bash
./scripts/setup.sh
```

This will:
- Check all prerequisites
- Install dependencies for both apps
- Configure development environment
- Set up Git hooks

### Manual Setup

If you prefer manual setup:

**Mobile App:**
```bash
cd mobile-app
npm install
cd ios && pod install  # macOS only
```

**Android TV App:**
```bash
cd android-tv-app
./gradlew build
```

### Running the Apps

**Mobile App:**
```bash
cd mobile-app
npm run android     # Run on Android
npm run ios         # Run on iOS (macOS only)
```

**Android TV App:**
```bash
cd android-tv-app
./gradlew installDebug
```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Reports**: Report bugs via GitHub Issues
2. **Feature Requests**: Suggest new features via GitHub Issues
3. **Code Contributions**: Submit pull requests
4. **Documentation**: Improve or add documentation
5. **Testing**: Add or improve tests
6. **Security**: Report security vulnerabilities privately

### Reporting Bugs

When reporting bugs, please include:

- **Clear title** describing the issue
- **Description** with steps to reproduce
- **Expected behavior** vs actual behavior
- **Environment details** (OS, device, version)
- **Screenshots** or logs if applicable
- **Minimal reproduction** code if possible

Use the bug report template when creating issues.

### Suggesting Features

When suggesting features:

- **Check existing issues** to avoid duplicates
- **Describe the problem** you're trying to solve
- **Propose a solution** with rationale
- **Consider alternatives** you've explored
- **Explain benefits** to users/project

Use the feature request template when creating issues.

### Security Vulnerabilities

**DO NOT** create public issues for security vulnerabilities.

Instead, email: security@tvboxplayer.com

See [SECURITY.md](./SECURITY.md) for details.

## Pull Request Process

### Before Starting

1. **Check existing PRs** to avoid duplicate work
2. **Create or comment on an issue** to discuss your changes
3. **Ensure you can commit time** to address feedback
4. **Review our coding standards** below

### Creating a Pull Request

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Write/update tests** for your changes

4. **Update documentation** if needed

5. **Run all tests** locally:
   ```bash
   ./scripts/test.sh
   ```

6. **Commit your changes** with clear messages:
   ```bash
   git commit -m "feat: add new pairing method"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** on GitHub

### PR Requirements

Your PR must:

- ✅ Pass all CI checks
- ✅ Include tests for new functionality
- ✅ Maintain or improve code coverage (>80%)
- ✅ Follow coding standards
- ✅ Include updated documentation
- ✅ Have clear commit messages
- ✅ Be based on latest `main` branch

### PR Review Process

1. **Automated checks** run on your PR
2. **Maintainers review** your code
3. **Address feedback** by pushing new commits
4. **Approval** from at least one maintainer required
5. **Merge** by maintainers once approved

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```
feat(mobile): add QR code pairing
fix(android-tv): resolve cache eviction bug
docs: update API documentation
test(mobile): add pairing flow tests
```

## Coding Standards

### General Guidelines

- Write **clean, readable code**
- Follow **existing patterns** in the codebase
- Keep functions **small and focused**
- Use **meaningful names** for variables/functions
- Add **comments** for complex logic
- Avoid **premature optimization**

### Kotlin (Android TV App)

- Follow [Kotlin style guide](https://kotlinlang.org/docs/coding-conventions.html)
- Use **ktlint** for formatting
- Run linter: `./gradlew ktlintCheck`
- Format code: `./gradlew ktlintFormat`

**Key conventions:**
```kotlin
// Use descriptive names
fun generatePairingPin(): String

// Use data classes for models
data class Device(val id: String, val name: String)

// Use coroutines for async operations
suspend fun syncContent(): Result<Unit>

// Use sealed classes for states
sealed class LoadingState {
    object Idle : LoadingState()
    object Loading : LoadingState()
    data class Success(val data: List<Media>) : LoadingState()
    data class Error(val message: String) : LoadingState()
}
```

### TypeScript (Mobile App)

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use **ESLint** and **Prettier**
- Run linter: `npm run lint`
- Format code: `npm run format`

**Key conventions:**
```typescript
// Use TypeScript types
interface Device {
  id: string;
  name: string;
}

// Use functional components with hooks
const PairingScreen: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  // ...
}

// Use Redux Toolkit
const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    addDevice: (state, action: PayloadAction<Device>) => {
      state.devices.push(action.payload);
    },
  },
});

// Use async/await
async function fetchDevices(): Promise<Device[]> {
  const response = await api.get('/devices');
  return response.data;
}
```

### Code Organization

**Android TV:**
```
app/src/main/java/com/tvboxplayer/
├── ui/              # Activities, fragments, adapters
├── service/         # Background services
├── data/            # Database, DAOs, repositories
├── network/         # API clients, network utilities
├── player/          # Media player logic
├── cache/           # Cache management
└── util/            # Utility classes
```

**Mobile:**
```
src/
├── screens/         # Screen components
├── components/      # Reusable UI components
├── navigation/      # Navigation setup
├── redux/           # Redux store, actions, reducers
├── sagas/           # Redux-Saga middleware
├── services/        # API clients, utilities
├── utils/           # Helper functions
├── constants/       # Constants and enums
└── theme/           # Theme configuration
```

## Testing Requirements

### Test Coverage

- **Overall coverage**: >80%
- **Critical paths**: >95%
- **Business logic**: >90%
- **UI components**: >70%

### Writing Tests

**Android TV (JUnit + MockK):**
```kotlin
@Test
fun `generatePairingPin should return 6-digit code`() {
    val pin = pairingManager.generatePairingPin()
    
    assertThat(pin).hasLength(6)
    assertThat(pin).containsOnlyDigits()
}
```

**Mobile (Jest + React Testing Library):**
```typescript
describe('PairingScreen', () => {
  it('should display PIN input', () => {
    const { getByPlaceholderText } = render(<PairingScreen />);
    expect(getByPlaceholderText('Enter PIN')).toBeTruthy();
  });
});
```

### Running Tests

```bash
# All tests
./scripts/test.sh

# Android TV only
cd android-tv-app && ./gradlew test

# Mobile only
cd mobile-app && npm test

# With coverage
cd mobile-app && npm run test:coverage
```

### Test Documentation

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

## Documentation

### When to Update Documentation

Update documentation when:

- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Improving processes
- Adding configuration options

### Documentation Types

1. **Code Comments**: Complex logic, public APIs
2. **README Files**: Each major component
3. **API Documentation**: REST endpoints
4. **Architecture Docs**: Design decisions
5. **User Guides**: End-user documentation

### Documentation Style

- Use **clear, concise language**
- Include **code examples**
- Add **diagrams** for complex concepts
- Keep **up-to-date** with code changes
- Use **proper markdown** formatting

## Community

### Getting Help

- **Documentation**: Check docs first
- **Issues**: Search existing issues
- **Discussions**: GitHub Discussions for questions
- **Email**: support@tvboxplayer.com

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Pull Requests**: Code contributions
- **Email**: Private/sensitive matters

### Code Review

When reviewing code:

- Be **respectful and constructive**
- Focus on **code, not the person**
- Explain **why**, not just **what**
- Suggest **alternatives** when possible
- Approve when **standards are met**

### Recognition

Contributors will be:

- Added to **CONTRIBUTORS.md**
- Mentioned in **release notes**
- Credited in **commit history**

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

If you have questions about contributing, please:

1. Check this guide thoroughly
2. Search existing issues/discussions
3. Create a new discussion on GitHub
4. Email: contribute@tvboxplayer.com

Thank you for contributing to TV Box Player! 🎉
