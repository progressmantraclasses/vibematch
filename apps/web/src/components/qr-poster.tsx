'use client';

import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { CountdownTimer } from './countdown-timer';

interface QrPosterProps {
  shareUrl: string;
  shortCode: string;
  friendName?: string | null;
  creatorName: string;
  expiresAt: string | Date | null;
}

export function QrPoster({
  shareUrl,
  shortCode,
  friendName,
  creatorName,
  expiresAt,
}: QrPosterProps) {
  const [copied, setCopied] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    // Generate high-res image using HTML5 Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1000;

    // Dark romantic gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 800, 1000);
    bgGradient.addColorStop(0, '#12071f');
    bgGradient.addColorStop(0.5, '#0b0714');
    bgGradient.addColorStop(1, '#1a0826');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 800, 1000);

    // Subtle border glow
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 740, 940);

    // Title
    ctx.fillStyle = '#ff3366';
    ctx.font = 'bold 42px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DilSe VibeMatch', 400, 110);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('A 1-of-1 Secret Compatibility Invite', 400, 150);

    // Recipient Greeting
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Inter, sans-serif';
    const greeting = friendName
      ? `Hey ${friendName}! ${creatorName} made this for you ✨`
      : `${creatorName} sent you a private vibe check 💌`;
    ctx.fillText(greeting, 400, 210);

    // Draw QR code to canvas
    const svg = posterRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      img.onload = () => {
        // Draw white card behind QR
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(175, 260, 450, 450, 24);
        ctx.fill();

        // Draw QR
        ctx.drawImage(img, 200, 285, 400, 400);

        // Security badge footer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.fillText(`Code: ${shortCode}`, 400, 770);

        ctx.fillStyle = 'rgba(255, 51, 102, 0.9)';
        ctx.font = '18px Inter, sans-serif';
        ctx.fillText('🔒 Single-Use Cryptographic QR Lock', 400, 810);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText('Scan with any phone camera to unlock', 400, 850);

        // Download PNG
        const link = document.createElement('a');
        link.download = `DilSe-VibeMatch-${shortCode}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Poster Card */}
      <div
        ref={posterRef}
        className="w-full relative rounded-3xl border border-white/20 bg-gradient-to-b from-[#180928]/90 via-[#0b0714]/90 to-[#12061e]/90 p-8 shadow-2xl backdrop-blur-2xl flex flex-col items-center text-center overflow-hidden"
      >
        {/* Glow corner accents */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-roseNeon/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-electricViolet/20 rounded-full blur-3xl pointer-events-none" />

        {/* Security badge pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-roseNeon/15 border border-roseNeon/30 text-rose-300 text-xs font-semibold mb-4 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          1-Person Single-Use Locked
        </div>

        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          {friendName ? `For ${friendName} 💌` : 'Your Secret Vibe QR 💌'}
        </h3>
        <p className="text-sm text-white/60 mt-1 mb-6">
          Share this private QR with your friend or crush!
        </p>

        {/* High-DPI QR Container */}
        <div className="relative p-5 bg-white rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105">
          <QRCodeSVG
            value={shareUrl}
            size={220}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff3366"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        {/* Short code & Timer */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="font-mono text-sm tracking-wider font-bold text-white/90 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
            {shortCode}
          </span>
          <CountdownTimer expiresAt={expiresAt} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 w-full mt-4">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-roseNeon" />
          Download Poster
        </Button>
        <Button
          onClick={handleCopy}
          variant="rose"
          className="flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied Link!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Share Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
