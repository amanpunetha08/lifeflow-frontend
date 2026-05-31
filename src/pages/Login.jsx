import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await client.post('/auth/login/', form);
      const tokens = data.tokens || data;
      const user = data.user;
      if (!user) {
        const { data: profile } = await client.get('/auth/profile/', {
          headers: { Authorization: `Bearer ${tokens.access}` },
        });
        login(profile, tokens);
      } else {
        login(user, tokens);
      }
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl p-8 bg-[#1a1a2e] border border-[#2a2a3e]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1"><span className="text-indigo-400">Life</span>Flow</h1>
          <h2 className="text-xl font-semibold text-white mt-4">Welcome Back! 👋</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to continue your journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Username or Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" className="rounded" />
            Remember me
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login'}
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
          Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
