import React, { useState } from 'react';
import { X, Mail, Phone, ArrowLeft, Eye, EyeOff, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        setSuccess('Welcome back! Logged in successfully.');
      } else {
        await register(name, email, password, phone);
        setSuccess('Account created! Welcome to Roamnexa.');
      }
      setTimeout(() => { setSuccess(''); onClose(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 z-10">
          <X size={20} />
        </button>

        {/* Header gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">R</div>
            <h2 className="text-2xl font-bold text-slate-800">{isLogin ? 'Welcome back!' : 'Join Roamnexa'}</h2>
            <p className="text-slate-500 text-sm mt-1">{isLogin ? 'Login to access your bookings' : 'Create your free travel account'}</p>
          </div>

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4">
              <CheckCircle size={18} /> <span className="text-sm font-medium">{success}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Full Name" required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address" required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            {!isLogin && (
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="Phone number (optional)"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Password" required minLength={6}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-60">
              {loading ? 'Please wait...' : isLogin ? 'Login to Roamnexa' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-600 font-semibold hover:text-blue-700">
              {isLogin ? 'Sign up free' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
