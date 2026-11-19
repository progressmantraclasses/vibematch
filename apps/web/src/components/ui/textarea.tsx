import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-[15px] sm:text-sm text-white placeholder:text-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-all duration-300 resize-y',
        'hover:border-white/25 hover:bg-white/[0.06]',
        'focus-visible:outline-none focus-visible:border-roseNeon/60 focus-visible:bg-white/[0.07] focus-visible:shadow-[0_0_0_4px_rgba(255,51,102,0.15),0_8px_30px_-12px_rgba(255,51,102,0.6)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
