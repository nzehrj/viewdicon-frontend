import React, { useState } from 'react';
import { Mic, Check } from 'lucide-react';
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
    setIsRecording(true);
    setStep('recording');

    setTimeout(() => {
      setIsRecording(false);
      setStep('success');
      setTimeout(() => onNext(name || 'Adanne'), 1500);
    }, 3000);
  };

  const progress = step === 'input' ? 50 : 100;

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Account Security Binding
          </h1>
          <div className="flex items-center gap-4">
            <ProgressBar progress={progress} size="lg" className="flex-1" />
            <span className={`text-sm whitespace-nowrap ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Step 2 of 2: Voice Authentication
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`w-full max-w-md p-8 rounded-3xl ${
            theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100'
          }`}>
            {step === 'success' ? (
              <>
                <h2 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Voiceprint Authentication
                </h2>
                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  For enhanced security, please say the phrase below in your native language
                </p>

                <div className="flex items-center justify-center py-12">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Check className="w-16 h-16 text-white" />
                  </div>
                </div>

                <p className={`text-center text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Voice Binding Successful!!
                </p>
              </>
            ) : (
              <>
                <div className={`mb-6 p-4 rounded-xl border-l-4 border-green-600 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'
                }`}>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    In the tongue of your people, speak the name you are called at home
                  </p>
                </div>

                <Waveform isActive={isRecording} bars={40} />

                {step === 'recording' && (
                  <div className="text-center mt-4">
                    <motion.div
                      className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-red-600 text-white font-semibold"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {name || 'Adanne'}
                    </motion.div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        {step === 'input' && (
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your response or press mic"
              className={`flex-1 p-4 rounded-2xl outline-none ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-2 border-gray-700 text-white placeholder:text-gray-500'
                  : 'bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRecord}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-red-600 flex items-center justify-center text-white shadow-lg"
            >
              <Mic className="w-6 h-6" />
            </motion.button>
          </div>
        )}
      </div>
    </GradientBackground>
  );
};