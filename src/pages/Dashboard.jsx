import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HiPlus } from 'react-icons/hi2';
import client from '../api/client';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';

const COLORS = { completed: '#10b981', in_progress: '#f59e0b', todo: '#6b7280', missed: '#f43f5e' };

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(new Date());

  useEffect(() => {
    Promise.all([
      client.get('/tasks/today/').then((r) => setTasks(r.data?.results || r.data || [])).catch(() => {}),
      client.get('/analytics/').then((r) => setAnalytics(r.data)).catch(() => {}),
      client.post('/scheduler/rules/process_expired/').catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const stats = {
    completed: tasks.filter((t) => t.status === 'completed').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    missed: tasks.filter((t) => t.status === 'missed').length,
  };
  const total = tasks.length || 1;
  const progress = Math.round((stats.completed / total) * 100);
  const donutData = Object.entries(stats).map(([name, value]) => ({ name, value: value || 0 }));
  const xpToday = analytics?.stats?.xp_today ?? tasks.filter(t => t.status === 'completed').reduce((s, t) => s + (t.xp_reward || 10), 0);
  const sparkData = analytics?.daily_xp?.map(d => ({ v: d.xp })) || [{ v: 0 }];

  const filtered = tab === 'all' ? tasks : tasks.filter((t) => t.status === tab);

  const completeTask = async (id) => {
    try {
      await client.post(`/tasks/${id}/complete/`);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'completed' } : t)));
      toast.success('Task completed! +XP');
    } catch { toast.error('Failed'); }
  };

  const monthDays = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startDay = startOfMonth(currentMonth).getDay();

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e]">
          <p className="text-gray-400 text-sm mb-3">Tasks Overview</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20">
              <ResponsiveContainer>
                <PieChart><Pie data={donutData} innerRadius={25} outerRadius={35} dataKey="value" strokeWidth={0}>
                  {donutData.map((_, i) => <Cell key={i} fill={Object.values(COLORS)[i]} />)}
                </Pie></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-white font-bold">{tasks.length} total</p>
              <p className="text-emerald-400">{stats.completed} done</p>
              <p className="text-amber-400">{stats.in_progress} active</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e] flex flex-col items-center justify-center">
          <p className="text-gray-400 text-sm mb-2">Today's Progress</p>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#2a2a3e" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#6366f1" strokeWidth="6" strokeDasharray={`${progress * 2.14} 214`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">{progress}%</span>
          </div>
        </div>
        <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e]">
          <p className="text-gray-400 text-sm mb-2">XP Earned Today</p>
          <p className="text-2xl font-bold text-emerald-400">+{xpToday} XP</p>
          <div className="h-12 mt-2">
            <ResponsiveContainer><AreaChart data={sparkData}><Area type="monotone" dataKey="v" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} /></AreaChart></ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e]">
          <p className="text-gray-400 text-sm mb-2">Discipline Score</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{user?.discipline_score || analytics?.stats?.discipline_score || 0}<span className="text-lg text-gray-500 dark:text-gray-400">/100</span></p>
          <p className="text-emerald-400 text-sm mt-1">Level {user?.level || 1} • {user?.xp || 0} XP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Tasks</h3>
            <button className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm"><HiPlus className="w-4 h-4" /> Add Task</button>
          </div>
          <div className="flex gap-2 mb-4">
            {['all', 'todo', 'in_progress', 'completed'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm ${tab === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
                {t === 'all' ? 'All' : t === 'in_progress' ? 'In Progress' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filtered.length === 0 && <p className="text-gray-500 text-sm">No tasks</p>}
            {filtered.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e]">
                <input type="checkbox" checked={task.status === 'completed'} onChange={() => completeTask(task.id)} className="w-5 h-5 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</p>
                  <p className="text-xs text-gray-500">{task.start_time} - {task.end_time}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{task.priority}</span>
                <span className="text-xs text-indigo-400">+{task.xp_reward || 10} XP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-slate-50 dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e]">
          <h3 className="text-lg font-semibold text-white mb-4">{format(currentMonth, 'MMMM yyyy')}</h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(startDay).fill(null).map((_, i) => <span key={`e${i}`} />)}
            {monthDays.map((day) => (
              <span key={day.toISOString()} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs ${isToday(day) ? 'bg-indigo-500 text-white' : isSameMonth(day, currentMonth) ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600'}`}>
                {format(day, 'd')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
