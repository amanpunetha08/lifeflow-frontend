import { motion } from 'framer-motion'

export function DisciplineMeter({ score = 50 }) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const color = clampedScore >= 70 ? 'from-green-400 to-emerald-500' :
                clampedScore >= 40 ? 'from-yellow-400 to-orange-500' :
                'from-red-400 to-red-600'

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white">Discipline</span>
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-dark-200">{clampedScore.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-dark-800 rounded-full h-3">
        <motion.div
          className={`bg-gradient-to-r ${color} h-3 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedScore}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-dark-500 mt-2">
        {clampedScore >= 70 ? '💪 Great discipline! Keep it up.' :
         clampedScore >= 40 ? '⚠️ Room for improvement. Stay consistent.' :
         '🚨 Low discipline. Complete tasks to recover!'}
      </p>
    </div>
  )
}

export function ChaosMeter({ chaos = 0 }) {
  const clampedChaos = Math.max(0, Math.min(100, chaos))
  const color = clampedChaos <= 20 ? 'from-green-400 to-emerald-500' :
                clampedChaos <= 50 ? 'from-yellow-400 to-orange-500' :
                'from-red-500 to-red-700'

  // Visual chaos effect — shake intensity based on chaos level
  const shakeIntensity = clampedChaos > 60 ? { x: [0, -1, 1, -1, 0] } : {}

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg"
            animate={shakeIntensity}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            {clampedChaos > 60 ? '🌪️' : clampedChaos > 30 ? '💨' : '✨'}
          </motion.span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white">Chaos</span>
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-dark-200">{clampedChaos.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-dark-800 rounded-full h-3">
        <motion.div
          className={`bg-gradient-to-r ${color} h-3 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedChaos}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-dark-500 mt-2">
        {clampedChaos <= 20 ? '🧘 Calm and balanced. Well done!' :
         clampedChaos <= 50 ? '⚡ Some chaos building. Complete tasks to restore order.' :
         '🔥 High chaos! Missing tasks is causing disorder. Focus!'}
      </p>
    </div>
  )
}
