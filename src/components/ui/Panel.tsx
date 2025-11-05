import React from 'react';
import { cn } from '@/lib/utils';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'container';
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, children, variant = 'glass', ...props }, ref) => {
    const variants = {
      default: 'bg-gray-900/50 border border-gray-700',
      glass: 'glass-panel',
      container: 'glass-container',
    };

    return (
      <div
        ref={ref}
        className={cn('p-4', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = 'Panel';

export default Panel;
