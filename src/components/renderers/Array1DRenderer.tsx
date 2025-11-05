'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Array1DTracer } from '@/lib/tracers';

interface Array1DRendererProps {
  title: string;
  data: Array1DTracer;
}

export const Array1DRenderer: React.FC<Array1DRendererProps> = ({
  title,
  data: tracer,
}) => {
  const data = tracer.data;

  if (!data || data.length === 0 || !data[0]) return null;

  const row = data[0]; // Array1D stores data as a single row in 2D array
  const values = row.map(el => el.value);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  return (
    <div className="glass-panel rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">{title}</h3>
      <div className="flex items-end justify-center gap-1 h-64">
        {row.map((element, index) => {
          const heightPercent = ((element.value - minValue) / range) * 100;

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
                  element.selected && 'shadow-glow-primary',
                  element.patched && 'shadow-glow-accent',
                  !element.selected && !element.patched && 'bg-gradient-to-t from-primary/70 to-primary/40',
                  element.selected && 'bg-gradient-to-t from-primary to-primary-light animate-pulse',
                  element.patched && 'bg-gradient-to-t from-accent to-accent-light'
                )}
              >
                {/* Value label on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono bg-black/80 px-2 py-1 rounded whitespace-nowrap">
                    {element.value}
                  </span>
                </div>
              </motion.div>

              {/* Index label */}
              <span className="text-xs text-gray-400 font-mono">{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Array1DRenderer;
