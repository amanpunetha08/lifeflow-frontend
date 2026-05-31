import { useState, useEffect, useRef } from 'react';

const MODES = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 };

export default function FocusMode() {
  const [mode, setMode] = useState('pomodoro');
  const [time, setTime] = useState(MODES.pomodoro);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && time > 0) {
      intervalRef.current = setInterval(() => setTime((t) => t - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      if (time === 0 && running) {
        setSessions((s) => [...s, { mode, completedAt: new Date().toLocaleTimeString() }]);
        setRunning(false);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [running, time]);

  const switchMode = (m) => { setMode(m); setTime(MODES[m]); setRunning(false); };
  const toggle = () => setRunning(!running);
  const reset = () => { setTime(MODES[mode]); setRunning(false); };

  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const total = MODES[mode];
  const progress = ((total - time) / total) * 100;
  const circumference = 2 * Math.PI * 120;

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-3">
        {[['pomodoro', 'Pomodoro'], ['short', 'Short Break'], ['long', 'Long Break']].map(([k, label]) => (
          <button key={k} onClick={() => switchMode(k)}
            className={`px-5 py-2 rounded-xl text-sm ${mode === k ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90">
            <circle cx="128" cy="128" r="120" fill="none" stroke="#1a1a2e" strokeWidth="8" />
            <circle cx="128" cy="128" r="120" fill="none" stroke="#6366f1" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white font-mono">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-gray-400 text-sm mt-2 capitalize">{mode === 'pomodoro' ? 'Focus Time' : mode.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={toggle}
            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-8 py-3 font-medium text-lg">
            {running ? 'Pause' : 'Start Focus'}
          </button>
          <button onClick={reset} className="border border-gray-200 dark:border-[#2a2a3e] text-gray-400 hover:text-white rounded-xl px-6 py-3">Reset</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] text-center">
          <p className="text-gray-400 text-sm">Today's Focus</p>
          <p className="text-2xl font-bold text-white mt-1">{sessions.length} sessions</p>
        </div>
        <div className="rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] text-center">
          <p className="text-gray-400 text-sm">Total Focus</p>
          <p className="text-2xl font-bold text-white mt-1">{sessions.length * 25}m</p>
        </div>
      </div>

      {/* Session History */}
      {sessions.length > 0 && (
        <div className="rounded-2xl p-6 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] max-w-md mx-auto">
          <h3 className="text-white font-semibold mb-3">Session History</h3>
          <div className="space-y-2">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-50 dark:bg-[#0f0f1a]">
                <span className="text-gray-300 capitalize">{s.mode}</span>
                <span className="text-gray-500">{s.completedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
