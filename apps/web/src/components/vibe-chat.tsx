'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Sparkles, MessageCircle, Smile, Circle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
  const [activeRole, setActiveRole] = useState<'creator' | 'responder'>(
    currentViewerRole || 'responder',
  );
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.io connection
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
        // Prevent duplicate messages if already present
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    socket.on(
      'user-typing',
      (data: { senderName: string; isTyping: boolean }) => {
        if (data.isTyping && data.senderName !== getActiveSenderName()) {
          setTypingUser(data.senderName);
        } else {
          setTypingUser(null);
        }
      },
    );

    // Fetch initial chat history
    async function fetchMessages() {
      try {
        const history = await api.get<ChatMessage[]>(
          `/matches/${matchId}/messages`,
        );
        if (Array.isArray(history) && history.length > 0) {
          setMessages(history);
        }
      } catch {
        // Fallback to initialMessages prop
      }
    }
    fetchMessages();

    return () => {
      socket.disconnect();
    };
  }, [matchId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const getActiveSenderName = () => {
    return activeRole === 'creator' ? creatorName : responderName;
  };

  const getActiveSenderEmoji = () => {
    return activeRole === 'creator' ? creatorEmoji : responderEmoji;
  };

  const getActiveSenderAvatar = () => {
    return activeRole === 'creator' ? creatorAvatar : responderAvatar;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !socketRef.current) return;

    const senderName = getActiveSenderName();
    const payload = {
      matchId,
      senderName,
      senderRole: activeRole,
      senderAvatar: getActiveSenderAvatar() || '',
      senderEmoji: getActiveSenderEmoji(),
      text,
    };

    // Emit via WebSocket
    socketRef.current.emit('send-chat-message', payload);

    // Stop typing indicator
    socketRef.current.emit('typing', {
      matchId,
      senderName,
      isTyping: false,
    });

    setInputText('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (socketRef.current) {
      const senderName = getActiveSenderName();
      socketRef.current.emit('typing', {
        matchId,
        senderName,
        isTyping: true,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', {
          matchId,
          senderName,
          isTyping: false,
        });
      }, 1500);
    }
  };

  const quickReactions = ['💖', '🔥', '✨', '😂', '🌹', '🙈', 'Coffee chalo? ☕', 'Sach mein? 😳'];

  return (
    <div className="w-full rounded-3xl border border-white/15 bg-gradient-to-b from-[#160a28]/95 via-[#0b0714]/95 to-[#120820]/95 p-4 sm:p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-4 relative overflow-hidden">
      {/* Decorative ambient corner glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-roseNeon/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-electricViolet/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-roseNeon to-electricViolet flex items-center justify-center shadow-lg shadow-roseNeon/30 shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                DilSe Live Vibe Chat
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Circle
                  className={`w-2 h-2 fill-current ${
                    isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
                  }`}
                />
                {isConnected ? 'Real-time Connected' : 'Connecting...'}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Private chat between {creatorName} & {responderName}
            </p>
          </div>
        </div>

        {/* Switch identity toggle */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-center">
          <span className="text-[11px] text-white/50 pl-2 font-medium">You are:</span>
          <button
            type="button"
            onClick={() => setActiveRole('creator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRole === 'creator'
                ? 'bg-roseNeon text-white shadow-md shadow-roseNeon/25'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {creatorName} ({creatorEmoji})
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('responder')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRole === 'responder'
                ? 'bg-electricViolet text-white shadow-md shadow-purple-600/25'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {responderName} ({responderEmoji})
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="min-h-[280px] max-h-[380px] overflow-y-auto pr-2 space-y-3 custom-scrollbar flex flex-col relative z-10">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white/40 my-auto">
            <Heart className="w-12 h-12 text-roseNeon/50 fill-roseNeon/20 animate-pulse mb-3" />
            <p className="text-base font-semibold text-white/80">
              Break the ice! Start chatting right now ✨
            </p>
            <p className="text-xs text-white/50 mt-1 max-w-sm">
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
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`flex items-end gap-2.5 ${
                  isMe ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm shrink-0 mb-1">
                    {msg.senderEmoji || '💖'}
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-lg backdrop-blur-md transition-all ${
                    isMe
                      ? isCreatorMsg
                        ? 'bg-gradient-to-r from-roseNeon to-pink-600 text-white rounded-br-none shadow-roseNeon/20'
                        : 'bg-gradient-to-r from-electricViolet to-purple-600 text-white rounded-br-none shadow-purple-600/20'
                      : 'bg-white/10 border border-white/15 text-white/95 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-0.5">
                    <span className="font-bold">{msg.senderName}</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed break-words">
                    {msg.text}
                  </p>
                </div>

                {isMe && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm shrink-0 mb-1">
                    {msg.senderEmoji || '💖'}
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUser && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center gap-2 text-xs text-rose-300 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit"
            >
              <span className="font-semibold">{typingUser} is typing</span>
              <span className="flex items-center gap-1 ml-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-roseNeon animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-roseNeon animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-roseNeon animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar relative z-10 border-t border-white/10">
        <span className="text-[11px] text-white/40 shrink-0 flex items-center gap-1 font-semibold uppercase tracking-wider">
          <Smile className="w-3.5 h-3.5 text-roseNeon" /> Quick:
        </span>
        {quickReactions.map((r, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(r)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-roseNeon/20 hover:border-roseNeon/40 text-white/90 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input & Send Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2 border-t border-white/10 relative z-10"
      >
        <Input
          placeholder={`Message ${
            activeRole === 'creator' ? responderName : creatorName
          }...`}
          value={inputText}
          onChange={handleTyping}
          className="flex-1 bg-white/5 border-white/15 text-sm h-12 rounded-2xl focus-visible:ring-roseNeon"
        />

        <Button
          type="submit"
          variant="default"
          size="default"
          disabled={!inputText.trim()}
          className="gap-2 px-6 h-12 rounded-2xl shrink-0 shadow-lg shadow-roseNeon/25 active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline font-bold">Send</span>
        </Button>
      </form>
    </div>
  );
}
