import { motion } from 'framer-motion'
import { HiLightningBolt, HiClock, HiCalendar, HiExclamation, HiTrash } from 'react-icons/hi'
import api from '../../api/client'
import toast from 'react-hot-toast'

const priorityColors = {
  light: {
    low: 'border-green-500/40 bg-green-50',
    medium: 'border-yellow-500/40 bg-yellow-50',
    high: 'border-orange-500/40 bg-orange-50',
    urgent: 'border-red-500/40 bg-red-50',
  },
  dark: {
    low: 'border-green-500/30 bg-green-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    high: 'border-orange-500/30 bg-orange-500/5',
    urgent: 'border-red-500/30 bg-red-500/5',
  },
}

const statusBadge = {
  todo: 'bg-gray-200 text-gray-600 dark:bg-dark-700 dark:text-dark-300',
  in_progress: 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400',
  completed: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
  missed: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
}

export default function TaskCard({ task, onComplete, onDelete }) {
  const handleComplete = async () => {
    try {
      await api.post(`/tasks/${task.id}/complete/`)
      toast.success(`+${task.xp_reward} XP! ⚡`)
      onComplete(task.xp_reward)
    } catch {
      toast.error('Failed to complete task')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task.id}/`)
      toast.success('Task deleted')
      onDelete()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const isSubtask = !!task.parent_task
  const hasPileUp = task.is_rolled_over || task.rollover_count > 0

  return (
    <motion.div
      className={`rounded-2xl p-5 border-l-4 transition-transform hover:scale-[1.02]
        ${hasPileUp
          ? 'border-red-500 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/30'
          : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10'
        }`}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ borderLeftColor: hasPileUp ? '#ef4444' : task.color }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{task.title}</h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 dark:text-dark-500 dark:hover:text-red-400 transition">
            <HiTrash className="text-sm" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-dark-400 mb-3 flex-wrap">
        <span className="flex items-center gap-1">
          <HiLightningBolt className="text-yellow-500" /> {task.xp_reward} XP
        </span>
        {task.task_type === 'daily' && (
          <span className="flex items-center gap-1">
            <HiCalendar className="text-primary-500" /> Daily
          </span>
        )}
        {task.task_type === 'timeframe' && !isSubtask && (
          <span className="flex items-center gap-1">
            <HiClock className="text-accent-500" /> {task.pending_subtasks_count}/{task.total_subtasks_count} days left
          </span>
        )}
        {hasPileUp && (
          <span className="flex items-center gap-1 text-red-500">
            <HiExclamation /> Piled up ({task.rollover_count}x)
          </span>
        )}
      </div>

      {task.tags?.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {task.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-dark-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-dark-300">{tag}</span>
          ))}
        </div>
      )}

      {task.status !== 'completed' && task.status !== 'missed' && (
        <button onClick={handleComplete} className="w-full btn-primary text-xs py-2 mt-2">
          ✓ Complete {isSubtask ? 'Today' : 'Task'}
        </button>
      )}
    </motion.div>
  )
}
