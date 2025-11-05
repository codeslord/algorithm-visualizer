'use client';

import React from 'react';
import { Panel, Badge } from './ui';
import { usePlayerStore, useCurrentStore } from '@/store';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faPlay } from '@fortawesome/free-solid-svg-icons';

export const VisualizationViewer: React.FC = () => {
  const { chunks, cursor, lineIndicator } = usePlayerStore();
  const { description } = useCurrentStore();

  const hasVisualization = chunks.length > 0;

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
            <FontAwesomeIcon icon={faChartBar} className="text-primary" />
            Algorithm Description
          </h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </motion.div>
      )}

      {/* Visualization Area */}
      {hasVisualization ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-6 min-h-[400px] flex items-center justify-center"
        >
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">
              <FontAwesomeIcon icon={faChartBar} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
              Visualization Running
            </h3>
            <div className="space-y-2">
              <Badge variant="primary">
                Step: {cursor} / {chunks.length}
              </Badge>
              {lineIndicator?.lineNumber && (
                <Badge variant="accent">Line: {lineIndicator.lineNumber}</Badge>
              )}
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              The visualization would render here with beautiful animations showing
              the algorithm execution step by step.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 min-h-[400px] flex items-center justify-center"
        >
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl mb-4">
              <FontAwesomeIcon icon={faPlay} className="text-gray-600" />
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
      )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel variant="glass" className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Steps</p>
          <p className="text-2xl font-bold text-primary">{chunks.length}</p>
        </Panel>
        <Panel variant="glass" className="text-center">
          <p className="text-gray-400 text-sm mb-1">Current Step</p>
          <p className="text-2xl font-bold text-accent">{cursor}</p>
        </Panel>
        <Panel variant="glass" className="text-center">
          <p className="text-gray-400 text-sm mb-1">Current Line</p>
          <p className="text-2xl font-bold text-secondary">
            {lineIndicator?.lineNumber || '-'}
          </p>
        </Panel>
      </div>
    </div>
  );
};

export default VisualizationViewer;
