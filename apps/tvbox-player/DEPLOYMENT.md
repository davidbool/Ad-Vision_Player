# Deployment Guide - TV Box Player

This guide covers deployment strategies, app store submissions, and distribution methods for the TV Box Player applications.

## Table of Contents

- [Overview](#overview)
- [Android TV App Deployment](#android-tv-app-deployment)
- [Mobile App - Google Play Store](#mobile-app---google-play-store)
- [Mobile App - Apple App Store](#mobile-app---apple-app-store)
- [Beta Testing](#beta-testing)
- [Release Process](#release-process)
- [Distribution Channels](#distribution-channels)
- [Rollback Procedures](#rollback-procedures)

## Overview

The TV Box Player consists of three application targets:
1. **Android TV App** - For Android TV Box devices (direct distribution)
2. **Mobile Android App** - For Android phones/tablets (Google Play Store)
3. **Mobile iOS App** - For iPhone/iPad (Apple App Store)

## Android TV App Deployment

### Distribution Methods

#### 1. Direct APK Download (Primary Method)

The Android TV app is distributed as a standalone APK for sideloading.

**Hosting Options**:
- GitHub Releases (recommended)
- Own web server
- Cloud storage (Google Drive, Dropbox)

**Setup GitHub Releases**:

1. **Create a release**:
   ```bash
   # Tag the version
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

2. **Automated via CI/CD**:
   - The release workflow automatically creates releases for version tags
   - APK and checksum files are automatically attached

3. **Manual release**:
   ```bash
   # Build release APK
   ./scripts/build-android-tv.sh release
   
   # Create GitHub release and upload APK
   gh release create v1.0.0 \
     android-tv-app/app/build/outputs/apk/release/app-release.apk \
     android-tv-app/app/build/outputs/apk/release/app-release.apk.sha256 \
     --title "TV Box Player v1.0.0" \
     --notes "Release notes here"
   ```

#### 2. Alternative App Stores

**Amazon Appstore**:
1. Register at [Amazon Developer Console](https://developer.amazon.com/)
2. Create new app submission
3. Upload APK and metadata
4. Submit for review

**APKPure/APKMirror**:
- Submit signed APK to these third-party stores
- Provide app description and screenshots

### Installation Instructions for Users

Create an installation guide for end users:

```markdown
## How to Install TV Box Player

### Prerequisites
- Android TV Box running Android 6.0 or higher
- Allow installation from unknown sources

### Installation Steps

1. **Enable Unknown Sources**:
   - Go to Settings → Security & Restrictions
   - Enable "Unknown sources" or allow your browser/file manager

2. **Download APK**:
   - Visit: https://github.com/yourorg/tvbox-player/releases
   - Download the latest `tvbox-player-androidtv-vX.X.X.apk`

3. **Verify Download** (Optional but recommended):
   - Download the `.sha256` file
   - Run: `sha256sum tvbox-player-androidtv-vX.X.X.apk`
   - Compare with the checksum in the `.sha256` file

4. **Install**:
   - Open file manager on TV Box
   - Navigate to Downloads folder
   - Click on the APK file
   - Click "Install"
   - Click "Open" to launch

### Via ADB (For Advanced Users)

```bash
# Connect to TV Box
adb connect <tv-box-ip>:5555

# Install APK
adb install -r tvbox-player-androidtv-vX.X.X.apk

# Launch app
adb shell am start -n com.tvboxplayer/.MainActivity
```
```

### Update Strategy

**Manual Updates**:
- Users download and install new APK versions
- In-app notification for available updates

**Future: In-App Updates**:
- Implement update checker
- Download and prompt for installation

### Monitoring

Track key metrics:
- Download count (GitHub Analytics)
- Installation success rate
- Crash reports (Firebase Crashlytics)
- User feedback

## Mobile App - Google Play Store

### Prerequisites

1. **Google Play Console Account**:
   - Register at [Google Play Console](https://play.google.com/console)
   - Pay one-time registration fee ($25)

2. **App Signing**:
   - Use Play App Signing (recommended)
   - Google manages your app signing key

### Initial Setup

1. **Create Application**:
   - Go to Google Play Console
   - Click "Create app"
   - Fill in app details:
     - App name: "TV Box Player"
     - Default language
     - App or Game: App
     - Free or Paid: Free

2. **Set up App Content**:
   - Privacy Policy URL (required)
   - App category: Video Players & Editors
   - Target audience: All ages
   - Content rating questionnaire

3. **Store Listing**:
   
   **App Details**:
   - Short description (80 chars max)
   - Full description (4000 chars max)
   - Screenshots (minimum 2)
   - Feature graphic (1024 x 500)
   - App icon (512 x 512)

   **Example Descriptions**:
   ```
   Short: Stream your media from cloud storage to your TV with ease. Pair your phone with your TV Box.
   
   Full:
   TV Box Player is your ultimate media streaming companion. Seamlessly connect your mobile device to your Android TV Box and stream your favorite content from cloud storage directly to your TV.
   
   Features:
   • Easy device pairing with PIN code
   • Google Drive integration
   • Create and manage playlists
   • Remote control functionality
   • Offline caching for smooth playback
   • Support for multiple media formats
   
   Perfect for home entertainment, presentations, and more!
   ```

### Build for Release

1. **Prepare release build**:
   ```bash
   # Build AAB (Android App Bundle)
   ./scripts/build-mobile-android.sh release aab
   ```

2. **Output location**:
   ```
   mobile-app/android/app/build/outputs/bundle/release/app-release.aab
   ```

### Upload to Google Play

#### First Release

1. **Create Release**:
   - Go to Release → Production
   - Click "Create new release"

2. **Upload App Bundle**:
   - Upload `app-release.aab`
   - Set release name (e.g., "1.0.0")

3. **Release Notes**:
   ```
   Version 1.0.0 - Initial Release
   
   • Device pairing with Android TV Box
   • Google Drive integration
   • Playlist creation and management
   • Remote control functionality
   • Content caching for offline playback
   ```

4. **Review and Rollout**:
   - Review all information
   - Click "Review release"
   - Click "Start rollout to Production"

#### Subsequent Releases

1. **Version Update**:
   ```bash
   # Update version
   ./scripts/version.sh set 1.1.0
   
   # Build new AAB
   ./scripts/build-mobile-android.sh release aab
   ```

2. **Create New Release**:
   - Upload new AAB
   - Add release notes
   - Choose rollout percentage (staged rollout)

### Testing Tracks

**Internal Testing**:
- Closed group of testers
- Quick approval (~5 minutes)
- Test new features before production

**Closed Testing (Beta)**:
- Larger group of beta testers
- Can use email list or Google Groups
- Get feedback before wide release

**Open Testing**:
- Anyone can join
- Public testing phase
- Requires Play Store review

### Staged Rollout

Gradually release to users:
1. Start with 20% of users
2. Monitor crash rates and reviews
3. Increase to 50% if stable
4. Full rollout after 2-3 days

Halt rollout if issues detected.

## Mobile App - Apple App Store

### Prerequisites

1. **Apple Developer Account**:
   - Enroll at [Apple Developer Program](https://developer.apple.com/programs/)
   - Annual fee: $99

2. **Certificates and Profiles**:
   - Development Certificate
   - Distribution Certificate
   - App Store Provisioning Profile

### App Store Connect Setup

1. **Create App Record**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - My Apps → "+" → New App
   - Platform: iOS
   - Name: "TV Box Player"
   - Primary Language: English
   - Bundle ID: com.tvboxplayer.mobile
   - SKU: TVBOXPLAYER001

2. **App Information**:
   - Privacy Policy URL (required)
   - Category: Photo & Video
   - Subcategory: optional

3. **Pricing and Availability**:
   - Price: Free
   - Availability: All countries (or selected)

### Prepare iOS Build

1. **Archive the app**:
   ```bash
   ./scripts/build-mobile-ios.sh Release archive
   ```

2. **Create Export Options**:
   
   Create `mobile-app/ExportOptions.plist`:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>method</key>
       <string>app-store</string>
       <key>teamID</key>
       <string>YOUR_TEAM_ID</string>
       <key>uploadSymbols</key>
       <true/>
       <key>compileBitcode</key>
       <true/>
   </dict>
   </plist>
   ```

3. **Export and Upload**:
   ```bash
   cd mobile-app
   
   # Export IPA
   xcodebuild -exportArchive \
     -archivePath build/tvboxplayer.xcarchive \
     -exportPath build/export \
     -exportOptionsPlist ExportOptions.plist
   
   # Upload to App Store Connect
   xcrun altool --upload-app \
     --type ios \
     --file build/export/tvboxplayermobile.ipa \
     --username "your@email.com" \
     --password "app-specific-password"
   ```

   Or use Xcode Organizer:
   - Window → Organizer
   - Select your archive
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow prompts

### App Store Submission

1. **Version Information**:
   - Version number: 1.0.0
   - Copyright: © 2024 Your Company
   - Build: Select uploaded build

2. **App Store Assets**:
   
   **Screenshots** (required for each device size):
   - iPhone 6.7" Display: 1290 x 2796 (3 required)
   - iPhone 6.5" Display: 1284 x 2778
   - iPhone 5.5" Display: 1242 x 2208
   - iPad Pro 12.9" Display: 2048 x 2732
   
   **App Preview Video** (optional):
   - Max 30 seconds
   - Show key features

   **Icon**: 1024 x 1024 (provided in assets)

3. **Description**:
   ```
   TV Box Player - Your Media Streaming Companion
   
   Stream your favorite media from cloud storage directly to your TV. TV Box Player makes it easy to pair your iPhone with your Android TV Box and control your entertainment.
   
   KEY FEATURES:
   
   📱 Easy Pairing
   Connect to your TV Box with a simple 6-digit PIN code. No complicated setup required.
   
   ☁️ Cloud Integration
   Access your media from Google Drive. More cloud providers coming soon.
   
   🎬 Playlist Management
   Create, edit, and organize your media playlists. Your content, your way.
   
   🎮 Remote Control
   Use your iPhone as a powerful remote control for your TV Box.
   
   📦 Smart Caching
   Download content for smooth offline playback. No buffering interruptions.
   
   🎨 Beautiful Interface
   Clean, intuitive design that follows iOS design guidelines.
   
   SUPPORTED FORMATS:
   • Videos: MP4, MKV, AVI, MOV, WEBM
   • Images: JPEG, PNG, GIF, WEBP
   • Audio: MP3, AAC, FLAC, WAV
   • Playlists: M3U, M3U8
   
   REQUIREMENTS:
   • iPhone running iOS 12.0 or later
   • Android TV Box with TV Box Player installed
   • Wi-Fi network (same network for both devices)
   • Cloud storage account (Google Drive)
   
   Perfect for home entertainment, photo slideshows, video presentations, and more!
   ```

4. **Keywords**: 
   ```
   tv box,media player,streaming,cloud storage,remote control,playlist,video player,hdmi,chromecast,dlna
   ```

5. **Support URL**: Your support website
   
6. **Marketing URL** (optional): Your product page

### Review Process

1. **Submit for Review**:
   - Review all information
   - Add review notes if needed
   - Click "Submit for Review"

2. **Review Time**:
   - Typically 24-48 hours
   - Can take up to 1 week

3. **Common Rejection Reasons**:
   - App crashes during review
   - Missing privacy policy
   - Unclear app purpose
   - Incomplete functionality
   - Permission usage not explained

4. **Review Notes** (for reviewer):
   ```
   To test this app:
   1. Install the Android TV Box app (APK provided in notes)
   2. Launch TV Box app - note the PIN code displayed
   3. Launch this iOS app
   4. Enter the PIN code to pair devices
   5. Navigate to "Content" to browse media
   6. Use "Remote" tab to control playback
   
   Test Account:
   Email: reviewer@example.com
   Password: TestPass123
   
   Note: This app requires an Android TV Box to function fully. A demo video showing the pairing process is included.
   ```

### Post-Submission

**Approved**:
- App goes live automatically or on scheduled date
- Submit update to App Store listing if needed

**Rejected**:
- Read rejection reason carefully
- Fix issues
- Respond to reviewer if needed
- Resubmit

## Beta Testing

### Android - Google Play

**Internal Testing**:
1. Go to Release → Testing → Internal testing
2. Create release and upload AAB
3. Add testers by email
4. Testers receive invite link

**Closed Testing**:
1. Create email list or use Google Group
2. Upload AAB to Closed Testing track
3. Share opt-in URL with testers

**Open Testing**:
1. Upload AAB to Open Testing track
2. Anyone can join via Play Store
3. Visible in Play Store with "Early Access" badge

### iOS - TestFlight

1. **Upload Build**:
   ```bash
   # Build and upload as described above
   xcrun altool --upload-app ...
   ```

2. **Internal Testing** (immediate):
   - Up to 100 testers
   - Can use iTunes Connect accounts
   - No review required

3. **External Testing**:
   - Up to 10,000 testers
   - Requires beta app review (~24 hours)
   - Public link available

4. **Invite Testers**:
   - Email invitations
   - Public link sharing
   - TestFlight app required

5. **Collect Feedback**:
   - Crash reports automatic
   - Screenshot feedback
   - Written feedback from testers

## Release Process

### Version Numbering

Follow Semantic Versioning (SemVer):
- **MAJOR**: Breaking changes (2.0.0)
- **MINOR**: New features, backward compatible (1.1.0)
- **PATCH**: Bug fixes (1.0.1)

### Release Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Version numbers updated
- [ ] CHANGELOG.md updated
- [ ] Release notes prepared
- [ ] Builds created and tested
- [ ] Security scan completed
- [ ] APK size verified (< 50MB for Android TV)
- [ ] Signing keys backed up
- [ ] Staging deployment successful
- [ ] Documentation updated

### Release Steps

1. **Prepare Release**:
   ```bash
   # Update version
   ./scripts/version.sh set 1.1.0
   
   # Update CHANGELOG.md
   # Add release notes
   
   # Commit changes
   git add .
   git commit -m "Bump version to 1.1.0"
   
   # Tag release
   git tag -a v1.1.0 -m "Version 1.1.0"
   
   # Push
   git push origin main
   git push origin v1.1.0
   ```

2. **Automated Build**:
   - CI/CD automatically builds and creates GitHub release
   - Artifacts uploaded automatically

3. **Manual Build** (if needed):
   ```bash
   # Build all platforms
   ./scripts/build-android-tv.sh release
   ./scripts/build-mobile-android.sh release aab
   ./scripts/build-mobile-ios.sh Release archive
   ```

4. **Deploy**:
   - Android TV: GitHub release (automatic)
   - Android Mobile: Upload to Play Console
   - iOS Mobile: Upload to App Store Connect

5. **Verify**:
   - Download and test builds
   - Check store listings
   - Monitor crash reports
   - Review user feedback

### Staged Rollout Strategy

**Day 1**: 20% of users
- Monitor crash rate
- Check critical user feedback
- Verify no major issues

**Day 3**: 50% of users
- Continue monitoring
- Address any issues found

**Day 5**: 100% rollout
- Complete rollout if stable
- Announce on social media/blog

## Distribution Channels

### Primary Channels

1. **Android TV App**:
   - GitHub Releases (primary)
   - Website download page

2. **Mobile Android**:
   - Google Play Store (primary)
   - APK download (alternative)

3. **Mobile iOS**:
   - Apple App Store (only option)

### Marketing Assets

Prepare for distribution:
- App icons (various sizes)
- Screenshots (all device sizes)
- Feature graphics
- Video demonstrations
- Press kit
- Social media graphics

## Rollback Procedures

### Android TV App

**Immediate Rollback**:
1. Remove problematic release from GitHub
2. Re-promote previous stable release
3. Notify users via update notification

### Google Play Store

**Rollback Options**:

1. **Halt Rollout**:
   - Go to Production track
   - Click "Halt rollout"
   - Investigate issues

2. **Rollback to Previous Version**:
   - Not directly supported
   - Must upload previous version with higher version code
   - Submit as hotfix

3. **Emergency Fix**:
   ```bash
   # Create hotfix branch
   git checkout -b hotfix/1.1.1 v1.1.0
   
   # Fix critical issue
   # Commit fix
   
   # Update version
   ./scripts/version.sh set 1.1.1
   
   # Build and deploy
   ./scripts/build-mobile-android.sh release aab
   
   # Upload to Play Console as emergency update
   ```

### Apple App Store

**Rollback Process**:

1. **Remove from Sale**:
   - Go to App Store Connect
   - My Apps → Your App
   - Pricing and Availability
   - Remove from sale (temporary)

2. **Submit Previous Version**:
   - Not directly supported
   - Must create new build from previous version
   - Increment build number
   - Submit expedited review (if eligible)

3. **Emergency Update**:
   - Fix critical issue
   - Build new version
   - Request expedited review
   - Note: limited expedited reviews per year

## Monitoring and Analytics

### Key Metrics to Track

**Installation Metrics**:
- Download count
- Install success rate
- Active installations
- Uninstall rate

**Performance Metrics**:
- Crash-free users rate (target: > 99.5%)
- ANR (Application Not Responding) rate (target: < 0.1%)
- App start time
- API latency

**User Engagement**:
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session length
- Feature usage

### Tools

- **Google Play Console**: Android metrics
- **App Store Connect**: iOS metrics
- **Firebase Analytics**: Cross-platform analytics
- **Firebase Crashlytics**: Crash reporting
- **GitHub Analytics**: Download counts

## Support and Maintenance

### Support Channels

- GitHub Issues: Bug reports and feature requests
- Email support: support@yourcompany.com
- Documentation: README and wiki
- FAQ: Common questions

### Update Frequency

- **Patch releases**: As needed for critical bugs
- **Minor releases**: Monthly (new features)
- **Major releases**: Quarterly (major changes)

### Maintenance Windows

- No downtime required for mobile apps
- Coordinate TV Box app updates with mobile releases

## Legal and Compliance

### Required Documents

- [Privacy Policy](PRIVACY_POLICY.md)
- [Terms of Service](TERMS_OF_SERVICE.md)
- [End User License Agreement](EULA.md)

### Store Requirements

- Comply with Google Play Developer Policies
- Follow Apple App Store Review Guidelines
- Respect user privacy (GDPR, CCPA)
- Disclose data collection and usage

## Next Steps

After successful deployment:
1. Monitor app performance and user feedback
2. Plan next release based on roadmap
3. Engage with user community
4. Iterate and improve based on data

## Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Firebase Documentation](https://firebase.google.com/docs)
