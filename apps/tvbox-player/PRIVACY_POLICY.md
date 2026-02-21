# Privacy Policy - TV Box Player

**Effective Date**: February 18, 2026  
**Last Updated**: February 18, 2026  
**Version**: 1.0

---

## Introduction

Welcome to TV Box Player ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your personal information.

This Privacy Policy applies to:
- TV Box Player application for Android TV Boxes
- TV Box Player mobile application (iOS and Android)
- Related services and websites

By using TV Box Player, you agree to the terms of this Privacy Policy. If you do not agree with this policy, please do not use our services.

---

## Table of Contents

1. [Information We Collect](#information-we-collect)
2. [How We Use Your Information](#how-we-use-your-information)
3. [How We Share Your Information](#how-we-share-your-information)
4. [Cloud Storage Integration](#cloud-storage-integration)
5. [Data Security](#data-security)
6. [Data Retention](#data-retention)
7. [Your Rights and Choices](#your-rights-and-choices)
8. [Children's Privacy](#childrens-privacy)
9. [International Data Transfers](#international-data-transfers)
10. [GDPR Compliance (European Users)](#gdpr-compliance-european-users)
11. [CCPA Compliance (California Residents)](#ccpa-compliance-california-residents)
12. [Changes to This Policy](#changes-to-this-policy)
13. [Contact Us](#contact-us)

---

## Information We Collect

### 1. Information You Provide

**Device Pairing Information:**
- Device name (customizable)
- Device type (mobile, TV box)
- Platform information (iOS, Android version)

**Account Information (Optional):**
- Email address (if you create an account)
- Username (if you create an account)

**Content Preferences:**
- Playlists you create
- Playback preferences
- Favorited content

### 2. Information Automatically Collected

**Device Information:**
- Device model and manufacturer
- Operating system version
- Application version
- Unique device identifiers (for pairing and authentication)
- Screen resolution
- Hardware capabilities

**Usage Information:**
- Features you use
- Playback statistics (duration, frequency)
- App interactions
- Performance metrics
- Crash reports and error logs

**Network Information:**
- IP address (local network only for device discovery)
- Network type (WiFi, Ethernet)
- Connection quality metrics

**Log Information:**
- Access logs
- Error logs (no personal information)
- Performance logs

### 3. Information from Third-Party Services

**Cloud Storage Providers:**
When you connect cloud storage (e.g., Google Drive), we receive:
- File and folder names
- File metadata (size, type, creation date)
- Access tokens (encrypted and stored securely)

We **DO NOT** collect:
- The content of your files
- Your cloud storage password
- Information about files you don't choose to sync

---

## How We Use Your Information

### Primary Uses

1. **Service Delivery:**
   - Enable device pairing
   - Synchronize content from cloud storage
   - Stream media to your TV Box
   - Manage playlists and playback

2. **Service Improvement:**
   - Analyze usage patterns to improve features
   - Identify and fix bugs
   - Optimize performance
   - Develop new features

3. **Communication:**
   - Send service notifications
   - Provide customer support
   - Send security alerts
   - Inform about important updates

4. **Security and Fraud Prevention:**
   - Authenticate users and devices
   - Detect and prevent unauthorized access
   - Monitor for suspicious activity
   - Comply with legal obligations

### Data Processing Legal Basis (GDPR)

We process your data based on:
- **Consent**: When you explicitly agree to data collection
- **Contract**: To provide the services you request
- **Legitimate Interest**: For service improvement and security
- **Legal Obligation**: To comply with applicable laws

---

## How We Share Your Information

### We DO Share Information With:

1. **Cloud Storage Providers:**
   - Google Drive (when you authorize the connection)
   - Only to access files you choose to sync

2. **Service Providers:**
   - Analytics services (anonymized data)
   - Crash reporting services (no personal identifiers)
   - Cloud infrastructure providers (encrypted data)

3. **Legal Requirements:**
   - When required by law or legal process
   - To protect our rights or property
   - In response to valid government requests
   - To prevent fraud or security threats

### We DO NOT:

- ❌ Sell your personal information to third parties
- ❌ Share your information for marketing purposes
- ❌ Provide your data to advertisers
- ❌ Share your media content with anyone
- ❌ Access your cloud storage without your permission

---

## Cloud Storage Integration

### Google Drive Integration

**What We Access:**
- Files and folders you explicitly choose to sync
- File metadata (name, size, type)
- Folder structure for selected directories

**What We DO NOT Access:**
- Files you don't select for syncing
- Your Google Drive password
- Other Google account information
- Emails, contacts, or calendar data

**How We Use Google Drive:**
1. You authenticate via Google's OAuth 2.0 (directly with Google)
2. Google provides us a limited access token
3. We use the token only to download files you select
4. Tokens are encrypted and stored securely on your TV Box
5. You can revoke access at any time via your Google account settings

**Data Storage:**
- Downloaded files are encrypted with AES-256-GCM on your TV Box
- Files remain on your local device only
- We don't upload your files to our servers
- We don't create copies on external servers

### Future Cloud Providers

When we add support for additional cloud providers (Dropbox, OneDrive, etc.):
- Similar privacy protections will apply
- You'll authorize each provider independently
- We'll only access what you explicitly permit
- All data will be encrypted locally

---

## Data Security

### Security Measures

We implement industry-standard security measures to protect your information:

**Encryption:**
- **At Rest**: AES-256-GCM encryption for all cached media
- **In Transit**: TLS 1.3 (minimum TLS 1.2) for all network communication
- **Database**: SQLCipher encryption for local database
- **Credentials**: Stored in Android Keystore / iOS Keychain

**Access Controls:**
- JWT token-based authentication
- Device-specific authentication
- 24-hour session timeout
- Maximum 5 paired devices per TV Box

**Network Security:**
- Certificate pinning for backend communications
- Secure local network discovery (mDNS over TLS)
- No plain-text transmission of sensitive data

**Application Security:**
- Regular security audits
- Penetration testing
- Static code analysis
- Dependency vulnerability scanning

For more details, see our [Security Policy](SECURITY.md).

### Data Breach Response

In the unlikely event of a data breach:
1. We will notify affected users within 72 hours
2. We will report to relevant authorities as required by law
3. We will provide information about the breach and remediation steps
4. We will take immediate action to prevent future breaches

---

## Data Retention

### How Long We Keep Your Data

**Active Users:**
- Device pairing information: Until you unpair the device
- Cached media: According to your cache settings (LRU eviction)
- Usage logs: 90 days
- Crash reports: 30 days

**Inactive Users:**
- If you don't use the app for 12 months, we may delete your data
- You'll receive a notification before deletion

**Account Deletion:**
- When you request account deletion, we delete all your data within 30 days
- Some information may be retained for legal or security purposes (90 days max)
- Backups containing your data will be deleted within 90 days

### Data You Control

You can delete at any time:
- Cached media files
- Playlists
- Playback history
- Paired devices

---

## Your Rights and Choices

### Universal Rights

You have the right to:

1. **Access Your Data:**
   - Request a copy of your personal information
   - Export your playlists and settings
   - View paired devices and permissions

2. **Correct Your Data:**
   - Update device names
   - Modify preferences
   - Correct inaccurate information

3. **Delete Your Data:**
   - Unpair devices
   - Clear cached content
   - Delete playlists
   - Request complete account deletion

4. **Control Data Collection:**
   - Opt out of analytics (via app settings)
   - Disable crash reporting (via app settings)
   - Revoke cloud storage access

5. **Data Portability:**
   - Export your data in JSON format
   - Transfer playlists to another device

### How to Exercise Your Rights

**Via App:**
- Settings → Privacy → [Choose action]

**Via Email:**
- Send request to: privacy@tvboxplayer.com
- Include: Your device ID or registered email
- We'll respond within 30 days

---

## Children's Privacy

TV Box Player is intended for general audiences and not specifically designed for children under 13 (or 16 in the EU).

**We do not:**
- Knowingly collect information from children under 13/16
- Direct marketing to children
- Require children to disclose personal information

**If you believe:**
- A child has provided information to us, contact us immediately
- We will delete such information promptly
- Parents can request access to, deletion of, or stop further collection of their child's information

---

## International Data Transfers

### Data Storage Locations

- **TV Box**: All data stored locally on your device
- **Mobile App**: Minimal data stored locally
- **Backend Services** (if deployed): Hosted in [specify regions]

### Cross-Border Transfers

If you're outside the country where our servers are located:
- Your data may be transferred across borders
- We ensure adequate protection through:
  - Standard Contractual Clauses (SCCs)
  - Adequacy decisions by relevant authorities
  - Your explicit consent

---

## GDPR Compliance (European Users)

If you are located in the European Economic Area (EEA), you have additional rights under GDPR:

### Your GDPR Rights

1. **Right to Access (Article 15):**
   - Receive a copy of your personal data
   - Information about how we process your data

2. **Right to Rectification (Article 16):**
   - Correct inaccurate personal data
   - Complete incomplete data

3. **Right to Erasure (Article 17) - "Right to be Forgotten":**
   - Request deletion of your personal data
   - Exceptions: Legal obligations, legitimate interests

4. **Right to Restriction (Article 18):**
   - Limit how we use your data
   - While we verify accuracy or assess deletion requests

5. **Right to Data Portability (Article 20):**
   - Receive your data in machine-readable format
   - Transfer data to another service

6. **Right to Object (Article 21):**
   - Object to processing based on legitimate interests
   - Object to direct marketing (we don't do this)

7. **Right to Withdraw Consent (Article 7):**
   - Withdraw consent at any time
   - Doesn't affect lawfulness of prior processing

8. **Right to Lodge a Complaint:**
   - Contact your local supervisory authority
   - File a complaint if you believe we violate GDPR

### Legal Basis for Processing

| Data Type | Legal Basis |
|-----------|-------------|
| Device pairing | Contract (service delivery) |
| Usage analytics | Legitimate interest (service improvement) |
| Cloud storage access | Consent (explicit authorization) |
| Security logs | Legitimate interest (security) |
| Email communications | Consent (opt-in) |

### Data Protection Officer

For GDPR-related inquiries:
- **Email**: dpo@tvboxplayer.com
- **Address**: [Your company address]

---

## CCPA Compliance (California Residents)

If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):

### Your CCPA Rights

1. **Right to Know:**
   - Categories of personal information collected
   - Sources of information
   - Business purpose for collection
   - Categories of third parties we share with

2. **Right to Delete:**
   - Request deletion of personal information
   - Exceptions apply (legal requirements, security)

3. **Right to Opt-Out:**
   - We do NOT sell personal information
   - No opt-out needed, as we don't sell data

4. **Right to Non-Discrimination:**
   - We won't discriminate against you for exercising CCPA rights
   - Same service quality regardless of privacy choices

### California Consumer Disclosure

**Personal Information We Collect:**

| Category | Examples | Collected |
|----------|----------|-----------|
| Identifiers | Device ID, IP address | Yes |
| Commercial information | Playlists, preferences | Yes |
| Internet activity | Usage patterns, interactions | Yes |
| Geolocation | General location (from IP) | No |
| Audio/visual | Media you choose to sync | Yes (locally) |
| Professional information | N/A | No |
| Inferences | Content preferences | Yes |

**We DO NOT Sell Personal Information**

TV Box Player does not sell personal information to third parties.

### How to Exercise CCPA Rights

**By Email**: privacy@tvboxplayer.com  
**By Phone**: [Your phone number] (toll-free)  
**By Mail**: [Your mailing address]

We will respond within 45 days (extendable by 45 days with notice).

---

## Changes to This Policy

### Updates

We may update this Privacy Policy to reflect:
- Changes in our practices
- New features or services
- Legal or regulatory requirements
- User feedback

### Notification

When we make material changes:
- We'll update the "Last Updated" date
- We'll notify you via in-app notification
- For significant changes, we may request your consent
- You can review the history at: https://tvboxplayer.com/privacy/history

### Your Continued Use

- Continued use after changes means acceptance
- If you don't agree, please stop using the service

---

## Contact Us

### Privacy Inquiries

**General Privacy Questions:**
- Email: privacy@tvboxplayer.com
- Response time: Within 5 business days

**Data Subject Requests:**
- Email: privacy@tvboxplayer.com
- Subject line: "Data Subject Request"
- Response time: Within 30 days

**Security Concerns:**
- Email: security@tvboxplayer.com
- For security vulnerabilities, see [SECURITY.md](SECURITY.md)

**General Support:**
- Email: support@tvboxplayer.com
- Website: https://tvboxplayer.com/support

### Mailing Address

[Your Company Name]  
[Street Address]  
[City, State, ZIP]  
[Country]

### Data Protection Officer (GDPR)

Email: dpo@tvboxplayer.com  
[DPO Address if different from above]

---

## Additional Resources

- **Security Policy**: [SECURITY.md](SECURITY.md)
- **Terms of Service**: [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md)
- **Cookie Policy**: [Not applicable - we don't use cookies]
- **User Guide**: Available in the app and at https://tvboxplayer.com/guide

---

## Acknowledgment

By using TV Box Player, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.

If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us using the information provided above.

---

**Document Version**: 1.0  
**Effective Date**: February 18, 2026  
**Last Updated**: February 18, 2026  
**Next Review**: August 18, 2026  
**Owner**: Privacy Team

---

## Appendix: Third-Party Services

### Services We Use

| Service | Purpose | Data Shared | Privacy Policy |
|---------|---------|-------------|----------------|
| Google Drive API | Cloud storage access | Files you select | [Google Privacy](https://policies.google.com/privacy) |
| Firebase Crashlytics | Crash reporting | App version, device type, stack trace | [Firebase Privacy](https://firebase.google.com/support/privacy) |
| [Add other services] | [Purpose] | [Data] | [Link] |

### Your Control

You can disable integration with third-party services:
- Settings → Privacy → Third-Party Services
- Each service can be toggled independently
- Disabling may limit functionality

---

Thank you for trusting TV Box Player with your media streaming needs. Your privacy is important to us.
