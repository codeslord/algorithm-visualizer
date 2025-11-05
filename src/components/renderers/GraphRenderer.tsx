'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GraphTracer } from '@/lib/tracers';

interface GraphRendererProps {
  title: string;
  data: GraphTracer;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({
  title,
  data: tracer,
}) => {
  const { nodes, edges, isDirected, isWeighted, dimensions } = tracer;
  const { baseWidth, baseHeight, nodeRadius } = dimensions;

  if (!nodes || nodes.length === 0) return null;

  const viewBox = [
    -baseWidth / 2,
    -baseHeight / 2,
    baseWidth,
    baseHeight,
  ];

  return (
    <div className="glass-panel rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">{title}</h3>
      <svg
        width="100%"
        height="400"
        viewBox={viewBox.join(' ')}
        className="bg-black/20 rounded-lg"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className="fill-gray-400"
            />
          </marker>
          <marker
            id="arrowhead-selected"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className="fill-primary"
            />
          </marker>
          <marker
            id="arrowhead-visited"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className="fill-accent"
            />
          </marker>
        </defs>

        {/* Render edges */}
        {edges.map((edge, index) => {
          const sourceNode = tracer.findNode(edge.source);
          const targetNode = tracer.findNode(edge.target);

          if (!sourceNode || !targetNode) return null;

          const { x: sx, y: sy } = sourceNode;
          let { x: ex, y: ey } = targetNode;

          const mx = (sx + ex) / 2;
          const my = (sy + ey) / 2;
          const dx = ex - sx;
          const dy = ey - sy;

          // Adjust end point for arrow
          if (isDirected) {
            const length = Math.sqrt(dx * dx + dy * dy);
            if (length !== 0) {
              ex = sx + (dx / length) * (length - nodeRadius - 4);
              ey = sy + (dy / length) * (length - nodeRadius - 4);
            }
          }

          const isSelected = edge.selectedCount > 0;
          const isVisited = edge.visitedCount > 0;

          return (
            <g key={`${edge.source}-${edge.target}-${index}`}>
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                x1={sx}
                y1={sy}
                x2={ex}
                y2={ey}
                className={cn(
                  'transition-all duration-300',
                  isSelected && 'stroke-primary',
                  isVisited && !isSelected && 'stroke-accent',
                  !isVisited && !isSelected && 'stroke-gray-500'
                )}
                strokeWidth={isSelected ? 3 : 2}
                markerEnd={isDirected ? (isSelected ? 'url(#arrowhead-selected)' : isVisited ? 'url(#arrowhead-visited)' : 'url(#arrowhead)') : undefined}
              />

              {/* Edge weight */}
              {isWeighted && edge.weight !== null && (
                <text
                  x={mx}
                  y={my - 5}
                  className="fill-white text-xs font-mono"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Render nodes */}
        {nodes.map((node) => {
          const isSelected = node.selectedCount > 0;
          const isVisited = node.visitedCount > 0;

          return (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                r={nodeRadius}
                className={cn(
                  'transition-all duration-300',
                  isSelected && 'fill-primary stroke-primary-light shadow-glow-primary',
                  isVisited && !isSelected && 'fill-accent/70 stroke-accent',
                  !isVisited && !isSelected && 'fill-gray-700 stroke-gray-500'
                )}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Node ID */}
              <text
                className="fill-white text-sm font-bold font-mono"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {node.id}
              </text>

              {/* Node weight */}
              {isWeighted && node.weight !== null && (
                <text
                  x={nodeRadius + 4}
                  y={0}
                  className="fill-gray-300 text-xs font-mono"
                  textAnchor="start"
                  dominantBaseline="middle"
                >
                  {node.weight}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GraphRenderer;
