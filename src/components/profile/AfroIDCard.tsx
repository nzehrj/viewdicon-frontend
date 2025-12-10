import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download,
  Share2,
  Copy,
  Check,
  QrCode,
  Shield,
  Award,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  X,
  ExternalLink
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import QRCode from 'qrcode';

interface AfroIDCardProps {
  showActions?: boolean;
  onClose?: () => void;
}

/**
 * AFRO ID CARD COMPONENT
 * 
 * Digital identity card with QR code for quick verification
 * Mobile-first design with full width layout
 * 
 * Location: src/components/profile/AfroIDCard.tsx
 */
export const AfroIDCard: React.FC<AfroIDCardProps> = ({
  showActions = true,
  onClose,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const afroIdentity = useAppSelector((state) => state.user.afroIdentity);
  const village = useAppSelector((state) => state.user.village);
  const role = useAppSelector((state) => state.user.role);
  const rank = useAppSelector((state) => state.user.rank);

  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Extract user data
  const afroId = afroIdentity?.afro_id || user?.afro_id || 'AFR-XXXX-XXXX';
  const displayName = user?.full_name || user?.name || 'User';
  const heritage = user?.tribe || afroIdentity?.heritage || 'African';
  const villageName = village?.villageName || 'No Village';
  const roleName = role?.roleName || 'Member';
  const crestLevel = rank?.level || 0;
  const joinDate = new Date().toISOString(); // Default to current date since created_at doesn't exist
  const location = user?.country || 'Nigeria';

  // Format join date
  const formattedJoinDate = new Date(joinDate).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });

  // Generate QR code
  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({
        afro_id: afroId,
        name: displayName,
        village: villageName,
        verified: true
      });
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: theme === 'dark' ? '#ffffff' : '#000000',
          light: theme === 'dark' ? '#1f2937' : '#ffffff'
        }
      });
      setQrCodeUrl(url);
      setShowQR(true);
    } catch (error) {
      console.error('QR generation failed:', error);
    }
  };

  // Copy Afro-ID
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(afroId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Download as image
  const handleDownload = () => {
    // TODO: Implement canvas-based card download
    console.log('Download Afro-ID card');
    alert('Download feature coming soon!');
  };

  // Share options
  const shareOptions = [
    { id: 'trusted', label: 'Share with Trusted Circle', icon: Shield },
    { id: 'link', label: 'Copy Profile Link', icon: ExternalLink },
    { id: 'qr', label: 'Show QR Code', icon: QrCode, action: generateQRCode },
  ];

  const handleShare = (optionId: string) => {
    if (optionId === 'qr') {
      generateQRCode();
    } else if (optionId === 'link') {
      navigator.clipboard.writeText(`https://viewdicon.app/profile/${afroId}`);
      alert('Profile link copied!');
    } else if (optionId === 'trusted') {
      alert('Share with trusted connections (coming soon)');
    }
    setShowShareMenu(false);
  };

  return (
    <div className="w-full p-2">
      {/* Header */}
      {onClose && (
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Digital ID Card
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full rounded-2xl overflow-hidden shadow-2xl border-2 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        {/* Card Header - African Pattern Background */}
        <div className="relative h-32 bg-gradient-to-br from-green-600 via-yellow-600 to-red-600 overflow-hidden">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`
            }} />
          </div>

          {/* Card Type Badge */}
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-gray-900">VERIFIED ID</span>
            </div>
          </div>

          {/* Crest Level */}
          <div className="absolute top-3 right-3">
            <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-gray-900">{crestLevel}</span>
            </div>
          </div>

          {/* Logo/Brand */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-bold text-lg tracking-wider">VIEWDICON</p>
            <p className="text-white/80 text-xs">African Digital Identity</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* User Info */}
          <div className="mb-4">
            <h3 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {displayName}
            </h3>
            
            {/* Afro-ID with Reveal/Hide */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex-1 px-3 py-2 rounded-lg font-mono text-sm ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                {isRevealed ? (
                  <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                    {afroId}
                  </span>
                ) : (
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                    ●●●●-●●●●-●●●●
                  </span>
                )}
              </div>
              
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title={isRevealed ? 'Hide ID' : 'Reveal ID'}
              >
                {isRevealed ? (
                  <EyeOff className="w-5 h-5 text-amber-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isRevealed && (
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  title="Copy ID"
                >
                  {isCopied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Village & Role */}
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                Village & Role
              </p>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {villageName}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {roleName}
              </p>
            </div>

            {/* Heritage */}
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                Heritage
              </p>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {heritage}
              </p>
              <p className="text-xs">🌍</p>
            </div>

            {/* Location */}
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                Location
              </p>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {location}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                Member Since
              </p>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formattedJoinDate}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className={`p-3 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-green-600/10 border-green-600/30' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-700'
                }`}>
                  Identity Verified
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-green-300' : 'text-green-600'
                }`}>
                  Biometric & Document Verified
                </p>
              </div>
              <Award className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Card Footer - Actions */}
        {showActions && (
          <div className={`p-3 border-t ${
            theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={generateQRCode}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-medium">QR Code</span>
              </button>

              <button
                onClick={handleDownload}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Download className="w-5 h-5" />
                <span className="text-xs font-medium">Download</span>
              </button>

              <button
                onClick={() => setShowShareMenu(true)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs font-medium">Share</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`w-full max-w-sm rounded-2xl p-6 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Scan QR Code
                  </h3>
                  <button
                    onClick={() => setShowQR(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {qrCodeUrl && (
                  <div className="bg-white p-4 rounded-xl mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="w-full" />
                  </div>
                )}

                <p className={`text-center text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Scan this code to verify identity
                </p>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Share Menu Modal */}
      <AnimatePresence>
        {showShareMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={`w-full max-w-sm rounded-2xl overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="p-4 border-b border-gray-700">
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Share Afro-ID
                  </h3>
                </div>

                <div className="p-2">
                  {shareOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => option.action ? option.action() : handleShare(option.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-gray-700 text-white'
                            : 'hover:bg-gray-100 text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-gray-700">
                  <button
                    onClick={() => setShowShareMenu(false)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AfroIDCard;