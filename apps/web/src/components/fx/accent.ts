export type Accent = 'rose' | 'violet' | 'amber' | 'emerald';

/** RGB triplets used for CSS `rgb(var(--accent) / a)` tokens */
export const ACCENT_RGB: Record<Accent, string> = {
  rose: '255 51 102',
  violet: '168 85 247',
  amber: '251 191 36',
  emerald: '52 211 153',
};

export const ACCENT_TEXT: Record<Accent, string> = {
  rose: 'text-rose-300',
  violet: 'text-purple-300',
  amber: 'text-amber-300',
  emerald: 'text-emerald-300',
};

export const ACCENT_SOLID: Record<Accent, string> = {
  rose: 'text-roseNeon',
  violet: 'text-electricViolet',
  amber: 'text-warmAmber',
  emerald: 'text-emerald-400',
};

export const ACCENT_PILL: Record<Accent, string> = {
  rose: 'bg-roseNeon/10 border-roseNeon/30 text-rose-300',
  violet: 'bg-electricViolet/10 border-electricViolet/30 text-purple-300',
  amber: 'bg-warmAmber/10 border-warmAmber/30 text-amber-300',
  emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
};

export const ACCENT_GRADIENT: Record<Accent, string> = {
  rose: 'from-roseNeon to-electricViolet',
  violet: 'from-electricViolet to-sky-400',
  amber: 'from-warmAmber to-roseNeon',
  emerald: 'from-emerald-400 to-sky-400',
};
