import { useState } from 'react';

const achievements = [
  { id: 1, emoji: '⚔️', name: '7 Day Warrior', desc: 'Complete tasks for 7 consecutive days', progress: '7/7', unlocked: true },
  { id: 2, emoji: '🌅', name: 'Early Bird', desc: 'Complete 5 tasks before 9 AM', progress: '5/5', unlocked: true },
  { id: 3, emoji: '🎯', name: 'Focus Master', desc: 'Complete 10 focus sessions', progress: '8/10', unlocked: false },
  { id: 4, emoji: '✨', name: 'No Miss Day', desc: 'Complete all tasks in a single day', progress: '1/1', unlocked: true },
  { id: 5, emoji: '🔥', name: '30 Day Streak', desc: 'Maintain a 30-day streak', progress: '18/30', unlocked: false },
  { id: 6, emoji: '💥', name: 'Task Destroyer', desc: 'Complete 100 tasks total', progress: '67/100', unlocked: false },
  { id: 7, emoji: '🧠', name: 'Total Focus', desc: 'Accumulate 50 hours of focus time', progress: '32/50', unlocked: false },
];

export default function Achievements() {
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? achievements : tab === 'unlocked' ? achievements.filter((a) => a.unlocked) : achievements.filter((a) => !a.unlocked);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Achievements</h2>
        <div className="flex gap-2">
          {['all', 'unlocked', 'locked'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm ${tab === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <div key={a.id} className={`rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e] relative ${!a.unlocked ? 'opacity-60' : ''}`}>
            {!a.unlocked && (
              <div className="absolute top-3 right-3 text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">🔒 Locked</div>
            )}
            <div className="text-4xl mb-4">{a.emoji}</div>
            <h4 className="text-white font-semibold mb-1">{a.name}</h4>
            <p className="text-sm text-gray-400 mb-4">{a.desc}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className={a.unlocked ? 'text-emerald-400' : 'text-gray-400'}>{a.progress}</span>
            </div>
            <div className="mt-2 h-2 bg-[#0f0f1a] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${a.unlocked ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                style={{ width: `${(parseInt(a.progress) / parseInt(a.progress.split('/')[1])) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
