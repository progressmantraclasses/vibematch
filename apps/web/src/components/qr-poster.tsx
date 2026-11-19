'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Check, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { CountdownTimer } from './countdown-timer';
import { HoloCard } from './fx/holo-card';
import { MandalaRing } from './fx/mandala-ring';
import { OrnamentDivider } from './fx/ornament-divider';

interface QrPosterProps {
  shareUrl: string;
  shortCode: string;
  friendName?: string | null;
  creatorName: string;
  expiresAt: string | Date | null;
}

export function QrPoster({ shareUrl, shortCode, friendName, creatorName, expiresAt }: QrPosterProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1000;

    const bgGradient = ctx.createLinearGradient(0, 0, 800, 1000);
    bgGradient.addColorStop(0, '#1d0b33');
    bgGradient.addColorStop(0.5, '#0b0714');
    bgGradient.addColorStop(1, '#1a0826');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 800, 1000);

    // radial glow
    const glow = ctx.createRadialGradient(400, 480, 50, 400, 480, 420);
    glow.addColorStop(0, 'rgba(255,51,102,0.25)');
    glow.addColorStop(1, 'rgba(255,51,102,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 800, 1000);

    // symmetric frame + corner brackets
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 740, 940);
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 5;
    const c = 46;
    const corners: [number, number, number, number][] = [
      [30, 30, 1, 1],
      [770, 30, -1, 1],
      [30, 970, 1, -1],
      [770, 970, -1, -1],
    ];
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * c);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * c, y);
      ctx.stroke();
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff3366';
    ctx.font = 'bold 44px Inter, sans-serif';
    ctx.fillText('DilSe VibeMatch', 400, 115);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('A 1-of-1 Secret Compatibility Invite', 400, 152);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Inter, sans-serif';
    const greeting = friendName
      ? `Hey ${friendName}! ${creatorName} made this for you ✨`
      : `${creatorName} sent you a private vibe check 💌`;
    ctx.fillText(greeting, 400, 212);

    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(175, 260, 450, 450, 28);
      ctx.fill();
      ctx.drawImage(img, 200, 285, 400, 400);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`Code: ${shortCode}`, 400, 775);

      ctx.fillStyle = 'rgba(255, 51, 102, 0.95)';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText('🔒 Single-Use Cryptographic QR Lock', 400, 815);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('Scan with any phone camera to unlock', 400, 855);

      const link = document.createElement('a');
      link.download = `DilSe-VibeMatch-${shortCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <HoloCard accent="rose" active tilt tiltMax={6} className="w-full p-6 sm:p-8 overflow-hidden !bg-[#120820]/70">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            1-Person Single-Use Locked
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            {friendName ? `For ${friendName} 💌` : 'Your Secret Vibe QR 💌'}
          </h3>
          <p className="text-xs sm:text-sm text-white/55 mt-1.5">Share this private QR with your friend or crush!</p>
          <OrnamentDivider className="my-4" />

          {/* QR stage */}
          <div className="relative w-[260px] h-[260px] sm:w-[290px] sm:h-[290px] grid place-items-center my-2">
            <MandalaRing className="absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)]" intensity={0.8} />
            {/* rotating conic frame */}
            <div
              aria-hidden
              className="absolute inset-3 rounded-[2rem] blur-[2px]"
              style={{
                background: 'conic-gradient(from var(--angle), #ff3366, #a855f7, #38bdf8, #fbbf24, #ff3366)',
                animation: 'border-spin 4s linear infinite',
              }}
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.2 }}
              className="relative p-3 bg-white rounded-[1.6rem] shadow-[0_20px_60px_-10px_rgba(255,51,102,0.7)] overflow-hidden"
            >
              <div ref={qrRef}>
                <QRCodeSVG
                  value={shareUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff3366"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
                    height: 38,
                    width: 38,
                    excavate: true,
                  }}
                />
              </div>
              {/* scanning laser */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-2 h-10 bg-gradient-to-b from-transparent via-roseNeon/35 to-transparent"
                animate={{ top: ['-10%', '90%', '-10%'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2.5">
            <span className="font-mono text-sm tracking-[0.3em] font-bold text-white bg-white/[0.07] px-4 py-1.5 rounded-xl border border-white/15">
              {shortCode}
            </span>
            <CountdownTimer expiresAt={expiresAt} />
          </div>
        </div>
      </HoloCard>

      <div className="grid grid-cols-2 gap-3 w-full mt-4">
        <Button onClick={handleDownload} variant="outline" className="h-12 gap-2 rounded-2xl">
          <Download className="w-4 h-4 text-roseNeon" />
          Download
        </Button>
        <Button onClick={handleCopy} className="h-12 gap-2 rounded-2xl">
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
