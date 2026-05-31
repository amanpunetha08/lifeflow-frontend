import { useEffect, useState } from 'react';
import { HiOutlineTrophy } from 'react-icons/hi2';
import { useAchievementsStore } from '../store/dataStore';

export default function Achievements() {
  const achievements = useAchievementsStore(s => s.data) || [];
  const loading = useAchievementsStore(s => s.loading);
  const fetch = useAchievementsStore(s => s.fetch);
  const [tab, setTab] = useState('all');

  useEffect(() => { fetch(); }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  const filtered = tab === 'all' ? achievements : tab === 'unlocked' ? achievements.filter(a => a.unlocked_at) : achievements.filter(a => !a.unlocked_at);

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-white dark:bg-[#1E293B] rounded-xl p-1 border border-slate-200 dark:border-[#475569] w-fit">
        {['all', 'unlocked', 'locked'].map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${tab === t ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t}</button>)}
      </div>

      {filtered.length === 0 ? <p className="text-center text-slate-400 py-12 text-sm">No achievements to show</p> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => (
            <div key={a.id} className={`p-5 rounded-2xl border shadow-sm dark:shadow-none ${a.unlocked ? 'bg-white dark:bg-[#1E293B] border-emerald-200 dark:border-emerald-500/30' : 'bg-white dark:bg-[#1E293B] border-slate-100 dark:border-[#475569] opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.unlocked ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                  <HiOutlineTrophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{a.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{a.description}</p>
                </div>
              </div>
              {a.progress !== undefined && (
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Progress</span><span className="text-slate-400">{a.progress}%</span></div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full"><div className={`h-full rounded-full ${a.unlocked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} style={{ width: `${a.progress}%` }} /></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
