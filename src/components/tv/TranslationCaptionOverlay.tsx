// src/components/tv/TranslationCaptionOverlay.tsx
// Translation Caption Overlay - Real-time Subtitles

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, X, Settings, Type, Eye } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Caption {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

interface TranslationCaptionOverlayProps {
  captions: Caption[];
  currentTime: number;
  isVisible: boolean;
  onToggle?: (visible: boolean) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ig', name: 'Igbo' },
  { code: 'ha', name: 'Hausa' },
  { code: 'sw', name: 'Swahili' },
  { code: 'zu', name: 'Zulu' },
  { code: 'am', name: 'Amharic' },
  { code: 'so', name: 'Somali' },
];

const FONT_SIZES = [
  { id: 'small', label: 'Small', size: 'text-sm' },
  { id: 'medium', label: 'Medium', size: 'text-base' },
  { id: 'large', label: 'Large', size: 'text-lg' },
];

export const TranslationCaptionOverlay: React.FC<TranslationCaptionOverlayProps> = ({
  captions,
  currentTime,
  isVisible,
  onToggle,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('medium');
  const [opacity, setOpacity] = useState(80);
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);

  // Find current caption based on time
  useEffect(() => {
    const caption = captions.find(
      c => currentTime >= c.startTime && currentTime <= c.endTime
    );
    setCurrentCaption(caption || null);
  }, [currentTime, captions]);

  const selectedFontSize = FONT_SIZES.find(f => f.id === fontSize)?.size || 'text-base';

  return (
    <>
      {/* Caption Bar */}
      <AnimatePresence>
        {isVisible && currentCaption && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-20 left-0 right-0 px-4 pointer-events-none z-30"
          >
            <div
              className={`max-w-4xl mx-auto rounded-lg px-6 py-3 ${selectedFontSize} font-semibold text-white text-center`}
              style={{
                backgroundColor: `rgba(0, 0, 0, ${opacity / 100})`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {currentCaption.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Button */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="flex flex-col gap-2">
          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle?.(!isVisible)}
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transition-colors ${
              isVisible
                ? 'bg-purple-600 text-white'
                : 'bg-black/60 text-white/80 hover:text-white'
            }`}
            title="Toggle captions"
          >
            <Languages className="w-6 h-6" />
          </motion.button>

          {/* Settings Button */}
          {isVisible && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center backdrop-blur-sm shadow-lg transition-colors"
              title="Caption settings"
            >
              <Settings className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`absolute bottom-4 right-20 w-80 rounded-2xl overflow-hidden shadow-2xl z-40 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Caption Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-1 rounded-lg ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Language Selector */}
              <div>
                <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Languages className="w-4 h-4" />
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Type className="w-4 h-4" />
                  Font Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setFontSize(size.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        fontSize === size.id
                          ? 'bg-purple-600 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <label className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Eye className="w-4 h-4" />
                  Background Opacity ({opacity}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                    Transparent
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                    Solid
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <p className={`text-xs font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Preview
                </p>
                <div
                  className={`rounded px-4 py-2 ${selectedFontSize} font-semibold text-white text-center`}
                  style={{
                    backgroundColor: `rgba(0, 0, 0, ${opacity / 100})`,
                  }}
                >
                  Sample caption text
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TranslationCaptionOverlay;