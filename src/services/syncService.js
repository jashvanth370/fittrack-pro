import { flushOfflineQueue } from '../db/indexedDB';

export const initBackgroundSync = () => {
  window.addEventListener('online', async () => {
    console.log('[SyncService] Back online — flushing queue…');
    try {
      const items = await flushOfflineQueue();
      if (items.length > 0) {
        console.log(`[SyncService] Synced ${items.length} offline actions.`);
      }
    } catch (err) {
      console.error('[SyncService] Sync failed:', err);
    }
  });
};

export const isOnline = () => navigator.onLine;
