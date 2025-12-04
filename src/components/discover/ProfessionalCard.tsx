import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Shield, 
  Award,
  Briefcase,
  DollarSign,
  Zap,
  MessageCircle
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface ProfessionalCardProps {
  professional: {
    id: string;
    name: string;
    role: string;
    village: string;
    villageColor: string;
    crestTier: number;
    honorStage: string;
    shieldState: 'green' | 'amber' | 'red';
    offerLine: string;
    priceHint?: string;
    distance?: number;
    isOnline: boolean;
    canBookNow: boolean;
    rating?: number;
    completedJobs?: number;
  };
  onRequestWork?: (professionalId: string) => void;
}

/**
 * PROFESSIONAL RESULT CARD COMPONENT
 * 
 * Displays a professional's identity card in Discover results.
 * Shows: Identity strip, offer line, trust indicators, CTA
 * 
 * CTA is NOT "DM" - it's "Request Work"/"Book Now" etc.
 * Clicking starts a protected Business Session.
 * 
 * Location: src/components/discover/ProfessionalCard.tsx
 */
export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onRequestWork,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const shieldColors = {
    green: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
  };
  
  const handleRequestWork = () => {
    if (onRequestWork) {
      onRequestWork(professional.id);
    } else {
      console.log('Request work from:', professional.name);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`p-3 md:p-4 border-b md:border-2 md:rounded-xl transition-all ${
        theme === 'dark'
          ? 'bg-gray-900 md:bg-gray-800 border-gray-800 md:border-gray-700 md:hover:border-gray-600'
          : 'bg-white border-gray-100 md:border-gray-200 md:hover:border-gray-300'
      }`}
    >
      {/* Header - Identity */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div 
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-white text-base md:text-lg flex-shrink-0"
          style={{ backgroundColor: professional.villageColor }}
        >
          {professional.name.charAt(0)}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-sm md:text-base truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {professional.name}
                </h3>
                {professional.isOnline && (
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                )}
              </div>
              <p className={`text-xs md:text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {professional.role} • {professional.village}
              </p>
            </div>
            
            {/* Shield Badge */}
            <Shield 
              className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" 
              style={{ color: shieldColors[professional.shieldState] }}
              fill={shieldColors[professional.shieldState]}
            />
          </div>
          
          {/* Trust Indicators Row */}
          <div className="flex items-center gap-2 md:gap-3 text-xs">
            {/* Crest */}
            <div className="flex items-center gap-1">
              <span>{'⭐'.repeat(professional.crestTier)}</span>
            </div>
            
            {/* Rating */}
            {professional.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500" fill="#f59e0b" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {professional.rating}
                </span>
              </div>
            )}
            
            {/* Jobs Completed */}
            {professional.completedJobs && (
              <div className="flex items-center gap-1 text-gray-500">
                <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="text-[10px] md:text-xs">{professional.completedJobs} jobs</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Honor Stage Badge */}
      {professional.honorStage && (
        <div className="mb-3">
          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium"
            style={{ 
              backgroundColor: `${professional.villageColor}20`,
              color: professional.villageColor
            }}
          >
            <Award className="w-3 h-3" />
            {professional.honorStage}
          </span>
        </div>
      )}
      
      {/* Offer Line */}
      <p className={`text-xs md:text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {professional.offerLine}
      </p>
      
      {/* Meta Info */}
      <div className="flex items-center gap-3 md:gap-4 mb-4 text-[10px] md:text-xs">
        {/* Distance */}
        {professional.distance !== undefined && (
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{professional.distance} km away</span>
          </div>
        )}
        
        {/* Price Hint */}
        {professional.priceHint && (
          <div className="flex items-center gap-1 text-gray-500">
            <DollarSign className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{professional.priceHint}</span>
          </div>
        )}
        
        {/* Available Now Badge */}
        {professional.isOnline && (
          <div className="flex items-center gap-1 text-green-500">
            <Zap className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span className="font-medium">Available now</span>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Primary CTA - Request Work */}
        <button
          onClick={handleRequestWork}
          disabled={!professional.canBookNow}
          className={`flex-1 px-3 py-2 md:px-4 md:py-2.5 font-semibold text-xs md:text-sm transition-colors flex items-center justify-center gap-2 ${
            professional.canBookNow
              ? 'text-white hover:opacity-90'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          style={professional.canBookNow ? { backgroundColor: professional.villageColor } : {}}
        >
          {professional.isOnline ? 'Request Now' : 'Request Work'}
        </button>
        
        {/* Secondary Action - Quick Message */}
        <button
          className={`p-2 md:p-2.5 transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Quick question"
        >
          <MessageCircle className={`w-4 h-4 md:w-5 md:h-5 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`} />
        </button>
      </div>
      
      {/* Unavailable Notice */}
      {!professional.canBookNow && (
        <p className={`text-[10px] md:text-xs mt-2 text-center ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          {professional.isOnline 
            ? 'Busy with another job' 
            : 'Offline - Will respond later'}
        </p>
      )}
    </motion.div>
  );
};

export default ProfessionalCard;