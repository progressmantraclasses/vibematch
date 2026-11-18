'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  PlusCircle,
  QrCode,
  Heart,
  Clock,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Edit3,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { CountdownTimer } from '../../components/countdown-timer';
import { AnimatedCounter } from '../../components/animated-counter';
import { GoogleAuthButton } from '../../components/google-auth-button';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [invites, setInvites] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const meRes = await api.get<{ user: any; stats: any }>('/auth/me');
        if (meRes?.user) {
          setUser(meRes.user);

          // Load invites and connections
          const [invitesRes, matchesRes] = await Promise.all([
            api.get<any[]>('/invites/my').catch(() => []),
            api.get<any[]>('/matches/my-connections').catch(() => []),
          ]);

          setInvites(Array.isArray(invitesRes) ? invitesRes : (invitesRes as any)?.data || []);
          setMatches(Array.isArray(matchesRes) ? matchesRes : (matchesRes as any)?.data || []);
        }
      } catch (err) {
        // Not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleRevoke = async (inviteId: string) => {
    if (!confirm('Are you sure you want to revoke this QR invite? Nobody will be able to scan it.')) {
      return;
    }
    setRevokingId(inviteId);
    try {
      await api.patch(`/invites/${inviteId}/revoke`);
      setInvites((prev) =>
        prev.map((inv) =>
          inv.id === inviteId ? { ...inv, status: 'REVOKED' } : inv,
        ),
      );
    } catch (err: any) {
      alert(err.message || 'Failed to revoke invite');
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[75vh] flex flex-col items-center justify-center px-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-6"
        >
          <div className="w-16 h-16 rounded-full border-4 border-roseNeon/20 border-t-roseNeon animate-spin" />
          <Heart className="w-6 h-6 text-roseNeon fill-roseNeon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_12px_rgba(255,51,102,0.8)]" />
        </motion.div>
        <p className="text-white/80 text-base font-semibold tracking-wide animate-pulse">
          Loading your vibe records...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="max-w-md w-full rounded-3xl border border-white/15 bg-white/[0.04] p-8 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-4">
          <div className="w-18 h-18 rounded-3xl bg-roseNeon/20 border border-roseNeon/30 flex items-center justify-center mx-auto text-roseNeon shadow-lg shadow-roseNeon/20">
            <LayoutDashboard className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Sign In to View Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4">
            Log in with Google to view all your created QR invites, active match connections, live chats, and secret confessions.
          </p>
          <div className="pt-2">
            <GoogleAuthButton />
          </div>
        </div>
      </div>
    );
  }

  const activeInvites = invites.filter((i) => i.status === 'ACTIVE' || i.status === 'CLAIMED');
  const completedMatches = invites.filter((i) => i.status === 'COMPLETED').length + matches.length;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10"
      >
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl object-cover border-2 border-roseNeon shadow-xl shadow-roseNeon/20"
            />
          ) : (
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-3xl shadow-xl shadow-roseNeon/20">
              {user.customAvatarEmoji || '😎'}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-rose-300 font-semibold mt-0.5">
              {user.tagline || 'Ready to match vibes ✨'}
            </p>
          </div>
        </div>

        <Link href="/create">
          <Button variant="default" size="lg" className="gap-2 h-12 px-6 rounded-2xl shadow-lg shadow-roseNeon/30">
            <PlusCircle className="w-5 h-5" />
            Create New QR Invite
          </Button>
        </Link>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-xl hover:border-white/20 transition-all shadow-lg">
          <span className="text-xs text-white/50 font-bold uppercase tracking-wider block mb-1">
            Total Invites
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white">
            <AnimatedCounter value={invites.length} />
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5 sm:p-6 backdrop-blur-xl hover:border-emerald-500/40 transition-all shadow-lg shadow-emerald-950/20">
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
            Active / Claimed QRs
          </span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-300">
            <AnimatedCounter value={activeInvites.length} />
          </div>
        </div>

        <div className="rounded-3xl border border-roseNeon/25 bg-roseNeon/[0.06] p-5 sm:p-6 backdrop-blur-xl hover:border-roseNeon/40 transition-all shadow-lg shadow-roseNeon/10">
          <span className="text-xs text-rose-300 font-bold uppercase tracking-wider block mb-1">
            Completed Matches
          </span>
          <div className="text-3xl sm:text-4xl font-black text-roseNeon">
            <AnimatedCounter value={completedMatches} />
          </div>
        </div>

        <div className="rounded-3xl border border-electricViolet/25 bg-electricViolet/[0.06] p-5 sm:p-6 backdrop-blur-xl hover:border-electricViolet/40 transition-all shadow-lg shadow-purple-950/20">
          <span className="text-xs text-purple-300 font-bold uppercase tracking-wider block mb-1">
            Vibe Connections
          </span>
          <div className="text-3xl sm:text-4xl font-black text-electricViolet">
            <AnimatedCounter value={matches.length} />
          </div>
        </div>
      </motion.div>

      {/* TABS: Invites I Sent VS Quizzes I Answered */}
      <Tabs defaultValue="invites" className="w-full">
        <TabsList className="grid grid-cols-2 max-w-md mb-8 h-12 p-1 bg-white/5 border border-white/10 rounded-2xl">
          <TabsTrigger value="invites" className="rounded-xl text-xs sm:text-sm font-bold">
            Invites I Sent ({invites.length})
          </TabsTrigger>
          <TabsTrigger value="matches" className="rounded-xl text-xs sm:text-sm font-bold">
            Our Shared Vibe Matches ({matches.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INVITES I SENT */}
        <TabsContent value="invites" className="space-y-4">
          {invites.length === 0 ? (
            <div className="text-center py-16 sm:py-20 rounded-3xl border border-white/10 bg-white/[0.02] px-4 space-y-3">
              <QrCode className="w-14 h-14 text-white/30 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">No QR Invites Created Yet</h3>
              <p className="text-xs sm:text-sm text-white/50 max-w-sm mx-auto">
                Create a 1-of-1 private QR code for your friend or crush to break the ice!
              </p>
              <div className="pt-2">
                <Link href="/create">
                  <Button variant="default" size="lg" className="rounded-2xl">
                    Create Your First Invite
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {invites.map((inv) => (
                <motion.div
                  key={inv.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl hover:border-white/25 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-white/80 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
                        {inv.shortCode}
                      </span>
                      <Badge
                        variant={
                          inv.status === 'ACTIVE'
                            ? 'active'
                            : inv.status === 'CLAIMED'
                            ? 'claimed'
                            : inv.status === 'COMPLETED'
                            ? 'completed'
                            : inv.status === 'EXPIRED'
                            ? 'expired'
                            : 'revoked'
                        }
                      >
                        {inv.status}
                      </Badge>
                    </div>

                    <h4 className="text-xl font-extrabold text-white mb-1 tracking-tight">
                      {inv.prefilledFriendName ? `For ${inv.prefilledFriendName}` : 'Open Invite'}
                    </h4>

                    <p className="text-xs text-white/50 mb-4">
                      {inv.questionCount} Questions • Created on{' '}
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mb-4">
                      <CountdownTimer expiresAt={inv.expiresAt} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    {inv.status === 'COMPLETED' && inv.completedMatchId ? (
                      <Link href={`/match/${inv.completedMatchId}`} className="w-full">
                        <Button variant="rose" size="sm" className="w-full gap-2 h-11 rounded-xl font-bold shadow-md shadow-roseNeon/20">
                          <Heart className="w-4 h-4 fill-white" />
                          View Match Result
                        </Button>
                      </Link>
                    ) : inv.status === 'ACTIVE' || inv.status === 'CLAIMED' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={revokingId === inv.id}
                        onClick={() => handleRevoke(inv.id)}
                        className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 h-10 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        {revokingId === inv.id ? 'Revoking...' : 'Revoke QR Now'}
                      </Button>
                    ) : (
                      <span className="text-xs text-white/40 italic">
                        No longer active
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: OUR SHARED VIBE MATCHES */}
        <TabsContent value="matches" className="space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-16 sm:py-20 rounded-3xl border border-white/10 bg-white/[0.02] px-4 space-y-3">
              <Heart className="w-14 h-14 text-white/30 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">No Shared Matches Yet</h3>
              <p className="text-xs sm:text-sm text-white/50 max-w-sm mx-auto">
                When a friend answers your quiz, or when you answer a friend&apos;s quiz, your match connection and live chat will appear here!
              </p>
              <div className="pt-2">
                <Link href="/create">
                  <Button variant="default" size="lg" className="rounded-2xl">
                    Create an Invite
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((m) => (
                <Link key={m.id} href={`/match/${m.id}`}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl hover:border-roseNeon/40 hover:bg-white/[0.05] transition-all flex flex-col justify-between group cursor-pointer shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {m.partnerAvatar ? (
                          <img
                            src={m.partnerAvatar}
                            alt={m.partnerName}
                            className="w-13 h-13 rounded-2xl object-cover border border-roseNeon shadow-md"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-2xl bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-2xl shadow-md">
                            {m.partnerEmoji || '💖'}
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                            {m.partnerName}
                          </h4>
                          <span className="text-xs text-white/50">
                            {m.isCreator ? 'You created quiz' : 'You answered quiz'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black text-roseNeon drop-shadow-[0_0_10px_rgba(255,51,102,0.5)]">
                          {m.compatibilityPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/60">
                      <span>{m.sameCount} / {m.totalQuestions} Questions Matched</span>
                      <span className="text-rose-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Result &amp; Chat <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
