// src/components/tv/CowrieRainOverlay.tsx
// Cowrie Rain Celebration Effect

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

interface Cowrie {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
}

export const CowrieRainOverlay: React.FC = () => {
  const showRain = useAppSelector((state) => state.tv.showCowrieRain);
  const amount = useAppSelector((state) => state.tv.cowrieRainAmount);
  const [cowries, setCowries] = useState<Cowrie[]>([]);

  useEffect(() => {
    if (showRain) {
      // Generate random cowrie positions
      const newCowries: Cowrie[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        rotation: Math.random() * 360,
      }));
      setCowries(newCowries);

      // Clear after animation
      setTimeout(() => setCowries([]), 5000);
    }
  }, [showRain]);

  return (
    <AnimatePresence>
      {showRain && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {/* Amount Display */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <p className="text-4xl font-bold text-center">🪙 {amount}</p>
              <p className="text-lg text-center mt-1">Cowries!</p>
            </div>
          </motion.div>

          {/* Falling Cowries */}
          {cowries.map((cowrie) => (
            <motion.div
              key={cowrie.id}
              initial={{ 
                y: -20, 
                x: `${cowrie.x}%`, 
                rotate: cowrie.rotation,
                opacity: 1,
              }}
              animate={{ 
                y: '110vh', 
                rotate: cowrie.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: cowrie.duration,
                delay: cowrie.delay,
                ease: 'easeIn',
              }}
              className="absolute text-4xl"
            >
              🪙
            </motion.div>
          ))}

          {/* Sparkle Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: 4 }}
            className="absolute inset-0 bg-gradient-radial from-yellow-400/20 to-transparent"
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default CowrieRainOverlay;