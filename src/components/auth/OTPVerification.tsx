import React, { useState, useRef, useEffect } from 'react';
import { Shield, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';

interface OTPVerificationProps {
  phone: string;
  onNext: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ phone, onNext }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [currentOTP, setCurrentOTP] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    
    // Show initial OTP when component mounts
    const initialOTP = localStorage.getItem('mock_otp');
    if (initialOTP) {
      setCurrentOTP(initialOTP);
      // Use setTimeout to show after component is mounted
      setTimeout(() => {
        setShowOTPModal(true);
      }, 500);
    }
  }, []);

  const handleCopyOTP = async () => {
    try {
      await navigator.clipboard.writeText(currentOTP);
      setCopied(true);
      
      // Close modal after showing success
      setTimeout(() => {
        setShowOTPModal(false);
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: just close
      setShowOTPModal(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value && newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode: string) => {
    setLoading(true);
    setError('');

    try {
      const mockOTP = localStorage.getItem('mock_otp');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (otpCode === mockOTP) {
        localStorage.removeItem('mock_otp');
        onNext();
      } else {
        setError('Invalid verification code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setError('');
    setCopied(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('mock_otp', newOTP);
      setCurrentOTP(newOTP);
      console.log('📱 New Mock OTP sent:', newOTP);

      // Show modal with new OTP
      setShowOTPModal(true);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
      setCanResend(true);
    }
  };

  // Format phone number properly - remove any + prefix and country code
  const cleanPhone = phone.replace(/^\+?234/, ''); // Remove +234 or 234 prefix
  const maskedPhone = cleanPhone.replace(/(\d{3})(\d{4})/, '+234 $1 *** $2');

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-3xl ${
              theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-xl'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className={`text-3xl font-bold text-center mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Enter Verification Code
            </h2>

            <p className={`text-center mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">
                {maskedPhone}
              </span>
            </p>

            <div className="mb-6" onPaste={handlePaste}>
              <div className="flex justify-between gap-1.5 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-10 h-10 sm:w-14 sm:h-14 text-center text-base sm:text-2xl font-bold rounded-lg sm:rounded-xl border-2 transition-all ${
                      error
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : digit
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : theme === 'dark'
                        ? 'border-gray-600 bg-gray-900/50 focus:border-green-500'
                        : 'border-gray-300 bg-gray-50 focus:border-green-500'
                    } ${theme === 'dark' ? 'text-white' : 'text-gray-900'} focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-6"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-500">{error}</span>
              </motion.div>
            )}

            <div className="text-center mb-6">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-green-600 dark:text-green-400 font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend Code
                </button>
              ) : (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Resend code in{' '}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {resendTimer}s
                  </span>
                </p>
              )}
            </div>

            <Button
              onClick={() => handleVerify(otp.join(''))}
              isLoading={loading}
              disabled={otp.some((digit) => !digit) || loading}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <p className={`text-xs text-center mt-6 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Didn't receive the code? Check your phone or request a new one
            </p>
          </motion.div>
        </div>
      </div>

      {/* OTP Modal with Copy Button */}
      <AnimatePresence>
        {showOTPModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className={`rounded-2xl shadow-2xl p-8 max-w-md w-full relative ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Verification Code
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Click the copy button to copy your code
                  </p>
                </div>

                {/* OTP Code Display with Copy Button */}
                <div className={`rounded-xl p-6 mb-6 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-700' 
                    : 'bg-gradient-to-br from-green-50 to-emerald-50'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    {/* Code Display */}
                    <div className="flex-1 text-center">
                      <p className={`text-3xl font-bold tracking-widest font-mono ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {currentOTP}
                      </p>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopyOTP}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-lg
                        font-medium text-sm transition-all duration-200
                        ${copied 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                        }
                      `}
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Warning */}
                <div className={`flex items-start gap-3 p-4 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-amber-900/20' 
                    : 'bg-amber-50'
                }`}>
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                  }`} />
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-amber-200' : 'text-amber-800'
                  }`}>
                    <strong>Important:</strong> Copy this code to verify your phone number. The modal will close automatically after copying.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </GradientBackground>
  );
};