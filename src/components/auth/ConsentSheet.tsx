import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface ConsentSheetProps {
  onAccept: (consentIds: string[]) => void;
}

const CONSENT_ITEMS: ConsentItem[] = [
  {
    id: 'data_processing',
    title: 'Data Processing',
    description: 'We process your personal data to provide and improve our services.',
    required: true,
  },
  {
    id: 'identity_verification',
    title: 'Identity Verification',
    description: 'We verify your African identity and location for platform integrity.',
    required: true,
  },
  {
    id: 'biometric_data',
    title: 'Biometric Data',
    description: 'We collect fingerprint and voice data for secure authentication.',
    required: true,
  },
  {
    id: 'device_binding',
    title: 'Device Binding',
    description: 'We bind your device to your account for security (max 3 devices).',
    required: true,
  },
  {
    id: 'community_data',
    title: 'Community Data',
    description: 'We store your family connections and cultural attestations.',
    required: true,
  },
];

export const ConsentSheet: React.FC<ConsentSheetProps> = ({ onAccept }) => {
  const [acceptedItems, setAcceptedItems] = useState<string[]>([]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const theme = useAppSelector((state) => state.theme.theme);

  const handleToggle = (id: string) => {
    setAcceptedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allRequiredAccepted = CONSENT_ITEMS.filter((item) => item.required).every((item) =>
    acceptedItems.includes(item.id)
  );

  const handleAccept = () => {
    if (allRequiredAccepted) {
      onAccept(acceptedItems);
    }
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-afro-green-500 to-afro-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Your Privacy & Consent
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Please review and accept the following items
              </p>
            </div>
          </div>
        </div>

        {/* Consent Items */}
        <div className="flex-1 space-y-3 mb-6">
          {CONSENT_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                acceptedItems.includes(item.id)
                  ? 'border-afro-green-500 bg-afro-green-500/10'
                  : theme === 'dark'
                  ? 'border-gray-700 bg-gray-800/30'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    acceptedItems.includes(item.id)
                      ? 'bg-afro-green-500 border-afro-green-500'
                      : theme === 'dark'
                      ? 'border-gray-600'
                      : 'border-gray-300'
                  }`}
                >
                  {acceptedItems.includes(item.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    {item.required && (
                      <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                  
                  {/* Expand button */}
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    className={`text-sm mt-2 ${
                      theme === 'dark' ? 'text-afro-green-400' : 'text-afro-green-600'
                    } hover:underline`}
                  >
                    {expandedItem === item.id ? 'Show less' : 'Learn more'}
                  </button>

                  {/* Expanded details */}
                  {expandedItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`mt-3 p-3 rounded-lg text-sm ${
                        theme === 'dark' ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      Detailed information about {item.title.toLowerCase()} will be provided here,
                      including how we use this data, who we share it with, and your rights.
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <Button onClick={handleAccept} disabled={!allRequiredAccepted} fullWidth size="lg">
          I Agree & Continue
        </Button>

        <p className={`text-center text-xs mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </GradientBackground>
  );
};