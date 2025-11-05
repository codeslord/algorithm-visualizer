'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Navigator } from '@/components/Navigator';
import { CodeEditor } from '@/components/CodeEditor';
import { Player } from '@/components/Player';
import { VisualizationViewer } from '@/components/VisualizationViewer';
import { AlgorithmApi } from '@/lib/api';
import { useCurrentStore, useDirectoryStore, usePlayerStore } from '@/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui';

export default function VisualizerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, hasAccess, loading: authLoading } = useAuth();
  const router = useRouter();
  const { setCategories } = useDirectoryStore();
  const { setFiles, setEditingFile, setDescription, setAlgorithm, setTitles } =
    useCurrentStore();
  const { setChunks } = usePlayerStore();

  // Check access
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (!authLoading && user && !hasAccess) {
      router.push('/landing');
    }
  }, [user, hasAccess, authLoading, router]);

  // Load categories on mount
  useEffect(() => {
    if (hasAccess) {
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
    }
  }, [setCategories, hasAccess]);

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
    toast.success('Build started!');
    setChunks([
      { commands: [], lineNumber: 1 },
      { commands: [], lineNumber: 2 },
      { commands: [], lineNumber: 3 },
    ]);
  };

  if (authLoading || (!hasAccess && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="spinner w-16 h-16 mx-auto" />
          <p className="text-gray-400">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-6 max-w-md">
          <Lock className="w-24 h-24 mx-auto text-warning" />
          <h1 className="text-3xl font-bold">Access Required</h1>
          <p className="text-gray-400">
            You need to purchase access to use the Algorithm Visualizer
          </p>
          <Button variant="primary" onClick={() => router.push('/landing')}>
            Get Access
          </Button>
        </div>
      </div>
    );
  }

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
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-80 p-4 flex-shrink-0 overflow-y-auto glass-scrollbar"
        >
          <Navigator onSelectAlgorithm={handleSelectAlgorithm} />
        </motion.aside>

        <main className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden"
          >
            <div className="flex flex-col min-h-0">
              <CodeEditor onBuild={handleBuild} />
            </div>

            <div className="flex flex-col min-h-0 overflow-y-auto glass-scrollbar">
              <VisualizationViewer />
            </div>
          </motion.div>

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
