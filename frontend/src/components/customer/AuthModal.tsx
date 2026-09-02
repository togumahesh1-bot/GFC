import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    signup,
    loginAsCustomer,
    loginAsAdmin,
  } = useAuth();
  const { showToast } = useToast();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      showToast('Please enter your email or phone number', 'error');
      return;
    }
    setLoading(true);
    const res = await login(emailOrPhone, password);
    setLoading(false);
    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signup(name, phone, email, password);
    setLoading(false);
    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your registered email or phone', 'error');
      return;
    }
    showToast('A password reset link & OTP was sent to your phone/email', 'success');
    setAuthModalTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-zinc-800 mb-6 pb-2 gap-4">
          <button
            onClick={() => setAuthModalTab('login')}
            className={`text-base font-bold pb-2 transition-all relative ${
              authModalTab === 'login'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthModalTab('signup')}
            className={`text-base font-bold pb-2 transition-all relative ${
              authModalTab === 'signup'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
          <p className="text-zinc-400 font-semibold mb-2">⚡ Quick 1-Click Demo Login:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsCustomer();
                setIsAuthModalOpen(false);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
            >
              <span>Mahesh (Customer)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                loginAsAdmin();
                setIsAuthModalOpen(false);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email or 10-Digit Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. togumahesh1@gmail.com or 9876543210"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('forgot')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Enter your password (e.g. demo123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Signup Form */}
        {authModalTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Mobile Number (for live SMS & WhatsApp tracking)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Sign up today & get <b>50 bonus loyalty points (₹50 discount)</b> instantly!</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account & Claim 50 Pts'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {authModalTab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter your registered phone or email to receive a password reset link and instant one-time login PIN.
            </p>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email or Mobile Number
              </label>
              <input
                type="text"
                required
                placeholder="Enter email or phone"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setAuthModalTab('login')}
              className="w-full text-center text-xs text-zinc-400 hover:text-white"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
