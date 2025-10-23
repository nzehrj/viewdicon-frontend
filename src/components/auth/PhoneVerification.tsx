import React, { useState, useRef, useEffect } from 'react';
import { Phone, AlertCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { useAppSelector } from '@store/hooks';
import { validatePhone } from '@utils/validators';
import { formatPhoneDisplay } from '@utils/formatters';

interface PhoneVerificationProps {
  onNext: (phone: string) => void;
}

type Country = {
  name: string;
  iso2: string;
  code: string;
  dialCode: string;
};

const COUNTRIES: Country[] = [
  { name: 'Nigeria', iso2: 'ng', code: 'NG', dialCode: '+234' },
  { name: 'Kenya', iso2: 'ke', code: 'KE', dialCode: '+254' },
  { name: 'Ghana', iso2: 'gh', code: 'GH', dialCode: '+233' },
  { name: 'South Africa', iso2: 'za', code: 'ZA', dialCode: '+27' },
  { name: 'Egypt', iso2: 'eg', code: 'EG', dialCode: '+20' },
  { name: 'Ethiopia', iso2: 'et', code: 'ET', dialCode: '+251' },
  { name: 'Uganda', iso2: 'ug', code: 'UG', dialCode: '+256' },
  { name: 'Tanzania', iso2: 'tz', code: 'TZ', dialCode: '+255' },
  { name: 'Senegal', iso2: 'sn', code: 'SN', dialCode: '+221' },
  { name: 'Cameroon', iso2: 'cm', code: 'CM', dialCode: '+237' },
  { name: 'Ivory Coast', iso2: 'ci', code: 'CI', dialCode: '+225' },
  { name: 'United States', iso2: 'us', code: 'US', dialCode: '+1' },
  { name: 'United Kingdom', iso2: 'gb', code: 'GB', dialCode: '+44' },
  { name: 'Canada', iso2: 'ca', code: 'CA', dialCode: '+1' },
  { name: 'Germany', iso2: 'de', code: 'DE', dialCode: '+49' },
  { name: 'France', iso2: 'fr', code: 'FR', dialCode: '+33' },
];

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onNext }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockOTP, setMockOTP] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const [selectedCountryIso, setSelectedCountryIso] = useState<string>('ng');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry: Country =
    COUNTRIES.find((c) => c.iso2 === selectedCountryIso) || COUNTRIES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxLen = selectedCountry.dialCode === '+234' ? 10 : 12;
    if (value.length <= maxLen) {
      setPhone(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullPhone = `${selectedCountry.dialCode}${phone}`;
    if (!validatePhone(fullPhone)) {
      setError('Please enter a valid phone number for the selected country');
      return;
    }

    if (selectedCountry.dialCode === '+234' && phone.length !== 10) {
      setError('Phone number must be 10 digits for Nigeria');
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

      setTimeout(() => onNext(fullPhone), 1200);
    } catch {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formattedPhone = phone ? formatPhoneDisplay(`${selectedCountry.dialCode}${phone}`) : '';

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 sm:p-8 rounded-3xl ${
              theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-xl'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Phone className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2
              className={`text-3xl font-bold text-center mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Verify Your Phone
            </h2>

            <p
              className={`text-center mb-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Enter your phone number to receive a verification code
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Phone Number
                </label>
                <div className="flex gap-2 items-center flex-col sm:flex-row">
                  <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center justify-between w-full sm:min-w-[160px] px-4 py-3 rounded-xl border-2 bg-green-500/10 ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://flagcdn.com/w20/${selectedCountry.iso2}.png`}
                          alt={`${selectedCountry.name} flag`}
                          className="w-7 h-5 rounded-sm object-cover"
                          onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                        />
                        <span
                          className={`font-medium text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {selectedCountry.code} {selectedCountry.dialCode}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`absolute z-10 w-full sm:min-w-[200px] max-h-[300px] overflow-y-auto rounded-xl border-2 ${
                            theme === 'dark'
                              ? 'bg-gray-900 border-gray-700'
                              : 'bg-white border-gray-200'
                          } mt-1 shadow-lg`}
                        >
                          {COUNTRIES.map((c) => (
                            <button
                              key={c.iso2}
                              type="button"
                              onClick={() => {
                                setSelectedCountryIso(c.iso2);
                                setPhone('');
                                setError('');
                                setIsDropdownOpen(false);
                              }}
                              className={`flex items-center gap-2 w-full px-4 py-3 text-left text-sm hover:bg-green-500/20 ${
                                c.iso2 === selectedCountryIso
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-700'
                              }`}
                            >
                              <img
                                src={`https://flagcdn.com/w20/${c.iso2}.png`}
                                alt={`${c.name} flag`}
                                className="w-7 h-5 rounded-sm object-cover"
                              />
                              <span>{`${c.name} (${c.dialCode})`}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder={
                      selectedCountry.dialCode === '+234' ? '8012345678' : '712345678'
                    }
                    className="flex-1 w-full"
                    error={error}
                    maxLength={selectedCountry.dialCode === '+234' ? 10 : 12}
                  />
                </div>

                {phone && !error && (
                  <p
                    className={`text-sm mt-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
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
                  <p
                    className={`text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-700'
                    }`}
                  >
                    📱 Test OTP Code:
                  </p>
                  <p
                    className={`text-3xl font-bold tracking-widest text-center ${
                      theme === 'dark' ? 'text-green-300' : 'text-green-600'
                    }`}
                  >
                    {mockOTP}
                  </p>
                  <p
                    className={`text-xs text-center mt-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Use this code on the next page
                  </p>
                </motion.div>
              )}

              <div
                className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                }`}
              >
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <strong
                    className={theme === 'dark' ? 'text-white' : 'text-gray-900'}
                  >
                    Note:
                  </strong>{' '}
                  A 6-digit verification code will be sent to your phone via SMS.
                </p>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                disabled={phone.length === 0 || loading}
                className="w-full"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </form>

            <p
              className={`text-xs text-center mt-6 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Standard SMS rates may apply
            </p>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default PhoneVerification;