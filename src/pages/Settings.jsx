import { useState } from 'react';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Settings() {
  const { theme, toggle } = useThemeStore();
  const { user } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.username || '');

  const save = () => toast.success('Settings saved');

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Display Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Email</label>
            <input type="email" disabled value={user?.email || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-slate-50 dark:bg-[#0B1220] text-slate-500 cursor-not-allowed" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300">Dark Mode</p>
            <p className="text-xs text-slate-400">Toggle between light and dark theme</p>
          </div>
          <button onClick={toggle} className={`w-11 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <button onClick={save} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">Save Changes</button>
    </div>
  );
}
