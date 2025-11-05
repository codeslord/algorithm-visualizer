'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Array2DTracer } from '@/lib/tracers';

interface Array2DRendererProps {
  title: string;
  data: Array2DTracer;
}

export const Array2DRenderer: React.FC<Array2DRendererProps> = ({
  title,
  data: tracer,
}) => {
  const data = tracer.data;

  if (!data || data.length === 0) return null;

  const flatValues = data.flat().map(el => el.value);
  const maxValue = Math.max(...flatValues, 1);
  const minValue = Math.min(...flatValues, 0);
  const range = maxValue - minValue || 1;

  return (
    <div className="glass-panel rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">{title}</h3>
      <div className="flex flex-col items-center justify-center gap-2">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((element, colIndex) => {
              const intensity = ((element.value - minValue) / range) * 100;

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
                    element.selected && 'border-primary shadow-glow-primary scale-110',
                    element.patched && 'border-accent shadow-glow-accent',
                    !element.selected && !element.patched && 'border-white/20'
                  )}
                  style={{
                    backgroundColor: `rgba(41, 98, 255, ${intensity / 100})`,
                  }}
                >
                  {element.value}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Array2DRenderer;
