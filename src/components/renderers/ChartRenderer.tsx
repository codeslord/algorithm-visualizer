'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChartRendererProps {
  data: number[];
  selected?: number[];
  className?: string;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  data,
  selected = [],
  className,
}) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data, 1);

  return (
    <div className={cn('flex items-end justify-center gap-2 h-48 p-4', className)}>
      {data.map((value, index) => {
        const heightPercent = (value / maxValue) * 100;
        const isSelected = selected.includes(index);

        return (
          <div
            key={index}
            className="flex flex-col items-center gap-2 flex-1 min-w-0"
          >
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 15,
              }}
              className="w-full origin-bottom"
              style={{ height: `${Math.max(heightPercent, 5)}%` }}
            >
              <div
                className={cn(
                  'w-full h-full rounded-t-md relative',
                  'transition-all duration-300',
                  isSelected
                    ? 'bg-gradient-to-t from-accent to-accent-light shadow-glow-accent'
                    : 'bg-gradient-to-t from-secondary/70 to-secondary/40'
                )}
              >
                {/* Value label */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-white font-bold">
                  {value}
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default ChartRenderer;
