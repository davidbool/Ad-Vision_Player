# Firebase Backend Architecture – Ad-Vision Player

> **Status**: MVP implementation  
> **Constraint**: Firebase Spark (free) tier only  
> **Last updated**: 2026-02-21

---

## A. Architecture Overview

### High-Level Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            FIREBASE (Free Tier)                              │
│                                                                              │
│   ┌───────────────┐   ┌───────────────────┐   ┌──────────────────────────┐  │
│   │ Firebase Auth │   │     Firestore      │   │   Firebase Hosting       │  │
│   │  email/pass   │   │  (structured DB)   │   │  (future web dashboard)  │  │
│   │  Google OAuth │   │                    │   │                          │  │
│   └───────┬───────┘   └────────┬──────────┘   └──────────────────────────┘  │
│           │                   │                                              │
└───────────┼───────────────────┼──────────────────────────────────────────────┘
            │ Firebase SDK       │ Firebase SDK
     ┌──────┴──────┐      ┌─────┴───────────────┐
     │             │      │                     │
┌────┴─────┐  ┌────┴────────────────────────────┴──┐
│ Mobile   │  │          Android TV Box            │
│ React    │  │            (Kotlin)                │
│ Native   │  │  • Anonymous Auth on first boot    │
│ App      │  │  • Reads playlists / media from    │
│          │  │    Firestore after pairing         │
│ • Login  │  │  • Listens for pairingRequests     │
│ • Ctrl   │  │    confirmation in real time       │
│ • Manage │  │  • Pushes sync-job progress        │
└──────────┘  └────────────────────────────────────┘
```

### How the Frontend Connects to Firebase

The mobile app (React Native) uses the **Firebase JS SDK v9** (modular):

```
Mobile App
  └── src/services/firebase/
        ├── firebaseConfig.ts   ← initialises Firebase app, exports auth + db
        ├── authService.ts      ← signIn / register / Google / subscribeToAuthState
        └── firestoreService.ts ← typed CRUD wrappers for all collections
```

The Android TV app (Kotlin) will use the **Firebase Android SDK**:
- `firebase-auth-ktx` for anonymous sign-in
- `firebase-firestore-ktx` for real-time listeners

### Authentication Flow

```
Mobile user                          Firebase Auth
─────────────────────────────────────────────────
1. Opens app
2. Redux AUTH_STATE_CHANGED fires ◄── onAuthStateChanged listener (authSaga)
   (null → show LoginScreen)
3. Enters email/password
   or taps "Continue with Google"
4. loginRequest / loginWithGoogle ──► signInWithEmailAndPassword
   dispatched                          / signInWithCredential
5. loginSuccess dispatched         ◄── UserCredential returned
6. Navigation switches to main app
7. User profile created/merged     ──► Firestore users/{uid}
```

### Pairing Flow (TV ↔ Mobile via Firestore)

```
Android TV                    Firestore                    Mobile App
──────────────────────────────────────────────────────────────────────
1. Anonymous sign-in ──────────────────────────────────────────────►
2. Generate PIN, hash it
3. Create pairingRequests/{sessionId} ──────────────────────────────►
   { pinHash, tvDeviceId, status:'pending' }
4. Display PIN on screen + start real-time listener on doc
                                             5. User enters sessionId+PIN
                                             6. Fetch pairingRequests/{sessionId}
                                             7. Verify bcrypt(PIN) == pinHash
                                             8. updateDoc → status:'confirmed', userId
5. onSnapshot fires            ◄────────────────────────────────────
   userId is now set
6. Store userId locally
7. Read users/{userId}/playlists etc.
```

### Security Model

- Every document under `users/{userId}/...` is only accessible to the
  authenticated user with that `uid`.
- `pairingRequests` are writable by any authenticated user (including anonymous)
  for creation, but only a non-anonymous user may confirm them.
- No user can read another user's data.
- Anonymous TV-box sessions have no access to `users/` data until they know the
  `userId` explicitly (supplied via the confirmed pairing doc).

---

## B. Firestore Data Model

### Collections Overview

```
users/{userId}
  ├── (profile document)
  ├── devices/{deviceId}
  ├── media/{mediaId}
  ├── playlists/{playlistId}
  │     └── items/{position}
  ├── syncJobs/{jobId}
  └── settings/{deviceId}

pairingRequests/{sessionId}
```

### Example Documents

#### `users/{userId}` – User profile
```json
{
  "uid": "Xq9k2mF3...",
  "email": "alice@example.com",
  "displayName": "Alice",
  "createdAt": "2026-02-21T10:00:00Z",
  "lastActiveAt": "2026-02-21T18:30:00Z"
}
```

#### `users/{userId}/devices/{deviceId}` – Paired device
```json
{
  "deviceId": "tv-box-abc123",
  "deviceName": "Living Room TV",
  "deviceType": "tv",
  "platform": "android",
  "isPrimary": true,
  "permissions": ["read", "control", "sync", "admin"],
  "pairedAt": "2026-02-21T10:05:00Z",
  "lastSeenAt": "2026-02-21T18:00:00Z"
}
```

#### `users/{userId}/media/{mediaId}` – Media item
```json
{
  "mediaId": "media-xyz789",
  "filename": "holiday_photo.jpg",
  "mediaType": "image",
  "mimeType": "image/jpeg",
  "sizeBytes": 2097152,
  "durationMs": null,
  "resolution": "3840x2160",
  "cloudProvider": "google_drive",
  "cloudFileId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74",
  "thumbnailUrl": null,
  "addedAt": "2026-02-20T09:00:00Z",
  "syncedAt": "2026-02-20T09:01:00Z",
  "isCached": false
}
```

#### `users/{userId}/playlists/{playlistId}` – Playlist
```json
{
  "playlistId": "pl-001",
  "name": "Morning Slideshow",
  "description": "Photos for the kitchen TV",
  "createdAt": "2026-02-19T08:00:00Z",
  "updatedAt": "2026-02-21T12:00:00Z",
  "itemCount": 12,
  "totalDurationMs": 60000,
  "shuffle": false,
  "repeat": true
}
```

#### `users/{userId}/playlists/{playlistId}/items/000003` – Playlist item
```json
{
  "position": 3,
  "mediaId": "media-xyz789",
  "filename": "holiday_photo.jpg",
  "mediaType": "image",
  "duration": null,
  "thumbnailUrl": null
}
```

#### `users/{userId}/syncJobs/{jobId}` – Sync job
```json
{
  "syncJobId": "job-abc",
  "provider": "google_drive",
  "targetDeviceId": "tv-box-abc123",
  "status": "in_progress",
  "progress": {
    "totalFiles": 50,
    "downloadedFiles": 23,
    "failedFiles": 0,
    "totalBytes": 104857600,
    "downloadedBytes": 48234496,
    "percentComplete": 46
  },
  "createdAt": "2026-02-21T17:00:00Z",
  "startedAt": "2026-02-21T17:00:05Z",
  "completedAt": null
}
```

#### `pairingRequests/{sessionId}` – TV ↔ Mobile pairing
```json
{
  "sessionId": "sess-7f3a",
  "pinHash": "$2b$10$...",
  "tvDeviceId": "tv-box-abc123",
  "deviceName": "Living Room TV",
  "status": "pending",
  "userId": null,
  "createdAt": "2026-02-21T18:00:00Z",
  "expiresAt": "2026-02-21T18:05:00Z"
}
```

---

## C. Authentication Design

### How Users Are Created

| Method | Implementation |
|--------|----------------|
| Email / password | `createUserWithEmailAndPassword` → `registerWithEmail()` |
| Google OAuth | `GoogleSignin.signIn()` + `signInWithCredential()` → `signInWithGoogle()` |

On first registration, `createUserProfile()` writes a Firestore profile doc.

### Session Handling

Firebase handles session persistence automatically.  
`initializeAuth` is configured with `getReactNativePersistence(AsyncStorage)` so
the session survives app restarts.

The `authSaga` starts a long-running `watchAuthState` fork that bridges
`onAuthStateChanged` into Redux via `AUTH_STATE_CHANGED` actions.

### Role-Based Access (MVP)

Roles are stored as a `permissions` array on each `devices/{deviceId}` document:

| Permission | Capability |
|------------|------------|
| `read` | Browse media library and playlists |
| `control` | Send playback commands to TV box |
| `sync` | Trigger Google Drive sync jobs |
| `admin` | Rename/unpair devices, change settings |

At MVP, the mobile app user always gets all four permissions on the TV they pair.

### Required Frontend Changes

| File | Change |
|------|--------|
| `src/services/firebase/firebaseConfig.ts` | ✅ Created – Firebase init |
| `src/services/firebase/authService.ts` | ✅ Created – Auth methods |
| `src/redux/actions/authActions.ts` | ✅ Created – Auth action creators |
| `src/redux/reducers/authReducer.ts` | ✅ Created – Auth state slice |
| `src/sagas/authSaga.ts` | ✅ Created – Async auth operations |
| `src/screens/LoginScreen.tsx` | ✅ Created – Login / register UI |
| `src/navigation/index.tsx` | ✅ Updated – Auth-gated navigation |
| `src/redux/reducers/index.ts` | ✅ Updated – Added auth slice |
| `src/sagas/index.ts` | ✅ Updated – Added authSaga |
| `package.json` | ✅ Updated – Added `firebase`, `@react-native-google-signin` |

---

## D. Security Rules

See [`firestore.rules`](./firestore.rules) at the repository root.

Key points:

1. `users/{userId}/**` – full read/write only for the document's owner (`request.auth.uid == userId`).
2. `pairingRequests/{sessionId}`:
   - Any authenticated user (including anonymous TV) may **create** a pending request.
   - Any authenticated user may **read** (needed for PIN verification polling).
   - Only a non-anonymous user may **update** to `'confirmed'` and only if `userId == request.auth.uid`.
   - `tvDeviceId` and `pinHash` are immutable after creation (enforced in rules).
3. No other paths are accessible.

---

## E. Required Code Changes

### New Files

```
/ (repository root)
├── firebase.json                    ← Firebase CLI project config
├── firestore.rules                  ← Firestore security rules
└── firestore.indexes.json           ← Composite indexes

apps/tvbox-player/mobile-app/
└── src/
    ├── services/
    │   └── firebase/
    │       ├── firebaseConfig.ts    ← App init, exports auth + db
    │       ├── authService.ts       ← Auth operations
    │       ├── firestoreService.ts  ← All Firestore CRUD
    │       └── index.ts             ← Barrel export
    ├── redux/
    │   ├── actions/
    │   │   └── authActions.ts       ← Auth action creators
    │   └── reducers/
    │       └── authReducer.ts       ← Auth slice reducer
    ├── sagas/
    │   └── authSaga.ts              ← Async auth + onAuthStateChanged channel
    └── screens/
        └── LoginScreen.tsx          ← Email/pass + Google login UI
```

### Modified Files

```
apps/tvbox-player/mobile-app/
├── package.json                     ← + firebase, @react-native-google-signin
├── jest.config.js                   ← + firebase/* in transformIgnorePatterns
├── jest.setup.js                    ← + Firebase module mocks
├── src/services/index.ts            ← + firebaseServices export
├── src/redux/actions/index.ts       ← + authActions export
├── src/redux/actions/types.ts       ← AUTH_ACTIONS expanded
├── src/redux/reducers/index.ts      ← + auth slice in combineReducers
├── src/sagas/index.ts               ← + authSaga fork
└── src/navigation/index.tsx         ← Auth-gated routing
```

### Android TV – Required (not yet implemented)

The TV box needs the following additions to adopt Firebase pairing:

```
apps/tvbox-player/android-tv-app/
└── app/build.gradle.kts
    # Add:
    # implementation("com.google.firebase:firebase-auth-ktx:22.3.1")
    # implementation("com.google.firebase:firebase-firestore-ktx:24.10.3")

src/main/java/com/tvboxplayer/
├── firebase/
│   ├── TvFirebaseAuth.kt       ← Anonymous sign-in, token management
│   └── TvFirestoreService.kt   ← createPairingRequest, subscribePairingRequest,
│                                  readPlaylists, readMediaItems
└── ui/pairing/PairingActivity.kt  ← Replace local REST pairing with Firestore
```

---

## F. Implementation Plan

### Step 1 – Firebase Project Setup (manual, one-time)
1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** → Email/Password + Google
3. Enable **Firestore** in production mode
4. Download `google-services.json` and place it in `android/app/`
5. Download `GoogleService-Info.plist` and place it in `ios/`
6. Copy your Firebase config values into `firebaseConfig.ts` (or use env vars)
7. Run `firebase deploy --only firestore:rules,firestore:indexes` to deploy security rules

### Step 2 – Mobile App Dependencies (PR already implements this)
```bash
cd apps/tvbox-player/mobile-app
npm install firebase @react-native-google-signin/google-signin
npx pod-install ios   # iOS only
```

Configure Google Sign-In once in your app entry point:
```typescript
// index.js or App.tsx
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({ webClientId: 'YOUR_WEB_CLIENT_ID' });
```

### Step 3 – Firebase Config Values
Replace `YOUR_*` placeholders in `firebaseConfig.ts` with real project values,
or set these environment variables via `react-native-config`:
```
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
```

### Step 4 – Android TV Firebase Integration
1. Add `google-services.json` to `apps/tvbox-player/android-tv-app/app/`
2. Add Firebase Gradle plugins and dependencies
3. Implement `TvFirebaseAuth.kt` (anonymous sign-in)
4. Implement `TvFirestoreService.kt` (pairing + content reads)
5. Refactor `PairingActivity` to use the Firestore pairing flow instead of the local REST API
6. The local REST API (Ktor stub) can remain for local-network control commands

### Step 5 – Gradual Migration
- Phase 1 (complete): Auth + Firestore data model in mobile app
- Phase 2: Android TV Firebase pairing (replaces PIN REST API)
- Phase 3: Sync-job progress via Firestore real-time listeners (replaces polling)
- Phase 4: Push notifications (FCM – free tier) for sync completion alerts

---

## Suggested Improvements & Refactoring Opportunities

### Current Issues
1. **`ApiServerService.kt` is unimplemented** – the Ktor server is a TODO stub.
   For MVP, replace direct device-to-device REST with Firestore real-time
   sync for content management; keep REST only for low-latency playback control.

2. **Tokens stored in Keychain but never refreshed securely** – the current
   `refreshToken` call hits a local server endpoint. With Firebase Auth, token
   refresh is automatic.

3. **`redux-saga` + `axios` duplication** – the existing sagas call `apiClient`
   which points at a local IP. After Firebase integration, media/playlist sagas
   should call `firestoreService` instead. The local API can be kept only for
   real-time playback commands (low latency requirement).

4. **No login screen** – the app jumps straight into the main UI. Fixed by this PR.

### Scalability Notes
- Firestore free tier: 50K reads / 20K writes / 20K deletes per day.
  For a typical user with ~200 media items and ~10 playlists this is well within
  limits. Watch the `onSnapshot` calls – each active listener counts against read
  quota.
- When you exceed free tier, upgrade to **Blaze** (pay-as-you-go) – the cost
  for a small app remains negligible.
- Cloud Functions are **not required** for this MVP. Add them only when you need
  server-side validation (e.g., PIN hashing on create, deep playlist deletion).

---

## Environment Variables Reference

| Variable | Purpose |
|----------|---------|
| `FIREBASE_API_KEY` | Firebase Web API key |
| `FIREBASE_AUTH_DOMAIN` | Auth OAuth redirect domain |
| `FIREBASE_PROJECT_ID` | Firestore project identifier |
| `FIREBASE_STORAGE_BUCKET` | Storage bucket name (future use) |
| `FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID (future push notifications) |
| `FIREBASE_APP_ID` | Firebase App identifier |
| `GOOGLE_SIGNIN_WEB_CLIENT_ID` | Web client ID for Google Sign-In |
