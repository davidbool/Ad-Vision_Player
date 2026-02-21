# Installation Guide - TV Box Player for Android TV Box

## Overview

This guide will help you install the TV Box Player application on your Android TV Box device.

## Prerequisites

- Android TV Box running **Android 6.0 (Marshmallow) or higher**
- Internet connection
- USB drive or file manager app (for sideloading)

## Download

### Option 1: Direct Download (Recommended)

**Download Link**: [GitHub Releases](https://github.com/alexbol99/tvbox-player/releases/latest)

1. On your Android TV Box, open a web browser
2. Navigate to the releases page
3. Download `tvbox-player-androidtv-vX.X.X.apk` (latest version)

### Option 2: From Computer

1. Visit the releases page on your computer
2. Download the APK file
3. Transfer to TV Box via:
   - USB drive
   - Network file sharing
   - Google Drive / Dropbox

## Installation Steps

### Step 1: Enable Unknown Sources

**For Android TV 8.0 and higher:**

1. Go to **Settings** → **Security & restrictions**
2. Select **Unknown sources**
3. Choose the app you'll use to install (Browser, File Manager, etc.)
4. Toggle to **Allow from this source**

**For Android TV 6.0 - 7.x:**

1. Go to **Settings** → **Security & restrictions**
2. Toggle **Unknown sources** to **ON**
3. Confirm when prompted

### Step 2: Locate the APK File

**If downloaded on TV Box:**
- Open **Downloads** folder in your file manager
- Look for `tvbox-player-androidtv-vX.X.X.apk`

**If transferred from USB:**
- Insert USB drive into TV Box
- Open **File Manager**
- Navigate to USB storage
- Find the APK file

### Step 3: Install the Application

1. Click on the APK file
2. Review the permissions requested:
   - Storage (for caching media)
   - Network (for local device discovery)
   - Wake Lock (to keep screen on during playback)
3. Click **Install**
4. Wait for installation to complete (5-15 seconds)
5. Click **Open** or **Done**

### Step 4: First Launch

1. Find **TV Box Player** in your app drawer
2. Launch the application
3. On first launch, you'll see:
   - Welcome screen
   - Permission requests (grant all for full functionality)
   - Pairing screen with 6-digit PIN code

### Step 5: Pair with Mobile Device

1. Keep the TV Box Player open (showing the PIN code)
2. Install the mobile companion app on your phone
3. Enter the PIN code displayed on your TV
4. Confirm pairing on both devices
5. Start using TV Box Player!

## Verification

### Check Installation Success

After installation, verify:
- [ ] App appears in app drawer
- [ ] App launches without errors
- [ ] Pairing screen displays 6-digit PIN
- [ ] App version matches downloaded version (Settings → About)

### Verify Checksum (Optional but Recommended)

For security, verify the downloaded APK:

1. Download the `.sha256` file alongside the APK
2. On Linux/Mac/Android terminal:
   ```bash
   sha256sum tvbox-player-androidtv-vX.X.X.apk
   ```
3. Compare output with content of `.sha256` file
4. Should match exactly

## Troubleshooting

### Installation Failed

**Error: "App not installed"**
- Solution: Ensure you enabled Unknown Sources
- Solution: Clear previous installation if upgrading

**Error: "Parse error"**
- Solution: Re-download APK (file may be corrupted)
- Solution: Verify checksum matches

**Error: "Incompatible"**
- Solution: Check Android version (need 6.0+)
- Solution: Ensure APK is for Android TV (not mobile version)

### App Won't Open

1. Clear app cache: Settings → Apps → TV Box Player → Clear Cache
2. Restart your TV Box
3. Reinstall the application
4. Check if Android version is supported

### Permissions Not Working

1. Go to Settings → Apps → TV Box Player → Permissions
2. Manually grant all required permissions:
   - Storage
   - Network
3. Restart the app

### Can't Find Pairing Code

1. Ensure app is on the main pairing screen
2. If stuck on splash screen, wait 5-10 seconds
3. If still not showing, restart the app
4. Check logs (Settings → About → View Logs)

## Updating

### Check for Updates

1. Open TV Box Player
2. Go to Settings → About
3. Tap "Check for Updates"
4. If update available, follow download link

### Manual Update

1. Download new APK version
2. Install over existing app (data will be preserved)
3. Confirm update
4. Restart app

### Clean Installation (if update fails)

1. Uninstall current version:
   - Settings → Apps → TV Box Player → Uninstall
2. Install new version following steps above
3. Note: All settings and cached media will be lost

## Uninstallation

To remove TV Box Player:

1. Go to **Settings** → **Apps**
2. Find **TV Box Player**
3. Click **Uninstall**
4. Confirm
5. Clear remaining data:
   - Navigate to internal storage
   - Delete folder: `/Android/data/com.tvboxplayer/`

## Support

### Need Help?

- **Documentation**: Check README.md in repository
- **Issues**: Report at GitHub Issues
- **Email**: support@tvboxplayer.com (if available)

### Known Limitations (PoC Version)

This is a Proof of Concept version with:
- ⚠️ Skeleton implementation (core features in development)
- ⚠️ Limited error handling
- ⚠️ Basic UI (improvements coming)
- ✅ Architecture and pairing functional
- ✅ Safe to install and test

### System Requirements

- **Minimum**: Android 6.0 (API 23)
- **Recommended**: Android 8.0 or higher
- **Storage**: 50MB for app + cache space for media
- **RAM**: 2GB minimum
- **Network**: Wi-Fi or Ethernet for device pairing

## FAQs

**Q: Is this safe to install?**
A: Yes, it's open-source and signed. Verify checksum for security.

**Q: Why "Unknown Sources"?**
A: App is not on Google Play Store (TV box apps are typically sideloaded).

**Q: Will it work on my device?**
A: Works on most Android TV boxes running Android 6.0+. Test and report issues.

**Q: Can I use it without mobile app?**
A: No, mobile app is required for pairing and control.

**Q: Is internet required?**
A: Only for initial cloud sync. Local playback works offline.

**Q: How do I report bugs?**
A: Use GitHub Issues or check CONTRIBUTING.md

---

**Version**: 0.1.0-poc  
**Last Updated**: 2026-02-20  
**Platform**: Android TV (Android 6.0+)
