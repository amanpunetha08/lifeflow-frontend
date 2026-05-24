import { HiSun, HiMoon } from 'react-icons/hi'
import { useThemeStore } from '../../store/themeStore'

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore()
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <HiSun className="text-yellow-500" /> : <HiMoon className="text-indigo-500" />}
    </button>
  )
}
