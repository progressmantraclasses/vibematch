'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, PlusCircle, LayoutDashboard, LogOut, Sparkles, Menu, X, Compass, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { AvatarOrb } from './fx/avatar-orb';
import { cn } from '../lib/utils';

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="DilSe VibeMatch home">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 8 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-roseNeon via-pink-500 to-electricViolet grid place-items-center shadow-[0_8px_24px_-6px_rgba(255,51,102,0.8)] ring-1 ring-white/25"
      >
        <span className="absolute inset-0 rounded-2xl bg-roseNeon/40 animate-ping-soft" />
        <Heart className="relative w-5 h-5 text-white fill-white" />
      </motion.div>
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold tracking-tight text-shimmer">DilSe</span>
          <span className="text-[9px] tracking-[0.35em] uppercase font-bold text-white/50 mt-1 group-hover:text-rose-300 transition-colors">
            VibeMatch
          </span>
        </div>
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await api.get<{ user: any }>('/auth/me');
        if (data?.user) setUser(data.user);
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/create', label: 'Create QR', icon: PlusCircle },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative max-w-6xl mx-auto h-16 rounded-2xl px-3 sm:px-4 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-3 border transition-all duration-500',
            scrolled
              ? 'bg-[#0c0618]/80 border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]'
              : 'bg-white/[0.03] border-white/[0.06] backdrop-blur-xl',
          )}
        >
          {/* glowing bottom hairline */}
          <span className="pointer-events-none absolute inset-x-10 -bottom-px h-px bg-gradient-to-r from-transparent via-roseNeon/60 to-transparent" />

          {/* Left: brand */}
          <div className="justify-self-start">
            <BrandMark />
          </div>

          {/* Center: links (desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors',
                    active ? 'text-white' : 'text-white/55 hover:text-white',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-lg bg-[linear-gradient(110deg,rgba(255,51,102,0.35),rgba(168,85,247,0.3))] shadow-[inset_0_0_0_1px_rgba(255,51,102,0.45),0_6px_20px_-6px_rgba(255,51,102,0.7)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={cn('w-3.5 h-3.5 relative z-10', active && 'text-roseNeon')} />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: auth/actions */}
          <div className="justify-self-end flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-roseNeon/50 hover:bg-white/10 transition-all"
                >
                  <AvatarOrb src={user.avatarUrl} emoji={user.customAvatarEmoji || '😎'} alt={user.name} size="sm" />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-white">{user.name?.split(' ')[0]}</span>
                    <span className="text-[9px] text-rose-300 font-semibold tracking-wider uppercase">Profile</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="hidden md:grid place-items-center w-10 h-10 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link href="/create" className="hidden md:block">
                <Button size="sm" className="gap-2 h-10 px-4 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5" />
                  Create Quiz
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden grid place-items-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white/85 active:scale-95 transition-transform cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileMenuOpen ? 'x' : 'm'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile full-screen sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-30 bg-[#07030d]/90 backdrop-blur-2xl pt-24 px-5 pb-32 flex flex-col"
          >
            <motion.nav
              className="flex flex-col gap-3"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
            >
              {navLinks.map((link, i) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                    }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center justify-between px-5 py-4 rounded-2xl border text-base font-display font-bold transition-all',
                        active
                          ? 'bg-[linear-gradient(110deg,rgba(255,51,102,0.25),rgba(168,85,247,0.2))] border-roseNeon/40 text-white'
                          : 'bg-white/[0.03] border-white/10 text-white/75',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={cn('w-5 h-5', active ? 'text-roseNeon' : 'text-white/50')} />
                        {link.label}
                      </span>
                      <span className="text-white/30 text-sm">0{i + 1}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto pt-6 border-t border-white/10"
            >
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AvatarOrb src={user.avatarUrl} emoji={user.customAvatarEmoji || '😎'} size="md" />
                    <div>
                      <span className="text-[11px] text-white/50 block">Signed in as</span>
                      <strong className="text-sm text-white">{user.name}</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 h-11 rounded-xl text-sm text-red-400 bg-red-500/10 border border-red-500/20 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/create" className="block">
                  <Button className="w-full gap-2 h-13 rounded-2xl text-base">
                    <Sparkles className="w-4 h-4" />
                    Create Your First Quiz
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom tab bar — symmetric with center FAB */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-safe pointer-events-none">
        <div className="pointer-events-auto relative mx-auto max-w-sm h-16 rounded-2xl bg-[#0c0618]/85 backdrop-blur-2xl border border-white/10 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.9)] grid grid-cols-3 items-center">
          <span className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-roseNeon/60 to-transparent" />
          {[navLinks[0], navLinks[1], navLinks[2]].map((link, i) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            if (i === 1) {
              return (
                <Link key={link.href} href={link.href} className="justify-self-center -mt-8" aria-label="Create QR">
                  <motion.span
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'relative grid place-items-center w-16 h-16 rounded-full bg-gradient-to-tr from-roseNeon via-fuchsia-500 to-electricViolet ring-4 ring-[#07030d] shadow-[0_12px_30px_-6px_rgba(255,51,102,0.9)]',
                    )}
                  >
                    <span className="absolute inset-0 rounded-full bg-roseNeon/40 animate-ping-soft" />
                    <Plus className="relative w-7 h-7 text-white" strokeWidth={2.75} />
                  </motion.span>
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 h-full text-[10px] font-bold tracking-wide transition-colors',
                  active ? 'text-white' : 'text-white/45',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="tabbar-dot"
                    className="absolute top-1.5 w-8 h-1 rounded-full bg-gradient-to-r from-roseNeon to-electricViolet shadow-[0_0_12px_rgba(255,51,102,0.9)]"
                  />
                )}
                <Icon className={cn('w-5 h-5', active && 'text-roseNeon')} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
