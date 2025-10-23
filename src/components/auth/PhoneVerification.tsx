import React, { useState } from 'react';
import { Phone, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { useAppSelector } from '@store/hooks';
import { validatePhone } from '@utils/validators';
import { formatPhoneDisplay } from '@utils/formatters';

interface PhoneVerificationProps {
  onNext: (phone: string) => void;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onNext }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockOTP, setMockOTP] = useState('');
  const theme = useAppSelector((state) => state.theme.theme);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullPhone = `+234${phone}`;
    if (!validatePhone(fullPhone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (phone.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOTP(generatedOTP);

      localStorage.setItem('verification_phone', fullPhone);
      localStorage.setItem('mock_otp', generatedOTP);

      console.log('📱 Mock OTP sent:', generatedOTP);

      setTimeout(() => {
        onNext(fullPhone);
      }, 2000);
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formattedPhone = phone ? formatPhoneDisplay(`+234${phone}`) : '';

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
                <Phone className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className={`text-3xl font-bold text-center mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Verify Your Phone
            </h2>

            <p className={`text-center mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Enter your Nigerian phone number to receive a verification code
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Phone Number
                </label>
                <div className="flex gap-3">
                  <div className={`flex items-center px-4 rounded-xl border-2 ${
                    theme === 'dark'
                      ? 'bg-gray-900/50 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <span className="text-2xl mr-2">🇳🇬</span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      +234
                    </span>
                  </div>

                  <Input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="8012345678"
                    className="flex-1"
                    error={error}
                    maxLength={10}
                  />
                </div>

                {phone && !error && (
                  <p className={`text-sm mt-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {formattedPhone}
                  </p>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-500">{error}</span>
                </motion.div>
              )}

              {mockOTP && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl border-2 ${
                    theme === 'dark'
                      ? 'bg-green-900/20 border-green-500/30'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <p className={`text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  }`}>
                    📱 Test OTP Code:
                  </p>
                  <p className={`text-3xl font-bold tracking-widest text-center ${
                    theme === 'dark' ? 'text-green-300' : 'text-green-600'
                  }`}>
                    {mockOTP}
                  </p>
                  <p className={`text-xs text-center mt-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Use this code on the next page
                  </p>
                </motion.div>
              )}

              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    Note:
                  </strong>{' '}
                  A 6-digit verification code will be sent to your phone via SMS.
                </p>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                disabled={phone.length !== 10 || loading}
                className="w-full"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </form>

            <p className={`text-xs text-center mt-6 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Standard SMS rates may apply
            </p>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};