'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PlusCircle,
  QrCode,
  Heart,
  ArrowRight,
  Sparkles,
  Trash2,
  Activity,
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { CountdownTimer } from '../../components/countdown-timer';
import { AnimatedCounter } from '../../components/animated-counter';
import { GoogleAuthButton } from '../../components/google-auth-button';
import { HoloCard } from '../../components/fx/holo-card';
import { HeartLoader } from '../../components/fx/heart-loader';
import { Medallion } from '../../components/fx/medallion';
import { AvatarOrb } from '../../components/fx/avatar-orb';
import { MandalaRing } from '../../components/fx/mandala-ring';
import { Stagger, StaggerItem } from '../../components/fx/reveal';
import { ACCENT_SOLID, type Accent } from '../../components/fx/accent';
import { cn } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const STATUS_VARIANT: Record<string, 'active' | 'claimed' | 'completed' | 'expired' | 'revoked'> = {
  ACTIVE: 'active',
  CLAIMED: 'claimed',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
};

const STATUS_ACCENT: Record<string, Accent> = {
  ACTIVE: 'emerald',
  CLAIMED: 'amber',
  COMPLETED: 'rose',
  EXPIRED: 'violet',
  REVOKED: 'rose',
};

function MiniRing({ value }: { value: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        <circle cx="28" cy="28" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        <motion.circle
          cx="28"
          cy="28"
          r={r}
          stroke="url(#mini-ring)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (Math.min(100, value) / 100) * c }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <defs>
          <linearGradient id="mini-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff3366" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center font-display text-sm font-black text-white">{value}%</div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <HoloCard accent="violet" className="relative overflow-hidden py-14 sm:py-20 px-6 text-center">
      <MandalaRing className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] opacity-40" />
      <div className="relative flex flex-col items-center gap-3">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Medallion accent="violet" className="w-16 h-16 sm:w-16 sm:h-16 rounded-3xl mb-2">
            <Icon className="w-7 h-7" />
          </Medallion>
        </motion.div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-white">{title}</h3>
        <p className="text-xs sm:text-sm text-white/50 max-w-sm">{body}</p>
        <Link href="/create" className="pt-3">
          <Button size="lg" className="rounded-2xl gap-2">
            <Sparkles className="w-4 h-4" />
            {cta}
          </Button>
        </Link>
      </div>
    </HoloCard>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [invites, setInvites] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [pendingRevoke, setPendingRevoke] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const meRes = await api.get<{ user: any; stats: any }>('/auth/me');
        if (meRes?.user) {
          setUser(meRes.user);
          const [invitesRes, matchesRes] = await Promise.all([
            api.get<any[]>('/invites/my').catch(() => []),
            api.get<any[]>('/matches/my-connections').catch(() => []),
          ]);
          setInvites(Array.isArray(invitesRes) ? invitesRes : (invitesRes as any)?.data || []);
          setMatches(Array.isArray(matchesRes) ? matchesRes : (matchesRes as any)?.data || []);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const confirmRevoke = async () => {
    if (!pendingRevoke) return;
    const inviteId = pendingRevoke.id;
    setRevokingId(inviteId);
    setPendingRevoke(null);
    try {
      await api.patch(`/invites/${inviteId}/revoke`);
      setInvites((prev) => prev.map((inv) => (inv.id === inviteId ? { ...inv, status: 'REVOKED' } : inv)));
    } catch (err: any) {
      setError(err.message || 'Failed to revoke invite');
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) {
    return <HeartLoader label="Loading your vibe records…" sublabel="Syncing dashboard" />;
  }

  if (!user) {
    return (
      <div className="flex-1 min-h-[75vh] flex items-center justify-center px-4 py-12 relative">
        <MandalaRing className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-[130vw] opacity-60" />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative max-w-md w-full"
        >
          <HoloCard accent="rose" active tilt className="p-8 sm:p-10 text-center">
            <div className="flex justify-center mb-5">
              <Medallion accent="rose" className="w-18 h-18 sm:w-18 sm:h-18 rounded-3xl">
                <LayoutDashboard className="w-8 h-8" />
              </Medallion>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-3">Sign In to View Dashboard</h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-7">
              Log in with Google to view all your created QR invites, active match connections, live chats, and secret confessions.
            </p>
            <GoogleAuthButton />
          </HoloCard>
        </motion.div>
      </div>
    );
  }

  const activeInvites = invites.filter((i) => i.status === 'ACTIVE' || i.status === 'CLAIMED');
  const completedMatches = invites.filter((i) => i.status === 'COMPLETED').length + matches.length;

  const stats: { label: string; value: number; accent: Accent; icon: React.ElementType }[] = [
    { label: 'Total Invites', value: invites.length, accent: 'violet', icon: QrCode },
    { label: 'Active / Claimed', value: activeInvites.length, accent: 'emerald', icon: Activity },
    { label: 'Completed', value: completedMatches, accent: 'rose', icon: CheckCircle2 },
    { label: 'Connections', value: matches.length, accent: 'amber', icon: Users },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 sm:space-y-10">
      {/* ── Profile hero ── */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <HoloCard accent="rose" className="relative overflow-hidden p-6 sm:p-10">
          <MandalaRing className="absolute -right-24 -top-24 w-[380px] opacity-50 hidden sm:block" />
          <MandalaRing className="absolute -left-24 -bottom-24 w-[380px] opacity-50 hidden sm:block" />
          <div className="relative flex flex-col sm:flex-row items-center sm:justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <AvatarOrb src={user.avatarUrl} emoji={user.customAvatarEmoji || '😎'} alt={user.name} size="xl" />
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/45 font-bold">Welcome back</span>
                <h1 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">{user.name}</h1>
                <p className="text-xs sm:text-sm text-rose-300 font-semibold mt-1.5">{user.tagline || 'Ready to match vibes ✨'}</p>
              </div>
            </div>
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 rounded-2xl">
                <PlusCircle className="w-5 h-5" />
                Create New QR Invite
              </Button>
            </Link>
          </div>
        </HoloCard>
      </motion.div>

      {/* ── Stats (4, symmetric) ── */}
      <Stagger immediate className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <StaggerItem key={s.label}>
              <HoloCard accent={s.accent} tilt className="group p-5 sm:p-6 h-full">
                <div className="flex flex-col items-center text-center gap-2.5">
                  <Medallion accent={s.accent} className="w-11 h-11 sm:w-12 sm:h-12">
                    <Icon className="w-5 h-5" />
                  </Medallion>
                  <div className={cn('font-display text-3xl sm:text-4xl font-black', ACCENT_SOLID[s.accent])}>
                    <AnimatedCounter value={s.value} />
                  </div>
                  <span className="text-[10px] sm:text-xs text-white/50 font-bold uppercase tracking-[0.16em]">{s.label}</span>
                </div>
              </HoloCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* inline error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-red-300"
          >
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {error}
            </span>
            <button onClick={() => setError(null)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tabs ── */}
      <Tabs defaultValue="invites" className="w-full">
        <div className="flex justify-center mb-6 sm:mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md h-12">
            <TabsTrigger value="invites" className="text-xs sm:text-sm">
              <QrCode className="w-4 h-4" /> Invites ({invites.length})
            </TabsTrigger>
            <TabsTrigger value="matches" className="text-xs sm:text-sm">
              <Heart className="w-4 h-4" /> Matches ({matches.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* INVITES — ticket cards */}
        <TabsContent value="invites">
          {invites.length === 0 ? (
            <EmptyState
              icon={QrCode}
              title="No QR Invites Created Yet"
              body="Create a 1-of-1 private QR code for your friend or crush to break the ice!"
              cta="Create Your First Invite"
            />
          ) : (
            <Stagger immediate className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {invites.map((inv) => {
                const accent = STATUS_ACCENT[inv.status] || 'violet';
                const live = inv.status === 'ACTIVE' || inv.status === 'CLAIMED';
                return (
                  <StaggerItem key={inv.id} className="h-full">
                    <HoloCard
                      accent={accent}
                      tilt
                      className={cn('group h-full flex flex-col', !live && inv.status !== 'COMPLETED' && 'opacity-75')}
                      contentClassName="flex flex-col h-full"
                    >
                      {/* top stub */}
                      <div className="p-5 sm:p-6 pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-white/80 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10">
                            {inv.shortCode}
                          </span>
                          <Badge variant={STATUS_VARIANT[inv.status] || 'expired'} dot>
                            {inv.status}
                          </Badge>
                        </div>
                        <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mb-1">
                          {inv.prefilledFriendName ? `For ${inv.prefilledFriendName}` : 'Open Invite'}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-white/45">
                          {inv.questionCount} Questions · {new Date(inv.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* perforation with notches */}
                      <div className="relative h-6 flex items-center">
                        <span className="ticket-notch -left-[11px]" />
                        <div className="perforation flex-1 mx-4" />
                        <span className="ticket-notch -right-[11px]" />
                      </div>

                      {/* bottom stub */}
                      <div className="p-5 sm:p-6 pt-3 mt-auto space-y-4">
                        <CountdownTimer expiresAt={inv.expiresAt} />
                        {inv.status === 'COMPLETED' && inv.completedMatchId ? (
                          <Link href={`/match/${inv.completedMatchId}`} className="block">
                            <Button variant="rose" size="sm" className="w-full gap-2 h-11 rounded-xl font-bold">
                              <Heart className="w-4 h-4 fill-white" />
                              View Match Result
                            </Button>
                          </Link>
                        ) : live ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={revokingId === inv.id}
                            onClick={() => setPendingRevoke(inv)}
                            className="w-full gap-1.5 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 border-red-500/25 h-11 rounded-xl"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {revokingId === inv.id ? 'Revoking…' : 'Revoke QR'}
                          </Button>
                        ) : (
                          <div className="h-11 grid place-items-center rounded-xl border border-dashed border-white/10 text-xs text-white/35 italic">
                            No longer active
                          </div>
                        )}
                      </div>
                    </HoloCard>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </TabsContent>

        {/* MATCHES — dual avatar cards */}
        <TabsContent value="matches">
          {matches.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No Shared Matches Yet"
              body="When a friend answers your quiz, or when you answer a friend's quiz, your match and live chat will appear here!"
              cta="Create an Invite"
            />
          ) : (
            <Stagger immediate className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {matches.map((m) => (
                <StaggerItem key={m.id} className="h-full">
                  <Link href={`/match/${m.id}`} className="block h-full">
                    <HoloCard accent="rose" tilt className="group p-5 sm:p-6 h-full cursor-pointer" contentClassName="flex flex-col h-full">
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative flex -space-x-4 shrink-0">
                            <AvatarOrb emoji={user.customAvatarEmoji || '😎'} src={user.avatarUrl} size="md" />
                            <AvatarOrb emoji={m.partnerEmoji || '💖'} src={m.partnerAvatar} size="md" accent="violet" />
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 grid place-items-center w-5 h-5 rounded-full bg-roseNeon ring-2 ring-[#120820]">
                              <Heart className="w-2.5 h-2.5 text-white fill-white" />
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display text-base sm:text-lg font-bold text-white truncate group-hover:text-rose-200 transition-colors">
                              {m.partnerName}
                            </h4>
                            <span className="text-[11px] text-white/45">{m.isCreator ? 'You created quiz' : 'You answered quiz'}</span>
                          </div>
                        </div>
                        <MiniRing value={m.compatibilityPercent} />
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10 text-[11px] sm:text-xs text-white/55">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {m.sameCount} / {m.totalQuestions} matched
                        </span>
                        <span className="text-rose-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Result &amp; Chat <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </HoloCard>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </TabsContent>
      </Tabs>

      {/* Revoke confirmation */}
      <Dialog open={!!pendingRevoke} onOpenChange={(o) => !o && setPendingRevoke(null)}>
        <DialogContent accent="rose" className="text-center">
          <div className="flex justify-center mb-4">
            <Medallion accent="rose" className="w-14 h-14">
              <Trash2 className="w-6 h-6" />
            </Medallion>
          </div>
          <DialogTitle>Revoke this QR invite?</DialogTitle>
          <DialogDescription>
            {pendingRevoke?.prefilledFriendName ? `${pendingRevoke.prefilledFriendName}'s` : 'This'} invite{' '}
            <span className="font-mono text-white/80">{pendingRevoke?.shortCode}</span> will stop working immediately. Nobody will be able to scan it.
          </DialogDescription>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button variant="outline" onClick={() => setPendingRevoke(null)} className="h-11 rounded-xl">
              Keep it
            </Button>
            <Button variant="rose" onClick={confirmRevoke} className="h-11 rounded-xl gap-1.5">
              <Trash2 className="w-4 h-4" /> Revoke
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
