'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Play, Layout as LayoutIcon } from 'lucide-react';
import { usePlayerStore, useCurrentStore } from '@/store';
import {
  Array1DRenderer,
  Array2DRenderer,
  LogRenderer,
  ChartRenderer,
  GraphRenderer,
} from './renderers';

interface TracerState {
  type: string;
  key: string;
  data?: any;
  selected?: any;
  patched?: any;
  logs?: string[];
  nodes?: any[];
  edges?: any[];
  directed?: boolean;
  weighted?: boolean;
}

export const VisualizationViewer: React.FC = () => {
  const { chunks, cursor } = usePlayerStore();
  const { description } = useCurrentStore();

  // Build tracer states from commands up to current cursor
  const tracerStates = useMemo(() => {
    const states = new Map<string, TracerState>();

    // Process all chunks up to and including the current cursor
    for (let i = 0; i <= cursor && i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk || !chunk.commands) continue;

      chunk.commands.forEach((command: any) => {
        const { key, method, args } = command;

        if (!key) return; // Skip root commands

        // Get or create tracer state
        if (!states.has(key)) {
          states.set(key, {
            type: method.includes('Array1D')
              ? 'array1d'
              : method.includes('Array2D')
              ? 'array2d'
              : method.includes('Chart')
              ? 'chart'
              : method.includes('Graph')
              ? 'graph'
              : method.includes('Log')
              ? 'log'
              : 'unknown',
            key,
            logs: [],
          });
        }

        const state = states.get(key)!;

        // Process command based on method
        switch (method) {
          case 'set':
            state.data = args[0];
            state.selected = [];
            state.patched = new Map();
            break;

          case 'select':
            if (state.type === 'array1d' || state.type === 'chart') {
              state.selected = args;
            } else if (state.type === 'array2d') {
              state.selected = state.selected || [];
              state.selected.push([args[0], args[1]]);
            }
            break;

          case 'deselect':
            if (state.type === 'array1d' || state.type === 'chart') {
              state.selected = state.selected?.filter((i: number) => !args.includes(i)) || [];
            } else if (state.type === 'array2d') {
              state.selected =
                state.selected?.filter(
                  ([r, c]: [number, number]) => r !== args[0] || c !== args[1]
                ) || [];
            }
            break;

          case 'patch':
            if (!state.patched) state.patched = new Map();
            if (state.type === 'array1d' || state.type === 'chart') {
              state.patched.set(args[0], args[1]);
            } else if (state.type === 'array2d') {
              state.patched.set(`${args[0]},${args[1]}`, args[2]);
            }
            break;

          case 'depatch':
            if (state.patched) {
              if (state.type === 'array1d' || state.type === 'chart') {
                state.patched.delete(args[0]);
              } else if (state.type === 'array2d') {
                state.patched.delete(`${args[0]},${args[1]}`);
              }
            }
            break;

          case 'print':
          case 'println':
            if (!state.logs) state.logs = [];
            state.logs.push(args[0]);
            break;

          case 'chart':
            // Link array to chart
            break;

          case 'addNode':
            if (!state.nodes) state.nodes = [];
            state.nodes.push({
              id: String(args[0]),
              weight: args[1],
              visited: false,
              selected: false,
            });
            break;

          case 'addEdge':
            if (!state.edges) state.edges = [];
            state.edges.push({
              source: String(args[0]),
              target: String(args[1]),
              weight: args[2],
              visited: false,
              selected: false,
            });
            break;

          case 'directed':
            state.directed = args[0];
            break;

          case 'weighted':
            state.weighted = args[0];
            break;

          case 'visit':
            if (state.type === 'graph' && state.nodes) {
              const node = state.nodes.find((n) => n.id === String(args[0]));
              if (node) node.visited = true;
            }
            break;
        }
      });
    }

    return Array.from(states.values());
  }, [chunks, cursor]);

  const hasVisualization = chunks.length > 0;

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
          {tracerStates.map((state) => (
            <div key={state.key} className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <LayoutIcon className="w-4 h-4" />
                <span className="font-mono">{state.key}</span>
              </div>

              {state.type === 'array1d' && state.data && (
                <Array1DRenderer
                  data={state.data}
                  selected={state.selected}
                  patched={state.patched}
                />
              )}

              {state.type === 'array2d' && state.data && (
                <Array2DRenderer
                  data={state.data}
                  selected={state.selected}
                  patched={state.patched}
                />
              )}

              {state.type === 'chart' && state.data && (
                <ChartRenderer data={state.data} selected={state.selected} />
              )}

              {state.type === 'graph' && state.nodes && (
                <GraphRenderer
                  nodes={state.nodes}
                  edges={state.edges || []}
                  directed={state.directed}
                  weighted={state.weighted}
                />
              )}

              {state.type === 'log' && state.logs && state.logs.length > 0 && (
                <LogRenderer logs={state.logs} />
              )}
            </div>
          ))}
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
          <p className="text-2xl font-bold text-accent">{cursor}</p>
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
