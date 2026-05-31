import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await client.post('/auth/login/', form);
      login(data.user, data.tokens);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1220] px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-[#475569]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2"><span className="text-3xl">🌿</span><span className="text-2xl font-bold text-slate-900 dark:text-slate-50">LifeFlow</span></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">Don't have an account? <Link to="/register" className="text-emerald-600 hover:text-emerald-500">Sign up</Link></p>
      </div>
    </div>
  );
}
