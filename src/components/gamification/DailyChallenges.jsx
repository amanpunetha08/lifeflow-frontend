import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { HiLightningBolt, HiCheck } from 'react-icons/hi'
import api from '../../api/client'

export default function DailyChallenges() {
  const { data: challenges = [] } = useQuery({
    queryKey: ['daily-challenges'],
    queryFn: async () => (await api.get('/gamification/challenges/')).data.results || (await api.get('/gamification/challenges/')).data,
  })

  if (challenges.length === 0) {
    return (
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Daily Challenges</h3>
        </div>
        <div className="space-y-2">
          {[
            { title: 'Complete 3 tasks', progress: 0, target: 3, xp: 15 },
            { title: 'No missed tasks today', progress: 1, target: 1, xp: 20 },
            { title: 'Finish a task before noon', progress: 0, target: 1, xp: 10 },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg p-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
                {c.progress}/{c.target}
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700 dark:text-dark-200">{c.title}</div>
                <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(c.progress / c.target) * 100}%` }}
                  />
                </div>
              </div>
              <span className="flex items-center gap-0.5 text-xs text-yellow-500 font-medium">
                <HiLightningBolt /> {c.xp}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎯</span>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Daily Challenges</h3>
      </div>
      <div className="space-y-2">
        {challenges.map((c) => (
          <div key={c.id} className="flex items-center gap-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg p-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${c.is_completed ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'}`}>
              {c.is_completed ? <HiCheck /> : `${c.progress}/${c.challenge.target_value}`}
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-700 dark:text-dark-200">{c.challenge.title}</div>
              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-1.5 mt-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${c.is_completed ? 'bg-green-500' : 'bg-primary-500'}`}
                  style={{ width: `${Math.min((c.progress / c.challenge.target_value) * 100, 100)}%` }}
                />
              </div>
            </div>
            <span className="flex items-center gap-0.5 text-xs text-yellow-500 font-medium">
              <HiLightningBolt /> {c.challenge.xp_reward}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
