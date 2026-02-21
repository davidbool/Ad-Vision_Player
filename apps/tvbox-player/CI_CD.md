# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) infrastructure for the TV Box Player project.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Workflow Details](#workflow-details)
- [Secrets Configuration](#secrets-configuration)
- [Branch Strategy](#branch-strategy)
- [Build Artifacts](#build-artifacts)
- [Troubleshooting](#troubleshooting)

## Overview

The TV Box Player project uses GitHub Actions for CI/CD automation. The pipeline handles:

- **Continuous Integration**: Automated builds and tests on every commit
- **Code Quality**: Linting, type checking, and security scans
- **Automated Testing**: Unit tests, integration tests
- **Build Artifacts**: APK, AAB, and IPA generation
- **Release Management**: Automated releases on version tags

### Architecture

```
┌─────────────┐
│   Push/PR   │
└──────┬──────┘
       │
       ├─────────────────┬──────────────────┬──────────────────┐
       │                 │                  │                  │
┌──────▼──────┐  ┌──────▼──────┐  ┌────────▼────────┐  ┌─────▼─────┐
│ Android TV  │  │   Mobile    │  │     Mobile      │  │   Code    │
│   Build     │  │   Android   │  │      iOS        │  │  Quality  │
└──────┬──────┘  └──────┬──────┘  └────────┬────────┘  └─────┬─────┘
       │                 │                  │                  │
       ├─────────────────┼──────────────────┼──────────────────┤
       │                 │                  │                  │
┌──────▼─────────────────▼──────────────────▼──────────────────▼─────┐
│                        Artifacts & Reports                          │
└─────────────────────────────────────────────────────────────────────┘

                              On Tag (v*)
                                   │
                           ┌───────▼────────┐
                           │  Release Flow  │
                           └───────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
            ┌───────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
            │ Android TV   │ │  Mobile  │ │   Mobile    │
            │   Release    │ │ Android  │ │     iOS     │
            └───────┬──────┘ └────┬─────┘ └──────┬──────┘
                    │              │              │
            ┌───────▼──────────────▼──────────────▼──────┐
            │       GitHub Release with Assets           │
            └────────────────────────────────────────────┘
```

## GitHub Actions Workflows

The project includes the following workflows:

### 1. Android TV Build
**File**: `.github/workflows/android-tv-build.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual dispatch

**Jobs**:
- `lint`: Runs Android lint checks
- `test`: Runs unit tests
- `build-debug`: Builds debug APK
- `build-release`: Builds signed release APK (main branch only)

**Artifacts**:
- Debug APK (on all builds)
- Release APK with SHA-256 checksum (main branch)
- Lint reports
- Test results

### 2. Mobile Android Build
**File**: `.github/workflows/mobile-android-build.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual dispatch

**Jobs**:
- `lint-and-test`: ESLint, TypeScript, Jest tests
- `build-android-debug`: Builds debug APK
- `build-android-release`: Builds release APK and AAB (main branch only)

**Artifacts**:
- Debug APK
- Release APK and AAB with checksums
- Test coverage reports

### 3. Mobile iOS Build
**File**: `.github/workflows/mobile-ios-build.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual dispatch

**Jobs**:
- `lint-and-test`: ESLint, TypeScript, Jest tests
- `build-ios`: Debug build for validation
- `build-ios-release`: Release build and IPA export (main branch, requires signing)

**Artifacts**:
- Build logs
- IPA file (if signing configured)

**Note**: Runs on macOS runners (required for iOS builds)

### 4. Code Quality
**File**: `.github/workflows/code-quality.yml`

**Triggers**:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Manual dispatch

**Jobs**:
- `android-tv-quality`: Detekt, ktlint, lint, dependency analysis
- `mobile-app-quality`: ESLint, Prettier, TypeScript, security audit
- `dependency-review`: Checks for vulnerable dependencies (PRs only)
- `security-scan`: Trivy vulnerability scanner

**Artifacts**:
- Quality reports
- Security scan results

### 5. Release Workflow
**File**: `.github/workflows/release.yml`

**Triggers**:
- Push of version tags (`v*.*.*`)
- Manual dispatch with version input

**Jobs**:
- `create-release`: Creates GitHub release with changelog
- `build-android-tv`: Builds and uploads Android TV APK
- `build-mobile-android`: Builds and uploads mobile Android APK/AAB
- `build-mobile-ios`: Builds iOS IPA (if signing configured)

**Outputs**:
- GitHub Release with all build artifacts
- Automated changelog generation
- SHA-256 checksums for verification

## Workflow Details

### Android TV Build Workflow

#### Lint Job
```yaml
- Checkout code
- Setup JDK 17
- Run Gradle lint
- Upload lint results
```

**Duration**: ~2-3 minutes

#### Test Job
```yaml
- Checkout code
- Setup JDK 17
- Run unit tests
- Upload test results and coverage
```

**Duration**: ~2-4 minutes

#### Build Debug
```yaml
- Checkout code
- Setup JDK 17
- Build debug APK
- Verify APK size
- Upload APK artifact
```

**Duration**: ~3-5 minutes

#### Build Release (main branch only)
```yaml
- Checkout code
- Setup JDK 17
- Decode signing keystore (if available)
- Build signed release APK
- Verify size < 50MB
- Generate SHA-256 checksum
- Upload APK and checksum
```

**Duration**: ~4-6 minutes

### Mobile Android Build Workflow

#### Lint and Test
```yaml
- Checkout code
- Setup Node.js 18
- Install npm dependencies
- Run ESLint
- Run TypeScript type check
- Run Jest with coverage
- Upload coverage report
```

**Duration**: ~3-5 minutes

#### Build Debug
```yaml
- Checkout code
- Setup Node.js 18 and JDK 17
- Install npm dependencies
- Build Android debug APK
- Upload APK
```

**Duration**: ~5-8 minutes

#### Build Release (main branch only)
```yaml
- Checkout code
- Setup Node.js 18 and JDK 17
- Install npm dependencies
- Decode signing keystore
- Build release APK
- Build release AAB
- Generate checksums
- Upload artifacts
```

**Duration**: ~6-10 minutes

### Mobile iOS Build Workflow

#### Lint and Test
```yaml
- Checkout code
- Setup Node.js 18
- Install npm dependencies
- Run ESLint, TypeScript, Jest
```

**Duration**: ~3-5 minutes (macOS runner)

#### Build iOS
```yaml
- Checkout code
- Setup Node.js 18
- Install npm dependencies
- Install CocoaPods dependencies
- Build iOS app (unsigned)
- Upload build logs
```

**Duration**: ~10-15 minutes

#### Build iOS Release (main branch only)
```yaml
- Checkout code
- Setup Node.js and dependencies
- Import signing certificate (if available)
- Import provisioning profile
- Archive iOS app
- Export IPA
- Upload IPA
```

**Duration**: ~12-20 minutes

### Code Quality Workflow

#### Android TV Quality
```yaml
- Run detekt (static analysis)
- Run ktlint (code style)
- Run lint
- Analyze dependencies
- Upload reports
```

**Duration**: ~3-5 minutes

#### Mobile Quality
```yaml
- Run ESLint with JSON output
- Run Prettier check
- Run TypeScript compiler check
- Analyze bundle size
- Run npm audit (security)
- Upload reports
```

**Duration**: ~3-5 minutes

#### Security Scan
```yaml
- Run Trivy filesystem scanner
- Upload results to GitHub Security
```

**Duration**: ~2-4 minutes

### Release Workflow

#### Create Release
```yaml
- Extract version from tag or input
- Generate changelog from git commits
- Create GitHub release
- Output upload URL for artifacts
```

#### Build and Upload Artifacts
```yaml
- Update version numbers in code
- Build release artifacts
- Generate checksums
- Upload to GitHub release
```

**Total Duration**: ~20-35 minutes for all platforms

## Secrets Configuration

### Required Secrets

Configure these secrets in GitHub repository settings (`Settings → Secrets and variables → Actions`):

#### Android TV App Signing
```
ANDROID_KEYSTORE_BASE64      # Base64-encoded keystore file
ANDROID_KEYSTORE_PASSWORD    # Keystore password
ANDROID_KEY_ALIAS            # Key alias (e.g., "tvboxplayer")
ANDROID_KEY_PASSWORD         # Key password
```

#### Mobile Android App Signing
```
MOBILE_ANDROID_KEYSTORE_BASE64    # Base64-encoded keystore file
MOBILE_ANDROID_KEYSTORE_PASSWORD  # Keystore password
MOBILE_ANDROID_KEY_ALIAS          # Key alias (e.g., "mobileapp")
MOBILE_ANDROID_KEY_PASSWORD       # Key password
```

#### iOS App Signing (optional)
```
IOS_CERTIFICATE_BASE64              # Base64-encoded .p12 certificate
IOS_CERTIFICATE_PASSWORD            # Certificate password
IOS_PROVISIONING_PROFILE_BASE64     # Base64-encoded provisioning profile
```

### Generating Secrets

#### Android Keystore

1. **Generate keystore**:
   ```bash
   keytool -genkey -v -keystore release.keystore \
     -alias tvboxplayer \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000
   ```

2. **Encode to base64**:
   ```bash
   cat release.keystore | base64 > release.keystore.base64
   ```

3. **Add to GitHub Secrets**:
   - Copy contents of `release.keystore.base64`
   - Add as `ANDROID_KEYSTORE_BASE64`

#### iOS Certificate

1. **Export certificate from Keychain**:
   - Open Keychain Access
   - Find your distribution certificate
   - Right-click → Export
   - Choose `.p12` format
   - Set password

2. **Encode to base64**:
   ```bash
   cat Certificate.p12 | base64 > Certificate.p12.base64
   ```

3. **Add to GitHub Secrets**:
   - Copy contents of `Certificate.p12.base64`
   - Add as `IOS_CERTIFICATE_BASE64`

#### Provisioning Profile

1. **Download from Apple Developer**:
   - Go to Certificates, Identifiers & Profiles
   - Download provisioning profile

2. **Encode to base64**:
   ```bash
   cat Profile.mobileprovision | base64 > Profile.mobileprovision.base64
   ```

3. **Add to GitHub Secrets**:
   - Copy contents
   - Add as `IOS_PROVISIONING_PROFILE_BASE64`

### Security Best Practices

✅ **DO**:
- Store all credentials as GitHub Secrets
- Use separate keystores for different apps
- Back up keystores securely offline
- Rotate secrets periodically
- Use short-lived tokens when possible

❌ **DON'T**:
- Commit secrets to repository
- Share secrets via unencrypted channels
- Reuse passwords across services
- Store secrets in code or config files

## Branch Strategy

### Branch Model

```
main (protected)
  ├── develop (integration)
  ├── feature/* (feature branches)
  ├── bugfix/* (bug fixes)
  ├── hotfix/* (production hotfixes)
  └── release/* (release preparation)
```

### Branch Protections

**main branch**:
- Require pull request reviews (1+)
- Require status checks to pass
- Require branches to be up to date
- Include administrators
- Restrict force pushes

**develop branch**:
- Require pull request reviews (1)
- Require status checks to pass
- Allow force pushes (with lease)

### Workflow Triggers by Branch

| Workflow | main | develop | feature/* | PR |
|----------|------|---------|-----------|-----|
| Android TV Build | ✅ Full | ✅ Tests | ❌ | ✅ Tests |
| Mobile Android | ✅ Full | ✅ Tests | ❌ | ✅ Tests |
| Mobile iOS | ✅ Full | ✅ Tests | ❌ | ✅ Tests |
| Code Quality | ✅ | ✅ | ❌ | ✅ |
| Release | ✅ (tags) | ❌ | ❌ | ❌ |

### Git Flow

1. **Feature Development**:
   ```bash
   git checkout develop
   git checkout -b feature/new-feature
   # Make changes
   git commit -am "Add new feature"
   git push origin feature/new-feature
   # Create PR to develop
   ```

2. **Bug Fix**:
   ```bash
   git checkout develop
   git checkout -b bugfix/fix-issue
   # Fix bug
   git commit -am "Fix issue"
   git push origin bugfix/fix-issue
   # Create PR to develop
   ```

3. **Release Preparation**:
   ```bash
   git checkout develop
   git checkout -b release/1.1.0
   # Update versions, changelog
   git commit -am "Prepare release 1.1.0"
   # Create PR to main
   # After merge:
   git tag -a v1.1.0 -m "Version 1.1.0"
   git push origin v1.1.0
   ```

4. **Hotfix**:
   ```bash
   git checkout main
   git checkout -b hotfix/1.0.1
   # Fix critical bug
   git commit -am "Hotfix critical issue"
   # Create PR to main
   # After merge, tag and merge back to develop
   ```

## Build Artifacts

### Artifact Retention

- **Pull Requests**: 7 days
- **Branch builds**: 30 days
- **Release builds**: 90 days
- **GitHub Releases**: Permanent

### Artifact Types

#### Android TV App
- `app-debug.apk` - Debug build for testing
- `app-release.apk` - Signed release APK
- `app-release.apk.sha256` - Checksum for verification
- `lint-results` - Lint analysis reports
- `test-results` - Unit test results

#### Mobile Android App
- `android-debug-apk` - Debug APK
- `android-release` - Release APK and AAB with checksums
- `coverage-report` - Test coverage HTML report
- `android-quality-reports` - ESLint and audit reports

#### Mobile iOS App
- `ios-build-logs` - Xcode build logs
- `ios-release-ipa` - Signed IPA (if certificates configured)

### Downloading Artifacts

**From GitHub Actions**:
1. Go to Actions tab
2. Select workflow run
3. Scroll to "Artifacts" section
4. Click to download

**From GitHub Releases**:
1. Go to Releases page
2. Select version
3. Download assets

**Using GitHub CLI**:
```bash
# List releases
gh release list

# Download release assets
gh release download v1.0.0

# List workflow runs
gh run list --workflow=android-tv-build.yml

# Download artifacts from run
gh run download <run-id>
```

## Monitoring and Notifications

### Status Badges

Add to README.md:

```markdown
![Android TV Build](https://github.com/username/tvbox-player/workflows/Android%20TV%20Build/badge.svg)
![Mobile Android Build](https://github.com/username/tvbox-player/workflows/Mobile%20Android%20Build/badge.svg)
![Mobile iOS Build](https://github.com/username/tvbox-player/workflows/Mobile%20iOS%20Build/badge.svg)
![Code Quality](https://github.com/username/tvbox-player/workflows/Code%20Quality/badge.svg)
```

### Notifications

Configure in repository settings:

**Email Notifications**:
- Enabled by default for your GitHub email
- Configure in Settings → Notifications

**Slack Integration**:
```yaml
# Add to workflow
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Build failed: ${{ github.workflow }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Gradle build fails with memory error
```
Error: Java heap space
```

**Solution**: Increase heap size in workflow:
```yaml
- name: Build with Gradle
  env:
    GRADLE_OPTS: "-Xmx4g"
  run: ./gradlew assembleRelease
```

---

**Issue**: Node modules installation fails
```
Error: EACCES: permission denied
```

**Solution**: Use `npm ci` instead of `npm install`:
```yaml
- name: Install dependencies
  run: npm ci
```

---

**Issue**: iOS build fails with provisioning error
```
Error: No matching provisioning profiles found
```

**Solution**: 
1. Verify certificate and profile secrets are correctly set
2. Check certificate expiration
3. Ensure bundle ID matches profile

#### Signing Issues

**Issue**: Keystore decode fails
```
Error: illegal base64 character
```

**Solution**: Ensure base64 encoding is clean:
```bash
# Correct way (no line breaks)
cat keystore | base64 -w 0 > keystore.base64

# Or on macOS
cat keystore | base64 > keystore.base64
```

---

**Issue**: Signing configuration not found
```
Error: Keystore file not found
```

**Solution**: Check secret name matches workflow:
- Workflow uses: `ANDROID_KEYSTORE_BASE64`
- Secret must have exact same name

#### Workflow Syntax

**Issue**: Workflow doesn't trigger
```
Workflow not running on push
```

**Solution**: Check path filters:
```yaml
on:
  push:
    paths:
      - 'android-tv-app/**'  # Must match exactly
```

---

**Issue**: Job dependencies fail
```
Job skipped due to unmet dependency
```

**Solution**: Check job dependencies:
```yaml
jobs:
  build:
    needs: [test]  # Ensure 'test' job exists and passes
```

### Debug Tips

**Enable debug logging**:
```bash
# Set repository secret
ACTIONS_STEP_DEBUG = true
ACTIONS_RUNNER_DEBUG = true
```

**View raw logs**:
- Click on any step in workflow run
- Click "View raw logs" icon

**Re-run failed jobs**:
- Click "Re-run jobs" → "Re-run failed jobs"

**Manual workflow trigger**:
```bash
gh workflow run android-tv-build.yml
```

## Performance Optimization

### Caching

**Gradle Cache**:
```yaml
- uses: actions/setup-java@v4
  with:
    cache: 'gradle'  # Automatic caching
```

**npm Cache**:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
    cache-dependency-path: mobile-app/package-lock.json
```

**CocoaPods Cache**:
```yaml
- name: Cache CocoaPods
  uses: actions/cache@v3
  with:
    path: mobile-app/ios/Pods
    key: ${{ runner.os }}-pods-${{ hashFiles('**/Podfile.lock') }}
```

### Build Matrix (Future Enhancement)

Run builds in parallel for different configurations:

```yaml
strategy:
  matrix:
    api-level: [23, 29, 33]
    arch: [x86, x86_64]
```

### Resource Limits

**Free tier limits** (GitHub Actions):
- 2,000 minutes/month for private repos
- Unlimited for public repos
- Linux: 1x multiplier
- macOS: 10x multiplier
- Windows: 2x multiplier

**Optimization tips**:
- Use Linux runners when possible
- Run iOS builds only when necessary
- Use path filters to skip unnecessary builds
- Cache dependencies aggressively

## CI/CD Best Practices

✅ **DO**:
- Keep workflows simple and focused
- Use reusable workflows for common tasks
- Cache dependencies
- Run tests before builds
- Use semantic versioning
- Generate changelogs automatically
- Monitor build times and optimize

❌ **DON'T**:
- Store secrets in code
- Skip tests to save time
- Use outdated dependencies
- Ignore failing tests
- Deploy without review
- Over-complicate workflows

## Maintenance

### Regular Tasks

**Weekly**:
- Review failed builds
- Update dependencies
- Check disk usage

**Monthly**:
- Review workflow efficiency
- Update action versions
- Clean old artifacts
- Review secrets rotation

**Quarterly**:
- Update base images
- Review and optimize workflows
- Update documentation
- Audit security

### Updating Workflows

1. **Test changes locally**:
   ```bash
   # Use act to test GitHub Actions locally
   act -j build-debug
   ```

2. **Test in feature branch**:
   - Create PR with workflow changes
   - Verify workflows run correctly

3. **Document changes**:
   - Update this documentation
   - Add comments in workflow files

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Android Build Documentation](https://developer.android.com/studio/build)
- [React Native CI/CD](https://reactnative.dev/docs/running-on-device)
- [Fastlane Documentation](https://docs.fastlane.tools/)

---

**Last Updated**: 2024-01-18
**Version**: 1.0.0
