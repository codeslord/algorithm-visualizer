import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      children,
      isLoading,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'glass-button',
      primary: 'glass-button-primary',
      secondary: 'glass-button-secondary',
      accent: 'glass-button-accent',
      ghost: 'bg-transparent hover:bg-white/10 border-transparent',
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
      icon: 'p-2 w-10 h-10',
    };

    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            'font-medium rounded-lg',
            'transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            variants[variant],
            sizes[size],
            className
          )}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading ? (
            <>
              <div className="spinner w-4 h-4" />
              <span>Loading...</span>
            </>
          ) : (
            children
          )}
        </button>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';

export default Button;
