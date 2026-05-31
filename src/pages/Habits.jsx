import { useState, useEffect } from 'react';
import { HiPlus } from 'react-icons/hi2';
import client from '../api/client';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    client.get('/tasks/habits/').then((r) => setHabits(r.data?.results || r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (!habits.length) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Habits</h2>
        <button className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm"><HiPlus className="w-4 h-4" /> Add Habit</button>
      </div>
      <div className="text-center text-gray-400 py-20">No habits yet. Create a daily recurring task to track habits!</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Habits</h2>
        <button className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm"><HiPlus className="w-4 h-4" /> Add Habit</button>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => {
          const days = habit.weekly_completion || [];
          const streak = habit.streak || 0;
          const completionRate = days.length ? Math.round((days.filter(Boolean).length / days.length) * 100) : 0;

          return (
            <div key={habit.id} onClick={() => setSelected(habit.id === selected ? null : habit.id)}
              className="rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] cursor-pointer hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{habit.icon || '📌'}</span>
                  <div>
                    <h4 className="text-white font-medium">{habit.title || habit.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{habit.frequency || 'Daily'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    {dayLabels.map((day, i) => (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-500">{day}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${days[i] ? 'bg-indigo-500 text-white' : 'bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-[#2a2a3e] text-gray-500'}`}>
                          {days[i] ? '✓' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 text-sm font-medium">🔥 {streak}</p>
                    <p className="text-xs text-gray-500">streak</p>
                  </div>
                </div>
              </div>
              {selected === habit.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2a2a3e]">
                  <p className="text-sm text-gray-400 mb-2">Current streak: <span className="text-amber-400">{streak} days</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completion rate: <span className="text-emerald-400">{completionRate}%</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total completed: <span className="text-indigo-400">{habit.total_completed || 0}</span></p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
