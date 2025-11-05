'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faUser, faSignOutAlt, faCode } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui';
import { useEnvStore } from '@/store';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, setUser } = useEnvStore();

  const handleSignOut = () => {
    setUser(undefined);
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
              <FontAwesomeIcon icon={faCode} className="text-xl" />
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
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-8 h-8 rounded-full border-2 border-primary/50"
                  />
                  <span className="text-sm font-medium">{user.login}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  title="Sign Out"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  // Sign in logic would go here
                  alert('GitHub OAuth integration would be implemented here');
                }}
              >
                <FontAwesomeIcon icon={faGithub} className="mr-2" />
                Sign In with GitHub
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
