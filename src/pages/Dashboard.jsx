import { useEffect, useState } from 'react';
import { HiOutlineClipboardDocumentList, HiOutlineCheckCircle, HiOutlineChartBarSquare, HiOutlineClock, HiOutlineFire } from 'react-icons/hi2';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import client from '../api/client';
import toast from 'react-hot-toast';

function StreakHeatmap({ data }) {
  // Build 90-day grid (13 weeks × 7 days)
  const today = new Date();
  const days = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const record = data.find(r => r.date === dateStr);
    const level = record ? Math.min(4, Math.ceil((record.completed / Math.max(record.total, 1)) * 4)) : 0;
    days.push({ date: dateStr, level, completed: record?.completed || 0, total: record?.total || 0 });
  }

  // Pad start to align with weekday (start on Sunday)
  const firstDay = new Date(today);
  firstDay.setDate(firstDay.getDate() - 89);
  const padStart = firstDay.getDay();

  const colors = ['bg-slate-100 dark:bg-slate-700', 'bg-emerald-200 dark:bg-emerald-900', 'bg-emerald-300 dark:bg-emerald-700', 'bg-emerald-400 dark:bg-emerald-500', 'bg-emerald-500 dark:bg-emerald-400'];
  const months = [];
  let lastMonth = -1;
  days.forEach((d, i) => {
    const m = new Date(d.date).getMonth();
    if (m !== lastMonth) { months.push({ idx: i + padStart, name: new Date(d.date).toLocaleString('default', { month: 'short' }) }); lastMonth = m; }
  });

  const cells = [...Array(padStart).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      <div className="flex gap-0.5 mb-1 ml-8">
        {months.map((m, i) => (
          <span key={i} className="text-[10px] text-slate-400" style={{ marginLeft: `${Math.max(0, (m.idx / 7) * 14 - (i > 0 ? (months[i-1].idx / 7) * 14 + 20 : 0))}px` }}>{m.name}</span>
        ))}
      </div>
      <div className="flex gap-0.5">
        <div className="flex flex-col gap-0.5 mr-1">
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
            <span key={i} className="text-[10px] text-slate-400 h-3 leading-3">{d}</span>
          ))}
        </div>
        <div className="flex gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm ${day ? colors[day.level] : 'bg-transparent'}`}
                  title={day ? `${day.date}: ${day.completed}/${day.total} tasks` : ''}
                />
              ))}
              {week.length < 7 && [...Array(7 - week.length)].map((_, i) => (
                <div key={`pad-${i}`} className="w-3 h-3 rounded-sm bg-transparent" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 ml-8">
        <span className="text-[10px] text-slate-400">Less</span>
        {colors.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />)}
        <span className="text-[10px] text-slate-400">More</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([client.get('/tasks/today/'), client.get('/analytics/')])
      .then(([t, a]) => { setTasks(t.data.results || t.data || []); setAnalytics(a.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const completeTask = async (id) => {
    try {
      await client.post(`/tasks/${id}/complete/`);
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
      toast.success('Task completed! 🎉');
    } catch { toast.error('Failed to complete task'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  const completed = tasks.filter(t => t.status === 'completed').length;
  const stats = [
    { icon: HiOutlineClipboardDocumentList, label: "Today's Tasks", value: tasks.length, color: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' },
    { icon: HiOutlineCheckCircle, label: 'Completed', value: completed, color: 'bg-green-100 dark:bg-green-500/10 text-green-600' },
    { icon: HiOutlineChartBarSquare, label: 'Productivity', value: `${analytics?.productivity_score || 0}%`, color: 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600' },
    { icon: HiOutlineClock, label: 'Focus Time', value: `${analytics?.focus_time || 0}h`, color: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600' },
    { icon: HiOutlineFire, label: 'Streak', value: `${analytics?.streak || 0}d`, color: 'bg-red-100 dark:bg-red-500/10 text-red-600' },
  ];

  const weeklyData = analytics?.weekly || [{ day: 'Mon', score: 0 }, { day: 'Tue', score: 0 }, { day: 'Wed', score: 0 }, { day: 'Thu', score: 0 }, { day: 'Fri', score: 0 }, { day: 'Sat', score: 0 }, { day: 'Sun', score: 0 }];

  const priorityColor = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-emerald-500' };
  const statusBadge = { todo: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300', in_progress: 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400', completed: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', missed: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569]">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Today's Tasks</h3>
          {tasks.length === 0 ? <p className="text-sm text-slate-400 py-8 text-center">No tasks for today. Add some!</p> : (
            <div className="space-y-2">
              {tasks.slice(0, 8).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors">
                  <div className={`w-2 h-2 rounded-full ${priorityColor[task.priority] || 'bg-slate-400'}`} />
                  <span className={`flex-1 text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${statusBadge[task.status] || statusBadge.todo}`}>{task.status?.replace('_', ' ')}</span>
                  {task.xp && <span className="text-xs text-emerald-500 font-medium">+{task.xp}xp</span>}
                  {task.status !== 'completed' && <button onClick={() => completeTask(task.id)} className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">Done</button>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Weekly Productivity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #475569', borderRadius: 12, color: '#f8fafc' }} />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streak Heatmap */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Activity Streak</h3>
          <span className="text-xs text-slate-400">Last 90 days</span>
        </div>
        <StreakHeatmap data={analytics?.streak_history || []} />
      </div>
    </div>
  );
}
