import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggle: () => set((s) => {
        const next = s.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');
        return { theme: next };
      }),
    }),
    { name: 'lifeflow-theme' }
  )
);

// Initialize on load
const saved = JSON.parse(localStorage.getItem('lifeflow-theme') || '{}');
document.documentElement.classList.toggle('dark', (saved?.state?.theme || 'dark') === 'dark');

export default useThemeStore;
