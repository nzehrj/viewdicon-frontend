import React, { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';

interface TermsOfServiceProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onAccept, onDecline }) => {
  const [accepted, setAccepted] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-3xl ${
              theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className={`text-3xl font-bold text-center mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Terms of Service
            </h2>

            <p className={`text-center mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Please read and accept our terms to continue
            </p>

            {/* Terms Content - Scrollable */}
            <div className={`max-h-96 overflow-y-auto rounded-xl p-6 mb-6 ${
              theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
            }`}>
              <div className={`space-y-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {/* Section 1 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    1. Acceptance of Terms
                  </h3>
                  <p className="text-sm leading-relaxed">
                    By accessing and using Viewdicon services, you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do not 
                    use this service.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    2. Identity Verification
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Viewdicon uses advanced identity verification methods including phone verification, 
                    voice biometrics, and device binding. You consent to providing accurate information 
                    and understand that false information may result in account suspension.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    3. Privacy and Data Protection
                  </h3>
                  <p className="text-sm leading-relaxed">
                    We are committed to protecting your privacy. Your personal data, including biometric 
                    information, will be encrypted and stored securely. We comply with GDPR, POPIA, and 
                    other applicable data protection regulations.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    4. Account Security
                  </h3>
                  <p className="text-sm leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account. You may use 
                    up to 3 devices (or 4 for elders). Any unauthorized use must be reported immediately.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    5. Kinship Tiers and IWA Score
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Your Kinship tier (Continental African, African Diaspora, or Global Partner) and IWA 
                    (Integrity, Wisdom, Action) score determine access to certain features and benefits. 
                    These are based on verifiable information and community attestations.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    6. Wari Transaction Protocol (WTP)
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Financial transactions through Viewdicon use the Wari protocol. Fees vary by Kinship 
                    tier. All transactions are subject to verification and may be delayed for security reasons.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    7. Village Roles and Tools
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Access to village-specific tools is granted based on your selected role and Kinship tier. 
                    Tool availability may change based on community needs and platform updates.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    8. Content and Intellectual Property
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Content you create through Digital Griot Archive (DGA) remains your intellectual property. 
                    However, you grant Viewdicon a license to display and distribute this content through 
                    the platform.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    9. Moot and Dispute Resolution
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Disputes within the platform may be resolved through the Moot system, which uses 
                    community-based adjudication. Decisions made through Moot are binding.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    10. Termination
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Viewdicon reserves the right to terminate or suspend your account for violations of 
                    these terms, fraudulent activity, or upon your request. Upon termination, certain data 
                    may be retained as required by law.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    11. Changes to Terms
                  </h3>
                  <p className="text-sm leading-relaxed">
                    We reserve the right to modify these terms at any time. You will be notified of 
                    significant changes and may need to re-accept updated terms.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    12. Governing Law
                  </h3>
                  <p className="text-sm leading-relaxed">
                    These terms are governed by the laws of the Federal Republic of Nigeria and the 
                    African Union's data protection frameworks.
                  </p>
                </div>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="mb-6">
              <label className="flex items-start cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    accepted
                      ? 'bg-green-500 border-green-500'
                      : theme === 'dark'
                      ? 'border-gray-600 group-hover:border-gray-500'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {accepted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>
                <span className={`ml-3 text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  I have read and agree to the{' '}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Terms of Service
                  </span>
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onDecline}
                className="flex-1"
              >
                Decline
              </Button>
              <Button
                onClick={onAccept}
                disabled={!accepted}
                className="flex-1"
              >
                Accept & Continue
              </Button>
            </div>

            {/* Helper Text */}
            {!accepted && (
              <p className={`text-xs text-center mt-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Please check the box above to accept the terms
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};