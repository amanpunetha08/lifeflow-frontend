import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { HiViewGrid, HiViewList, HiLogout, HiPlus, HiX, HiLightningBolt } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import TaskCard from '../../components/tasks/TaskCard'
import TaskList from '../../components/tasks/TaskList'
import CreateTaskFlow from '../../components/tasks/CreateTaskFlow'
import Onboarding from '../../components/common/Onboarding'
import ThemeToggle from '../../components/common/ThemeToggle'
import GamificationPanel from '../../components/gamification/GamificationPanel'
import { DisciplineMeter, ChaosMeter } from '../../components/gamification/Meters'
import DailyChallenges from '../../components/gamification/DailyChallenges'
import XPPopup from '../../components/gamification/XPPopup'

export default function Dashboard() {
  const [view, setView] = useState('card')
  const [showCreate, setShowCreate] = useState(false)
  const [xpPopup, setXpPopup] = useState({ show: false, amount: 0 })
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [showOnboarding, setShowOnboarding] = useState(!user?.onboarding_completed)

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['tasks-today'],
    queryFn: async () => (await api.get('/tasks/today/')).data,
  })

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/profile/')
      setUser(data)
    } catch {}
  }

  const handleTaskAction = () => {
    refetch()
    refreshUser()
  }

  const handleTaskComplete = (xpAmount = 10) => {
    setXpPopup({ show: true, amount: xpAmount })
    refetch()
    refreshUser()
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleOnboardingComplete = async () => {
    // Refresh user profile
    try {
      const { data } = await api.get('/auth/profile/')
      setUser(data)
    } catch {}
    setShowOnboarding(false)
    refetch()
  }

  // Show onboarding for first-time users
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-white/5 border-b border-gray-200 dark:border-white/5 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            LifeFlow
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-dark-300 hidden md:block">Hi, {user?.display_name || user?.username}!</span>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full">
              <HiLightningBolt className="text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-white">{user?.xp || 0} XP</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full">
              <span className="text-sm text-gray-700 dark:text-white">Lv.{user?.level || 1}</span>
            </div>
            <ThemeToggle />
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-700 dark:text-dark-400 dark:hover:text-white transition">
              <HiLogout className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Gamification Panel */}
        <GamificationPanel user={user} />

        {/* Meters + Challenges */}
        <div className="grid md:grid-cols-3 gap-4 mt-4 mb-6">
          <DisciplineMeter score={user?.discipline_score} />
          <ChaosMeter chaos={user?.chaos_meter} />
          <DailyChallenges />
        </div>

        {/* XP Progress Bar */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-8">
          <div className="flex justify-between text-sm mb-2 text-gray-700 dark:text-white">
            <span>Level {user?.level || 1} Progress</span>
            <span>{user?.xp || 0} / {(user?.level || 1) * 100} XP</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-800 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((user?.xp || 0) / ((user?.level || 1) * 100)) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Task Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Tasks</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
            >
              {showCreate ? <><HiX /> Close</> : <><HiPlus /> New Task</>}
            </button>
            <button
              onClick={() => setView('card')}
              className={`p-2 rounded-lg transition ${view === 'card' ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-dark-400 hover:text-gray-700 dark:hover:text-white'}`}
            >
              <HiViewGrid />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition ${view === 'list' ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-dark-400 hover:text-gray-700 dark:hover:text-white'}`}
            >
              <HiViewList />
            </button>
          </div>
        </div>

        {/* Inline Create Task Flow */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <CreateTaskFlow onCreated={() => { refetch(); setShowCreate(false) }} />
            </motion.div>
          )}
        </AnimatePresence>

        {tasks.length === 0 && !showCreate ? (
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-500 dark:text-dark-400 mb-4">No tasks for today. Create one to get started!</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-1">
              <HiPlus /> Create Task
            </button>
          </div>
        ) : view === 'card' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} onDelete={handleTaskAction} />
            ))}
          </div>
        ) : (
          <TaskList tasks={tasks} onComplete={handleTaskComplete} onDelete={handleTaskAction} />
        )}
      </main>

      <XPPopup xp={xpPopup.amount} show={xpPopup.show} onDone={() => setXpPopup({ show: false, amount: 0 })} />
    </div>
  )
}
