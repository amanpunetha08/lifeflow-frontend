import { useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowPath, HiOutlineCheckCircle, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';
import client from '../api/client';
import { useTasksStore } from '../store/dataStore';
import toast from 'react-hot-toast';

const statusStyles = {
  completed: 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-800',
  todo: 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#475569]',
  in_progress: 'bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200 dark:border-cyan-800',
  missed: 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-800',
};

export default function Tasks() {
  const tasks = useTasksStore(s => s.data) || [];
  const loading = useTasksStore(s => s.loading);
  const [expandedTask, setExpandedTask] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', task_type: 'daily', priority: 'medium' });

  const fetchTasks = useTasksStore(s => s.fetch);
  useEffect(() => { fetchTasks(); }, []);

  const completeTask = async (id) => {
    try {
      await client.post(`/tasks/${id}/complete/`);
      useTasksStore.getState().invalidate();
      fetchTasks();
      toast.success('Task completed! 🎉');
    } catch { toast.error('Failed'); }
  };

  const deleteTask = async (id) => {
    try { await client.delete(`/tasks/${id}/`); useTasksStore.getState().invalidate(); fetchTasks(); }
    catch { toast.error('Failed'); }
  };

  const resetDay = async () => {
    try { await client.post('/tasks/reset_today/'); useTasksStore.getState().invalidate(); fetchTasks(); toast.success('Day reset'); }
    catch { toast.error('Failed'); }
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
      setExpandedTask(null);
    } catch { toast.error('Failed to save'); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await client.post('/tasks/', form);
      toast.success('Task added');
      useTasksStore.getState().invalidate();
      fetchTasks();
      setShowForm(false);
      setForm({ title: '', task_type: 'daily', priority: 'medium' });
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  const pending = tasks.filter(t => t.status !== 'completed');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">Today ({pending.length} remaining)</h1>
        <div className="flex gap-2">
          <button onClick={resetDay} className="p-2.5 border border-slate-200 dark:border-[#475569] rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-[#334155]"><HiOutlineArrowPath className="w-4 h-4" /></button>
          <button onClick={() => setShowForm(!showForm)} className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"><HiOutlinePlus className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Quick add */}
      {showForm && (
        <form onSubmit={addTask} className="flex gap-2">
          <input type="text" required placeholder="Task title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          <button type="submit" className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium">Add</button>
        </form>
      )}

      {/* Pending tasks */}
      <div className="space-y-2">
        {pending.length === 0 && <p className="text-center text-slate-400 py-12 text-sm">All done for today! 🎉</p>}
        {pending.map(task => (
          <div key={task.id} className={`rounded-2xl border p-4 transition-all ${statusStyles[task.status]}`}>
            <div className="flex items-center gap-3">
              {/* Big complete button */}
              <button onClick={() => completeTask(task.id)}
                className="w-11 h-11 flex-shrink-0 rounded-full border-2 border-emerald-400 hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center transition-all group">
                <HiOutlineCheckCircle className="w-6 h-6 text-emerald-400 group-hover:text-white" />
              </button>

              {/* Task info — tap to expand notes */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleNotes(task)}>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{task.title}</p>
                {task.notes && !expandedTask && <p className="text-xs text-slate-400 mt-0.5 truncate">📝 {task.notes.split('\n')[0]}</p>}
              </div>

              {/* XP */}
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg flex-shrink-0">+{task.xp_reward}</span>

              {/* Expand arrow */}
              <button onClick={() => toggleNotes(task)} className="p-1.5 text-slate-400">
                {expandedTask === task.id ? <HiOutlineChevronUp className="w-4 h-4" /> : <HiOutlineChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Expanded notes */}
            {expandedTask === task.id && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#475569]">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={5}
                  placeholder="Write your notes here..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-[#475569] bg-slate-50 dark:bg-[#0B1220] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => saveNotes(task.id)} className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">Save Notes</button>
                  <button onClick={() => { saveNotes(task.id); setTimeout(() => completeTask(task.id), 300); }} className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">Save & Complete ✓</button>
                  <button onClick={() => deleteTask(task.id)} className="ml-auto px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completed section */}
      {completed.length > 0 && (
        <div className="pt-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Completed ({completed.length})</h3>
          <div className="space-y-1">
            {completed.map(task => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-900/30">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <HiOutlineCheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-slate-400 line-through flex-1 truncate">{task.title}</span>
                <span className="text-xs text-emerald-500 font-medium">+{task.xp_reward}xp</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
