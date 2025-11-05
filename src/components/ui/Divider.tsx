import React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'divider',
          orientation === 'vertical' ? 'border-l h-full' : 'border-t w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
