import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, AlertCircle, Wifi, Mic, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { LocationTruth } from '@/types/location.types';

interface LocationTruthPanelProps {
  locationTruth: LocationTruth;
  isOwner?: boolean; // Only owner can see detailed breakdown
}

export const LocationTruthPanel: React.FC<LocationTruthPanelProps> = ({
  locationTruth,
  isOwner = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [expanded, setExpanded] = useState(false);

  const { network_region_guess, spoken_declaration, clan_confirmations, confidence_score, last_verified_at } = locationTruth;

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    return theme === 'dark' ? 'text-red-400' : 'text-red-600';
  };

  const getConfidenceBg = (score: number) => {
    if (score >= 80) return theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50';
    if (score >= 60) return theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50';
    return theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50';
  };

  const hasNetworkLayer = network_region_guess !== '';
  const hasSpokenLayer = spoken_declaration !== '';
  const hasClanLayer = clan_confirmations.length > 0;

  const verifiedLayers = [hasNetworkLayer, hasSpokenLayer, hasClanLayer].filter(Boolean).length;

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 ${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
            getConfidenceBg(confidence_score)
          }`}>
            <MapPin className={`w-5 h-5 sm:w-6 sm:h-6 ${getConfidenceColor(confidence_score)}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-base sm:text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {spoken_declaration || network_region_guess || 'Location Not Set'}
            </h3>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {verifiedLayers}/3 layers verified
            </p>
          </div>
        </div>

        {/* Confidence Score */}
        <div className={`px-3 py-1.5 rounded-full ${getConfidenceBg(confidence_score)}`}>
          <p className={`text-xs sm:text-sm font-bold ${getConfidenceColor(confidence_score)}`}>
            {confidence_score}%
          </p>
        </div>
      </div>

      {/* Verification Layers Preview */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
          hasNetworkLayer 
            ? theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
            : theme === 'dark' ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
        }`}>
          <Wifi className="w-3 h-3" />
          <span className="hidden sm:inline">Network</span>
        </div>
        
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
          hasSpokenLayer 
            ? theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
            : theme === 'dark' ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
        }`}>
          <Mic className="w-3 h-3" />
          <span className="hidden sm:inline">Spoken</span>
        </div>
        
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
          hasClanLayer 
            ? theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
            : theme === 'dark' ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
        }`}>
          <Users className="w-3 h-3" />
          <span className="hidden sm:inline">Clan</span>
        </div>
      </div>

      {/* Expand Details (Owner Only) */}
      {isOwner && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
            }`}
          >
            <span className={`text-xs sm:text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {expanded ? 'Hide Details' : 'View Details'}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Expanded Details */}
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-3"
            >
              {/* Network Layer */}
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className={`w-4 h-4 ${
                    hasNetworkLayer 
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className={`text-xs sm:text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Network Fingerprint
                  </p>
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {network_region_guess || 'Not detected'}
                </p>
              </div>

              {/* Spoken Layer */}
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Mic className={`w-4 h-4 ${
                    hasSpokenLayer 
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className={`text-xs sm:text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Spoken Declaration
                  </p>
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  "{spoken_declaration || 'Not recorded'}"
                </p>
              </div>

              {/* Clan Layer */}
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className={`w-4 h-4 ${
                    hasClanLayer 
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className={`text-xs sm:text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Clan Confirmations
                  </p>
                </div>
                {clan_confirmations.length > 0 ? (
                  <div className="space-y-2">
                    {clan_confirmations.map((confirmation, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {confirmation.display_name} confirmed {new Date(confirmation.confirmed_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No confirmations yet
                  </p>
                )}
              </div>

              {/* Last Verified */}
              <div className={`flex items-center gap-2 text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                <AlertCircle className="w-3 h-3" />
                <span>Last verified: {new Date(last_verified_at).toLocaleString()}</span>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default LocationTruthPanel;