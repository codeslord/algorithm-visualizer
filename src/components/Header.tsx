'use client';

import React from 'react';
import Link from 'next/link';
import { Github, LogOut, Code2, User as UserIcon } from 'lucide-react';
import { Button } from './ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/landing');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass-container mx-4 mt-4 p-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center w-10 h-10 glass-button-primary rounded-xl"
            >
              <Code2 className="w-5 h-5" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-light via-purple-400 to-secondary-light bg-clip-text text-transparent">
                Algorithm Visualizer
              </h1>
              <p className="text-xs text-gray-400">
                Interactive Algorithm Visualization
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="glass-panel px-4 py-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center bg-primary/20">
                    <UserIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{profile?.email || user.email}</span>
                    {profile?.is_admin && (
                      <span className="text-xs text-accent">Admin</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => router.push('/auth/login')}
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
