import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiClipboardDocumentList, HiCalendarDays, HiArrowPath, HiChartBar, HiClock, HiBookOpen, HiTrophy, HiStar, HiGift, HiCog6Tooth, HiArrowRightOnRectangle } from 'react-icons/hi2';
import useAuthStore from '../store/authStore';
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
    <div className="flex h-screen bg-[#0f0f1a]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a12] border-r border-[#1a1a2e] flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-indigo-400">Life</span>Flow
          </h1>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1a1a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.username || 'User'}</p>
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
                Level {level}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{xp.toLocaleString()} / {xpForNext.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${Math.min((xp / xpForNext) * 100, 100)}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl py-2 transition"
          >
            <HiArrowRightOnRectangle className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#0f0f1a]/80 backdrop-blur-sm border-b border-[#1a1a2e] px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl text-white">
            Good morning, {user?.username || 'there'}! ⭐
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">Level {level}</span>
            <span className="text-sm text-gray-400">{xp.toLocaleString()} XP</span>
            <span className="text-sm text-amber-400">🔥 {streak} streak</span>
            <span className="text-sm text-emerald-400">⚡ {discipline}</span>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
