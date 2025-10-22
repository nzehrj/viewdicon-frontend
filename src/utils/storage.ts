import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { STORAGE_KEYS } from './constants';

interface ViewdiconDB extends DBSchema {
  auth: {
    key: string;
    value: any;
  };
  keys: {
    key: string;
    value: CryptoKeyPair;
  };
  cache: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<ViewdiconDB> | null = null;

/**
 * Initialize IndexedDB
 */
export const initDB = async (): Promise<IDBPDatabase<ViewdiconDB>> => {
  if (db) return db;
  
  db = await openDB<ViewdiconDB>('viewdicon-db', 1, {
    upgrade(database) {
      // Create object stores
      if (!database.objectStoreNames.contains('auth')) {
        database.createObjectStore('auth');
      }
      if (!database.objectStoreNames.contains('keys')) {
        database.createObjectStore('keys');
      }
      if (!database.objectStoreNames.contains('cache')) {
        database.createObjectStore('cache');
      }
    },
  });
  
  return db;
};

/**
 * Store value in IndexedDB
 */
export const setItem = async (key: string, value: any, store: 'auth' | 'keys' | 'cache' = 'auth'): Promise<void> => {
  const database = await initDB();
  await database.put(store, value, key);
};

/**
 * Get value from IndexedDB
 */
export const getItem = async <T = any>(key: string, store: 'auth' | 'keys' | 'cache' = 'auth'): Promise<T | undefined> => {
  const database = await initDB();
  return await database.get(store, key);
};

/**
 * Remove value from IndexedDB
 */
export const removeItem = async (key: string, store: 'auth' | 'keys' | 'cache' = 'auth'): Promise<void> => {
  const database = await initDB();
  await database.delete(store, key);
};

/**
 * Clear all data from a store
 */
export const clearStore = async (store: 'auth' | 'keys' | 'cache'): Promise<void> => {
  const database = await initDB();
  await database.clear(store);
};

/**
 * Clear all data from all stores
 */
export const clearAll = async (): Promise<void> => {
  await clearStore('auth');
  await clearStore('keys');
  await clearStore('cache');
  
  // Also clear localStorage items
  localStorage.removeItem('afro_theme');
  localStorage.removeItem('afro_language');
};

// Convenience methods for common operations
export const storage = {
  // Auth tokens
  setAuthToken: (token: string) => setItem(STORAGE_KEYS.AUTH_TOKEN, token, 'auth'),
  getAuthToken: () => getItem<string>(STORAGE_KEYS.AUTH_TOKEN, 'auth'),
  removeAuthToken: () => removeItem(STORAGE_KEYS.AUTH_TOKEN, 'auth'),
  
  // Refresh token
  setRefreshToken: (token: string) => setItem(STORAGE_KEYS.REFRESH_TOKEN, token, 'auth'),
  getRefreshToken: () => getItem<string>(STORAGE_KEYS.REFRESH_TOKEN, 'auth'),
  removeRefreshToken: () => removeItem(STORAGE_KEYS.REFRESH_TOKEN, 'auth'),
  
  // User data
  setUserData: (data: any) => setItem(STORAGE_KEYS.USER_DATA, data, 'auth'),
  getUserData: () => getItem(STORAGE_KEYS.USER_DATA, 'auth'),
  removeUserData: () => removeItem(STORAGE_KEYS.USER_DATA, 'auth'),
  
  // Device ID
  setDeviceId: (id: string) => setItem(STORAGE_KEYS.DEVICE_ID, id, 'auth'),
  getDeviceId: () => getItem<string>(STORAGE_KEYS.DEVICE_ID, 'auth'),
  
  // DPoP Key
  setDPoPKey: (key: CryptoKeyPair) => setItem(STORAGE_KEYS.DPOP_KEY, key, 'keys'),
  getDPoPKey: () => getItem<CryptoKeyPair>(STORAGE_KEYS.DPOP_KEY, 'keys'),
  removeDPoPKey: () => removeItem(STORAGE_KEYS.DPOP_KEY, 'keys'),
  
  // Language
  setLanguage: (lang: string) => setItem(STORAGE_KEYS.LANGUAGE, lang, 'cache'),
  getLanguage: () => getItem<string>(STORAGE_KEYS.LANGUAGE, 'cache'),
  
  // Theme
  setTheme: (theme: 'light' | 'dark') => setItem(STORAGE_KEYS.THEME, theme, 'cache'),
  getTheme: () => getItem<'light' | 'dark'>(STORAGE_KEYS.THEME, 'cache'),
  
  // Afro ID
  setAfroId: (id: string) => setItem(STORAGE_KEYS.AFRO_ID, id, 'auth'),
  getAfroId: () => getItem<string>(STORAGE_KEYS.AFRO_ID, 'auth'),
  
  // Role Manifest
  setRoleManifest: (manifest: any) => setItem(STORAGE_KEYS.ROLE_MANIFEST, manifest, 'cache'),
  getRoleManifest: () => getItem(STORAGE_KEYS.ROLE_MANIFEST, 'cache'),
  
  // Clear all storage
  clearAll,
};