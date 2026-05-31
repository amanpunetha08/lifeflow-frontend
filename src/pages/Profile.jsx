import useAuthStore from '../store/authStore';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const xpForNext = level * 1000;

  const badges = [
    { emoji: '⚔️', name: '7 Day Warrior' },
    { emoji: '🌅', name: 'Early Bird' },
    { emoji: '✨', name: 'No Miss Day' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="rounded-2xl p-8 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] text-center">
        <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center text-4xl text-indigo-400 font-bold mx-auto">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <h2 className="text-2xl font-bold text-white mt-4">{user?.username || 'User'}</h2>
        <span className="inline-block mt-2 text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">Level {level}</span>
        <div className="max-w-xs mx-auto mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{xp.toLocaleString()} XP</span>
            <span>{xpForNext.toLocaleString()} XP</span>
          </div>
          <div className="h-3 bg-gray-50 dark:bg-[#0f0f1a] rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((xp / xpForNext) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Streak', value: `🔥 ${user?.streaks || 0}`, color: 'text-amber-400' },
          { label: 'Total XP', value: xp.toLocaleString(), color: 'text-indigo-400' },
          { label: 'Discipline', value: user?.discipline_score || 0, color: 'text-emerald-400' },
          { label: 'Coins', value: `🪙 ${user?.coins || 0}`, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] text-center">
            <p className="text-gray-400 text-xs">{s.label}</p>
            <p className={`text-lg font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e]">
        <h3 className="text-white font-semibold mb-2">About</h3>
        <p className="text-gray-400 text-sm">{user?.bio || 'No bio yet. Add one in Settings!'}</p>
      </div>

      {/* Badges */}
      <div className="rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e]">
        <h3 className="text-white font-semibold mb-4">Badges Earned</h3>
        <div className="grid grid-cols-3 gap-4">
          {badges.map((b) => (
            <div key={b.name} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-[#2a2a3e]">
              <span className="text-3xl">{b.emoji}</span>
              <p className="text-xs text-gray-300 mt-2">{b.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
