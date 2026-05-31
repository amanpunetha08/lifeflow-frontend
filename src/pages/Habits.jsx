import { useEffect } from 'react';
import { HiOutlineFire } from 'react-icons/hi2';
import { useHabitsStore } from '../store/dataStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Habits() {
  const habits = useHabitsStore(s => s.data) || [];
  const loading = useHabitsStore(s => s.loading);
  const fetch = useHabitsStore(s => s.fetch);

  useEffect(() => { fetch(); }, []);

  if (loading && !habits.length) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (habits.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-slate-400 text-sm">No habits tracked yet. Create daily recurring tasks to see them here.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Daily Habits</h2>
      {habits.map(habit => (
        <div key={habit.id} className="p-5 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">{habit.title}</h3>
            <div className="flex items-center gap-1 text-amber-500"><HiOutlineFire className="w-4 h-4" /><span className="text-sm font-bold">{habit.streak || 0}</span></div>
          </div>
          <div className="flex gap-2">
            {DAYS.map((d, i) => {
              const done = habit.weekly_completion?.[i];
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400">{d}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${done ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    {done ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
