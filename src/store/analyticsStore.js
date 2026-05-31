import { create } from 'zustand';
import client from '../api/client';

const useAnalyticsStore = create((set, get) => ({
  data: null,
  loading: false,
  stale: true,

  fetch: async () => {
    const { stale, loading } = get();
    if (!stale || loading) return;

    set({ loading: true });
    try {
      const { data } = await client.get('/analytics/');
      set({ data, loading: false, stale: false });
    } catch {
      set({ loading: false });
    }
  },

  invalidate: () => set({ stale: true }),
}));

export default useAnalyticsStore;
