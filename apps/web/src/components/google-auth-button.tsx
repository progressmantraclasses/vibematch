'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal } from 'lucide-react';
import { api } from '../lib/api';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

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
  const [error, setError] = useState<string | null>(null);

  const handleGoogleClick = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const stateParam = claimToken || pendingMatchId ? `?state=${claimToken || pendingMatchId}` : '';
    window.location.href = `${apiBase}/auth/google${stateParam}`;
  };

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/dev-login', {
        name: devName,
        email: devEmail,
        pendingMatchId,
      });
      window.location.href = pendingMatchId ? `/match/${pendingMatchId}` : '/dashboard';
    } catch (err) {
      console.error(err);
      setError('Login error. Check if API is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
      <div className="relative w-full group">
        {/* animated halo */}
        <div
          aria-hidden
          className="absolute -inset-[2px] rounded-2xl opacity-70 group-hover:opacity-100 blur-[6px] transition-opacity"
          style={{
            background: 'conic-gradient(from var(--angle), #ff3366, #a855f7, #38bdf8, #fbbf24, #ff3366)',
            animation: 'border-spin 4s linear infinite',
          }}
        />
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleClick}
          className={`btn-shine relative w-full flex items-center justify-center gap-3 h-14 px-6 rounded-2xl bg-white text-slate-900 font-bold shadow-2xl cursor-pointer ${className}`}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span className="text-[15px] tracking-tight truncate">{text}</span>
        </motion.button>
      </div>

      <button
        type="button"
        onClick={() => setShowDevModal(true)}
        className="text-[11px] sm:text-xs text-white/40 hover:text-white/75 transition-colors flex items-center gap-1.5 mt-1 cursor-pointer py-1"
      >
        <Terminal className="w-3 h-3" />
        Test without Google? (One-Click Dev Login)
      </button>

      <Dialog open={showDevModal} onOpenChange={setShowDevModal}>
        <DialogContent className="max-w-sm text-left">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-roseNeon" />
            <DialogTitle>Instant Dev Login</DialogTitle>
          </div>
          <DialogDescription>Skip Google Cloud setup during development and jump straight into testing!</DialogDescription>

          <form onSubmit={handleDevLogin} className="space-y-3 mt-5">
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5">Your Name</label>
              <Input type="text" value={devName} onChange={(e) => setDevName(e.target.value)} className="h-11" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5">Email</label>
              <Input type="email" value={devEmail} onChange={(e) => setDevEmail(e.target.value)} className="h-11" required />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowDevModal(false)} className="h-11 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="h-11 rounded-xl">
                {loading ? 'Logging in…' : 'Sign In Now'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
