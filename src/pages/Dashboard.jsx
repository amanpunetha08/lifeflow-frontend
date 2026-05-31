import { useEffect, useState } from 'react';
import { HiOutlineClipboardDocumentList, HiOutlineCheckCircle, HiOutlineChartBarSquare, HiOutlineClock, HiOutlineFire } from 'react-icons/hi2';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import client from '../api/client';
import toast from 'react-hot-toast';

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
    </div>
  );
}
