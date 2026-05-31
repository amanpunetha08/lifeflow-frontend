import useAuthStore from '../store/authStore';
import { HiOutlineFire, HiOutlineTrophy, HiOutlineShieldCheck } from 'react-icons/hi2';

export default function Profile() {
  const { user } = useAuthStore();
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const xpPct = Math.min((xp % 100) / 100 * 100, 100);

  const stats = [
    { icon: HiOutlineFire, label: 'Streak', value: `${user?.streak || 0} days`, color: 'text-amber-500' },
    { icon: HiOutlineTrophy, label: 'Total XP', value: xp, color: 'text-emerald-500' },
    { icon: HiOutlineShieldCheck, label: 'Discipline', value: `${user?.discipline || 0}%`, color: 'text-cyan-500' },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">{(user?.username || 'U')[0].toUpperCase()}</div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{user?.username || 'User'}</h2>
        <p className="text-sm text-slate-400 mb-4">Level {level}</p>
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">XP Progress</span><span className="text-emerald-500">{xp % 100}/100</span></div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${xpPct}%` }} /></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-4 text-center">
            <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
            <p className="text-lg font-bold text-slate-900 dark:text-slate-50">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
