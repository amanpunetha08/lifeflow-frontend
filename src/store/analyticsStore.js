import { create } from 'zustand';
import client from '../api/client';

const useAnalyticsStore = create((set, get) => ({
  data: null,
  loading: false,
  lastFetched: null,

  fetch: async (force = false) => {
    const { lastFetched, loading } = get();
    // Cache for 30 seconds unless forced
    if (!force && lastFetched && Date.now() - lastFetched < 30000) return;
    if (loading) return;

    set({ loading: true });
    try {
      const { data } = await client.get('/analytics/');
      set({ data, loading: false, lastFetched: Date.now() });
    } catch {
      set({ loading: false });
    }
  },

  invalidate: () => {
    set({ lastFetched: null });
    get().fetch(true);
  },
}));

export default useAnalyticsStore;
