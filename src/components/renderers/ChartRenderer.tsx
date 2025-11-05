'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChartTracer } from '@/lib/tracers';

interface ChartRendererProps {
  title: string;
  data: ChartTracer;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  title,
  data: tracer,
}) => {
  const data = tracer.data;

  if (!data || data.length === 0 || !data[0]) return null;

  const row = data[0]; // Chart data is stored as single row
  const values = row.map(el => el.value);
  const maxValue = Math.max(...values, 1);

  return (
    <div className="glass-panel rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">{title}</h3>
      <div className="flex items-end justify-center gap-2 h-48">
        {row.map((element, index) => {
          const heightPercent = (element.value / maxValue) * 100;

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
                    element.selected
                      ? 'bg-gradient-to-t from-accent to-accent-light shadow-glow-accent'
                      : 'bg-gradient-to-t from-secondary/70 to-secondary/40'
                  )}
                >
                  {/* Value label */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-white font-bold">
                    {element.value}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartRenderer;
