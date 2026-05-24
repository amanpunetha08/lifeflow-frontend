import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import ThemeToggle from '../../components/common/ThemeToggle'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login/', form)
      const profileRes = await api.get('/auth/profile/', {
        headers: { Authorization: `Bearer ${data.access}` },
      })
      login(profileRes.data, { access: data.access, refresh: data.refresh })
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
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
        <h2 className="text-2xl font-bold mt-6 mb-2 text-gray-900 dark:text-white">Welcome back</h2>
        <p className="text-gray-500 dark:text-dark-400 text-sm mb-8">Sign in to continue your journey</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-500 dark:text-dark-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}
