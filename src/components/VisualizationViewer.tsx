'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Play } from 'lucide-react';
import { usePlayerStore, useCurrentStore } from '@/store';
import {
  Tracer,
  Array1DTracer,
  Array2DTracer,
  LogTracer,
  ChartTracer,
  GraphTracer,
  VerticalLayout,
  HorizontalLayout,
} from '@/lib/tracers';

// Tracer class map for construction from commands
const TracerClasses: Record<string, any> = {
  Array1DTracer,
  Array2DTracer,
  LogTracer,
  ChartTracer,
  GraphTracer,
};

export const VisualizationViewer: React.FC = () => {
  const { chunks, cursor } = usePlayerStore();
  const { description } = useCurrentStore();

  // Build tracer instances from commands up to current cursor
  const { root, tracers } = useMemo(() => {
    const tracers: Record<string, Tracer> = {};
    let root: any = null;

    console.log('[VisualizationViewer] Processing chunks:', chunks.length, 'cursor:', cursor);

    // Helper function to get tracer by key
    const getObject = (key: string) => tracers[key];

    // Process all chunks up to and including the current cursor
    for (let chunkIndex = 0; chunkIndex <= cursor && chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      if (!chunk || !chunk.commands) continue;

      console.log('[VisualizationViewer] Processing chunk', chunkIndex, 'with', chunk.commands?.length, 'commands');

      chunk.commands.forEach((command: any) => {
        const { key, method, args, className } = command;

        console.log('[VisualizationViewer] Command:', { key, method, className, args });

        // Handle setRoot command
        if (method === 'setRoot') {
          const layoutKey = args[0];
          const tracerKeys = args.slice(1);

          // Try to get tracers for the layout
          const layoutTracers = tracerKeys
            .map((k: string) => tracers[k])
            .filter((t: Tracer | undefined) => t !== undefined);

          if (layoutKey === 'vertical_layout') {
            root = new VerticalLayout(layoutTracers.length > 0 ? layoutTracers : Object.values(tracers));
          } else if (layoutKey === 'horizontal_layout') {
            root = new HorizontalLayout(layoutTracers.length > 0 ? layoutTracers : Object.values(tracers));
          } else {
            // Default to showing all tracers vertically
            root = new VerticalLayout(Object.values(tracers));
          }
          console.log('[VisualizationViewer] Set root layout:', layoutKey);
          return;
        }

        if (!key) return; // Skip commands without a key

        // Check if this is a construct command
        if (method === 'construct' && args && args[0]) {
          const title = args[0];

          // Use className from command to determine tracer type
          const TracerClass = className ? TracerClasses[className] : null;

          if (TracerClass) {
            tracers[key] = new TracerClass(key, getObject, title);
            console.log('[VisualizationViewer] Created tracer:', key, className);
          } else {
            console.warn(`Unknown tracer class: ${className} for key: ${key}`);
          }
          return;
        }

        // Apply method to existing tracer instance
        if (tracers[key] && typeof tracers[key][method] === 'function') {
          try {
            tracers[key][method](...(args || []));
            console.log('[VisualizationViewer] Applied method:', key, method);
          } catch (error) {
            console.error(`Error applying ${method} to ${key}:`, error);
          }
        } else if (tracers[key]) {
          console.warn(`Method ${method} not found on tracer ${key}`);
        } else {
          console.warn(`Tracer ${key} not found for method ${method}`);
        }
      });
    }

    // If no root was set, create a default vertical layout with all tracers
    if (!root && Object.keys(tracers).length > 0) {
      root = new VerticalLayout(Object.values(tracers));
      console.log('[VisualizationViewer] Created default vertical layout with', Object.keys(tracers).length, 'tracers');
    }

    console.log('[VisualizationViewer] Final tracers:', Object.keys(tracers));
    console.log('[VisualizationViewer] Root:', root);

    return { root, tracers };
  }, [chunks, cursor]);

  const hasVisualization = chunks.length > 0 && Object.keys(tracers).length > 0;

  if (!hasVisualization) {
    return (
      <div className="visualization-container space-y-4">
        {description && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4"
          >
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Algorithm Description
            </h3>
            <p className="text-gray-300 text-sm">{description}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 min-h-[400px] flex items-center justify-center"
        >
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl mb-4">
              <Play className="w-24 h-24 mx-auto text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300">
              No Visualization Yet
            </h3>
            <p className="text-gray-400">
              Click the <span className="text-primary font-medium">Build & Run</span>{' '}
              button to execute your algorithm and see the visualization.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="visualization-container space-y-4">
      {/* Description */}
      {description && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Algorithm Description
          </h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </motion.div>
      )}

      {/* Visualization Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-panel p-6 min-h-[400px]"
      >
        <div className="space-y-6">
          {root ? (
            root.render()
          ) : (
            // Fallback: render all tracers individually
            Object.values(tracers).map((tracer) => (
              <div key={tracer.key}>
                {tracer.render()}
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Step Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Total Steps</p>
          <p className="text-2xl font-bold text-primary">{chunks.length}</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Current Step</p>
          <p className="text-2xl font-bold text-accent">{cursor + 1}</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Current Line</p>
          <p className="text-2xl font-bold text-secondary">
            {chunks[cursor]?.lineNumber || '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualizationViewer;
