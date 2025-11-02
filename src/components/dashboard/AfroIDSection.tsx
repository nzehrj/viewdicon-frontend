import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Lock,
  Fingerprint,
  Award,
  Download,
  Share2
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { toggleAfroIdVisibility } from '@store/slices/userSlice';
import { maskAfroId, getVerificationBadgeColor } from '@/types/profile.types';

interface AfroIDSectionProps {
  showWarning?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
}

export const AfroIDSection: React.FC<AfroIDSectionProps> = ({
  showWarning = true,
  allowDownload = false,
  allowShare = false,
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const afroIdentity = useAppSelector((state) => state.user.afroIdentity);
  const showAfroId = useAppSelector((state) => state.user.showAfroId);

  const [copied, setCopied] = useState(false);
  const [shareWarningShown, setShareWarningShown] = useState(false);

  const afroId = afroIdentity?.afro_id || user?.afro_id || '';
  const verificationLevel = afroIdentity?.verification_level || 'Bronze';
  const heritage = afroIdentity?.heritage || user?.tribe || '';
  const totem = afroIdentity?.totem || user?.sankofa_totem || '';

  // Security state
  const securityState = afroIdentity?.security_state || {
    voice_verified: false,
    device_bound: false,
    face_verified: false,
    fingerprint_verified: false,
    kyc_completed: false,
  };

  const securityScore = Object.values(securityState).filter(Boolean).length;
  const maxSecurity = Object.keys(securityState).length;
  const securityPercentage = (securityScore / maxSecurity) * 100;

  const handleToggleVisibility = () => {
    dispatch(toggleAfroIdVisibility());
  };

  const handleCopy = async () => {
    if (!showAfroId || !afroId) return;

    try {
      await navigator.clipboard.writeText(afroId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!afroId) return;

    const element = document.createElement('a');
    const file = new Blob(
      [
        `VIEWDICON AFRO-ID\n\n`,
        `ID: ${afroId}\n`,
        `Heritage: ${heritage}\n`,
        `Totem: ${totem}\n`,
        `Verification: ${verificationLevel}\n`,
        `Security Score: ${securityScore}/${maxSecurity}\n\n`,
        `IMPORTANT: Keep this ID secret and secure.\n`,
        `Never share publicly or with untrusted sources.\n`,
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `afro-id-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    setShareWarningShown(true);
  };

  const confirmShare = () => {
    if (!afroId) return;

    if (navigator.share) {
      navigator.share({
        title: 'My Afro-ID',
        text: `My Afro-ID: ${afroId}`,
      });
    } else {
      handleCopy();
    }
    setShareWarningShown(false);
  };

  const verificationColor = getVerificationBadgeColor(verificationLevel);

  return (
    <div className="space-y-4">
      {/* Main Afro-ID Card */}
      <div
        className={`
        rounded-2xl p-6 border-2 transition-all
        ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-green-500/30'
            : 'bg-gradient-to-br from-white to-gray-50 border-green-500/30'
        }
        shadow-xl
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Your Afro-ID
              </h3>
              <p
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Sacred Identity • Bank-Grade Security
              </p>
            </div>
          </div>

          {/* Verification Badge */}
          <div
            className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
            style={{
              backgroundColor: `${verificationColor}20`,
              color: verificationColor,
              border: `2px solid ${verificationColor}40`,
            }}
          >
            <Award className="w-4 h-4" fill={verificationColor} />
            {verificationLevel}
          </div>
        </div>

        {/* ID Display */}
        <div
          className={`
          p-4 rounded-xl mb-4 font-mono text-center
          ${theme === 'dark' ? 'bg-gray-950/50' : 'bg-white'}
        `}
        >
          <AnimatePresence mode="wait">
            {showAfroId ? (
              <motion.div
                key="visible"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <p
                  className={`text-base sm:text-lg lg:text-xl font-bold tracking-wider break-all ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}
                >
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
                <p
                  className={`text-base sm:text-lg lg:text-xl font-bold tracking-wider ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {maskAfroId(afroId, false)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Show/Hide */}
          <button
            onClick={handleToggleVisibility}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all
              ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }
            `}
          >
            {showAfroId ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">Hide</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Show</span>
              </>
            )}
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            disabled={!showAfroId}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all
              ${
                copied
                  ? 'bg-green-500 text-white'
                  : showAfroId
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Download */}
          {allowDownload && (
            <button
              onClick={handleDownload}
              className={`
                flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                transition-all
                ${
                  theme === 'dark'
                    ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-500/30'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200'
                }
              `}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          )}

          {/* Share (with warning) */}
          {allowShare && (
            <button
              onClick={handleShare}
              className={`
                flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                transition-all
                ${
                  theme === 'dark'
                    ? 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 border border-amber-500/30'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200'
                }
              `}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}
        </div>

        {/* Heritage & Totem */}
        {(heritage || totem) && (
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {heritage && (
              <div>
                <p
                  className={`text-xs font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  Heritage
                </p>
                <p
                  className={`text-sm font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {heritage}
                </p>
              </div>
            )}
            {totem && (
              <div>
                <p
                  className={`text-xs font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  Totem
                </p>
                <p
                  className={`text-sm font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {totem}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Status */}
      <div
        className={`
        rounded-2xl p-6 border
        ${
          theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-white border-gray-200'
        }
      `}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <h4
              className={`font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Security Status
            </h4>
          </div>
          <span
            className={`text-sm font-semibold ${
              securityPercentage === 100
                ? 'text-green-500'
                : securityPercentage >= 60
                ? 'text-amber-500'
                : 'text-red-500'
            }`}
          >
            {securityScore}/{maxSecurity}
          </span>
        </div>

        {/* Security Progress Bar */}
        <div
          className={`h-2 rounded-full mb-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                securityPercentage === 100
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : securityPercentage >= 60
                  ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                  : 'linear-gradient(90deg, #ef4444, #dc2626)',
              width: `${securityPercentage}%`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${securityPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Security Checklist */}
        <div className="space-y-2">
          {Object.entries(securityState).map(([key, value]) => {
            const labels: Record<string, string> = {
              voice_verified: 'Voice Authentication',
              device_bound: 'Device Binding',
              face_verified: 'Face Recognition',
              fingerprint_verified: 'Fingerprint',
              kyc_completed: 'KYC Completed',
            };

            return (
              <div
                key={key}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  <Fingerprint
                    className={`w-4 h-4 ${
                      value ? 'text-green-500' : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {labels[key]}
                  </span>
                </div>
                {value ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning Banner */}
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
          p-4 rounded-xl flex items-start gap-3
          ${
            theme === 'dark'
              ? 'bg-red-900/20 border-2 border-red-500/30'
              : 'bg-red-50 border-2 border-red-200'
          }
        `}
        >
          <AlertTriangle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}
          />
          <div className="flex-1">
            <h4
              className={`font-bold mb-1 text-sm ${
                theme === 'dark' ? 'text-red-300' : 'text-red-800'
              }`}
            >
              Keep Your Afro-ID Secret
            </h4>
            <ul
              className={`text-xs space-y-0.5 ${
                theme === 'dark' ? 'text-red-200' : 'text-red-700'
              }`}
            >
              <li>• This is your permanent identity on Viewdicon</li>
              <li>• Never share publicly or with strangers</li>
              <li>• Used for wallet, recovery, and trust verification</li>
              <li>• Only share with people you trust completely</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Share Warning Modal */}
      <AnimatePresence>
        {shareWarningShown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShareWarningShown(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                max-w-md w-full rounded-2xl p-6
                ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-2 border-red-500/30'
                    : 'bg-white shadow-2xl'
                }
              `}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Share Your Afro-ID?
                </h3>
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Only share your Afro-ID with people you trust completely.
                  This grants them high-level access to you.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShareWarningShown(false)}
                  className={`
                    flex-1 px-4 py-3 rounded-xl font-semibold transition-all
                    ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }
                  `}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmShare}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all"
                >
                  I Understand, Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AfroIDSection;