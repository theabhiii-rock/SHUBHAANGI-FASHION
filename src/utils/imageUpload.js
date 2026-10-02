/**
 * Client-Side Image & Video Upload Utility
 * - Compresses camera and gallery photos to high-definition Web-ready JPEG
 * - Stores uploaded video files (MP4/MOV/WebM) in browser IndexedDB so full
 *   BTS reels and shoot videos can be uploaded without hitting localStorage limits
 * - Automatically extracts a cover frame thumbnail and duration from uploaded videos
 */

const IDB_NAME = 'shubhaangi_media_vault_v2';
const IDB_STORE = 'videos';
const IDB_VAULT_STORE = 'app_vault';

export function openShubhaangiDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(IDB_NAME, 2);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
      if (!db.objectStoreNames.contains(IDB_VAULT_STORE)) {
        db.createObjectStore(IDB_VAULT_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function openVideoDB() {
  return openShubhaangiDB();
}

/**
 * Saves arbitrary serializable data (products, services) to IndexedDB
 */
export async function saveToVault(key, value) {
  try {
    const db = await openShubhaangiDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_VAULT_STORE, 'readwrite');
      const store = tx.objectStore(IDB_VAULT_STORE);
      store.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IDB Vault write error:', err);
    return false;
  }
}

/**
 * Reads arbitrary serializable data from IndexedDB
 */
export async function getFromVault(key) {
  try {
    const db = await openShubhaangiDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_VAULT_STORE, 'readonly');
      const store = tx.objectStore(IDB_VAULT_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('IDB Vault read error:', err);
    return null;
  }
}

export function compressImageFile(file, maxWidthOrOpts = 900, qualityArg = 0.76) {
  const maxWidth = typeof maxWidthOrOpts === 'object' && maxWidthOrOpts !== null
    ? (maxWidthOrOpts.maxWidth || 900)
    : (Number(maxWidthOrOpts) || 900);
  const quality = typeof maxWidthOrOpts === 'object' && maxWidthOrOpts !== null
    ? (maxWidthOrOpts.quality || 0.76)
    : (Number(qualityArg) || 0.76);

  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to parse image data'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file from device'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts a JPEG poster frame and formatted duration from a video File/Blob
 */
function extractVideoMetadata(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    let resolved = false;
    const finish = (poster = '', durationText = '') => {
      if (resolved) return;
      resolved = true;
      URL.revokeObjectURL(objectUrl);
      resolve({ poster, durationText });
    };

    const timeout = setTimeout(() => finish('', ''), 4000);

    video.onloadedmetadata = () => {
      const secs = Math.round(video.duration || 0);
      const mins = Math.floor(secs / 60);
      const remSecs = secs % 60;
      const durationText = secs > 0 ? `${mins}:${String(remSecs).padStart(2, '0')}s Reel` : 'BTS Video';
      video.currentTime = Math.min(0.8, (video.duration || 1) * 0.25);

      video.onseeked = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          const maxW = 720;
          let w = video.videoWidth || 640;
          let h = video.videoHeight || 360;
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, w, h);
          const poster = canvas.toDataURL('image/jpeg', 0.8);
          finish(poster, durationText);
        } catch {
          finish('', durationText);
        }
      };
    };

    video.onerror = () => {
      clearTimeout(timeout);
      finish('', '');
    };
  });
}

/**
 * Saves an uploaded video File to IndexedDB and returns { videoUrl, poster, durationText }
 */
export async function saveVideoFile(file) {
  if (!file || !file.type.startsWith('video/')) {
    throw new Error('Please select a valid video file (MP4, MOV, WebM)');
  }

  const { poster, durationText } = await extractVideoMetadata(file);
  const key = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const db = await openVideoDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  return {
    videoUrl: `idb://${key}`,
    poster,
    durationText
  };
}

const blobUrlCache = new Map();

/**
 * Resolves a stored video URL (either 'idb://...' or direct 'https://...') into a playable URL
 */
export async function resolvePlayableVideoUrl(videoUrl) {
  if (!videoUrl) return '';
  if (!videoUrl.startsWith('idb://')) return videoUrl;

  if (blobUrlCache.has(videoUrl)) {
    return blobUrlCache.get(videoUrl);
  }

  try {
    const key = videoUrl.replace('idb://', '');
    const db = await openVideoDB();
    const fileOrBlob = await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (!fileOrBlob) return '';
    const objectUrl = URL.createObjectURL(fileOrBlob);
    blobUrlCache.set(videoUrl, objectUrl);
    return objectUrl;
  } catch (err) {
    console.warn('Failed to resolve IndexedDB video:', err);
    return '';
  }
}
