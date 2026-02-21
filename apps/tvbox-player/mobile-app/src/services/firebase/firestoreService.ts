import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Device, MediaItem, Playlist, SyncJob, Settings } from '../../utils/types';

// ─────────────────────────────────────────────────────────────────────────────
// Path helpers
// ─────────────────────────────────────────────────────────────────────────────

const userRef = (uid: string) => doc(db, 'users', uid);
const devicesCol = (uid: string) => collection(db, 'users', uid, 'devices');
const deviceRef = (uid: string, deviceId: string) =>
  doc(db, 'users', uid, 'devices', deviceId);
const mediaCol = (uid: string) => collection(db, 'users', uid, 'media');
const mediaRef = (uid: string, mediaId: string) =>
  doc(db, 'users', uid, 'media', mediaId);
const playlistsCol = (uid: string) => collection(db, 'users', uid, 'playlists');
const playlistRef = (uid: string, playlistId: string) =>
  doc(db, 'users', uid, 'playlists', playlistId);
const playlistItemsCol = (uid: string, playlistId: string) =>
  collection(db, 'users', uid, 'playlists', playlistId, 'items');
const syncJobsCol = (uid: string) => collection(db, 'users', uid, 'syncJobs');
const syncJobRef = (uid: string, jobId: string) =>
  doc(db, 'users', uid, 'syncJobs', jobId);
const settingsRef = (uid: string, deviceId: string) =>
  doc(db, 'users', uid, 'settings', deviceId);
const pairingRequestRef = (sessionId: string) =>
  doc(db, 'pairingRequests', sessionId);

// ─────────────────────────────────────────────────────────────────────────────
// User profile
// ─────────────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: unknown;
  lastActiveAt: unknown;
}

/**
 * Create or merge a user profile document on first sign-in.
 */
export async function createUserProfile(
  uid: string,
  email: string | null,
  displayName: string | null
): Promise<void> {
  await setDoc(
    userRef(uid),
    {
      uid,
      email,
      displayName,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Fetch the user profile document.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap: DocumentSnapshot = await getDoc(userRef(uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Devices
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Persist a paired device under the user's devices subcollection.
 */
export async function saveDevice(uid: string, device: Device): Promise<void> {
  await setDoc(deviceRef(uid, device.deviceId), {
    ...device,
    pairedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
  });
}

/**
 * Fetch all devices paired to the user.
 */
export async function getDevices(uid: string): Promise<Device[]> {
  const snap: QuerySnapshot = await getDocs(devicesCol(uid));
  return snap.docs.map(d => d.data() as Device);
}

/**
 * Remove a paired device.
 */
export async function removeDevice(uid: string, deviceId: string): Promise<void> {
  await deleteDoc(deviceRef(uid, deviceId));
}

/**
 * Update last-seen timestamp for a device.
 */
export async function touchDevice(uid: string, deviceId: string): Promise<void> {
  await updateDoc(deviceRef(uid, deviceId), { lastSeenAt: serverTimestamp() });
}

// ─────────────────────────────────────────────────────────────────────────────
// Media
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add or update a media item in the user's media library.
 */
export async function saveMediaItem(
  uid: string,
  item: MediaItem
): Promise<void> {
  await setDoc(mediaRef(uid, item.mediaId), {
    ...item,
    addedAt: serverTimestamp(),
    syncedAt: serverTimestamp(),
  });
}

/**
 * Fetch all media items, optionally filtered by type and sorted.
 */
export async function getMedia(
  uid: string,
  mediaType?: string,
  sortField: 'filename' | 'addedAt' = 'addedAt',
  sortDir: 'asc' | 'desc' = 'desc',
  pageLimit = 50
): Promise<MediaItem[]> {
  const direction = sortDir;
  const constraints = mediaType
    ? [where('mediaType', '==', mediaType), orderBy(sortField, direction), limit(pageLimit)]
    : [orderBy(sortField, direction), limit(pageLimit)];
  const q = query(mediaCol(uid), ...constraints);
  const snap: QuerySnapshot = await getDocs(q);
  return snap.docs.map(d => d.data() as MediaItem);
}

/**
 * Delete a media item from the library.
 */
export async function deleteMediaItem(uid: string, mediaId: string): Promise<void> {
  await deleteDoc(mediaRef(uid, mediaId));
}

// ─────────────────────────────────────────────────────────────────────────────
// Playlists
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new playlist document; returns the generated document ID.
 */
export async function createPlaylist(
  uid: string,
  playlist: Omit<Playlist, 'playlistId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(playlistsCol(uid), {
    ...playlist,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // Write the generated id back into the document.
  await updateDoc(ref, { playlistId: ref.id });
  return ref.id;
}

/**
 * Fetch all playlists for the user.
 */
export async function getPlaylists(uid: string): Promise<Playlist[]> {
  const snap: QuerySnapshot = await getDocs(
    query(playlistsCol(uid), orderBy('updatedAt', 'desc'))
  );
  return snap.docs.map(d => d.data() as Playlist);
}

/**
 * Update mutable playlist fields.
 */
export async function updatePlaylist(
  uid: string,
  playlistId: string,
  updates: Partial<Omit<Playlist, 'playlistId' | 'createdAt'>>
): Promise<void> {
  await updateDoc(playlistRef(uid, playlistId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a playlist and all its items.
 *
 * Note: Firestore does not auto-delete subcollections – for an MVP this is
 * acceptable. A Cloud Function can handle deep deletion in production.
 */
export async function deletePlaylist(uid: string, playlistId: string): Promise<void> {
  await deleteDoc(playlistRef(uid, playlistId));
}

/**
 * Overwrite the ordered item list for a playlist.
 * Each item document is keyed by its numeric position (zero-padded for ordering).
 *
 * Limitation (MVP): This function only writes new items; it does not delete
 * documents for positions that no longer exist. Call this function with the
 * *complete* item list each time to avoid orphaned documents.  A Cloud Function
 * can handle deep deletion in a future iteration.
 */
export async function setPlaylistItems(
  uid: string,
  playlistId: string,
  items: Array<{ mediaId: string; filename: string; mediaType: string; duration?: number; thumbnailUrl?: string }>
): Promise<void> {
  const col = playlistItemsCol(uid, playlistId);
  await Promise.all(
    items.map((item, idx) =>
      setDoc(doc(col, String(idx).padStart(6, '0')), { ...item, position: idx })
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sync jobs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new sync job and return its document ID.
 */
export async function createSyncJob(
  uid: string,
  provider: string,
  targetDeviceId: string
): Promise<string> {
  const ref = await addDoc(syncJobsCol(uid), {
    provider,
    targetDeviceId,
    status: 'pending',
    progress: {
      totalFiles: 0,
      downloadedFiles: 0,
      failedFiles: 0,
      totalBytes: 0,
      downloadedBytes: 0,
      percentComplete: 0,
    },
    createdAt: serverTimestamp(),
    startedAt: null,
    completedAt: null,
  });
  await updateDoc(ref, { syncJobId: ref.id });
  return ref.id;
}

/**
 * Subscribe to real-time sync job updates.
 * Returns an unsubscribe function.
 */
export function subscribeSyncJob(
  uid: string,
  jobId: string,
  onUpdate: (job: SyncJob) => void
): Unsubscribe {
  return onSnapshot(syncJobRef(uid, jobId), snap => {
    if (snap.exists()) {
      onUpdate(snap.data() as SyncJob);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Persist device-specific settings.
 */
export async function saveSettings(
  uid: string,
  deviceId: string,
  settings: Settings
): Promise<void> {
  await setDoc(settingsRef(uid, deviceId), settings, { merge: true });
}

/**
 * Fetch device-specific settings.
 */
export async function fetchSettings(
  uid: string,
  deviceId: string
): Promise<Settings | null> {
  const snap: DocumentSnapshot = await getDoc(settingsRef(uid, deviceId));
  return snap.exists() ? (snap.data() as Settings) : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Device pairing (TV box ↔ mobile)
// ─────────────────────────────────────────────────────────────────────────────

export interface PairingRequestDoc {
  sessionId: string;
  pinHash: string;
  tvDeviceId: string;
  deviceName: string;
  status: 'pending' | 'confirmed' | 'expired';
  userId: string | null;
  createdAt: unknown;
  expiresAt: unknown;
}

/**
 * Write a new pairing request created by the TV box.
 * The TV box calls this after generating a PIN.
 */
export async function createPairingRequest(
  sessionId: string,
  tvDeviceId: string,
  deviceName: string,
  pinHash: string,
  expiresAt: Date
): Promise<void> {
  await setDoc(pairingRequestRef(sessionId), {
    sessionId,
    pinHash,
    tvDeviceId,
    deviceName,
    status: 'pending',
    userId: null,
    createdAt: serverTimestamp(),
    expiresAt,
  });
}

/**
 * Confirm a pairing request from the mobile app side.
 * The mobile user supplies the sessionId and the plain PIN; the caller is
 * responsible for hashing the PIN before comparison.
 */
export async function confirmPairingRequest(
  sessionId: string,
  userId: string
): Promise<void> {
  await updateDoc(pairingRequestRef(sessionId), {
    status: 'confirmed',
    userId,
  });
}

/**
 * Fetch a pairing request by its session ID.
 */
export async function getPairingRequest(
  sessionId: string
): Promise<PairingRequestDoc | null> {
  const snap: DocumentSnapshot = await getDoc(pairingRequestRef(sessionId));
  return snap.exists() ? (snap.data() as PairingRequestDoc) : null;
}

/**
 * Subscribe to real-time updates on a pairing request.
 * The TV box calls this to know when the user has confirmed pairing.
 * Returns an unsubscribe function.
 */
export function subscribePairingRequest(
  sessionId: string,
  onUpdate: (request: PairingRequestDoc) => void
): Unsubscribe {
  return onSnapshot(pairingRequestRef(sessionId), snap => {
    if (snap.exists()) {
      onUpdate(snap.data() as PairingRequestDoc);
    }
  });
}
