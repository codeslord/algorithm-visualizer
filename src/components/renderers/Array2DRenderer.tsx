'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Array2DRendererProps {
  data: number[][];
  selected?: Array<[number, number]>;
  patched?: Map<string, number>;
  className?: string;
}

export const Array2DRenderer: React.FC<Array2DRendererProps> = ({
  data,
  selected = [],
  patched,
  className,
}) => {
  if (!data || data.length === 0) return null;

  const flatData = data.flat();
  const maxValue = Math.max(...flatData, 1);
  const minValue = Math.min(...flatData, 0);
  const range = maxValue - minValue || 1;

  const isSelected = (row: number, col: number) =>
    selected.some(([r, c]) => r === row && c === col);

  const getPatchedValue = (row: number, col: number) => {
    const key = `${row},${col}`;
    return patched?.has(key) ? patched.get(key)! : data[row][col];
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 p-4', className)}>
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((_, colIndex) => {
            const value = getPatchedValue(rowIndex, colIndex);
            const selected = isSelected(rowIndex, colIndex);
            const isPatched = patched?.has(`${rowIndex},${colIndex}`);
            const intensity = ((value - minValue) / range) * 100;

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  'font-mono text-sm font-bold',
                  'transition-all duration-300',
                  'border-2',
                  selected && 'border-primary shadow-glow-primary scale-110',
                  isPatched && 'border-accent shadow-glow-accent',
                  !selected && !isPatched && 'border-white/20'
                )}
                style={{
                  backgroundColor: `rgba(41, 98, 255, ${intensity / 100})`,
                }}
              >
                {value}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Array2DRenderer;
