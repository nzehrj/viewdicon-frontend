import React, { useState } from 'react';
import { Mic, Check, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { ProgressBar } from '@components/common/ProgressBar';
import { Waveform } from '@components/common/Waveform';
import { useAppSelector } from '@store/hooks';

interface VoiceAuthenticationProps {
  onNext: (name: string) => void;
}

export const VoiceAuthentication: React.FC<VoiceAuthenticationProps> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [step, setStep] = useState<'input' | 'recording' | 'success'>('input');
  const theme = useAppSelector((state) => state.theme.theme);

  const handleRecord = () => {
    if (!name.trim()) {
      alert('Please enter your name first');
      return;
    }
    
    setIsRecording(true);
    setStep('recording');

    setTimeout(() => {
      setIsRecording(false);
      setStep('success');
      setTimeout(() => onNext(name), 1500);
    }, 3000);
  };

  const progress = step === 'input' ? 50 : 100;

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8 max-w-4xl mx-auto w-full">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Voice Authentication
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <ProgressBar progress={progress} size="lg" className="flex-1 w-full" />
            <span className={`text-sm whitespace-nowrap ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Step 2 of 2: Voice Verification
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl ${
            theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white shadow-xl'
          }`}>
            {step === 'success' ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Check className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                  </div>

                  <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Voice Verified!
                  </h2>
                  <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your voiceprint has been successfully registered
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                <h2 className={`text-xl sm:text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Record Your Voice
                </h2>
                <p className={`mb-6 text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  For enhanced security, we'll record your voice saying your name. This creates a unique voiceprint for authentication.
                </p>

                {/* Instructions Card */}
                <div className={`mb-6 p-4 rounded-xl border-l-4 ${
                  theme === 'dark' 
                    ? 'border-green-600 bg-gray-700/50' 
                    : 'border-green-600 bg-green-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <Volume2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <div>
                      <p className={`font-semibold mb-1 text-sm sm:text-base ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        How it works:
                      </p>
                      <ol className={`text-xs sm:text-sm space-y-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <li>1. Enter your name in the field below</li>
                        <li>2. Press the microphone button to start recording</li>
                        <li>3. Say your name clearly when prompted</li>
                        <li>4. Your voiceprint will be saved securely</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={step === 'recording'}
                    className={`w-full p-4 rounded-xl outline-none text-sm sm:text-base ${
                      theme === 'dark'
                        ? 'bg-gray-900/50 border-2 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500'
                        : 'bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500'
                    } transition-colors`}
                  />
                </div>

                {/* Waveform */}
                <div className="mb-6">
                  <Waveform isActive={isRecording} bars={40} />
                </div>

                {/* Recording Status */}
                {step === 'recording' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center mb-6 p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                        Recording in Progress
                      </p>
                    </div>
                    <motion.div
                      className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Please say: "{name}"
                    </motion.div>
                  </motion.div>
                )}

                {/* Record Button */}
                {step === 'input' && (
                  <button
                    onClick={handleRecord}
                    disabled={!name.trim()}
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
                      !name.trim()
                        ? theme === 'dark'
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start Voice Recording</span>
                  </button>
                )}

                {/* Privacy Note */}
                <div className={`mt-6 p-3 rounded-lg text-xs sm:text-sm ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    🔒 Your voice recording is encrypted and stored securely. It will only be used for authentication purposes.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};