'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  weight?: number;
  visited?: boolean;
  selected?: boolean;
  x?: number;
  y?: number;
}

interface Edge {
  source: string;
  target: string;
  weight?: number;
  visited?: boolean;
  selected?: boolean;
}

interface GraphRendererProps {
  nodes: Node[];
  edges: Edge[];
  directed?: boolean;
  weighted?: boolean;
  className?: string;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({
  nodes,
  edges,
  directed = false,
  weighted = false,
  className,
}) => {
  if (!nodes || nodes.length === 0) return null;

  // Simple circular layout
  const centerX = 200;
  const centerY = 150;
  const radius = 100;

  const positionedNodes = nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
    return {
      ...node,
      x: node.x ?? centerX + radius * Math.cos(angle),
      y: node.y ?? centerY + radius * Math.sin(angle),
    };
  });

  const getNodeById = (id: string) => positionedNodes.find((n) => n.id === id);

  return (
    <div className={cn('relative w-full h-80 glass-panel p-4 rounded-lg', className)}>
      <svg width="100%" height="100%" viewBox="0 0 400 300">
        {/* Render edges */}
        {edges.map((edge, index) => {
          const source = getNodeById(edge.source);
          const target = getNodeById(edge.target);

          if (!source || !target) return null;

          const midX = (source.x! + target.x!) / 2;
          const midY = (source.y! + target.y!) / 2;

          return (
            <g key={`${edge.source}-${edge.target}-${index}`}>
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={cn(
                  'transition-all duration-300',
                  edge.selected && 'stroke-accent',
                  edge.visited && !edge.selected && 'stroke-primary',
                  !edge.visited && !edge.selected && 'stroke-gray-600'
                )}
                strokeWidth={edge.selected ? 3 : 2}
                strokeOpacity={edge.selected ? 1 : 0.6}
              />

              {/* Edge weight label */}
              {weighted && edge.weight !== undefined && (
                <text
                  x={midX}
                  y={midY}
                  className="fill-white text-xs font-mono"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {edge.weight}
                </text>
              )}

              {/* Arrow for directed graphs */}
              {directed && (
                <polygon
                  points={`${target.x! - 8},${target.y!} ${target.x! - 12},${
                    target.y! - 4
                  } ${target.x! - 12},${target.y! + 4}`}
                  className={cn(
                    edge.selected ? 'fill-accent' : 'fill-gray-600'
                  )}
                />
              )}
            </g>
          );
        })}

        {/* Render nodes */}
        {positionedNodes.map((node) => (
          <g key={node.id}>
            <motion.circle
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              cx={node.x}
              cy={node.y}
              r={20}
              className={cn(
                'transition-all duration-300',
                node.selected && 'fill-primary stroke-primary-light',
                node.visited && !node.selected && 'fill-accent/50 stroke-accent',
                !node.visited && !node.selected && 'fill-gray-700 stroke-gray-500'
              )}
              strokeWidth={node.selected ? 3 : 2}
            />

            {/* Node label */}
            <text
              x={node.x}
              y={node.y}
              className="fill-white text-sm font-bold font-mono"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {node.id}
            </text>

            {/* Node weight */}
            {weighted && node.weight !== undefined && (
              <text
                x={node.x}
                y={node.y! + 30}
                className="fill-gray-400 text-xs font-mono"
                textAnchor="middle"
              >
                {node.weight}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default GraphRenderer;
