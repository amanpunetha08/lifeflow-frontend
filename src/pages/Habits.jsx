import { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';

const initialHabits = [
  { id: 1, name: 'Meditation', icon: '🧘', frequency: 'Daily, 15 min', streak: 12, days: [true, true, true, true, true, false, false] },
  { id: 2, name: 'Workout', icon: '💪', frequency: 'Daily', streak: 8, days: [true, true, false, true, true, true, false] },
  { id: 3, name: 'Reading', icon: '📚', frequency: 'Daily, 30 pages', streak: 15, days: [true, true, true, true, true, true, true] },
  { id: 4, name: 'No Sugar', icon: '🚫', frequency: 'Daily', streak: 5, days: [true, true, true, false, true, false, false] },
];

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Habits() {
  const [habits] = useState(initialHabits);
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Habits</h2>
        <button className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm">
          <HiPlus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} onClick={() => setSelected(habit.id === selected ? null : habit.id)}
            className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e] cursor-pointer hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{habit.icon}</span>
                <div>
                  <h4 className="text-white font-medium">{habit.name}</h4>
                  <p className="text-sm text-gray-400">{habit.frequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  {dayLabels.map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500">{day}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        habit.days[i] ? 'bg-indigo-500 text-white' : 'bg-[#0f0f1a] border border-[#2a2a3e] text-gray-500'
                      }`}>
                        {habit.days[i] ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-amber-400 text-sm font-medium">🔥 {habit.streak}</p>
                  <p className="text-xs text-gray-500">streak</p>
                </div>
              </div>
            </div>
            {selected === habit.id && (
              <div className="mt-4 pt-4 border-t border-[#2a2a3e]">
                <p className="text-sm text-gray-400 mb-2">Current streak: <span className="text-amber-400">{habit.streak} days</span></p>
                <p className="text-sm text-gray-400">Completion rate: <span className="text-emerald-400">{Math.round((habit.days.filter(Boolean).length / 7) * 100)}%</span></p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
