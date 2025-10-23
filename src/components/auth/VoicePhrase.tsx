import React, { useState } from 'react';
import { Mic, Volume2, RotateCcw, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { Waveform } from '@components/common/Waveform';
import { useAppSelector } from '@store/hooks';

interface VoicePhraseProps {
  phrase: string;
  language: string;
  onVerify: (audioBlob: Blob) => void;
  onRetry?: () => void;
  maxRetries?: number;
}

export const VoicePhrase: React.FC<VoicePhraseProps> = ({
  phrase,
  language,
  onVerify,
  onRetry,
  maxRetries = 1,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  const handleStartRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);

    // Simulate recording for 5 seconds
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
    }, 5000);
  };

  const handleSubmit = () => {
    // Create mock blob
    const mockBlob = new Blob(['mock audio'], { type: 'audio/webm' });
    onVerify(mockBlob);
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
      setHasRecorded(false);
      onRetry?.();
    }
  };

  const handlePlaySample = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col p-4 sm:p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl sm:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Voice Phrase Verification
              </h1>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Speak the phrase below clearly in {language}
              </p>
            </div>

            {/* Main Card */}
            <div className={`p-6 sm:p-8 rounded-3xl ${
              theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white shadow-xl'
            }`}>
              {/* Instructions */}
              <div className={`mb-6 p-4 rounded-xl ${
                theme === 'dark' ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className={`font-semibold mb-2 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
                    }`}>
                      Recording Tips:
                    </p>
                    <ul className={`text-xs sm:text-sm space-y-1 ${
                      theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
                    }`}>
                      <li>• Find a quiet space</li>
                      <li>• Speak naturally and clearly</li>
                      <li>• Hold your device 6-12 inches from your mouth</li>
                      <li>• You can play a sample first to hear the correct pronunciation</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Phrase Card */}
              <div className={`p-6 sm:p-8 rounded-2xl mb-6 ${
                theme === 'dark' ? 'bg-gray-900/50 border-2 border-gray-700' : 'bg-gray-50 border-2 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs sm:text-sm font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Your Phrase
                  </span>
                  <button
                    onClick={handlePlaySample}
                    disabled={isPlaying}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-white text-gray-900 hover:bg-gray-100 shadow-sm'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                    {isPlaying ? 'Playing...' : 'Listen to Sample'}
                  </button>
                </div>

                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold text-center leading-relaxed ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  "{phrase}"
                </p>

                {/* Phonetic Helper */}
                <p className={`text-xs sm:text-sm text-center mt-4 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  💡 Speak naturally, as you would to a friend or family member
                </p>
              </div>

              {/* Waveform */}
              <div className="mb-6">
                <Waveform isActive={isRecording} bars={40} />
              </div>

              {/* Recording Status */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl text-center ${
                    theme === 'dark' ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <p className={`font-semibold text-sm sm:text-base ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>
                      Recording Now... Speak Clearly
                    </p>
                  </div>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                    Recording will stop automatically in a few seconds
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {!hasRecorded ? (
                  <Button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    fullWidth
                    size="lg"
                    className="text-sm sm:text-base"
                  >
                    {isRecording ? (
                      <>
                        <Mic className="w-5 h-5 mr-2 animate-pulse" />
                        Recording... ({5}s)
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-4 rounded-xl text-center ${
                        theme === 'dark' ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-700'
                      }`}>
                        ✓ Recording Complete! Review and submit below.
                      </p>
                    </motion.div>

                    <Button 
                      onClick={handleSubmit} 
                      fullWidth 
                      size="lg"
                      className="text-sm sm:text-base"
                    >
                      Submit Recording
                    </Button>

                    {retryCount < maxRetries && (
                      <Button 
                        onClick={handleRetry} 
                        variant="outline" 
                        fullWidth
                        className="text-sm sm:text-base"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Record Again ({maxRetries - retryCount} {maxRetries - retryCount === 1 ? 'retry' : 'retries'} left)
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Retry Info */}
              {retryCount >= maxRetries && !hasRecorded && (
                <div className={`mt-6 p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-300'
                }`}>
                  <p className={`text-xs sm:text-sm font-medium ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                  }`}>
                    ⚠️ No retries remaining. You can proceed with SMS verification as an alternative.
                  </p>
                </div>
              )}

              {/* Privacy Note */}
              <div className={`mt-6 p-3 rounded-lg text-xs sm:text-sm ${
                theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100'
              }`}>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  🔒 Your voice recording is encrypted end-to-end and stored securely. It will only be used for identity verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};