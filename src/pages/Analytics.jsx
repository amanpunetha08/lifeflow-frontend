import { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const weekData = [
  { day: 'Mon', this: 65, last: 45 }, { day: 'Tue', this: 72, last: 55 }, { day: 'Wed', this: 80, last: 60 },
  { day: 'Thu', this: 68, last: 50 }, { day: 'Fri', this: 85, last: 70 }, { day: 'Sat', this: 55, last: 40 }, { day: 'Sun', this: 78, last: 65 },
];
const taskData = [{ name: 'Completed', value: 12 }, { name: 'In Progress', value: 7 }, { name: 'To Do', value: 3 }, { name: 'Missed', value: 2 }];
const focusData = [{ name: 'Deep Work', value: 55 }, { name: 'Meetings', value: 25 }, { name: 'Breaks', value: 20 }];
const xpData = [{ day: 'Mon', xp: 320 }, { day: 'Tue', xp: 450 }, { day: 'Wed', xp: 280 }, { day: 'Thu', xp: 520 }, { day: 'Fri', xp: 380 }, { day: 'Sat', xp: 200 }, { day: 'Sun', xp: 410 }];
const habitData = [{ name: 'Meditation', done: 6, total: 7 }, { name: 'Workout', done: 5, total: 7 }, { name: 'Reading', done: 7, total: 7 }, { name: 'No Sugar', done: 4, total: 7 }];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'];

export default function Analytics() {
  const [period, setPeriod] = useState('this');

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Completed', value: '38', change: '+12%', color: 'text-emerald-400' },
          { label: 'Focus Time', value: '18h 32m', change: '+8%', color: 'text-indigo-400' },
          { label: 'Productivity Score', value: '78', change: '+5%', color: 'text-amber-400' },
          { label: 'Discipline Score', value: '82', change: '+3%', color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
            <p className={`text-sm mt-1 ${s.color}`}>{s.change} from last week</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trend */}
        <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Productivity Trend</h3>
            <div className="flex gap-2">
              {['this', 'last'].map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`text-xs px-3 py-1 rounded-lg ${period === p ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400'}`}>
                  {p === 'this' ? 'This Week' : 'Last Week'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weekData}>
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 12 }} />
              <Line type="monotone" dataKey={period === 'this' ? 'this' : 'last'} stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Task Completion */}
        <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
          <h3 className="text-white font-semibold mb-4">Task Completion</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={taskData} innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                  {taskData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {taskData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-400">{d.name}</span>
                  <span className="text-white ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Focus Time Distribution */}
        <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
          <h3 className="text-white font-semibold mb-4">Focus Time Distribution</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={focusData} innerRadius={0} outerRadius={60} dataKey="value" strokeWidth={0}>
                  {focusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {focusData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-400">{d.name}</span>
                  <span className="text-white ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily XP */}
        <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
          <h3 className="text-white font-semibold mb-4">Daily XP</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={xpData}>
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 12 }} />
              <Bar dataKey="xp" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Habit Consistency */}
      <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
        <h3 className="text-white font-semibold mb-4">Habit Consistency</h3>
        <div className="space-y-4">
          {habitData.map((h) => (
            <div key={h.name} className="flex items-center gap-4">
              <span className="text-sm text-gray-300 w-24">{h.name}</span>
              <div className="flex-1 h-3 bg-[#0f0f1a] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(h.done / h.total) * 100}%` }} />
              </div>
              <span className="text-sm text-gray-400">{h.done}/{h.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
