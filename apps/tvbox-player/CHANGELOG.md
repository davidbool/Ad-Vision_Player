# Changelog

All notable changes to the TV Box Player project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- CI/CD pipeline with GitHub Actions
- Build scripts for all platforms
- Comprehensive documentation

## [1.0.0] - TBD

### Added

#### Android TV App
- Device pairing with 6-digit PIN code
- Google Drive integration for content sync
- Playlist creation and management
- Media playback (videos, images, audio)
- Content caching for offline playback
- HDMI output support
- mDNS service discovery
- Local web server for pairing API
- Secure token-based authentication

#### Mobile App
- Cross-platform React Native app (iOS & Android)
- Device discovery and pairing
- Google Drive authentication and file browsing
- Remote control functionality
- Playlist management
- Content synchronization
- Push notifications
- Secure credential storage

#### Infrastructure
- Complete CI/CD pipeline with GitHub Actions
- Automated builds for all platforms
- Code quality checks and linting
- Automated testing
- Release workflow with artifact generation
- Build scripts for local development
- Version management tools
- Comprehensive documentation

### Technical Details
- Android TV: Kotlin, Jetpack Compose, Room, ExoPlayer
- Mobile: React Native, TypeScript, Redux
- Backend: Ktor server on Android TV
- Authentication: JWT tokens, OAuth 2.0
- Storage: Room database, encrypted SharedPreferences

### Requirements
- Android TV Box: Android 6.0+ (API 23+)
- Mobile Android: Android 5.0+ (API 21+)
- Mobile iOS: iOS 12.0+
- Network: Wi-Fi connection required

### Known Limitations
- Single cloud provider (Google Drive only)
- Basic playlist features
- No subtitle support
- No multi-audio track support

---

## Version History

### Version Numbering

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes (e.g., 2.0.0)
- **MINOR** version for new functionality in a backward compatible manner (e.g., 1.1.0)
- **PATCH** version for backward compatible bug fixes (e.g., 1.0.1)

### Release Types

- **Major Release** (X.0.0): Significant new features, breaking changes
- **Minor Release** (1.X.0): New features, backward compatible
- **Patch Release** (1.0.X): Bug fixes, no new features
- **Hotfix** (1.0.X): Critical bug fixes requiring immediate release

---

## Future Roadmap

### Phase 2 - Enhanced Features
- [ ] QR code pairing
- [ ] Bluetooth pairing
- [ ] Multiple cloud providers (Dropbox, OneDrive, S3, WebDAV)
- [ ] Advanced caching strategies
- [ ] Subtitle support
- [ ] Multi-audio track support
- [ ] WebSocket for real-time control
- [ ] Picture-in-Picture mode

### Phase 3 - Premium Features
- [ ] Multi-device synchronization
- [ ] Voice control (Google Assistant)
- [ ] 4K playback optimization
- [ ] Advanced analytics
- [ ] Social features (shared playlists)
- [ ] Chromecast integration
- [ ] DLNA/UPnP support

---

## Maintenance Notes

### Adding New Entries

When adding changes to the changelog:

1. Add entries under `[Unreleased]` section
2. Categorize changes:
   - **Added** for new features
   - **Changed** for changes in existing functionality
   - **Deprecated** for soon-to-be removed features
   - **Removed** for now removed features
   - **Fixed** for any bug fixes
   - **Security** for vulnerability fixes

3. Use clear, concise descriptions
4. Link to issues/PRs when applicable
5. Credit contributors

### Release Process

When releasing a new version:

1. Update version numbers:
   ```bash
   ./scripts/version.sh set X.Y.Z
   ```

2. Move `[Unreleased]` entries to new version section:
   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD
   
   ### Added
   - Feature 1
   - Feature 2
   ```

3. Add comparison links at bottom:
   ```markdown
   [X.Y.Z]: https://github.com/user/repo/compare/vX.Y.Z-1...vX.Y.Z
   ```

4. Commit and tag:
   ```bash
   git add CHANGELOG.md
   git commit -m "Update CHANGELOG for version X.Y.Z"
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push origin main --tags
   ```

---

[Unreleased]: https://github.com/username/tvbox-player/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/username/tvbox-player/releases/tag/v1.0.0
