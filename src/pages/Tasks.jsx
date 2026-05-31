import { useState, useEffect } from 'react';
import { HiPlus, HiFunnel, HiArrowPath } from 'react-icons/hi2';
import client from '../api/client';
import toast from 'react-hot-toast';

const priorityClass = { high: 'bg-rose-500/20 text-rose-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-emerald-500/20 text-emerald-400' };
const statusClass = { completed: 'bg-emerald-500/20 text-emerald-400', in_progress: 'bg-amber-500/20 text-amber-400', todo: 'bg-gray-500/20 text-gray-400', missed: 'bg-rose-500/20 text-rose-400' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('list');
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', task_type: 'daily' });

  useEffect(() => {
    client.get('/tasks/today/').then((r) => setTasks(r.data?.results || r.data || [])).catch(() => {});
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await client.post('/tasks/', newTask);
      setTasks((prev) => [data, ...prev]);
      setShowAdd(false);
      setNewTask({ title: '', priority: 'medium', task_type: 'daily' });
      toast.success('Task created!');
    } catch { toast.error('Failed to create task'); }
  };

  const deleteTask = async (id) => {
    try {
      await client.delete(`/tasks/${id}/`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const resetToday = async () => {
    if (!confirm('This will mark all pending tasks as missed, apply demerits, and create fresh tasks. Continue?')) return;
    try {
      const { data } = await client.post('/tasks/reset_today/');
      toast.success(`Reset done! ${data.created.length} tasks created.`);
      client.get('/tasks/today/').then((r) => setTasks(r.data?.results || r.data || []));
    } catch { toast.error('Reset failed'); }
  };

  const columns = ['todo', 'in_progress', 'completed'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['list', 'board', 'card'].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm ${view === v ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={resetToday} className="flex items-center gap-1 border border-rose-500/30 text-rose-400 rounded-xl px-4 py-2 text-sm hover:bg-rose-500/10">
            <HiArrowPath className="w-4 h-4" /> Reset Day
          </button>
          <button className="flex items-center gap-1 border border-[#2a2a3e] text-gray-400 rounded-xl px-4 py-2 text-sm hover:text-white">
            <HiFunnel className="w-4 h-4" /> Filter
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm">
            <HiPlus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAdd && (
        <div className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e] space-y-4">
          <h3 className="text-white font-semibold">Create New Task</h3>
          <form onSubmit={addTask} className="space-y-4">
            {/* Step 1: Title */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">Task Name</label>
              <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-white" placeholder="What needs to be done?" required />
            </div>

            {/* Step 2: Type */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">Task Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setNewTask({ ...newTask, task_type: 'daily', priority: 'high' })}
                  className={`p-4 rounded-xl border text-left ${newTask.task_type === 'daily' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[#2a2a3e] bg-[#0f0f1a]'}`}>
                  <div className="text-lg mb-1">📅</div>
                  <div className="text-sm font-medium text-white">Daily Routine</div>
                  <div className="text-xs text-gray-500 mt-1">Repeats every day • High priority • +10 XP</div>
                </button>
                <button type="button" onClick={() => setNewTask({ ...newTask, task_type: 'timeframe', priority: 'medium' })}
                  className={`p-4 rounded-xl border text-left ${newTask.task_type === 'timeframe' ? 'border-amber-500 bg-amber-500/10' : 'border-[#2a2a3e] bg-[#0f0f1a]'}`}>
                  <div className="text-lg mb-1">⏰</div>
                  <div className="text-sm font-medium text-white">Time-Based</div>
                  <div className="text-xs text-gray-500 mt-1">One-time or multi-day • Custom priority</div>
                </button>
              </div>
            </div>

            {/* Step 3: Priority (only for time-based) */}
            {newTask.task_type === 'timeframe' && (
              <div>
                <label className="text-sm text-gray-400 block mb-2">Priority & XP</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'low', label: 'Low', xp: '+5 XP', penalty: '-10 XP', color: 'emerald' },
                    { val: 'medium', label: 'Medium', xp: '+8 XP', penalty: '-16 XP', color: 'amber' },
                    { val: 'high', label: 'High', xp: '+10 XP', penalty: '-20 XP', color: 'rose' },
                  ].map((p) => (
                    <button key={p.val} type="button" onClick={() => setNewTask({ ...newTask, priority: p.val })}
                      className={`p-3 rounded-xl border text-center ${newTask.priority === p.val ? `border-${p.color}-500 bg-${p.color}-500/10` : 'border-[#2a2a3e] bg-[#0f0f1a]'}`}>
                      <div className={`text-sm font-medium ${newTask.priority === p.val ? `text-${p.color}-400` : 'text-white'}`}>{p.label}</div>
                      <div className="text-xs text-gray-500">{p.xp}</div>
                      <div className="text-xs text-rose-400/70">Miss: {p.penalty}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Daily info */}
            {newTask.task_type === 'daily' && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                <p className="text-sm text-indigo-300">✓ High priority • +10 XP on complete • -20 XP if missed • Auto-repeats daily</p>
              </div>
            )}

            {/* Timeframe days */}
            {newTask.task_type === 'timeframe' && (
              <div>
                <label className="text-sm text-gray-400 block mb-1">Duration (days, optional)</label>
                <input type="number" min="1" value={newTask.timeframe_days || ''} onChange={(e) => setNewTask({ ...newTask, timeframe_days: parseInt(e.target.value) || null })}
                  className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-white" placeholder="Leave empty for single task" />
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 text-sm font-medium">Create Task</button>
              <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white px-4 py-3 text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a3e] overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_120px_100px_80px_60px] gap-4 px-6 py-3 text-xs text-gray-500 border-b border-[#2a2a3e]">
            <span>Title</span><span>Priority</span><span>Time</span><span>Status</span><span>XP</span><span></span>
          </div>
          {tasks.map((task) => (
            <div key={task.id} className="grid grid-cols-[1fr_80px_100px_120px_100px_80px_60px] gap-4 px-6 py-4 items-center border-b border-[#2a2a3e] last:border-0">
              <span className="text-white text-sm truncate">{task.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${task.task_type === 'daily' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'}`}>{task.task_type === 'daily' ? '📅 Daily' : '⏰ Timed'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${priorityClass[task.priority] || ''}`}>{task.priority}</span>
              <span className="text-xs text-gray-400">{task.start_time ? new Date(task.start_time).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true}) : '--'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${statusClass[task.status] || ''}`}>{task.status}</span>
              <span className="text-xs text-indigo-400">+{task.xp_reward || 10}</span>
              <button onClick={() => deleteTask(task.id)} className="text-gray-500 hover:text-rose-400 text-xs">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-3 gap-4">
          {columns.map((col) => (
            <div key={col} className="rounded-2xl p-4 bg-[#1a1a2e] border border-[#2a2a3e]">
              <h4 className="text-sm font-medium text-gray-300 mb-3 capitalize">{col.replace('_', ' ')}</h4>
              <div className="space-y-2">
                {tasks.filter((t) => t.status === col).map((task) => (
                  <div key={task.id} className="p-3 rounded-xl bg-[#0f0f1a] border border-[#2a2a3e]">
                    <p className="text-sm text-white mb-2">{task.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityClass[task.priority] || ''}`}>{task.priority}</span>
                      <span className="text-xs text-indigo-400">+{task.xp_reward || 10} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card View */}
      {view === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-2xl p-6 bg-[#1a1a2e] border border-[#2a2a3e]">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-white font-medium">{task.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityClass[task.priority] || ''}`}>{task.priority}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{task.start_time ? new Date(task.start_time).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true}) : ''} - {task.end_time ? new Date(task.end_time).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true}) : ''}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass[task.status] || ''}`}>{task.status}</span>
                <span className="text-xs text-indigo-400">+{task.xp_reward || 10} XP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
