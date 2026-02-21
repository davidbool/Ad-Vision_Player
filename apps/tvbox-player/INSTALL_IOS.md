# Installation Guide - TV Box Player Mobile App for iPhone

## Overview

This guide will help you install the TV Box Player mobile companion app on your iPhone.

## Important: iOS Installation Methods

⚠️ **Unlike Android, iOS apps cannot be directly sideloaded without one of these methods:**

### Method 1: TestFlight (Recommended - Easiest)
- Requires: Apple ID (free)
- Process: Download TestFlight app, use beta invite link
- Limit: Beta version only
- Status: **Pending setup**

### Method 2: App Store (Not Available Yet)
- Requires: Nothing (when available)
- Process: Download from App Store like any app
- Limit: Must pass Apple review
- Status: **Not yet submitted**

### Method 3: Ad-hoc Distribution (Limited Devices)
- Requires: Device UDID registered
- Process: Install via Apple Configurator or Xcode
- Limit: Up to 100 devices per year
- Status: **Available with setup**

### Method 4: Enterprise Distribution (Not Recommended for PoC)
- Requires: Apple Enterprise Developer Program ($299/year)
- Process: Install via enterprise certificate
- Limit: Intended for company employees only
- Status: **Not applicable for PoC**

## Prerequisites

- **iPhone** running **iOS 12.0 or higher**
- **Apple ID** (free, required for TestFlight)
- **Internet connection**
- **TV Box Player Android TV app** installed on TV box

## Method 1: TestFlight Installation (Recommended)

### Step 1: Download TestFlight

1. Open **App Store** on your iPhone
2. Search for "**TestFlight**"
3. Download and install TestFlight (official Apple app, free)
4. Open TestFlight

### Step 2: Get Beta Invite

**Option A: Via Email**
1. Check your email for TestFlight invitation
2. Click "View in TestFlight" in the email
3. Opens TestFlight app automatically

**Option B: Via Link**
1. Click the beta invite link: `https://testflight.apple.com/join/[CODE]`
2. Opens TestFlight app
3. Accept the invitation

**Option C: Via QR Code**
1. Scan QR code (provided separately)
2. Opens TestFlight app
3. Accept invitation

### Step 3: Install from TestFlight

1. In TestFlight, find **TV Box Player**
2. Tap **Install**
3. Wait for download (may take 1-2 minutes)
4. Tap **Open** or find app on home screen
5. First launch may show "New App Available" notification

### Step 4: Grant Permissions

On first launch, grant permissions:
- [ ] **Local Network** - Required for finding TV boxes
- [ ] **Photos** (Optional) - For accessing media
- [ ] **Notifications** (Optional) - For sync status

### Step 5: Pair with TV Box

1. Launch TV Box Player on your TV Box (get 6-digit PIN)
2. Open mobile app
3. Tap "**Pair New Device**"
4. Enter the 6-digit PIN from TV screen
5. Tap "**Connect**"
6. Wait for confirmation (2-5 seconds)
7. Start using the app!

## Method 2: Ad-hoc Installation (Advanced)

### Prerequisites

- macOS computer with Xcode
- Lightning/USB-C cable
- Device UDID registered in developer portal

### Step 1: Get Your Device UDID

**On iPhone:**
1. Connect iPhone to Mac
2. Open **Finder** (macOS Catalina+) or **iTunes** (older)
3. Select your iPhone
4. Click on Serial Number to cycle to UDID
5. Right-click → Copy UDID

**Alternative Method:**
1. iPhone → Settings → General → About
2. Note the Serial Number area
3. Use online UDID lookup tool

### Step 2: Register Device (Developer Account Required)

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to Certificates, Identifiers & Profiles
3. Click Devices → Register New Device
4. Paste UDID, give device a name
5. Save

### Step 3: Get the IPA File

Contact the project administrator to get:
- `tvbox-player-mobile-vX.X.X.ipa`
- Must be built with ad-hoc provisioning profile including your UDID

### Step 4: Install via Xcode

1. Open **Xcode** on Mac
2. Go to **Window** → **Devices and Simulators**
3. Select your iPhone (must be connected)
4. Click the **"+"** button in Installed Apps section
5. Select the IPA file
6. Wait for installation
7. App appears on iPhone home screen

### Step 5: Trust Developer

1. On iPhone: Settings → General → VPN & Device Management
2. Find developer profile
3. Tap → Trust
4. Confirm trust

## Method 3: Install via Apple Configurator (Alternative)

### Prerequisites

- macOS computer
- Apple Configurator 2 (free from App Store)
- IPA file

### Steps

1. Download **Apple Configurator 2** from Mac App Store
2. Connect iPhone to Mac via cable
3. Open Apple Configurator 2
4. Select your iPhone
5. Click **Add** → **Apps**
6. Select the IPA file
7. Click **Add**
8. App installs automatically

## Verification

### Check Installation

After installation, verify:
- [ ] App icon appears on home screen
- [ ] App launches without crash
- [ ] Pairing screen loads
- [ ] Can enter PIN code
- [ ] Version matches expected (Settings → About)

### Test Functionality

1. **Network Discovery**:
   - App should find TV boxes on local network
   - May take 5-10 seconds

2. **Pairing**:
   - Enter PIN from TV
   - Should connect within 5 seconds
   - Shows connected devices

3. **Basic Controls**:
   - Remote control buttons respond
   - Can navigate menus
   - Settings accessible

## Troubleshooting

### TestFlight Issues

**"Unable to Install"**
- Solution: Check iOS version (need 12.0+)
- Solution: Ensure enough storage space (need 100MB)
- Solution: Restart iPhone and try again

**"Beta is Full"**
- Solution: Current beta is limited to 10,000 testers
- Solution: Contact administrator for priority access
- Solution: Wait for public release

**"Invite Expired"**
- Solution: Request new invite link
- Solution: Links expire after 30 days

### Ad-hoc Installation Issues

**"Unable to Verify App"**
- Solution: Check device UDID is registered
- Solution: Verify provisioning profile includes your device
- Solution: Re-build IPA with updated profile

**"Untrusted Enterprise Developer"**
- Solution: Settings → General → Device Management
- Solution: Tap developer profile → Trust

### App Won't Launch

1. Force quit and relaunch
2. Restart iPhone
3. Check iOS version compatibility
4. Reinstall the app
5. Check crash logs (Settings → Privacy → Analytics)

### Local Network Permission Denied

1. Settings → TV Box Player → Local Network
2. Toggle ON
3. Restart app
4. Try pairing again

### Can't Find TV Box

1. Ensure both devices on same Wi-Fi network
2. Check TV Box app is running
3. Wait 10-15 seconds for discovery
4. Try manual IP entry (if available)
5. Restart Wi-Fi on both devices

## Updating

### TestFlight Updates

- Automatic: Updates notify you in TestFlight
- Manual: Open TestFlight → Check for updates
- Frequency: Weekly during beta (typical)

### Ad-hoc Updates

1. Get new IPA file
2. Uninstall old version
3. Install new version
4. Settings preserved in iCloud (if enabled)

## Uninstallation

### Remove App

1. Long-press app icon
2. Tap "Remove App"
3. Confirm "Delete App"

OR

1. Settings → General → iPhone Storage
2. Find TV Box Player
3. Tap → Delete App

### Remove TestFlight Entry

1. Open TestFlight
2. Find TV Box Player
3. Tap → Stop Testing
4. Confirm

### Remove Developer Trust

1. Settings → General → VPN & Device Management
2. Find developer profile
3. Tap → Delete Profile (if desired)

## System Requirements

### Minimum Requirements

- **iOS Version**: 12.0 or higher
- **Device**: iPhone 6s or newer
- **Storage**: 100MB free space
- **Network**: Wi-Fi (required for pairing)
- **Apple ID**: Required for TestFlight

### Recommended

- **iOS Version**: 14.0 or higher
- **Device**: iPhone 8 or newer
- **Storage**: 500MB for app + cache
- **Network**: Wi-Fi 5GHz for best performance

## Known Limitations (PoC Version)

This Proof of Concept version has:

- ⚠️ **Skeleton Implementation**: Core features under development
- ⚠️ **Limited Error Handling**: May crash in edge cases
- ⚠️ **Basic UI**: Design improvements planned
- ⚠️ **TestFlight Only**: Not on App Store yet
- ✅ **Functional Pairing**: Device pairing works
- ✅ **Safe to Test**: No data collection, secure

## FAQs

**Q: Why can't I just download the IPA?**
A: iOS doesn't allow direct APK-style installation. You need TestFlight, App Store, or enterprise distribution.

**Q: Is TestFlight safe?**
A: Yes, TestFlight is Apple's official beta testing platform. It's completely safe.

**Q: Do I need to pay for Apple Developer?**
A: No, as a tester using TestFlight, you only need a free Apple ID.

**Q: How long is the beta valid?**
A: TestFlight builds expire after 90 days. You'll get updates before expiration.

**Q: Can I use it on iPad?**
A: Yes, if the build includes iPad support (check with administrator).

**Q: Will my data be deleted with updates?**
A: No, TestFlight updates preserve app data (like Android updates).

**Q: What if I don't have a Mac for ad-hoc install?**
A: Use TestFlight method instead (no Mac required).

**Q: Can I install on multiple iPhones?**
A: Yes, with TestFlight. Ad-hoc limited to registered devices only.

**Q: Does it work with iOS 15/16/17?**
A: Yes, tested up to iOS 17. Works on all iOS 12+ versions.

## Support

### Getting Help

- **TestFlight Issues**: Help within TestFlight app
- **App Issues**: GitHub Issues or support email
- **Installation Help**: Check TROUBLESHOOTING.md
- **Feature Requests**: GitHub Discussions

### Providing Feedback

TestFlight users can:
1. Open TestFlight
2. Select TV Box Player
3. Tap "Send Beta Feedback"
4. Describe issue with screenshots

---

**Version**: 0.1.0-poc  
**Last Updated**: 2026-02-20  
**Platform**: iOS 12.0+  
**Distribution**: TestFlight Beta / Ad-hoc
