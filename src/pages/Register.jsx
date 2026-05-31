import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) return toast.error('Passwords do not match');
    if (!agreed) return toast.error('Please accept the terms');
    setLoading(true);
    try {
      const { data } = await client.post('/auth/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.user, data.tokens);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data;
      toast.error(typeof msg === 'string' ? msg : Object.values(msg || {})[0]?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl p-8 bg-[#1a1a2e] border border-[#2a2a3e]">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-white">Create Your Account 🚀</h2>
          <p className="text-gray-400 text-sm mt-1">Start your productivity journey today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Confirm Password</label>
            <input
              type="password"
              value={form.password2}
              onChange={(e) => setForm({ ...form, password2: e.target.value })}
              className="w-full bg-slate-100 dark:bg-[#0f0f1a] border border-slate-200 dark:border-[#2a2a3e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="rounded" />
            I agree to the Terms & Conditions
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#2a2a3e]" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-[#2a2a3e]" />
        </div>
        <button className="w-full border border-[#2a2a3e] text-gray-300 rounded-xl px-6 py-3 hover:bg-white/5">
          Continue with Google
        </button>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
