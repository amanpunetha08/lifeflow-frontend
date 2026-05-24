import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import ThemeToggle from '../../components/common/ThemeToggle'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password_confirm: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register/', form)
      login(data.user, data.tokens)
      toast.success('Account created! Welcome to LifeFlow!')
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data
      const msg = errors ? Object.values(errors).flat().join(' ') : 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50 dark:bg-dark-950 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
      <motion.div
        className="relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 w-full max-w-md shadow-lg dark:shadow-none"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          LifeFlow
        </Link>
        <h2 className="text-2xl font-bold mt-6 mb-2 text-gray-900 dark:text-white">Create your account</h2>
        <p className="text-gray-500 dark:text-dark-400 text-sm mb-8">Start building discipline today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-dark-300 mb-1 block">Username</label>
            <input
              type="text" required value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition"
              placeholder="yourname"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-dark-300 mb-1 block">Email</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-dark-300 mb-1 block">Password</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-dark-300 mb-1 block">Confirm Password</label>
            <input
              type="password" required value={form.password_confirm}
              onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
              className="w-full bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 dark:text-dark-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
