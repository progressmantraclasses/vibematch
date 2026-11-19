'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer relative inline-flex h-7 w-[3.25rem] shrink-0 cursor-pointer items-center rounded-full border border-white/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roseNeon focus-visible:ring-offset-2 focus-visible:ring-offset-velvetNight disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-roseNeon data-[state=checked]:to-electricViolet data-[state=checked]:border-transparent data-[state=checked]:shadow-[0_0_20px_-2px_rgba(255,51,102,0.7)]',
      'data-[state=unchecked]:bg-white/10',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none grid place-items-center h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] data-[state=checked]:translate-x-[1.6rem] data-[state=unchecked]:translate-x-1',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
