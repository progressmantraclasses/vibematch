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
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-roseNeon/20 border-t-roseNeon animate-spin" />
        <p className="text-white/60 text-sm mt-4 font-medium">Loading your vibes...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-white/15 bg-white/[0.04] p-8 backdrop-blur-2xl shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-roseNeon/20 border border-roseNeon/30 flex items-center justify-center mx-auto mb-4 text-roseNeon">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Sign In to View Dashboard
          </h2>
          <p className="text-sm text-white/60 mb-6">
            Log in with Google to view all your created QR invites, active match connections, and secret responses.
          </p>
          <GoogleAuthButton />
        </div>
      </div>
    );
  }

  const activeInvites = invites.filter((i) => i.status === 'ACTIVE' || i.status === 'CLAIMED');
  const completedMatches = invites.filter((i) => i.status === 'COMPLETED').length + matches.length;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-3xl object-cover border-2 border-roseNeon/50 shadow-xl"
            />
          ) : (
            <div className="w-16 h-16 rounded-3xl bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-3xl shadow-xl">
              {user.customAvatarEmoji || '😎'}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-rose-300 font-medium">
              {user.tagline || 'Ready to match vibes ✨'}
            </p>
          </div>
        </div>

        <Link href="/create">
          <Button variant="default" size="lg" className="gap-2 shadow-lg shadow-roseNeon/30">
            <PlusCircle className="w-5 h-5" />
            Create New QR Invite
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <span className="text-xs text-white/50 font-semibold uppercase tracking-wider block mb-1">
            Total Invites
          </span>
          <div className="text-3xl font-black text-white">
            <AnimatedCounter value={invites.length} />
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5 backdrop-blur-xl">
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
            Active / Claimed QRs
          </span>
          <div className="text-3xl font-black text-emerald-300">
            <AnimatedCounter value={activeInvites.length} />
          </div>
        </div>

        <div className="rounded-3xl border border-roseNeon/20 bg-roseNeon/[0.05] p-5 backdrop-blur-xl">
          <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider block mb-1">
            Completed Matches
          </span>
          <div className="text-3xl font-black text-roseNeon">
            <AnimatedCounter value={completedMatches} />
          </div>
        </div>

        <div className="rounded-3xl border border-electricViolet/20 bg-electricViolet/[0.05] p-5 backdrop-blur-xl">
          <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider block mb-1">
            Vibe Connections
          </span>
          <div className="text-3xl font-black text-electricViolet">
            <AnimatedCounter value={matches.length} />
          </div>
        </div>
      </div>

      {/* TABS: Invites I Sent VS Quizzes I Answered */}
      <Tabs defaultValue="invites" className="w-full">
        <TabsList className="grid grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="invites">
            Invites I Sent ({invites.length})
          </TabsTrigger>
          <TabsTrigger value="matches">
            Our Shared Vibe Matches ({matches.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INVITES I SENT */}
        <TabsContent value="invites" className="space-y-4">
          {invites.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-white/10 bg-white/[0.02]">
              <QrCode className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No QR Invites Created Yet</h3>
              <p className="text-xs text-white/50 mb-6">
                Create a 1-of-1 private QR code for your friend or crush!
              </p>
              <Link href="/create">
                <Button variant="default">Create Your First Invite</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-white/70 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
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

                    <h4 className="text-lg font-bold text-white mb-1">
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
                        <Button variant="rose" size="sm" className="w-full gap-1.5">
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
                        className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
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
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: OUR SHARED VIBE MATCHES */}
        <TabsContent value="matches" className="space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-white/10 bg-white/[0.02]">
              <Heart className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Shared Matches Yet</h3>
              <p className="text-xs text-white/50 mb-6">
                When a friend answers your quiz, or when you answer a friend&apos;s quiz, your match card will appear here!
              </p>
              <Link href="/create">
                <Button variant="default">Create an Invite</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((m) => (
                <Link key={m.id} href={`/match/${m.id}`}>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl hover:border-roseNeon/40 hover:scale-[1.02] transition-all flex flex-col justify-between group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {m.partnerAvatar ? (
                          <img
                            src={m.partnerAvatar}
                            alt={m.partnerName}
                            className="w-12 h-12 rounded-full object-cover border border-roseNeon"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-roseNeon/20 border border-roseNeon/40 flex items-center justify-center text-xl">
                            {m.partnerEmoji || '💖'}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                            {m.partnerName}
                          </h4>
                          <span className="text-xs text-white/50">
                            {m.isCreator ? 'You created quiz' : 'You answered quiz'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-black text-roseNeon">
                          {m.compatibilityPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/60">
                      <span>{m.sameCount} / {m.totalQuestions} Questions Matched</span>
                      <span className="text-rose-300 font-semibold flex items-center gap-1">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
