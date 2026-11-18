'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { api } from '../lib/api';
import { Button } from './ui/button';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await api.get<{ user: any }>('/auth/me');
        if (data?.user) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      window.location.href = '/';
    } catch {
      window.location.href = '/';
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Compass },
    ...(user
      ? [
          {
            href: '/dashboard',
            label: 'My Dashboard',
            icon: LayoutDashboard,
          },
        ]
      : []),
    { href: '/create', label: 'Create Secret QR', icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080410]/80 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.12, rotate: 8 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-roseNeon via-pink-500 to-electricViolet flex items-center justify-center shadow-lg shadow-roseNeon/30 ring-1 ring-white/20"
          >
            <Heart className="w-5 h-5 text-white fill-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-roseNeon via-fuchsia-400 to-electricViolet bg-clip-text text-transparent group-hover:drop-shadow-[0_0_15px_rgba(255,51,102,0.6)] transition-all">
              DilSe
            </span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-white/50 -mt-1 group-hover:text-rose-300 transition-colors">
              VibeMatch
            </span>
          </div>
        </Link>

        {/* Center Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-roseNeon/30 via-purple-500/20 to-electricViolet/30 border border-roseNeon/40 shadow-sm shadow-roseNeon/20"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-roseNeon' : ''}`} />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Desktop Auth / Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 hover:border-roseNeon/50 hover:bg-white/10 transition-all shadow-sm"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-roseNeon/60"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-sm">
                    {user.customAvatarEmoji || '😎'}
                  </span>
                )}
                <div className="flex flex-col text-left pr-1">
                  <span className="text-xs font-bold text-white leading-tight">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-rose-300 font-semibold tracking-wider uppercase">
                    Profile
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/create">
              <Button size="sm" variant="default" className="gap-2 shadow-lg shadow-roseNeon/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Quiz</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link href="/dashboard" className="p-1">
              <span className="w-8 h-8 rounded-full bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-sm">
                {user.customAvatarEmoji || '😎'}
              </span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#0c0518]/95 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-2xl"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-roseNeon/20 border border-roseNeon/40 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-roseNeon' : ''}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">Signed in as</span>
                    <strong className="text-xs text-white">{user.name}</strong>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/create" className="w-full">
                  <Button variant="default" className="w-full gap-2 justify-center">
                    <Sparkles className="w-4 h-4" />
                    Create Your First Quiz
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
