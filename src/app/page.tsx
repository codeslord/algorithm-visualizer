'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Navigator } from '@/components/Navigator';
import { CodeEditor } from '@/components/CodeEditor';
import { Player } from '@/components/Player';
import { VisualizationViewer } from '@/components/VisualizationViewer';
import { AlgorithmApi } from '@/lib/api';
import { useCurrentStore, useDirectoryStore, usePlayerStore } from '@/store';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { setCategories } = useDirectoryStore();
  const { setFiles, setEditingFile, setDescription, setAlgorithm, setTitles } =
    useCurrentStore();
  const { setChunks } = usePlayerStore();

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await AlgorithmApi.getCategories();
        setCategories(categories);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load algorithm categories');
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [setCategories]);

  const handleSelectAlgorithm = async (
    categoryKey: string,
    algorithmKey: string
  ) => {
    try {
      const data = await AlgorithmApi.getAlgorithm(categoryKey, algorithmKey);
      setFiles(data.files);
      setDescription(data.description);
      setAlgorithm({ categoryKey, algorithmKey });
      setTitles([categoryKey, algorithmKey]);

      // Set default editing file
      const defaultFile =
        data.files.find((f) => f.name.endsWith('.js')) || data.files[0];
      setEditingFile(defaultFile);

      toast.success('Algorithm loaded successfully');
    } catch (error) {
      console.error('Failed to load algorithm:', error);
      toast.error('Failed to load algorithm');
    }
  };

  const handleBuild = async () => {
    // Placeholder for build logic
    toast.success('Build started!');
    // This would call TracerApi and parse the results
    setChunks([
      { commands: [], lineNumber: 1 },
      { commands: [], lineNumber: 2 },
      { commands: [], lineNumber: 3 },
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="spinner w-16 h-16 mx-auto" />
          <p className="text-gray-400">Loading Algorithm Visualizer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigator Sidebar */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-80 p-4 flex-shrink-0 overflow-y-auto glass-scrollbar"
        >
          <Navigator onSelectAlgorithm={handleSelectAlgorithm} />
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
          {/* Top Section - Editor and Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden"
          >
            {/* Code Editor */}
            <div className="flex flex-col min-h-0">
              <CodeEditor onBuild={handleBuild} />
            </div>

            {/* Visualization */}
            <div className="flex flex-col min-h-0 overflow-y-auto glass-scrollbar">
              <VisualizationViewer />
            </div>
          </motion.div>

          {/* Bottom Section - Player Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-shrink-0"
          >
            <Player />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
