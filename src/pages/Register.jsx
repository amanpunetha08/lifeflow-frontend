import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await client.post('/auth/register/', { username: form.username, email: form.email, password: form.password });
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || Object.values(err.response?.data || {})[0]?.[0] || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1220] px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-[#475569]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2"><span className="text-3xl">🌿</span><span className="text-2xl font-bold text-slate-900 dark:text-slate-50">LifeFlow</span></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
            <input type="text" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
            <input type="password" required value={form.password2} onChange={e => setForm({ ...form, password2: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#475569] bg-white dark:bg-[#0B1220] text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-500">Sign in</Link></p>
      </div>
    </div>
  );
}
