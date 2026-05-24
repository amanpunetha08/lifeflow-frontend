import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'
import api from '../../api/client'
import toast from 'react-hot-toast'

export default function CreateTaskModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    start_time: '',
    end_time: '',
    recurrence_type: 'none',
    xp_reward: 10,
    tags: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
        start_time: form.start_time || null,
        end_time: form.end_time || null,
      }
      await api.post('/tasks/', payload)
      toast.success('Task created!')
      setForm({ title: '', description: '', priority: 'medium', category: '', start_time: '', end_time: '', recurrence_type: 'none', xp_reward: 10, tags: '' })
      onCreated()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Create Task</h2>
            <button onClick={onClose} className="text-dark-400 hover:text-white"><HiX className="text-xl" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-dark-300 mb-1 block">Title *</label>
              <input
                type="text" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="text-sm text-dark-300 mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition resize-none h-20"
                placeholder="Optional details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-dark-300 mb-1 block">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-dark-300 mb-1 block">Recurrence</label>
                <select
                  value={form.recurrence_type}
                  onChange={(e) => setForm({ ...form, recurrence_type: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-dark-300 mb-1 block">Start Time</label>
                <input
                  type="datetime-local" value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-sm text-dark-300 mb-1 block">End Time</label>
                <input
                  type="datetime-local" value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-dark-300 mb-1 block">Category</label>
                <input
                  type="text" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                  placeholder="e.g. Work, Health"
                />
              </div>
              <div>
                <label className="text-sm text-dark-300 mb-1 block">XP Reward</label>
                <input
                  type="number" value={form.xp_reward} min="1"
                  onChange={(e) => setForm({ ...form, xp_reward: parseInt(e.target.value) || 10 })}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-300 mb-1 block">Tags (comma separated)</label>
              <input
                type="text" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                placeholder="e.g. focus, important"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
