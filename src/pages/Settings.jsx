import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [tab, setTab] = useState('preferences');
  const [prefs, setPrefs] = useState({
    darkMode: true, hour24: false, weekMonday: true, notifications: true,
    autoMoveMissed: true, remindBefore: true, showCompleted: true,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const Toggle = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-300 text-sm">{label}</span>
      <button onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors ${value ? 'bg-indigo-500' : 'bg-[#2a2a3e]'}`}>
        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>

      <div className="flex gap-2 mb-6">
        {['preferences', 'profile', 'account', 'security'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm ${tab === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'preferences' && (
        <div className="space-y-6">
          <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e]">
            <h3 className="text-white font-medium mb-4">General</h3>
            <Toggle label="Dark Mode" value={prefs.darkMode} onChange={() => toggle('darkMode')} />
            <Toggle label="24 Hour Format" value={prefs.hour24} onChange={() => toggle('hour24')} />
            <Toggle label="Start week on Monday" value={prefs.weekMonday} onChange={() => toggle('weekMonday')} />
            <Toggle label="Notifications" value={prefs.notifications} onChange={() => toggle('notifications')} />
          </div>
          <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e]">
            <h3 className="text-white font-medium mb-4">Task Preferences</h3>
            <Toggle label="Auto move missed tasks" value={prefs.autoMoveMissed} onChange={() => toggle('autoMoveMissed')} />
            <Toggle label="Remind me before task start" value={prefs.remindBefore} onChange={() => toggle('remindBefore')} />
            <Toggle label="Show completed tasks" value={prefs.showCompleted} onChange={() => toggle('showCompleted')} />
          </div>
          <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e]">
            <h3 className="text-white font-medium mb-4">Data & Privacy</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your data is stored securely and never shared with third parties.</p>
          </div>
          <button onClick={() => toast.success('Settings saved!')}
            className="bg-indigo-500 hover:bg-indigo-600 text-gray-900 dark:text-white rounded-xl px-6 py-3">
            Save Changes
          </button>
        </div>
      )}

      {tab === 'profile' && (
        <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e] space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Display Name</label>
            <input className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-gray-900 dark:text-white" placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Bio</label>
            <textarea className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-gray-900 dark:text-white h-24 resize-none" placeholder="Tell us about yourself" />
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-gray-900 dark:text-white rounded-xl px-6 py-3">Update Profile</button>
        </div>
      )}

      {tab === 'account' && (
        <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e] space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-gray-900 dark:text-white" placeholder="email@example.com" />
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-gray-900 dark:text-white rounded-xl px-6 py-3">Update Email</button>
          <div className="pt-4 border-t border-slate-200 dark:border-[#2a2a3e]">
            <button className="text-rose-400 hover:text-rose-300 text-sm">Delete Account</button>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e] space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Current Password</label>
            <input type="password" className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">New Password</label>
            <input type="password" className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-gray-900 dark:text-white" />
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-gray-900 dark:text-white rounded-xl px-6 py-3">Change Password</button>
        </div>
      )}
    </div>
  );
}
