'use client';

import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faFastBackward,
  faFastForward,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Badge, Panel } from './ui';
import { usePlayerStore } from '@/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlayerProps {
  className?: string;
}

export const Player: React.FC<PlayerProps> = ({ className }) => {
  const {
    chunks,
    cursor,
    isPlaying,
    speed,
    setIsPlaying,
    setSpeed,
    next,
    prev,
    first,
    last,
    setCursor,
  } = usePlayerStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate speed in milliseconds (exponential scale)
  const getIntervalDelay = (speedValue: number) => {
    return Math.pow(2, 4 - speedValue) * 125;
  };

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (cursor < chunks.length) {
          next();
        } else {
          setIsPlaying(false);
        }
      }, getIntervalDelay(speed));
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, cursor, chunks.length, speed, next, setIsPlaying]);

  const handlePlayPause = () => {
    if (cursor >= chunks.length) {
      first();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCursor = parseInt(e.target.value, 10);
    setCursor(newCursor);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
  };

  const progressPercentage = chunks.length > 0 ? (cursor / chunks.length) * 100 : 0;

  return (
    <Panel variant="container" className={cn('p-6', className)}>
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <Badge variant="primary">
              {cursor} / {chunks.length}
            </Badge>
          </div>
          <div className="relative">
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={chunks.length}
              value={cursor}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={first}
            disabled={cursor === 0}
            title="First"
          >
            <FontAwesomeIcon icon={faFastBackward} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            disabled={cursor === 0}
            title="Previous"
          >
            <FontAwesomeIcon icon={faStepBackward} />
          </Button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              className="player-control-primary"
              onClick={handlePlayPause}
              disabled={chunks.length === 0}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
            </Button>
          </motion.div>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            disabled={cursor >= chunks.length}
            title="Next"
          >
            <FontAwesomeIcon icon={faStepForward} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={last}
            disabled={cursor >= chunks.length}
            title="Last"
          >
            <FontAwesomeIcon icon={faFastForward} />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faTachometerAlt} className="text-gray-400" />
              <span className="text-gray-400">Speed</span>
            </div>
            <Badge variant="accent">{speed.toFixed(1)}x</Badge>
          </div>
          <div className="relative">
            <div className="progress-bar">
              <div
                className="progress-fill bg-gradient-to-r from-accent via-accent-light to-accent"
                style={{ width: `${(speed / 4) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={0.5}
              value={speed}
              onChange={handleSpeedChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default Player;
