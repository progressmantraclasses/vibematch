'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal } from 'lucide-react';
import { api } from '../lib/api';

interface GoogleAuthButtonProps {
  className?: string;
  claimToken?: string;
  pendingMatchId?: string;
  text?: string;
}

export function GoogleAuthButton({
  className = '',
  claimToken,
  pendingMatchId,
  text = 'Continue with Google',
}: GoogleAuthButtonProps) {
  const [showDevModal, setShowDevModal] = useState(false);
  const [devName, setDevName] = useState('Aarav Sharma');
  const [devEmail, setDevEmail] = useState('aarav.vibe@example.com');
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const stateParam = claimToken || pendingMatchId ? `?state=${claimToken || pendingMatchId}` : '';
    window.location.href = `${apiBase}/auth/google${stateParam}`;
  };

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/dev-login', {
        name: devName,
        email: devEmail,
        pendingMatchId,
      });

      if (pendingMatchId) {
        window.location.href = `/match/${pendingMatchId}`;
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error(err);
      alert('Login error. Check if API is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleGoogleClick}
        className={`relative group w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-slate-900 font-semibold shadow-2xl transition-all duration-300 hover:shadow-roseNeon/40 hover:ring-2 hover:ring-roseNeon cursor-pointer ${className}`}
      >
        {/* Google G SVG */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="text-base tracking-tight">{text}</span>
      </motion.button>

      {/* Developer fast-test button */}
      <button
        type="button"
        onClick={() => setShowDevModal(true)}
        className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1 mt-1 cursor-pointer"
      >
        <Terminal className="w-3 h-3" />
        Test without Google credentials? (One-Click Dev Login)
      </button>

      {/* Dev Login Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-3xl border border-white/20 bg-[#120820] p-6 shadow-2xl text-left"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-roseNeon" />
              <h4 className="text-lg font-bold text-white">Instant Dev Login</h4>
            </div>
            <p className="text-xs text-white/60 mb-4">
              Skip Google Cloud setup during development and jump straight into testing!
            </p>

            <form onSubmit={handleDevLogin} className="space-y-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Email</label>
                <input
                  type="email"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDevModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-roseNeon to-electricViolet text-white text-xs font-semibold shadow-lg hover:brightness-110"
                >
                  {loading ? 'Logging in...' : 'Sign In Now'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
