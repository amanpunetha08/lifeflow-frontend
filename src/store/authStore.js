import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      login: (user, tokens) => set({ user, tokens }),
      logout: () => set({ user: null, tokens: null }),
      setUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
