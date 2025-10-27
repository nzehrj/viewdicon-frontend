import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, Lock, Fingerprint, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';

interface AfroIDWelcomeProps {
  afroId: string;
  userName: string;
  heritage: string; // e.g., "Yoruba", "Igbo", "Zulu"
  onContinue: () => void;
}

export const AfroIDWelcome: React.FC<AfroIDWelcomeProps> = ({
  afroId,
  userName,
  heritage,
  onContinue,
}) => {
  const [copied, setCopied] = useState(false);
  const [showId, setShowId] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    // Show celebration animation on mount
    setShowCelebration(true);
    const timer = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(afroId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = afroId;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const maskAfroId = (id: string) => {
    const parts = id.split('-');
    if (parts.length !== 5) return '•••-••-••-••••-••••';
    return `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}-••••`;
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        
        {/* Celebration Confetti Animation */}
        <AnimatePresence>
          {showCelebration && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -50, 
                    x: Math.random() * window.innerWidth,
                    opacity: 1,
                    rotate: 0
                  }}
                  animate={{ 
                    y: window.innerHeight + 100, 
                    rotate: 360,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: 'linear'
                  }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'][i % 5],
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <div className="w-full max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-6 sm:p-10 rounded-3xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' 
                : 'bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20'
            }`}
          >
            
            {/* Header Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }}
                className="relative"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 flex items-center justify-center shadow-2xl">
                  <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                  
                  {/* Sparkle Effects */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [360, 180, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: 'linear',
                      delay: 1.5
                    }}
                    className="absolute -bottom-2 -left-2"
                  >
                    <Sparkles className="w-6 h-6 text-blue-400" />
                  </motion.div>
                </div>

                {/* Pulsing Ring */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 rounded-full border-4 border-green-400"
                />
              </motion.div>
            </div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6 sm:mb-8"
            >
              <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome Home, {userName}!
              </h1>
              
              <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                You are now part of the digital Motherland
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                <span className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-700'
                }`}>
                  {heritage} Heritage
                </span>
              </div>
            </motion.div>

            {/* Afro-ID Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <div className={`p-4 sm:p-6 lg:p-8 rounded-2xl border-2 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-green-500/30' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-green-500/30'
              } shadow-xl`}>
                
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Afro-ID
                  </h2>
                  
                  <button
                    onClick={() => setShowId(!showId)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {showId ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="font-medium">Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="font-medium">Show</span>
                      </>
                    )}
                  </button>
                </div>

                {/* ID Display */}
                <div className={`p-3 sm:p-4 lg:p-6 rounded-xl mb-3 sm:mb-4 font-mono text-center ${
                  theme === 'dark' ? 'bg-gray-950/50' : 'bg-white'
                }`}>
                  <AnimatePresence mode="wait">
                    {showId ? (
                      <motion.div
                        key="visible"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <p className={`text-base sm:text-lg lg:text-2xl font-bold tracking-wider break-all ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {afroId}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="masked"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <p className={`text-base sm:text-lg lg:text-2xl font-bold tracking-wider ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {maskAfroId(afroId)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Copy Button */}
                <AnimatePresence mode="wait">
                  {showId && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={handleCopy}
                      disabled={!showId}
                      className={`w-full px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 ${
                        copied
                          ? 'bg-green-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                          Copy ID
                        </>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Security Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`p-3 sm:p-4 lg:p-6 rounded-xl mb-6 sm:mb-8 ${
                theme === 'dark' 
                  ? 'bg-red-900/20 border-2 border-red-500/30' 
                  : 'bg-red-50 border-2 border-red-200'
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`} />
                <div className="flex-1">
                  <h3 className={`font-bold mb-1.5 sm:mb-2 text-sm sm:text-base lg:text-lg ${
                    theme === 'dark' ? 'text-red-300' : 'text-red-800'
                  }`}>
                    Keep Your Afro-ID Secret
                  </h3>
                  <ul className={`text-xs sm:text-sm space-y-0.5 sm:space-y-1 ${
                    theme === 'dark' ? 'text-red-200' : 'text-red-700'
                  }`}>
                    <li>• Your Afro-ID is your unique digital identity</li>
                    <li>• Never share it publicly or with untrusted sources</li>
                    <li>• Used for secure transactions and verification</li>
                    <li>• Store it safely for account recovery</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8"
            >
              <div className={`p-3 sm:p-4 rounded-xl text-center ${
                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className={`text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Secure
                </p>
                <p className={`text-[10px] sm:text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Encrypted
                </p>
              </div>

              <div className={`p-3 sm:p-4 rounded-xl text-center ${
                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className={`text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Unique
                </p>
                <p className={`text-[10px] sm:text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  One identity
                </p>
              </div>

              <div className={`p-3 sm:p-4 rounded-xl text-center ${
                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className={`text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Permanent
                </p>
                <p className={`text-[10px] sm:text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Forever
                </p>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                onClick={onContinue}
                disabled={!copied}
                size="lg"
                fullWidth
                className="relative overflow-hidden group text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {copied ? (
                    <>
                      <span className="hidden sm:inline">Enter Dashboard</span>
                      <span className="sm:hidden">Enter</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Copy Your Afro-ID to Continue</span>
                      <span className="sm:hidden">Copy ID to Continue</span>
                    </>
                  )}
                </span>
                
                {/* Shine effect */}
                {copied && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </Button>

              {!copied && (
                <p className={`text-[10px] sm:text-xs text-center mt-2 sm:mt-3 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <Eye className="w-3 h-3 inline mr-1" />
                  Click "Show" then "Copy ID" above
                </p>
              )}
            </motion.div>

            {/* Ubuntu Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl text-center ${
                theme === 'dark' 
                  ? 'bg-amber-900/20 border border-amber-500/30' 
                  : 'bg-amber-50 border border-amber-200'
              }`}>
              <p className={`text-xs sm:text-sm italic ${
                theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
              }`}>
                "I am because we are"
              </p>
              <p className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              }`}>
                — Ubuntu Proverb
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default AfroIDWelcome;