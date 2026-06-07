import { useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowPath, HiOutlinePencilSquare, HiOutlineCheckCircle } from 'react-icons/hi2';
import client from '../api/client';
import { useTasksStore } from '../store/dataStore';
import toast from 'react-hot-toast';

const priorityColor = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-emerald-500' };
const statusColor = { todo: 'text-slate-500', in_progress: 'text-cyan-500', completed: 'text-emerald-500', missed: 'text-red-500' };
const typeBadge = { daily: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', timeframe: 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' };

export default function Tasks() {
  const tasks = useTasksStore(s => s.data) || [];
  const loading = useTasksStore(s => s.loading);
  const [view, setView] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [dayOffset, setDayOffset] = useState(0);
  const [dayTasks, setDayTasks] = useState(null);
  const [dayLoading, setDayLoading] = useState(false);
  const [form, setForm] = useState({ title: '', task_type: 'daily', priority: 'medium', start_time: '', end_time: '', duration_days: 1 });

  const fetchTasks = useTasksStore(s => s.fetch);
  useEffect(() => { fetchTasks(); }, []);

  // Fetch tasks for a specific day offset
  useEffect(() => {
    if (dayOffset === 0) { setDayTasks(null); return; }
    const fetchDay = async () => {
      setDayLoading(true);
      const d = new Date(); d.setDate(d.getDate() + dayOffset);
      const dateStr = d.toISOString().split('T')[0];
      try {
        const { data } = await client.get(`/tasks/today/?date=${dateStr}`);
        setDayTasks(data.results !== undefined ? data.results : data);
      } catch { setDayTasks([]); }
      setDayLoading(false);
    };
    fetchDay();
  }, [dayOffset]);

  const activeTasks = dayOffset === 0 ? tasks : (dayTasks || []);
  const isLoading = dayOffset === 0 ? loading : dayLoading;
  const dayLabel = dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : `+${dayOffset} days`;

  const fetchTasks = useTasksStore(s => s.fetch);
  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await client.post('/tasks/', form);
      toast.success('Task added');
      useTasksStore.getState().invalidate();
      fetchTasks();
      setShowForm(false);
      setForm({ title: '', task_type: 'daily', priority: 'medium', start_time: '', end_time: '', duration_days: 1 });
      fetchTasks();
    } catch { toast.error('Failed to add task'); }
  };

  const deleteTask = async (id) => { try { await client.delete(`/tasks/${id}/`); useTasksStore.getState().invalidate(); fetchTasks(); } catch { toast.error('Failed'); } };
  const resetDay = async () => { try { await client.post('/tasks/reset_today/'); useTasksStore.getState().invalidate(); fetchTasks(); toast.success('Day reset'); } catch { toast.error('Failed'); } };

  const completeTask = async (id) => {
    try {
      await client.post(`/tasks/${id}/complete/`);
      useTasksStore.getState().invalidate();
      fetchTasks();
      toast.success('Task completed! 🎉');
    } catch { toast.error('Failed'); }
  };

  const toggleNotes = (task) => {
    if (expandedTask === task.id) { setExpandedTask(null); }
    else { setExpandedTask(task.id); setNoteText(task.notes || ''); }
  };

  const saveNotes = async (id) => {
    try {
      await client.patch(`/tasks/${id}/`, { notes: noteText });
      useTasksStore.getState().invalidate();
      fetchTasks();
      toast.success('Notes saved');
    } catch { toast.error('Failed to save notes'); }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  const grouped = { todo: activeTasks.filter(t => t.status === 'todo'), in_progress: activeTasks.filter(t => t.status === 'in_progress'), completed: activeTasks.filter(t => t.status === 'completed') };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-white dark:bg-[#1E293B] rounded-xl p-1 border border-slate-200 dark:border-[#475569]">
          {[['Today', 0], ['Tomorrow', 1]].map(([label, offset]) => <button key={offset} onClick={() => setDayOffset(offset)} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${dayOffset === offset ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}>{label}</button>)}
        </div>
        <div className="flex gap-1 bg-white dark:bg-[#1E293B] rounded-xl p-1 border border-slate-200 dark:border-[#475569]">
          {['list', 'board', 'card'].map(v => <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${view === v ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}>{v}</button>)}
        </div>
        <div className="flex gap-2">
          <button onClick={resetDay} className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-200 dark:border-[#475569] rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#334155] transition-colors"><HiOutlineArrowPath className="w-4 h-4" />Reset</button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"><HiOutlinePlus className="w-4 h-4" />Add Task</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={addTask} className="p-5 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#475569] shadow-sm dark:shadow-none space-y-4">
          <input type="text" required placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select value={form.task_type} onChange={e => setForm({ ...form, task_type: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-sm text-slate-700 dark:text-slate-300">
              <option value="daily">Daily</option><option value="timeframe">Timeframe</option>
            </select>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-sm text-slate-700 dark:text-slate-300">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
            <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-sm text-slate-700 dark:text-slate-300" />
            <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-sm text-slate-700 dark:text-slate-300" />
          </div>
          <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-xl transition-colors">Save Task</button>
        </form>
      )}

      {view === 'list' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-[#475569] shadow-sm dark:shadow-none overflow-hidden">
          {activeTasks.length === 0 ? <p className="text-sm text-slate-400 py-12 text-center">No tasks for {dayLabel}</p> : activeTasks.map(task => (
            <div key={task.id} className="border-b border-slate-100 dark:border-[#475569] last:border-0">
              <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors">
                <div className={`w-2 h-2 rounded-full ${priorityColor[task.priority] || 'bg-slate-400'}`} />
                <span className={`flex-1 text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg ${typeBadge[task.task_type] || typeBadge.daily}`}>{task.task_type}</span>
                <span className={`text-xs font-medium ${statusColor[task.status]}`}>{task.status?.replace('_', ' ')}</span>
                {task.xp_reward && <span className="text-xs text-emerald-500">+{task.xp_reward}xp</span>}
                <button onClick={() => toggleNotes(task)} className="text-slate-400 hover:text-indigo-500 transition-colors" title="Log notes"><HiOutlinePencilSquare className="w-4 h-4" /></button>
                {task.status !== 'completed' && <button onClick={() => completeTask(task.id)} className="text-slate-400 hover:text-emerald-500 transition-colors" title="Complete"><HiOutlineCheckCircle className="w-4 h-4" /></button>}
                <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
              </div>
              {expandedTask === task.id && (
                <div className="px-5 pb-4 pt-1">
                  <textarea
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    rows={4}
                    placeholder="TRAP Log:&#10;• Topic:&#10;• Approach:&#10;• Pattern:&#10;• Review needed: Y/N"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#475569] bg-slate-50 dark:bg-[#0B1220] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button onClick={() => saveNotes(task.id)} className="mt-2 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Save Notes</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === 'board' && (
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([status, items]) => (
            <div key={status} className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-[#475569] shadow-sm dark:shadow-none p-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 capitalize">{status.replace('_', ' ')} ({items.length})</h4>
              <div className="space-y-2">
                {items.map(task => (
                  <div key={task.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-100 dark:border-[#475569]">
                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${priorityColor[task.priority] || 'bg-slate-400'}`} /><span className="text-sm text-slate-800 dark:text-slate-200">{task.title}</span></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'card' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTasks.map(task => (
            <div key={task.id} className="p-4 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-[#475569] shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-lg ${typeBadge[task.task_type] || typeBadge.daily}`}>{task.task_type}</span>
                <div className={`w-2 h-2 rounded-full ${priorityColor[task.priority] || 'bg-slate-400'}`} />
              </div>
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">{task.title}</h4>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${statusColor[task.status]}`}>{task.status?.replace('_', ' ')}</span>
                {task.xp && <span className="text-xs text-emerald-500">+{task.xp}xp</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
