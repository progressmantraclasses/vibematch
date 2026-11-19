'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MessageCircle, Smile } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { HoloCard } from './fx/holo-card';
import { AvatarOrb } from './fx/avatar-orb';
import { cn } from '../lib/utils';

interface ChatMessage {
  id: string;
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  senderEmoji?: string;
  text: string;
  timestamp: string | Date;
}

interface VibeChatProps {
  matchId: string;
  creatorName: string;
  creatorEmoji?: string;
  creatorAvatar?: string;
  responderName: string;
  responderEmoji?: string;
  responderAvatar?: string;
  initialMessages?: ChatMessage[];
  currentViewerRole?: 'creator' | 'responder';
}

export function VibeChat({
  matchId,
  creatorName,
  creatorEmoji = '😎',
  creatorAvatar,
  responderName,
  responderEmoji = '💖',
  responderAvatar,
  initialMessages = [],
  currentViewerRole,
}: VibeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [activeRole, setActiveRole] = useState<'creator' | 'responder'>(currentViewerRole || 'responder');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
      'http://localhost:4000';

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-chat', { matchId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive-chat-message', (newMsg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    socket.on('user-typing', (data: { senderName: string; isTyping: boolean }) => {
      if (data.isTyping && data.senderName !== getActiveSenderName()) {
        setTypingUser(data.senderName);
      } else {
        setTypingUser(null);
      }
    });

    async function fetchMessages() {
      try {
        const history = await api.get<ChatMessage[]>(`/matches/${matchId}/messages`);
        if (Array.isArray(history) && history.length > 0) {
          setMessages(history);
        }
      } catch {
        // fall back to initialMessages
      }
    }
    fetchMessages();

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  // Auto-scroll inside the message pane only (never scroll the whole page)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typingUser]);

  const getActiveSenderName = () => (activeRole === 'creator' ? creatorName : responderName);
  const getActiveSenderEmoji = () => (activeRole === 'creator' ? creatorEmoji : responderEmoji);
  const getActiveSenderAvatar = () => (activeRole === 'creator' ? creatorAvatar : responderAvatar);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !socketRef.current) return;

    const senderName = getActiveSenderName();
    socketRef.current.emit('send-chat-message', {
      matchId,
      senderName,
      senderRole: activeRole,
      senderAvatar: getActiveSenderAvatar() || '',
      senderEmoji: getActiveSenderEmoji(),
      text,
    });
    socketRef.current.emit('typing', { matchId, senderName, isTyping: false });
    setInputText('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (socketRef.current) {
      const senderName = getActiveSenderName();
      socketRef.current.emit('typing', { matchId, senderName, isTyping: true });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', { matchId, senderName, isTyping: false });
      }, 1500);
    }
  };

  const quickReactions = ['💖', '🔥', '✨', '😂', '🌹', '🙈', 'Coffee chalo? ☕', 'Sach mein? 😳'];

  return (
    <HoloCard accent="rose" corners className="w-full p-4 sm:p-6 md:p-8 !bg-[#120820]/70" contentClassName="space-y-4">
      {/* Header — mirrored avatars around the title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex -space-x-3">
            <AvatarOrb src={creatorAvatar} emoji={creatorEmoji} size="md" accent="rose" />
            <AvatarOrb src={responderAvatar} emoji={responderEmoji} size="md" accent="violet" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 grid place-items-center w-5 h-5 rounded-full bg-roseNeon ring-2 ring-[#120820]">
              <Heart className="w-2.5 h-2.5 text-white fill-white" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-roseNeon" />
                Live Vibe Chat
              </h3>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                  isConnected
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                )}
              >
                <span className="relative flex w-1.5 h-1.5">
                  <span className={cn('absolute inset-0 rounded-full animate-ping', isConnected ? 'bg-emerald-400' : 'bg-amber-400')} />
                  <span className={cn('relative w-1.5 h-1.5 rounded-full', isConnected ? 'bg-emerald-400' : 'bg-amber-400')} />
                </span>
                {isConnected ? 'Live' : 'Connecting…'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/45 mt-0.5 truncate">
              Private chat · {creatorName} &amp; {responderName}
            </p>
          </div>
        </div>

        {/* identity switch with sliding pill */}
        <div className="relative grid grid-cols-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10 self-stretch sm:self-center">
          {(['creator', 'responder'] as const).map((role) => {
            const active = activeRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={cn(
                  'relative px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer truncate',
                  active ? 'text-white' : 'text-white/50 hover:text-white',
                )}
              >
                {active && (
                  <motion.span
                    layoutId={`chat-role-${matchId}`}
                    className={cn(
                      'absolute inset-0 rounded-xl',
                      role === 'creator'
                        ? 'bg-roseNeon shadow-[0_6px_20px_-6px_rgba(255,51,102,0.9)]'
                        : 'bg-electricViolet shadow-[0_6px_20px_-6px_rgba(168,85,247,0.9)]',
                    )}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">
                  {role === 'creator' ? `${creatorEmoji} ${creatorName}` : `${responderEmoji} ${responderName}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="min-h-[300px] max-h-[55vh] sm:max-h-[420px] overflow-y-auto pr-1 space-y-3 flex flex-col no-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 my-auto">
            <div className="relative mb-4">
              <span className="absolute inset-0 rounded-full bg-roseNeon/30 animate-ping-soft" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-roseNeon/30 to-electricViolet/30 border border-roseNeon/40 grid place-items-center">
                <Heart className="w-7 h-7 text-roseNeon fill-roseNeon/40 heartbeat-glow" />
              </div>
            </div>
            <p className="font-display text-base font-bold text-white/85">Break the ice! ✨</p>
            <p className="text-xs text-white/45 mt-1.5 max-w-xs">
              Say hi, share a sweet compliment, or react to your vibe compatibility score!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === activeRole;
            const isCreatorMsg = msg.senderRole === 'creator';
            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.9, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className={cn('flex items-end gap-2', isMe ? 'justify-end' : 'justify-start')}
              >
                {!isMe && (
                  <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 grid place-items-center text-sm shrink-0">
                    {msg.senderEmoji || '💖'}
                  </span>
                )}
                <div
                  className={cn(
                    'max-w-[80%] sm:max-w-[68%] rounded-2xl px-4 py-2.5 shadow-lg',
                    isMe
                      ? isCreatorMsg
                        ? 'bg-gradient-to-br from-roseNeon to-fuchsia-600 text-white rounded-br-md shadow-[0_10px_24px_-10px_rgba(255,51,102,0.9)]'
                        : 'bg-gradient-to-br from-electricViolet to-indigo-600 text-white rounded-br-md shadow-[0_10px_24px_-10px_rgba(168,85,247,0.9)]'
                      : 'bg-white/[0.08] border border-white/10 text-white/95 rounded-bl-md backdrop-blur-md',
                  )}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 mb-0.5">
                    <span className="font-bold">{msg.senderName}</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed break-words">{msg.text}</p>
                </div>
                {isMe && (
                  <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 grid place-items-center text-sm shrink-0">
                    {msg.senderEmoji || '💖'}
                  </span>
                )}
              </motion.div>
            );
          })
        )}

        <AnimatePresence>
          {typingUser && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              className="flex items-center gap-2 text-[11px] text-rose-200 px-3.5 py-2 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/10 w-fit"
            >
              <span className="font-semibold">{typingUser}</span>
              <span className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-roseNeon"
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick reactions */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 pt-3 no-scrollbar border-t border-white/10"
        style={{ maskImage: 'linear-gradient(90deg, #000 85%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, #000 85%, transparent)' }}
      >
        <span className="text-[10px] text-white/40 shrink-0 flex items-center gap-1 font-bold uppercase tracking-wider">
          <Smile className="w-3.5 h-3.5 text-roseNeon" /> Quick
        </span>
        {quickReactions.map((r, i) => (
          <motion.button
            key={i}
            type="button"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSendMessage(r)}
            className="px-3.5 h-9 rounded-full text-xs font-semibold bg-white/[0.05] border border-white/10 hover:bg-roseNeon/20 hover:border-roseNeon/40 text-white/90 transition-colors shrink-0 cursor-pointer"
          >
            {r}
          </motion.button>
        ))}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <Input
          placeholder={`Message ${activeRole === 'creator' ? responderName : creatorName}…`}
          value={inputText}
          onChange={handleTyping}
          className="flex-1 h-12"
        />
        <Button type="submit" disabled={!inputText.trim()} className="gap-2 px-4 sm:px-6 h-12 rounded-2xl shrink-0" aria-label="Send">
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline font-bold">Send</span>
        </Button>
      </form>
    </HoloCard>
  );
}
