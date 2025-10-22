import React, { useState } from 'react';
import { Mic, Volume2, RotateCcw } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Title */}
            <h1 className={`text-3xl font-bold mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Voice Verification
            </h1>
            <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Speak the phrase below clearly in {language}
            </p>

            {/* Phrase Card */}
            <div className={`p-6 rounded-3xl mb-6 ${
              theme === 'dark' ? 'bg-gray-800/30 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your Phrase
                </span>
                <button
                  onClick={handlePlaySample}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                  Play Sample
                </button>
              </div>

              <p className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                "{phrase}"
              </p>

              {/* Phonetic Helper */}
              <p className={`text-sm text-center mt-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                Speak naturally, as you would to a friend
              </p>
            </div>

            {/* Waveform */}
            <div className="mb-6">
              <Waveform isActive={isRecording} bars={40} />
            </div>

            {/* Recording Status */}
            {isRecording && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-red-600 dark:text-red-400 font-medium mb-4"
              >
                Recording... Speak now
              </motion.p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!hasRecorded ? (
                <Button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  fullWidth
                  size="lg"
                >
                  {isRecording ? (
                    <>
                      <Mic className="w-5 h-5 mr-2 animate-pulse" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button onClick={handleSubmit} fullWidth size="lg">
                    Submit Recording
                  </Button>

                  {retryCount < maxRetries && (
                    <Button onClick={handleRetry} variant="outline" fullWidth>
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Record Again ({maxRetries - retryCount} {maxRetries - retryCount === 1 ? 'retry' : 'retries'} left)
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Retry Info */}
            {retryCount >= maxRetries && !hasRecorded && (
              <div className={`mt-4 p-4 rounded-xl ${
                theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-300'
              }`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  No retries remaining. You can proceed with SMS verification instead.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};