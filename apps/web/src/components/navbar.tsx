'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, PlusCircle, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { Button } from './ui/button';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await api.get<{ user: any }>('/auth/me');
        if (data?.user) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0714]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-roseNeon via-pink-500 to-electricViolet flex items-center justify-center shadow-lg shadow-roseNeon/30"
          >
            <Heart className="w-5 h-5 text-white fill-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-roseNeon via-fuchsia-400 to-electricViolet bg-clip-text text-transparent">
              DilSe
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-white/50 -mt-1">
              VibeMatch
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-white ${
              pathname === '/' ? 'text-roseNeon font-semibold' : 'text-white/70'
            }`}
          >
            Home
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname === '/dashboard'
                  ? 'text-roseNeon font-semibold'
                  : 'text-white/70'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              My Vibe Dashboard
            </Link>
          )}
          <Link
            href="/create"
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              pathname === '/create'
                ? 'text-roseNeon font-semibold'
                : 'text-white/70'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-roseNeon" />
            Create Invite
          </Link>
        </nav>

        {/* Right Auth / Profile Action */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-roseNeon/50"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-roseNeon/20 flex items-center justify-center text-sm">
                    {user.customAvatarEmoji || '😎'}
                  </span>
                )}
                <span className="text-xs font-semibold text-white hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-xl text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/create">
              <Button size="sm" variant="default" className="gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Quiz</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
