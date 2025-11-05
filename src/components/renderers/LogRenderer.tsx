'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogRendererProps {
  logs: string[];
  className?: string;
}

export const LogRenderer: React.FC<LogRendererProps> = ({ logs, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className={cn(
        'glass-panel p-4 rounded-lg h-full max-h-64 overflow-y-auto glass-scrollbar',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
        <Terminal className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-gray-300">Console Output</span>
      </div>

      <div ref={containerRef} className="space-y-1">
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-xs text-gray-300 py-1"
            >
              <span className="text-gray-500 mr-2">{index + 1}.</span>
              {log}
            </motion.div>
          ))}
        </AnimatePresence>

        {logs.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            No output yet
          </div>
        )}
      </div>
    </div>
  );
};

export default LogRenderer;
