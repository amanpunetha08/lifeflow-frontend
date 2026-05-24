import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiLightningBolt, HiCalendar, HiChartBar, HiFire, HiStar, HiClock } from 'react-icons/hi'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const features = [
  { icon: HiCalendar, title: 'Daily Scheduling', desc: 'Plan your day with smart time blocks and recurring routines.' },
  { icon: HiFire, title: 'Streak Tracking', desc: 'Build unbreakable habits with daily, weekly, and perfect-day streaks.' },
  { icon: HiChartBar, title: 'Productivity Scoring', desc: 'Track your discipline score and watch it grow over time.' },
  { icon: HiLightningBolt, title: 'XP & Leveling', desc: 'Earn XP for every task. Level up and unlock achievements.' },
  { icon: HiStar, title: 'Gamified Rewards', desc: 'Coins, badges, and daily challenges keep you motivated.' },
  { icon: HiClock, title: 'Smart Rollover', desc: 'Missed tasks auto-reschedule. Recurring tasks regenerate fresh.' },
]

const steps = [
  { num: '01', title: 'Create Tasks', desc: 'Add your daily routines and one-off tasks.' },
  { num: '02', title: 'Schedule Your Day', desc: 'Set times, priorities, and recurrence patterns.' },
  { num: '03', title: 'Complete & Earn', desc: 'Finish tasks to earn XP, coins, and streaks.' },
  { num: '04', title: 'Level Up', desc: 'Build discipline and unlock new achievements.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            LifeFlow
          </span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 dark:from-primary-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-[120px]" />
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Build Discipline.{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Track Progress.
            </span>
            <br />Level Up Your Life.
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-dark-300 max-w-2xl mx-auto">
            The gamified productivity scheduler that turns your daily routines into an RPG.
            Earn XP, maintain streaks, and build unbreakable discipline.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">Get Started Free</Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4">See Features</a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            Everything you need to{' '}
            <span className="text-primary-500">stay productive</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:border-primary-500/30 transition-colors shadow-sm dark:shadow-none"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.1 }}
              >
                <f.icon className="text-3xl text-primary-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-gray-600 dark:text-dark-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-100 dark:bg-dark-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            How it <span className="text-accent-500">works</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                className="flex gap-4"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.15 }}
              >
                <span className="text-4xl font-bold text-primary-500/30">{s.num}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                  <p className="text-gray-600 dark:text-dark-400 text-sm mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            Your <span className="text-primary-500">command center</span>
          </motion.h2>
          <motion.div
            className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-sm dark:shadow-none"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            {[
              { label: 'Tasks Today', value: '12', color: 'text-primary-500' },
              { label: 'XP Earned', value: '340', color: 'text-green-500' },
              { label: 'Current Streak', value: '7 days', color: 'text-orange-500' },
              { label: 'Discipline', value: '82%', color: 'text-accent-500' },
            ].map((stat) => (
              <div key={stat.label} className="p-4">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-500 dark:text-dark-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-100 dark:bg-dark-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">What users say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Alex K.', text: 'The streak system is addictive. I haven\'t missed a day in 3 weeks!' },
              { name: 'Sarah M.', text: 'Finally a productivity app that makes me want to complete tasks.' },
              { name: 'James R.', text: 'The XP system and leveling up keeps me motivated every single day.' },
            ].map((t) => (
              <div key={t.name} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <p className="text-gray-600 dark:text-dark-300 text-sm italic">"{t.text}"</p>
                <p className="mt-4 font-semibold text-sm text-gray-900 dark:text-white">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Ready to level up?</h2>
          <p className="text-gray-600 dark:text-dark-400 mb-8">Join thousands building better habits with LifeFlow.</p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4">Start Your Journey</Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/5 py-10 px-6 bg-white dark:bg-transparent">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-lg font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            LifeFlow
          </span>
          <div className="flex gap-6 text-gray-500 dark:text-dark-400 text-sm">
            <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition">Features</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">About</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">GitHub</a>
          </div>
          <p className="text-gray-400 dark:text-dark-500 text-sm">© 2025 LifeFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
