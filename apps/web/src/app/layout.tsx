import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../providers/theme-provider';
import { QueryProvider } from '../providers/query-provider';
import { Navbar } from '../components/navbar';
import { FloatingOrbs } from '../components/floating-orbs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DilSe VibeMatch — Secret Crush & Friend Compatibility 💖',
  description:
    'Single-use cryptographically secured QR code compatibility quiz. Find out how well you and your friend or crush vibe together, exchange secret confessions, and unlock mutual Instagram/WhatsApp contacts!',
  openGraph: {
    title: 'DilSe VibeMatch — Known-Crush Compatibility Platform',
    description:
      'Answer the same True/False questions and discover your compatibility % with 1-of-1 secure QR invites!',
    images: ['https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-velvetNight text-white min-h-screen relative overflow-x-hidden selection:bg-roseNeon/30 selection:text-white`}>
        <ThemeProvider>
          <QueryProvider>
            <FloatingOrbs />
            <Navbar />
            <div className="relative z-10 flex flex-col min-h-[calc(100vh-4.5rem)]">
              {children}
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
