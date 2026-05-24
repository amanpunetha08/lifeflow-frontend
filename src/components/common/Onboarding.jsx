import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowRight, HiArrowLeft, HiLightningBolt, HiCalendar, HiClock } from 'react-icons/hi'
import api from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import CreateTaskFlow from '../tasks/CreateTaskFlow'

const steps = ['welcome', 'name', 'schedule', 'routines', 'tutorial', 'first_task', 'done']

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [dayStart, setDayStart] = useState('09:00')
  const [dayEnd, setDayEnd] = useState('23:00')
  const [createdTasks, setCreatedTasks] = useState([])
  const setUser = useAuthStore((s) => s.setUser)

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const finishOnboarding = async () => {
    try {
      const { data } = await api.post('/auth/onboarding/complete/', {
        display_name: displayName,
        day_start_time: dayStart,
        day_end_time: dayEnd,
      })
      setUser(data)
      toast.success('Welcome to LifeFlow! 🎉')
      onComplete()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleTaskCreated = (task) => {
    setCreatedTasks([...createdTasks, task])
    toast.success(`Task "${task.title}" created!`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-dark-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="relative w-full max-w-xl"
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress bar */}
          <div className="flex gap-1 mb-8">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary-500' : 'bg-dark-700'}`} />
            ))}
          </div>

          {/* Step: Welcome */}
          {steps[step] === 'welcome' && (
            <div className="glass p-8 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h1 className="text-3xl font-bold mb-3">Welcome to LifeFlow!</h1>
              <p className="text-dark-300 mb-8">
                Let's set you up in just a minute. We'll help you understand how the system works
                and create your first tasks.
              </p>
              <button onClick={next} className="btn-primary inline-flex items-center gap-2">
                Let's Go <HiArrowRight />
              </button>
            </div>
          )}

          {/* Step: Name */}
          {steps[step] === 'name' && (
            <div className="glass p-8">
              <h2 className="text-2xl font-bold mb-2">What should we call you?</h2>
              <p className="text-dark-400 text-sm mb-6">This is how we'll greet you on your dashboard.</p>
              <input
                type="text" value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-primary-500 transition"
                placeholder="Your name..."
                autoFocus
              />
              <div className="flex justify-between mt-8">
                <button onClick={prev} className="btn-secondary inline-flex items-center gap-1"><HiArrowLeft /> Back</button>
                <button onClick={next} disabled={!displayName.trim()} className="btn-primary inline-flex items-center gap-1 disabled:opacity-50">
                  Continue <HiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Step: Schedule - Day start/end */}
          {steps[step] === 'schedule' && (
            <div className="glass p-8">
              <h2 className="text-2xl font-bold mb-2">When does your day start & end?</h2>
              <p className="text-dark-400 text-sm mb-6">
                We'll use this to schedule your tasks. Any pending tasks after your day ends will automatically move to the next day.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-dark-300 mb-2 block">Day starts at</label>
                  <input
                    type="time" value={dayStart}
                    onChange={(e) => setDayStart(e.target.value)}
                    className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-primary-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-dark-300 mb-2 block">Day ends at</label>
                  <input
                    type="time" value={dayEnd}
                    onChange={(e) => setDayEnd(e.target.value)}
                    className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-primary-500 transition"
                  />
                </div>
              </div>

              <div className="bg-dark-800/50 rounded-xl p-4 border border-primary-500/20 mb-6">
                <p className="text-sm text-dark-300">
                  <span className="text-primary-400 font-medium">How it works:</span> Tasks are scheduled between {dayStart || '09:00'} and {dayEnd || '23:00'}.
                  If a task isn't completed by {dayEnd || '23:00'}, it automatically moves to the next day.
                </p>
              </div>

              <div className="flex justify-between">
                <button onClick={prev} className="btn-secondary inline-flex items-center gap-1"><HiArrowLeft /> Back</button>
                <button onClick={next} className="btn-primary inline-flex items-center gap-1">
                  Continue <HiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Step: Routines explanation */}
          {steps[step] === 'routines' && (
            <div className="glass p-8">
              <h2 className="text-2xl font-bold mb-4">How LifeFlow works</h2>
              <p className="text-dark-300 text-sm mb-6">There are two types of tasks you can create:</p>

              <div className="space-y-4 mb-8">
                <div className="bg-dark-800/50 rounded-xl p-4 border border-primary-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <HiCalendar className="text-primary-400 text-xl" />
                    </div>
                    <h3 className="font-semibold">Daily Tasks</h3>
                  </div>
                  <p className="text-dark-400 text-sm">
                    Recurring tasks that show up every day. Things like exercise, meditation, reading.
                    Always high priority. <span className="text-yellow-400">+10 XP</span> per completion.
                  </p>
                </div>

                <div className="bg-dark-800/50 rounded-xl p-4 border border-accent-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                      <HiClock className="text-accent-400 text-xl" />
                    </div>
                    <h3 className="font-semibold">Timeframe Tasks</h3>
                  </div>
                  <p className="text-dark-400 text-sm">
                    Tasks with a deadline spread over multiple days. We create daily sub-tasks for you.
                    If you miss a day, it piles up! <span className="text-yellow-400">+10 XP</span> per day completed.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={prev} className="btn-secondary inline-flex items-center gap-1"><HiArrowLeft /> Back</button>
                <button onClick={next} className="btn-primary inline-flex items-center gap-1">Got it <HiArrowRight /></button>
              </div>
            </div>
          )}

          {/* Step: Tutorial */}
          {steps[step] === 'tutorial' && (
            <div className="glass p-8">
              <h2 className="text-2xl font-bold mb-4">Quick tips</h2>
              <div className="space-y-3 mb-8">
                {[
                  { icon: '✅', text: 'Complete tasks daily to earn XP and build streaks' },
                  { icon: '🔥', text: 'Missing daily tasks breaks your streak and reduces discipline' },
                  { icon: '📋', text: 'Timeframe tasks pile up if missed — stay on top of them!' },
                  { icon: '⏰', text: `Pending tasks after ${dayEnd} auto-move to tomorrow` },
                  { icon: '⭐', text: 'Level up by earning XP. Each level needs level × 100 XP' },
                  { icon: '🏷️', text: 'Use tags to organize tasks (you can create custom ones)' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 bg-dark-800/50 rounded-lg p-3">
                    <span className="text-xl">{tip.icon}</span>
                    <span className="text-sm text-dark-200">{tip.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <button onClick={prev} className="btn-secondary inline-flex items-center gap-1"><HiArrowLeft /> Back</button>
                <button onClick={next} className="btn-primary inline-flex items-center gap-1">Create my first task <HiArrowRight /></button>
              </div>
            </div>
          )}

          {/* Step: First task creation */}
          {steps[step] === 'first_task' && (
            <div className="glass p-8">
              <h2 className="text-2xl font-bold mb-2">Create your first task</h2>
              <p className="text-dark-400 text-sm mb-6">
                Try creating a task below. You can always create more later!
                {createdTasks.length > 0 && (
                  <span className="text-green-400 ml-2">({createdTasks.length} created ✓)</span>
                )}
              </p>

              <CreateTaskFlow onCreated={handleTaskCreated} compact />

              <div className="flex justify-between mt-6">
                <button onClick={prev} className="btn-secondary inline-flex items-center gap-1"><HiArrowLeft /> Back</button>
                <button onClick={next} className="btn-primary inline-flex items-center gap-1">
                  {createdTasks.length > 0 ? 'Finish Setup' : 'Skip for now'} <HiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Step: Done */}
          {steps[step] === 'done' && (
            <div className="glass p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-3">You're all set, {displayName}!</h2>
              <p className="text-dark-300 mb-2">
                Your day runs from <span className="text-primary-400 font-medium">{dayStart}</span> to <span className="text-primary-400 font-medium">{dayEnd}</span>.
              </p>
              <p className="text-dark-400 text-sm mb-8">
                Any incomplete tasks after {dayEnd} will automatically move to tomorrow.
              </p>
              <button onClick={finishOnboarding} className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                <HiLightningBolt /> Enter Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
