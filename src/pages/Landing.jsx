import { Link } from 'react-router-dom';
import { HiOutlineCalendarDays, HiOutlineArrowPath, HiOutlineChartBarSquare, HiOutlineFire, HiOutlineClock, HiOutlineTrophy } from 'react-icons/hi2';

const features = [
  { icon: HiOutlineCalendarDays, title: 'Smart Scheduler', desc: 'AI-powered task scheduling that adapts to your rhythm', color: 'text-emerald-500' },
  { icon: HiOutlineArrowPath, title: 'Habit Tracking', desc: 'Build lasting habits with streak tracking and reminders', color: 'text-cyan-500' },
  { icon: HiOutlineChartBarSquare, title: 'Analytics', desc: 'Deep insights into your productivity patterns', color: 'text-amber-500' },
  { icon: HiOutlineFire, title: 'Streaks', desc: 'Stay motivated with daily streaks and milestones', color: 'text-red-500' },
  { icon: HiOutlineClock, title: 'Focus Mode', desc: 'Distraction-free deep work sessions with timers', color: 'text-cyan-500' },
  { icon: HiOutlineTrophy, title: 'Achievements', desc: 'Unlock achievements as you build discipline', color: 'text-amber-500' },
];

const steps = ['Set your goals and daily tasks', 'Build habits with smart reminders', 'Track progress with analytics', 'Achieve more with less effort'];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1220]">
      <nav className="flex items-center justify-between px-6 lg:px-20 py-5 border-b border-slate-100 dark:border-[#475569]">
        <div className="flex items-center gap-2"><span className="text-2xl">🌿</span><span className="text-xl font-bold text-slate-900 dark:text-slate-50">LifeFlow</span></div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-300">
          <a href="#features">Features</a><a href="#how">How It Works</a><a href="#pricing">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600">Login</Link>
          <Link to="/register" className="text-sm px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors">Get Started</Link>
        </div>
      </nav>

      <section className="px-6 lg:px-20 py-24 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">Build Discipline.<br />Track Progress.<br />Achieve More.</h1>
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">The smart productivity system that combines task management, habit tracking, and analytics to help you build lasting discipline.</p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">Start Free</Link>
          <a href="#features" className="px-8 py-3 border border-slate-200 dark:border-[#475569] text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-[#334155] transition-colors">Learn More</a>
        </div>
      </section>

      <section id="features" className="px-6 lg:px-20 py-20 bg-slate-50 dark:bg-[#111827]">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-50 mb-12">Everything you need to stay on track</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="p-6 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#475569]">
              <Icon className={`w-8 h-8 ${color} mb-4`} />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="px-6 lg:px-20 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-50 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mx-auto mb-3">{i + 1}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-20 py-20 bg-slate-50 dark:bg-[#111827]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Ready to build discipline?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">Join thousands who are achieving more with LifeFlow.</p>
          <Link to="/register" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">Get Started Free</Link>
        </div>
      </section>

      <footer className="px-6 lg:px-20 py-8 border-t border-slate-100 dark:border-[#475569] text-center text-sm text-slate-500">
        © 2024 LifeFlow. Built for builders.
      </footer>
    </div>
  );
}
