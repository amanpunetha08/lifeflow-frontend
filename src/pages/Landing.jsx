import { Link } from 'react-router-dom';
import { HiCalendarDays, HiArrowPath, HiTrophy, HiChartBar, HiBolt, HiStar } from 'react-icons/hi2';

const features = [
  { icon: HiCalendarDays, title: 'Smart Scheduler', desc: 'Plan your day with intelligent scheduling', color: 'text-indigo-400 bg-indigo-500/10' },
  { icon: HiArrowPath, title: 'Habit Tracking', desc: 'Build and maintain good habits', color: 'text-emerald-400 bg-emerald-500/10' },
  { icon: HiTrophy, title: 'Gamified System', desc: 'Earn XP, unlock badges and level up', color: 'text-amber-400 bg-amber-500/10' },
  { icon: HiChartBar, title: 'Analytics', desc: 'Visualize your progress with powerful charts', color: 'text-purple-400 bg-purple-500/10' },
  { icon: HiBolt, title: 'Streaks', desc: 'Stay consistent and win streaks', color: 'text-rose-400 bg-rose-500/10' },
  { icon: HiStar, title: 'Achievements', desc: 'Unlock badges and titles', color: 'text-cyan-400 bg-cyan-500/10' },
];

const steps = [
  { num: 1, title: 'Plan Your Day', desc: 'Add tasks and set time & priority' },
  { num: 2, title: 'Complete Tasks', desc: 'Track progress and stay focused' },
  { num: 3, title: 'Earn XP', desc: 'Complete tasks and earn rewards' },
  { num: 4, title: 'Level Up', desc: 'Maintain streaks and increase discipline' },
  { num: 5, title: 'Be Your Best', desc: 'Build discipline and achieve your goals' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto relative z-10">
        <h1 className="text-2xl font-bold"><span className="text-indigo-400">✦ Life</span>Flow</h1>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how" className="hover:text-white transition">How It Works</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
          <a href="#" className="hover:text-white transition">Blog</a>
          <a href="#" className="hover:text-white transition">About</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white px-4 py-2">Login</Link>
          <Link to="/register" className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 py-2.5 font-medium">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-24 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Build Discipline.<br />
              Track Progress.<br />
              <span className="text-indigo-400">Level Up Your Life.</span>
            </h2>
            <p className="mt-6 text-gray-400 text-lg max-w-md">
              LifeFlow is a gamified daily scheduler that helps you plan your day, build habits, and achieve your goals — one task at a time.
            </p>
            <div className="flex gap-4 mt-8">
              <Link to="/register" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-8 py-3.5 font-semibold text-sm transition">
                Get Started Free
              </Link>
              <a href="#how" className="border border-[#2a2a3e] hover:border-gray-500 text-white rounded-full px-8 py-3.5 font-semibold text-sm transition">
                See How It Works
              </a>
            </div>
          </div>

          {/* Right - Character area with floating stats */}
          <div className="relative flex justify-center items-center min-h-[400px]">
            {/* Gradient glow */}
            <div className="absolute w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
            <div className="absolute w-60 h-60 bg-purple-500/15 rounded-full blur-[80px] translate-x-10 translate-y-10" />

            {/* Character placeholder */}
            <div className="relative w-64 h-80 bg-gradient-to-b from-indigo-900/30 to-purple-900/20 rounded-3xl border border-indigo-500/20 flex items-center justify-center">
              <span className="text-8xl">🧑‍💻</span>
            </div>

            {/* Floating stat badges */}
            <div className="absolute top-4 right-4 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-orange-400">🔥</span>
              <div>
                <div className="text-white font-bold text-sm">24</div>
                <div className="text-gray-500 text-xs">Day Streak</div>
              </div>
            </div>

            <div className="absolute top-20 left-0 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl px-4 py-2">
              <div className="text-indigo-400 font-bold text-sm">Level 12</div>
              <div className="text-gray-500 text-xs">Disciplined</div>
            </div>

            <div className="absolute bottom-20 left-0 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-purple-400">⚡</span>
              <div>
                <div className="text-white font-bold text-sm">2,450</div>
                <div className="text-gray-500 text-xs">Total XP</div>
              </div>
            </div>

            <div className="absolute bottom-4 right-8 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-emerald-400">🛡️</span>
              <div>
                <div className="text-white font-bold text-sm">82</div>
                <div className="text-gray-500 text-xs">Discipline Score</div>
              </div>
            </div>

            <div className="absolute bottom-32 right-0 bg-indigo-500/20 border border-indigo-500/30 rounded-xl px-3 py-1.5">
              <span className="text-indigo-300 text-xs font-medium">XP Today +250 XP</span>
            </div>
          </div>
        </div>

      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-20">
        <h3 className="text-center text-2xl font-bold mb-2">Powerful features to level up your productivity</h3>
        <p className="text-center text-gray-500 mb-12">Everything you need to build discipline and track progress</p>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-5 text-center hover:border-indigo-500/30 transition">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mx-auto mb-3`}>
                <f.icon className="text-xl" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
              <p className="text-gray-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="max-w-7xl mx-auto px-8 py-20">
        <h3 className="text-center text-2xl font-bold mb-12">How It Works</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-5 text-center w-44">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                  {s.num}
                </div>
                <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
                <p className="text-gray-500 text-xs">{s.desc}</p>
              </div>
              {i < steps.length - 1 && <span className="text-gray-600 text-xl hidden md:block">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-20">
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to become the best version of yourself?</h3>
          <p className="text-gray-400 mb-8">Join LifeFlow and start your journey today.</p>
          <Link to="/register" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-10 py-4 font-semibold inline-block transition">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a2e] py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-lg font-bold"><span className="text-indigo-400">✦ Life</span>Flow</h1>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#">Features</a>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <p className="text-gray-600 text-sm">© 2025 LifeFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
