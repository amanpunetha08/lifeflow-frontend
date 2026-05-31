import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiClipboardDocumentList, HiCalendarDays, HiArrowPath, HiChartBar, HiClock, HiBookOpen, HiTrophy, HiStar, HiGift, HiCog6Tooth, HiArrowRightOnRectangle, HiSun, HiMoon } from 'react-icons/hi2';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import client from '../api/client';

const navItems = [
  { to: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { to: '/tasks', icon: HiClipboardDocumentList, label: 'Tasks' },
  { to: '/calendar', icon: HiCalendarDays, label: 'Calendar' },
  { to: '/habits', icon: HiArrowPath, label: 'Habits' },
  { to: '/analytics', icon: HiChartBar, label: 'Analytics' },
  { to: '/focus', icon: HiClock, label: 'Focus Mode' },
  { to: '/journal', icon: HiBookOpen, label: 'Journal' },
  { to: '/challenges', icon: HiTrophy, label: 'Challenges' },
  { to: '/achievements', icon: HiStar, label: 'Achievements' },
  { to: '/rewards', icon: HiGift, label: 'Rewards Store' },
  { to: '/settings', icon: HiCog6Tooth, label: 'Settings' },
];

export default function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useThemeStore();

  // Refresh user profile on mount
  useEffect(() => {
    client.get('/auth/profile/').then(r => useAuthStore.getState().setUser(r.data)).catch(() => {});
  }, []);

  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const xpForNext = level * 100;
  const streak = user?.streak_count || 0;
  const discipline = user?.discipline_score || 0;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0f0f1a]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0a0a12] border-r border-gray-200 dark:border-[#1a1a2e] flex flex-col transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="text-indigo-500">Life</span>Flow
          </h1>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-l-2 border-indigo-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-[#1a1a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white truncate">{user?.display_name || user?.username || 'User'}</p>
              <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                Level {level}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{xp.toLocaleString()} / {xpForNext.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-[#1a1a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${Math.min((xp / xpForNext) * 100, 100)}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl py-2 transition"
          >
            <HiArrowRightOnRectangle className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#0f0f1a]/80 backdrop-blur-sm border-b border-gray-200 dark:border-[#1a1a2e] px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-lg md:text-xl text-gray-900 dark:text-white">
              Good morning, {user?.display_name || user?.username || 'there'}! ⭐
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition">
              {theme === 'dark' ? <HiSun className="w-5 h-5 text-amber-400" /> : <HiMoon className="w-5 h-5 text-indigo-500" />}
            </button>
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">Level {level}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{xp.toLocaleString()} XP</span>
              <span className="text-sm text-amber-500 dark:text-amber-400">🔥 {streak}</span>
              <span className="text-sm text-emerald-500 dark:text-emerald-400">⚡ {discipline}</span>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
