import { useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineChartBarSquare, HiOutlineShieldCheck } from 'react-icons/hi2';
import useAnalyticsStore from '../store/analyticsStore';
import toast from 'react-hot-toast';

export default function Analytics() {

  useEffect(() => { useAnalyticsStore.getState().fetch(); }, []);
  const data = useAnalyticsStore(s => s.data) || {};
  const loading = useAnalyticsStore(s => s.loading);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <p className="text-center text-slate-400 py-12">No analytics data available yet.</p>;

  const stats = [
    { icon: HiOutlineCheckCircle, label: 'Tasks Completed', value: data.tasks_completed || 0, color: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' },
    { icon: HiOutlineClock, label: 'Focus Time', value: `${data.focus_time || 0}h`, color: 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600' },
    { icon: HiOutlineChartBarSquare, label: 'Productivity', value: `${data.productivity_score || 0}%`, color: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600' },
    { icon: HiOutlineShieldCheck, label: 'Discipline', value: `${data.discipline_score || 0}%`, color: 'bg-red-100 dark:bg-red-500/10 text-red-600' },
  ];

  const weekly = data.weekly_trend || [];
  const breakdown = data.task_breakdown || {};
  const completion = Object.entries(breakdown).length > 0
    ? [{ name: 'Completed', value: breakdown.completed || 0 }, { name: 'Missed', value: breakdown.missed || 0 }, { name: 'Pending', value: (breakdown.todo || 0) + (breakdown.in_progress || 0) }]
    : [];
  const xpData = data.daily_xp || [];
  const COLORS = ['#10b981', '#ef4444', '#94a3b8'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569]">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Weekly Productivity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weekly}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #475569', borderRadius: 12, color: '#f8fafc' }} />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Task Completion</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={completion} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={2}>
                {completion.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #475569', borderRadius: 12, color: '#f8fafc' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {completion.map((c, i) => <span key={i} className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />{c.name}</span>)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Daily XP</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={xpData}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #475569', borderRadius: 12, color: '#f8fafc' }} />
              <Bar dataKey="xp" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Habit Consistency</h3>
          {(data.habit_consistency || []).map(h => (
            <div key={h.name} className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-600 dark:text-slate-300">{h.name}</span><span className="text-slate-400">{Math.round((h.completed / h.total) * 100)}%</span></div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(h.completed / h.total) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
