import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { UserRole } from '../../types';
import { User, Store, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    closeAuthModal,
    authModalMode,
    authModalRole,
    login,
    signup,
    demoLogin
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [role, setRole] = useState<UserRole>(authModalRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sync mode and role when modal opens
  React.useEffect(() => {
    setMode(authModalMode);
    setRole(authModalRole);
    setError('');
    setPassword('');
    setConfirmPassword('');
  }, [authModalOpen, authModalMode, authModalRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        // Password policy validation (FR-3): min 8 chars, 1 uppercase, 1 number, 1 special char
        const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
          setError(
            'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.'
          );
          return;
        }

        const res = await signup(email.trim(), password, role);
        if (!res.success && res.error) {
          setError(res.error);
        }
      } else {
        const res = await login(email.trim(), password, role);
        if (!res.success && res.error) {
          setError(res.error);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      maxWidth="max-w-md"
    >
      <div className="py-2">
        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 mb-3 shadow-inner">
            {role === 'customer' ? <User className="w-6 h-6" /> : <Store className="w-6 h-6" />}
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Access your queue tokens and grooming appointments'
              : 'Join the smart queue platform for seamless salon experiences'}
          </p>
        </div>

        {/* Role Selector Tabs (Wireframe Image 3: "login as user / shop") */}
        <div className="flex rounded-xl p-1 bg-slate-100 mb-6 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'customer'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            Customer / User
          </button>
          <button
            type="button"
            onClick={() => setRole('shop')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'shop'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Store className="w-4 h-4" />
            Barbershop / Salon
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email ID {role === 'shop' && '(Shop / Company)'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'customer' ? 'name@example.com' : 'contact@barbershop.com'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
            {mode === 'signup' && (
              <p className="text-[11px] text-slate-400 mt-1">
                At least 8 chars, 1 uppercase letter, 1 number, and 1 special symbol.
              </p>
            )}
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 hover:translate-y-px"
          >
            <span>
              {submitting
                ? 'Please wait...'
                : mode === 'login'
                ? 'Login'
                : 'Sign Up as ' + (role === 'customer' ? 'Customer' : 'Shop')}
            </span>
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className="font-bold text-brand-600 hover:text-brand-700"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="font-bold text-brand-600 hover:text-brand-700"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password Sub-Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Reset Password</h4>
            <p className="text-xs text-slate-500 mb-4">
              Enter your email address and we will dispatch a secure reset link.
            </p>
            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium mb-4">
                Password reset link sent! Check your inbox.
              </div>
            ) : (
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  defaultValue={email}
                />
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setForgotSuccess(false);
                }}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="flex-1 py-2 rounded-lg bg-brand-600 text-xs font-semibold text-white"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
