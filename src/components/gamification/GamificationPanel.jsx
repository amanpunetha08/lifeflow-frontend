import { motion } from 'framer-motion'
import { HiFire, HiStar, HiLightningBolt, HiShieldCheck } from 'react-icons/hi'

const RANKS = [
  { min: 0, name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { min: 20, name: 'Silver', color: 'text-gray-300', bg: 'bg-gray-400/10' },
  { min: 40, name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { min: 60, name: 'Diamond', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { min: 80, name: 'Legendary', color: 'text-purple-400', bg: 'bg-purple-500/10' },
]

const LEVEL_TITLES = {
  1: 'Beginner', 5: 'Focused', 10: 'Disciplined', 15: 'Warrior', 20: 'Mastermind',
}

function getRank(discipline) {
  return [...RANKS].reverse().find(r => discipline >= r.min) || RANKS[0]
}

function getLevelTitle(level) {
  const keys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a)
  const match = keys.find(k => level >= k)
  return LEVEL_TITLES[match] || 'Beginner'
}

export default function GamificationPanel({ user }) {
  const rank = getRank(user?.discipline_score || 0)
  const levelTitle = getLevelTitle(user?.level || 1)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Streak */}
      <motion.div
        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
      >
        <div className="text-3xl mb-1">
          {user?.streak_count > 0 ? '🔥' : '❄️'}
        </div>
        <div className="text-2xl font-bold text-orange-500">{user?.streak_count || 0}</div>
        <div className="text-xs text-gray-500 dark:text-dark-400">Day Streak</div>
        {user?.longest_streak > 0 && (
          <div className="text-xs text-gray-400 dark:text-dark-500 mt-1">Best: {user.longest_streak}d</div>
        )}
      </motion.div>

      {/* Level Badge */}
      <motion.div
        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
      >
        <div className="text-3xl mb-1">⚔️</div>
        <div className="text-2xl font-bold text-primary-500">Lv.{user?.level || 1}</div>
        <div className="text-xs text-gray-500 dark:text-dark-400">{levelTitle}</div>
        <div className="text-xs text-gray-400 dark:text-dark-500 mt-1">{user?.total_xp || 0} total XP</div>
      </motion.div>

      {/* Rank */}
      <motion.div
        className={`bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center`}
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
      >
        <div className="text-3xl mb-1">🏆</div>
        <div className={`text-lg font-bold ${rank.color}`}>{rank.name}</div>
        <div className="text-xs text-gray-500 dark:text-dark-400">Current Rank</div>
        <div className="text-xs text-gray-400 dark:text-dark-500 mt-1">Score: {(user?.discipline_score || 0).toFixed(0)}%</div>
      </motion.div>

      {/* Coins */}
      <motion.div
        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}
      >
        <div className="text-3xl mb-1">🪙</div>
        <div className="text-2xl font-bold text-yellow-500">{user?.coins || 0}</div>
        <div className="text-xs text-gray-500 dark:text-dark-400">Coins</div>
        <div className="text-xs text-gray-400 dark:text-dark-500 mt-1">{user?.total_completed_tasks || 0} tasks done</div>
      </motion.div>
    </div>
  )
}
