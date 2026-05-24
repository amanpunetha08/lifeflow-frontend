import { HiLightningBolt, HiCheck, HiTrash } from 'react-icons/hi'
import api from '../../api/client'
import toast from 'react-hot-toast'

const priorityDot = { low: 'bg-green-400', medium: 'bg-yellow-400', high: 'bg-orange-400', urgent: 'bg-red-400' }

export default function TaskList({ tasks, onComplete, onDelete }) {
  const handleComplete = async (task) => {
    try {
      await api.post(`/tasks/${task.id}/complete/`)
      toast.success(`+${task.xp_reward} XP! ⚡`)
      onComplete(task.xp_reward)
    } catch {
      toast.error('Failed to complete task')
    }
  }

  const handleDelete = async (task) => {
    try {
      await api.delete(`/tasks/${task.id}/`)
      toast.success('Task deleted')
      onDelete()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl divide-y divide-gray-100 dark:divide-white/5">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition">
          {task.status !== 'completed' && task.status !== 'missed' ? (
            <button
              onClick={() => handleComplete(task)}
              className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-dark-500 hover:border-primary-400 flex items-center justify-center transition"
            >
              <HiCheck className="text-xs opacity-0 hover:opacity-100 text-primary-400" />
            </button>
          ) : (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.status === 'completed' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
              <HiCheck className={`text-xs ${task.status === 'completed' ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          )}

          <div className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`} />

          <span className={`flex-1 text-sm ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-dark-500' : 'text-gray-800 dark:text-white'}`}>
            {task.title}
            {task.rollover_count > 0 && <span className="text-red-500 text-xs ml-2">(+{task.rollover_count} piled)</span>}
          </span>

          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-400">
            <HiLightningBolt className="text-yellow-500" /> {task.xp_reward}
          </span>

          {task.is_recurring && (
            <span className="text-xs bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">
              {task.recurrence_type}
            </span>
          )}

          <button onClick={() => handleDelete(task)} className="text-gray-400 hover:text-red-500 dark:text-dark-500 dark:hover:text-red-400 transition">
            <HiTrash className="text-sm" />
          </button>
        </div>
      ))}
    </div>
  )
}
