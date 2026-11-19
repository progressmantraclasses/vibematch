'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Accent } from '../fx/accent';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  accent?: Accent;
  hideClose?: boolean;
}

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, accent = 'rose', hideClose = false, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md data-[state=open]:animate-[fade-in_.25s_ease-out]" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'holo-card fixed left-1/2 top-1/2 z-[61] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 p-6 sm:p-7 !bg-[#120820]/95 focus:outline-none',
          'data-[state=open]:animate-[dialog-in_.4s_cubic-bezier(0.16,1,0.3,1)]',
          `holo-accent-${accent}`,
          className,
        )}
        data-active="true"
        {...props}
      >
        <span aria-hidden className="grain" />
        <span aria-hidden className="holo-corner tl" />
        <span aria-hidden className="holo-corner tr" />
        <span aria-hidden className="holo-corner bl" />
        <span aria-hidden className="holo-corner br" />
        <div className="relative z-[2]">{children}</div>
        {!hideClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 z-[3] p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-display text-lg sm:text-xl font-bold text-white tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-xs sm:text-sm text-white/60 leading-relaxed mt-1.5', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription };
