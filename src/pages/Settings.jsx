import { useState } from 'react';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';
import client from '../api/client';
import { useTasksStore } from '../store/dataStore';
import toast from 'react-hot-toast';

export default function Settings() {
  const { theme, toggle } = useThemeStore();
  const { user } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.username || '');
  const [seeding, setSeeding] = useState(false);
  const [reportDays, setReportDays] = useState(2);
  const [copying, setCopying] = useState(false);

  const save = () => toast.success('Settings saved');

  const seedPlan = async () => {
    setSeeding(true);
    try {
      const { data } = await client.post('/scheduler/seed_plan/');
      if (data.status === 'already_seeded') {
        toast.error(`Plan already exists (${data.tasks} tasks found)`);
      } else {
        toast.success(`Created ${data.tasks} tasks (${data.start_date} to ${data.end_date})`);
        useTasksStore.getState().invalidate();
      }
    } catch { toast.error('Failed to generate plan'); }
    setSeeding(false);
  };

  const copyReport = async () => {
    setCopying(true);
    try {
      const { data } = await client.get(`/analytics/report/?days=${reportDays}`);
      // Format as readable text
      let text = `📊 PROGRESS REPORT (${data.period.start} to ${data.period.end})\n\n`;
      text += `✅ Completed: ${data.summary.completed}/${data.summary.total_tasks} (${data.summary.completion_rate}%)\n`;
      text += `❌ Missed: ${data.summary.missed}\n`;
      text += `⏳ Pending: ${data.summary.pending}\n`;
      text += `⚡ XP Earned: ${data.summary.xp_earned}\n`;
      text += `🔥 Streak: ${data.summary.streak} | Level: ${data.summary.level}\n\n`;

      text += `--- CATEGORY BREAKDOWN ---\n`;
      for (const [cat, info] of Object.entries(data.categories)) {
        text += `${cat}: ${info.completed}/${info.total} (${info.rate}%)\n`;
      }

      text += `\n--- DAILY LOG ---\n`;
      for (const day of data.daily) {
        text += `\n📅 ${day.date} — ${day.completed}/${day.total} done (${day.completion_rate}%)\n`;
        for (const t of day.tasks) {
          const icon = t.status === 'completed' ? '✅' : t.status === 'missed' ? '❌' : '⏳';
          text += `  ${icon} ${t.title}\n`;
          if (t.notes) text += `     📝 ${t.notes.replace(/\n/g, '\n     ')}\n`;
        }
      }

      await navigator.clipboard.writeText(text);
      toast.success('Report copied to clipboard!');
    } catch { toast.error('Failed to get report'); }
    setCopying(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Display Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Email</label>
            <input type="email" disabled value={user?.email || ''} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-slate-50 dark:bg-[#0B1220] text-slate-500 cursor-not-allowed" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300">Dark Mode</p>
            <p className="text-xs text-slate-400">Toggle between light and dark theme</p>
          </div>
          <button onClick={toggle} className={`w-11 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">2-Week Growth Plan</h3>
        <p className="text-xs text-slate-400 mb-4">Generate a 14-day plan with DSA, System Design, Finance, and Home Workout tasks starting tomorrow. Includes TRAP methodology notes templates.</p>
        <button onClick={seedPlan} disabled={seeding} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors">
          {seeding ? 'Generating...' : '🚀 Generate 2-Week Plan'}
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">📋 Progress Report</h3>
        <p className="text-xs text-slate-400 mb-4">Copy your progress report (tasks, notes, completion rates) to clipboard. Paste it to your coach/AI for review.</p>
        <div className="flex items-center gap-3">
          <select value={reportDays} onChange={e => setReportDays(Number(e.target.value))} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-sm text-slate-700 dark:text-slate-300">
            <option value={1}>Today</option>
            <option value={2}>Last 2 days</option>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
          </select>
          <button onClick={copyReport} disabled={copying} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors">
            {copying ? 'Copying...' : '📋 Copy Report'}
          </button>
        </div>
      </div>

      <button onClick={save} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">Save Changes</button>
    </div>
  );
}
