import { useState, useEffect, useRef } from 'react';

const MODES = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 };

export default function FocusMode() {
  const [mode, setMode] = useState('pomodoro');
  const [time, setTime] = useState(MODES.pomodoro);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && time > 0) {
      intervalRef.current = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0) {
      clearInterval(intervalRef.current);
      setRunning(false);
      if (mode === 'pomodoro') setSessions(s => s + 1);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, time]);

  const switchMode = (m) => { setMode(m); setTime(MODES[m]); setRunning(false); };
  const toggle = () => setRunning(!running);
  const reset = () => { setTime(MODES[mode]); setRunning(false); };

  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const progress = 1 - time / MODES[mode];
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Focus Mode</h1>

      {/* Mode tabs */}
      <div className="flex gap-2 justify-center">
        {[['pomodoro', 'Pomodoro'], ['short', 'Short Break'], ['long', 'Long Break']].map(([key, label]) => (
          <button key={key} onClick={() => switchMode(key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${mode === key ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#475569]'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90">
            <circle cx="128" cy="128" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
            <circle cx="128" cy="128" r={radius} fill="none" stroke="currentColor" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              className="text-emerald-500 transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold font-mono text-slate-900 dark:text-slate-50">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-sm text-slate-400 mt-1 capitalize">{mode === 'pomodoro' ? 'Focus Time' : mode === 'short' ? 'Short Break' : 'Long Break'}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button onClick={toggle}
          className={`px-8 py-3 rounded-xl text-sm font-semibold transition ${running ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
          {running ? 'Pause' : 'Start Focus'}
        </button>
        <button onClick={reset}
          className="px-6 py-3 rounded-xl text-sm font-medium border border-slate-200 dark:border-[#475569] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#334155] transition">
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#475569] p-5 text-center">
          <p className="text-2xl font-bold text-emerald-500">{sessions}</p>
          <p className="text-xs text-slate-400 mt-1">Sessions Today</p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#475569] p-5 text-center">
          <p className="text-2xl font-bold text-cyan-500">{Math.round(sessions * 25 / 60 * 10) / 10}h</p>
          <p className="text-xs text-slate-400 mt-1">Total Focus</p>
        </div>
      </div>
    </div>
  );
}
