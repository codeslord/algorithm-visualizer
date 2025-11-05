'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Array1DRendererProps {
  data: number[];
  selected?: number[];
  patched?: Map<number, number>;
  className?: string;
}

export const Array1DRenderer: React.FC<Array1DRendererProps> = ({
  data,
  selected = [],
  patched,
  className,
}) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;

  return (
    <div className={cn('flex items-end justify-center gap-1 h-64 p-4', className)}>
      {data.map((value, index) => {
        const displayValue = patched?.has(index) ? patched.get(index)! : value;
        const heightPercent = ((displayValue - minValue) / range) * 100;
        const isSelected = selected.includes(index);
        const isPatched = patched?.has(index);

        return (
          <div
            key={index}
            className="flex flex-col items-center gap-1 flex-1 min-w-0"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(heightPercent, 5)}%` }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              className={cn(
                'w-full rounded-t-lg relative',
                'transition-colors duration-300',
                isSelected && 'shadow-glow-primary',
                isPatched && 'shadow-glow-accent',
                !isSelected && !isPatched && 'bg-gradient-to-t from-primary/70 to-primary/40',
                isSelected && 'bg-gradient-to-t from-primary to-primary-light animate-pulse',
                isPatched && 'bg-gradient-to-t from-accent to-accent-light'
              )}
            >
              {/* Value label on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-xs font-mono bg-black/80 px-2 py-1 rounded whitespace-nowrap">
                  {displayValue}
                </span>
              </div>
            </motion.div>

            {/* Index label */}
            <span className="text-xs text-gray-400 font-mono">{index}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Array1DRenderer;
