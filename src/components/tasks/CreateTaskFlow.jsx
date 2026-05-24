import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowRight, HiArrowLeft, HiCheck, HiPlus } from 'react-icons/hi'
import api from '../../api/client'
import toast from 'react-hot-toast'

const STEP_NAME = 0
const STEP_TYPE = 1
const STEP_DETAILS = 2

export default function CreateTaskFlow({ onCreated, compact = false }) {
  const [step, setStep] = useState(STEP_NAME)
  const [form, setForm] = useState({
    title: '',
    task_type: '',
    description: '',
    timeframe_days: 3,
    priority: 'medium',
    tags: [],
    start_date: '',
  })
  const [existingTags, setExistingTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/tasks/tags/').then(res => setExistingTags(res.data.results || res.data)).catch(() => {})
  }, [])

  const reset = () => {
    setStep(STEP_NAME)
    setForm({ title: '', task_type: '', description: '', timeframe_days: 3, priority: 'medium', tags: [], start_date: '' })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        task_type: form.task_type,
        description: form.description,
        tags: form.tags,
        priority: form.task_type === 'daily' ? 'high' : form.priority,
        xp_reward: 10,
      }
      if (form.task_type === 'timeframe') {
        payload.timeframe_days = form.timeframe_days
        if (form.start_date) {
          payload.timeframe_start_date = form.start_date
        }
      }
      const { data } = await api.post('/tasks/', payload)
      onCreated(data)
      reset()
    } catch (err) {
      toast.error(err.response?.data?.title?.[0] || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const addTag = (tagName) => {
    if (tagName && !form.tags.includes(tagName)) {
      setForm({ ...form, tags: [...form.tags, tagName] })
    }
    setNewTag('')
  }

  const removeTag = (tagName) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tagName) })
  }

  const createNewTag = async () => {
    if (!newTag.trim()) return
    try {
      const { data } = await api.post('/tasks/tags/', { name: newTag.trim() })
      setExistingTags([...existingTags, data])
      addTag(data.name)
    } catch {
      // Tag might already exist, just add it
      addTag(newTag.trim())
    }
  }

  const containerClass = compact ? '' : 'glass p-6'

  const inputClass = "w-full bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition"
  const labelClass = "text-sm text-gray-600 dark:text-dark-300 mb-1 block font-medium"
  const hintClass = "text-xs text-gray-500 dark:text-dark-500 mt-1"

  return (
    <div className={containerClass}>
      <AnimatePresence mode="wait">
        {/* Step 1: Task Name */}
        {step === STEP_NAME && (
          <motion.div key="name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <label className={labelClass}>What's the task?</label>
            <input
              type="text" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`${inputClass} py-3`}
              placeholder="e.g. Exercise, Read a book, Complete project..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && form.title.trim() && setStep(STEP_TYPE)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setStep(STEP_TYPE)}
                disabled={!form.title.trim()}
                className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-1 disabled:opacity-50"
              >
                Next <HiArrowRight />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Task Type */}
        {step === STEP_TYPE && (
          <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <label className={`${labelClass} mb-3`}>What kind of task is "{form.title}"?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setForm({ ...form, task_type: 'daily' }); setStep(STEP_DETAILS) }}
                className={`p-4 rounded-xl border text-left transition hover:border-primary-500/50 ${form.task_type === 'daily' ? 'border-primary-500 bg-primary-500/10' : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-800'}`}
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">Daily Task</div>
                <div className="text-gray-500 dark:text-dark-400 text-xs mt-1">Repeats every day</div>
              </button>
              <button
                onClick={() => { setForm({ ...form, task_type: 'timeframe' }); setStep(STEP_DETAILS) }}
                className={`p-4 rounded-xl border text-left transition hover:border-accent-500/50 ${form.task_type === 'timeframe' ? 'border-accent-500 bg-accent-500/10' : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-800'}`}
              >
                <div className="text-2xl mb-2">⏰</div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">Timeframe Task</div>
                <div className="text-gray-500 dark:text-dark-400 text-xs mt-1">Complete over X days</div>
              </button>
            </div>
            <div className="flex justify-start mt-4">
              <button onClick={() => setStep(STEP_NAME)} className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-1">
                <HiArrowLeft /> Back
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Details based on type */}
        {step === STEP_DETAILS && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-4">
              {/* Daily task info */}
              {form.task_type === 'daily' && (
                <div className="bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-xl p-3">
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    ✓ This task will appear every day • Priority: High • +10 XP per completion
                  </p>
                </div>
              )}

              {/* Timeframe details */}
              {form.task_type === 'timeframe' && (
                <>
                  <div>
                    <label className={labelClass}>Description (optional)</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={`${inputClass} resize-none h-16`}
                      placeholder="What does this task involve?"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Start date</label>
                    <input
                      type="date" value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      className={inputClass}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className={hintClass}>
                      Leave empty to start today. Pick a future date to schedule ahead.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>How many days to complete?</label>
                    <input
                      type="number" min="1" max="365" value={form.timeframe_days}
                      onChange={(e) => setForm({ ...form, timeframe_days: parseInt(e.target.value) || 1 })}
                      className={inputClass}
                    />
                    <p className={hintClass}>
                      We'll create {form.timeframe_days} daily sub-tasks. +10 XP each day you complete.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className={inputClass}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </>
              )}

              {/* Tags */}
              <div>
                <label className={labelClass}>Tags (optional)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="text-xs bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
                {existingTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {existingTags.filter(t => !form.tags.includes(t.name)).map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => addTag(tag.name)}
                        className="text-xs bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-dark-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition"
                      >
                        + {tag.name}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text" value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500"
                    placeholder="New tag..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), createNewTag())}
                  />
                  <button onClick={createNewTag} className="text-sm bg-gray-100 dark:bg-dark-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition text-gray-700 dark:text-white">
                    <HiPlus />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(STEP_TYPE)} className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-1">
                <HiArrowLeft /> Back
              </button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-1">
                {loading ? 'Creating...' : <><HiCheck /> Create Task</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
