import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Book, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface CAWSLawBannerProps {
  sessionType?: 'work' | 'escort' | 'delivery' | 'consultation';
  isExpanded?: boolean;
}

/**
 * CAWS LAW BANNER COMPONENT
 * 
 * Displays Cultural African Work Standards (CAWS) rules that govern business sessions.
 * These are the laws that protect both parties and guide dispute resolution.
 * 
 * Features:
 * - Collapsible law display
 * - Village-specific laws
 * - Session-type-specific rules
 * - Warning indicators
 * - Quick reference
 * 
 * CAWS Principles:
 * 1. Good Faith - Both parties act honestly
 * 2. Evidence Required - Proof trumps claims
 * 3. Elder Wisdom - Council decides disputes
 * 4. Community Protection - Bad actors are expelled
 * 5. Restoration Over Punishment - Fix, don't punish
 * 
 * Location: src/components/business/CAWSLawBanner.tsx
 */
export const CAWSLawBanner: React.FC<CAWSLawBannerProps> = ({
  sessionType = 'work',
  isExpanded: initialExpanded = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  
  // Core CAWS laws that apply to all sessions
  const coreLaws = [
    {
      id: 'good_faith',
      title: 'Good Faith Principle',
      description: 'Both parties must act honestly and honor their commitments',
      icon: Shield,
    },
    {
      id: 'evidence',
      title: 'Evidence Required',
      description: 'All claims must be supported with photos, messages, or witness testimony',
      icon: Book,
    },
    {
      id: 'council_authority',
      title: 'Council Has Final Say',
      description: 'Village Elders decide disputes. Their ruling is binding.',
      icon: Scale,
    },
    {
      id: 'protection',
      title: 'Community Protection',
      description: 'Repeated violators are banned from all villages',
      icon: AlertTriangle,
    },
  ];
  
  // Session-specific rules
  const sessionRules: Record<string, string[]> = {
    work: [
      'Client must clearly describe work before payment',
      'Professional must upload before/after photos',
      'Payment held in escrow until work approved',
      'Client has 3 days to inspect and approve',
      'Professional has right to dispute rejection',
    ],
    escort: [
      'Location must be verified and safe',
      'Emergency contacts must be shared',
      'Check-in required every 2 hours',
      'Police hotline accessible at all times',
      'Client pays 50% upfront, 50% on arrival',
    ],
    delivery: [
      'Package must be properly sealed',
      'Photo proof required at pickup and delivery',
      'GPS tracking throughout journey',
      'Recipient must verify contents before signing',
      'Damage claims must be filed within 24 hours',
    ],
    consultation: [
      'Session duration and scope must be agreed upfront',
      'Recording allowed only with mutual consent',
      'Professional advice does not create legal obligation',
      'Follow-up period defined in agreement',
      'Refund available if session not completed',
    ],
  };
  
  const currentRules = sessionRules[sessionType] || sessionRules.work;
  
  return (
    <div className={`border-l-4 border-amber-500 ${
      theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
    } rounded-r-lg overflow-hidden`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center justify-between ${
          theme === 'dark' ? 'hover:bg-amber-500/20' : 'hover:bg-amber-100'
        } transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className={`font-bold text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              CAWS Protection
            </h3>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Your rights and responsibilities
            </p>
          </div>
        </div>
        
        {isExpanded ? (
          <ChevronUp className={`w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
        )}
      </button>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 space-y-4 ${
              theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'
            }`}>
              {/* Core CAWS Laws */}
              <div>
                <h4 className={`text-xs font-bold uppercase mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Core Principles
                </h4>
                <div className="space-y-2">
                  {coreLaws.map((law) => {
                    const Icon = law.icon;
                    return (
                      <div
                        key={law.id}
                        className={`flex items-start gap-2 p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {law.title}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {law.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Session-Specific Rules */}
              <div>
                <h4 className={`text-xs font-bold uppercase mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session Rules
                </h4>
                <ul className="space-y-1">
                  {currentRules.map((rule, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-2 text-xs ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-amber-500 flex-shrink-0">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Warning */}
              <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-red-50 border-red-200'
              }`}>
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`} />
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-red-300' : 'text-red-800'
                }`}>
                  <strong>Warning:</strong> Violating CAWS laws results in Shield penalties, 
                  Crest downgrades, and potential ban from all villages.
                </p>
              </div>
              
              {/* Learn More Link */}
              <button
                className={`text-xs font-medium underline ${
                  theme === 'dark' ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'
                }`}
              >
                Read Full CAWS Code →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CAWSLawBanner;