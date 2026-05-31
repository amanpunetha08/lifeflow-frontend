import { create } from 'zustand';
import client from '../api/client';
import useAnalyticsStore from './analyticsStore';

const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: false,
  stale: true,

  fetch: async () => {
    const { stale, loading } = get();
    if (!stale || loading) return;

    set({ loading: true });
    try {
      const { data } = await client.get('/tasks/today/');
      set({ tasks: data.results || data || [], loading: false, stale: false });
    } catch {
      set({ loading: false });
    }
  },

  // Call this after any task action (complete, add, delete, reset)
  invalidate: () => {
    set({ stale: true });
    useAnalyticsStore.getState().invalidate();
  },
}));

export default useTasksStore;
