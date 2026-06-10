import { create } from 'zustand';
import client from '../api/client';

// Central store that manages all API data with dependency-based invalidation
// When tasks change → analytics + habits are stale
// When anything changes → dependent stores auto-refresh on next access

function createApiStore(endpoint, dependents = []) {
  return create((set, get) => ({
    data: null,
    loading: false,
    stale: true,

    fetch: async () => {
      const { stale, loading } = get();
      if (!stale || loading) return;
      set({ loading: true });
      try {
        const { data } = await client.get(endpoint);
        const result = data.results !== undefined ? data.results : data;
        set({ data: result, loading: false, stale: false });
      } catch {
        set({ loading: false });
      }
    },

    invalidate: () => {
      set({ stale: true });
      // Invalidate all dependent stores
      dependents.forEach(dep => dep.getState().invalidate());
    },

    reset: () => set({ data: null, loading: false, stale: true }),
  }));
}

// Analytics depends on nothing (leaf node) — flatten nested response
export const useAnalyticsStore = create((set, get) => ({
  data: null,
  loading: false,
  stale: true,

  fetch: async () => {
    const { stale, loading } = get();
    if (!stale || loading) return;
    set({ loading: true });
    try {
      const { data } = await client.get('/analytics/');
      const stats = data.stats || {};
      const result = {
        tasks_completed: stats.tasks_completed || 0,
        focus_time: Math.round((stats.focus_time_minutes || 0) / 60 * 10) / 10,
        productivity_score: stats.productivity_score || 0,
        discipline_score: stats.discipline_score || 0,
        streak: stats.streak || 0,
        weekly: data.weekly_trend || [],
        weekly_trend: data.weekly_trend || [],
        task_breakdown: data.task_breakdown || {},
        habit_consistency: data.habit_consistency || [],
        daily_xp: data.daily_xp || [],
        streak_history: data.streak_history || [],
      };
      set({ data: result, loading: false, stale: false });
    } catch {
      set({ loading: false });
    }
  },

  invalidate: () => set({ stale: true }),
  reset: () => set({ data: null, loading: false, stale: true }),
}));

// Habits depends on nothing (leaf node)
export const useHabitsStore = createApiStore('/tasks/habits/');

// Achievements depends on nothing (leaf node)
export const useAchievementsStore = createApiStore('/gamification/achievements/');

// Tasks is the root — when tasks change, analytics + habits + achievements refresh
export const useTasksStore = createApiStore('/tasks/today/', [
  useAnalyticsStore,
  useHabitsStore,
  useAchievementsStore,
]);
