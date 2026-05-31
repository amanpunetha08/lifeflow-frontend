import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import client from '../api/client';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('this');

  useEffect(() => {
    client.get('/analytics/').then((r) => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-center text-gray-400 py-20">No analytics data available yet. Complete some tasks to see your stats!</div>;

  const stats = data.stats || {};
  const weekData = data.weekly_trend || [];
  const taskData = data.task_breakdown || [];
  const xpData = data.daily_xp || [];
  const habitData = data.habit_consistency || [];

  const statCards = [
    { label: 'Tasks Completed', value: stats.tasks_completed ?? 0, change: stats.tasks_change, color: 'text-emerald-400' },
    { label: 'Focus Time', value: stats.focus_time || '0h', change: stats.focus_change, color: 'text-indigo-400' },
    { label: 'Productivity Score', value: stats.productivity_score ?? 0, change: stats.productivity_change, color: 'text-amber-400' },
    { label: 'Discipline Score', value: stats.discipline_score ?? 0, change: stats.discipline_change, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
            {s.change != null && <p className={`text-sm mt-1 ${s.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{s.change >= 0 ? '+' : ''}{s.change}% from last week</p>}
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
              <Line type="monotone" dataKey={period === 'this' ? 'this_week' : 'last_week'} stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Task Breakdown */}
        <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
          <h3 className="text-white font-semibold mb-4">Task Completion</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={taskData} innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                  {taskData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {taskData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-400">{d.name}</span>
                  <span className="text-white ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily XP */}
        <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e] lg:col-span-2">
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
      {habitData.length > 0 && (
        <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
          <h3 className="text-white font-semibold mb-4">Habit Consistency</h3>
          <div className="space-y-4">
            {habitData.map((h) => (
              <div key={h.name} className="flex items-center gap-4">
                <span className="text-sm text-gray-300 w-24">{h.name}</span>
                <div className="flex-1 h-3 bg-[#0f0f1a] rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(h.done / (h.total || 7)) * 100}%` }} />
                </div>
                <span className="text-sm text-gray-400">{h.done}/{h.total || 7}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
