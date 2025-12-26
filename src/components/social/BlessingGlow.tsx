// src/components/social/BlessingGlow.tsx
// Blessing Glow - Visual Appreciation Effect

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BlessingGlowProps {
  trigger: boolean;
  onComplete?: () => void;
  intensity?: 'low' | 'medium' | 'high';
}

export const BlessingGlow: React.FC<BlessingGlowProps> = ({
  trigger,
  onComplete,
  intensity = 'medium',
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (trigger) {
      // Generate particles
      const particleCount = intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setParticles(newParticles);

      // Clear particles after animation
      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [trigger, intensity, onComplete]);

  const getParticleSize = () => {
    switch (intensity) {
      case 'low':
        return 'w-2 h-2';
      case 'medium':
        return 'w-3 h-3';
      case 'high':
        return 'w-4 h-4';
    }
  };

  const getGlowColor = () => {
    switch (intensity) {
      case 'low':
        return 'from-yellow-400 to-amber-400';
      case 'medium':
        return 'from-amber-400 to-orange-400';
      case 'high':
        return 'from-orange-400 to-red-400';
    }
  };

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
        >
          {/* Glow Pulse */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-32 h-32 rounded-full blur-3xl
              bg-gradient-to-r ${getGlowColor()}
            `}
          />

          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 0.3,
                ease: 'easeOut',
              }}
              className={`absolute ${getParticleSize()}`}
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              <Sparkles className={`w-full h-full text-amber-400`} />
            </motion.div>
          ))}

          {/* Center Sparkle */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Sparkles className="w-12 h-12 text-amber-400" />
          </motion.div>

          {/* Ring Effect */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-24 h-24 rounded-full border-4
              border-amber-400
            `}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlessingGlow;