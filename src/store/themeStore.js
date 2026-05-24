import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggle: () => set((s) => {
        const next = s.theme === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.toggle('dark', next === 'dark')
        return { theme: next }
      }),
      init: () => set((s) => {
        document.documentElement.classList.toggle('dark', s.theme === 'dark')
        return s
      }),
    }),
    { name: 'lifeflow-theme' }
  )
)
