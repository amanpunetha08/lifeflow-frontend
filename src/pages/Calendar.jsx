import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import client from '../api/client';

export default function Calendar() {
  const [current, setCurrent] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { client.get('/tasks/today/').then(r => setTasks(r.data.results || r.data || [])).catch(() => {}); }, []);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const start = startOfWeek(monthStart);
  const end = endOfWeek(monthEnd);

  const days = [];
  let day = start;
  while (day <= end) { days.push(day); day = addDays(day, 1); }

  const tasksForDate = (d) => tasks.filter(t => t.date && isSameDay(new Date(t.date), d));

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{format(current, 'MMMM yyyy')}</h3>
          <div className="flex gap-1">
            <button onClick={() => setCurrent(subMonths(current, 1))} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#334155] transition-colors"><HiOutlineChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" /></button>
            <button onClick={() => setCurrent(addMonths(current, 1))} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#334155] transition-colors"><HiOutlineChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const hasTasks = tasksForDate(d).length > 0;
            return (
              <button key={i} onClick={() => setSelected(d)} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-colors ${!isSameMonth(d, current) ? 'text-slate-300 dark:text-slate-600' : isToday(d) ? 'bg-emerald-600 text-white font-bold' : selected && isSameDay(d, selected) ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#334155]'}`}>
                {format(d, 'd')}
                {hasTasks && <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569] p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">{selected ? format(selected, 'MMM d, yyyy') : 'Select a date'}</h3>
        {selected ? (
          tasksForDate(selected).length > 0 ? tasksForDate(selected).map(t => (
            <div key={t.id} className="p-3 mb-2 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-100 dark:border-[#475569]">
              <p className="text-sm text-slate-800 dark:text-slate-200">{t.title}</p>
              <p className="text-xs text-slate-400 mt-1">{t.status?.replace('_', ' ')}</p>
            </div>
          )) : <p className="text-sm text-slate-400">No tasks for this date</p>
        ) : <p className="text-sm text-slate-400">Click a date to see tasks</p>}
      </div>
    </div>
  );
}
