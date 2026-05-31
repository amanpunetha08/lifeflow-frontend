import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { HiChevronLeft, HiChevronRight, HiPlus } from 'react-icons/hi2';

const sampleEvents = [
  { id: 1, title: 'Team Standup', date: new Date(), color: 'bg-indigo-500' },
  { id: 2, title: 'Deep Work Session', date: new Date(), color: 'bg-emerald-500' },
  { id: 3, title: 'Review PRs', date: new Date(), color: 'bg-amber-500' },
];

export default function Calendar() {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [view, setView] = useState('month');

  const monthDays = eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) });
  const startDay = startOfMonth(current).getDay();
  const selectedEvents = sampleEvents.filter((e) => isSameDay(e.date, selected));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['month', 'week', 'day', 'agenda'].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm ${view === v ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrent(new Date())} className="text-sm text-gray-400 hover:text-white px-3 py-1.5 border border-gray-200 dark:border-[#2a2a3e] rounded-lg">Today</button>
          <button onClick={() => setCurrent(subMonths(current, 1))} className="text-gray-400 hover:text-white p-1"><HiChevronLeft className="w-5 h-5" /></button>
          <span className="text-white font-medium">{format(current, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrent(addMonths(current, 1))} className="text-gray-400 hover:text-white p-1"><HiChevronRight className="w-5 h-5" /></button>
          <button className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm">
            <HiPlus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e]">
          <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-3">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
              <span key={d}>{d.slice(0, 3)}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(startDay).fill(null).map((_, i) => <div key={`e${i}`} className="h-24" />)}
            {monthDays.map((day) => (
              <div key={day.toISOString()} onClick={() => setSelected(day)}
                className={`h-24 p-2 rounded-xl border cursor-pointer transition-colors ${
                  isSameDay(day, selected) ? 'border-indigo-500 bg-indigo-500/5' :
                  isToday(day) ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-gray-200 dark:border-[#2a2a3e] hover:border-[#3a3a4e]'
                }`}>
                <span className={`text-xs ${isToday(day) ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}>{format(day, 'd')}</span>
                <div className="mt-1 space-y-0.5">
                  {sampleEvents.filter((e) => isSameDay(e.date, day)).map((e) => (
                    <div key={e.id} className={`${e.color} text-white text-[10px] px-1 py-0.5 rounded truncate`}>{e.title}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e]">
          <h3 className="text-white font-semibold mb-4">Events on {format(selected, 'MMM d')}</h3>
          <div className="space-y-3">
            {selectedEvents.length === 0 && <p className="text-gray-500 text-sm">No events</p>}
            {selectedEvents.map((e) => (
              <div key={e.id} className="p-3 rounded-xl bg-gray-50 dark:bg-[#0f0f1a] border border-gray-200 dark:border-[#2a2a3e]">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${e.color}`} />
                  <span className="text-sm text-gray-900 dark:text-white">{e.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
