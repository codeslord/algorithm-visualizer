'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, File, Search } from 'lucide-react';
import { Input, Button, Badge } from './ui';
import { useDirectoryStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavigatorProps {
  onSelectAlgorithm?: (categoryKey: string, algorithmKey: string) => void;
}

export const Navigator: React.FC<NavigatorProps> = ({ onSelectAlgorithm }) => {
  const { categories } = useDirectoryStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (key: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      algorithms: category.algorithms.filter((algo) =>
        algo.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.algorithms.length > 0);

  return (
    <div className="glass-container h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto glass-scrollbar p-4 space-y-2">
        {filteredCategories.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No algorithms found</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.key} className="space-y-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.key)}
                className="w-full flex items-center justify-between p-3 rounded-lg glass-button hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  {expandedCategories.has(category.key) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <Folder className="w-4 h-4 text-primary" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge variant="default">{category.algorithms.length}</Badge>
              </button>

              {/* Algorithms */}
              <AnimatePresence>
                {expandedCategories.has(category.key) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-4 space-y-1"
                  >
                    {category.algorithms.map((algorithm) => (
                      <motion.button
                        key={algorithm.key}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        onClick={() =>
                          onSelectAlgorithm?.(category.key, algorithm.key)
                        }
                        className="w-full flex items-center gap-2 p-2 pl-8 rounded-lg text-left hover:bg-white/10 transition-all duration-300 group"
                      >
                        <File className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" />
                        <span className="text-sm">{algorithm.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button variant="primary" className="w-full">
          Create Scratch Paper
        </Button>
      </div>
    </div>
  );
};

export default Navigator;
