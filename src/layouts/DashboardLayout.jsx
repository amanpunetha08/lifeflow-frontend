import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiOutlineSquares2X2, HiOutlineClipboardDocumentList, HiOutlineCalendarDays, HiOutlineArrowPath, HiOutlineChartBarSquare, HiOutlineTrophy, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle, HiOutlineSun, HiOutlineMoon, HiOutlineBars3 } from 'react-icons/hi2';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
  { to: '/tasks', label: 'Tasks', icon: HiOutlineClipboardDocumentList },
  { to: '/calendar', label: 'Calendar', icon: HiOutlineCalendarDays },
  { to: '/habits', label: 'Habits', icon: HiOutlineArrowPath },
  { to: '/analytics', label: 'Analytics', icon: HiOutlineChartBarSquare },
  { to: '/achievements', label: 'Achievements', icon: HiOutlineTrophy },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const xpPct = Math.min((xp % 100) / 100 * 100, 100);

  return (
    <div className="flex h-screen overflow-hidden">
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-[#475569] transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-50">LifeFlow</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#334155]'}`}>
              <Icon className="w-5 h-5" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-[#475569]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">{(user?.username || 'U')[0].toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-slate-400">Level {level}</p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-3">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors">
            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-[#475569] bg-white dark:bg-[#111827]">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-400"><HiOutlineBars3 className="w-6 h-6" /></button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.username || 'there'}</h2>
          </div>
          <button onClick={toggle} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#334155] transition-colors">
            {theme === 'dark' ? <HiOutlineSun className="w-5 h-5 text-amber-400" /> : <HiOutlineMoon className="w-5 h-5 text-slate-600" />}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#0B1220]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
