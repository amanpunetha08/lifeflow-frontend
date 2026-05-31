import { useState, useEffect } from 'react';
import client from '../api/client';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    client.get('/gamification/achievements/').then((r) => setAchievements(r.data?.results || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  const filtered = tab === 'all' ? achievements : tab === 'unlocked' ? achievements.filter((a) => a.unlocked_at) : achievements.filter((a) => !a.unlocked_at);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Achievements</h2>
        <div className="flex gap-2">
          {['all', 'unlocked', 'locked'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm ${tab === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {!achievements.length && <div className="text-center text-gray-400 py-20">No achievements available yet.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => {
          const unlocked = !!a.unlocked_at;
          const progress = a.progress || 0;
          const requirement = a.requirement_value || 1;
          const pct = Math.min((progress / requirement) * 100, 100);

          return (
            <div key={a.id} className={`rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] relative ${!unlocked ? 'opacity-60' : ''}`}>
              {!unlocked && <div className="absolute top-3 right-3 text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">🔒 Locked</div>}
              {unlocked && <div className="absolute top-3 right-3 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">✓ {new Date(a.unlocked_at).toLocaleDateString()}</div>}
              <div className="text-4xl mb-4">{a.icon || a.emoji || '🏆'}</div>
              <h4 className="text-white font-semibold mb-1">{a.name || a.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{a.description || a.desc}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Progress</span>
                <span className={unlocked ? 'text-emerald-400' : 'text-gray-400'}>{progress}/{requirement}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-50 dark:bg-[#0f0f1a] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${unlocked ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
