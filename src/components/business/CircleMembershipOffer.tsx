import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, MessageCircle, Phone, Calendar, Award, X, Check, Zap } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface CircleMembershipOfferProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: string;
  professionalName: string;
  professionalVillage?: string;
  professionalVillageColor?: string;
  professionalCrest?: number;
  onAccept?: () => void;
}

/**
 * CIRCLE MEMBERSHIP OFFER COMPONENT
 * 
 * Premium connection offer shown after successful business sessions.
 * Allows users to stay connected beyond one-time transactions.
 * 
 * Benefits of "My Circle":
 * - Priority booking (skip queue)
 * - Discounted rates (10-20% off)
 * - Direct messaging
 * - Emergency contact access
 * - First look at new services
 * - Exclusive updates
 * 
 * How It Works:
 * 1. Complete successful business session
 * 2. Both parties can offer/accept "Join My Circle"
 * 3. One-time connection fee (₵2,000-5,000)
 * 4. Ongoing relationship established
 * 5. Mutual benefits unlocked
 * 
 * Types of Circle Connections:
 * - **Trusted Professional** - Your go-to service provider
 * - **Loyal Client** - Regular customer with perks
 * - **Business Partner** - Collaborative relationship
 * - **Mentor/Mentee** - Knowledge exchange
 * 
 * Privacy:
 * - Can remove from Circle anytime
 * - Both parties must consent
 * - Visible only to each other
 * - No public display
 * 
 * Location: src/components/business/CircleMembershipOffer.tsx
 */
export const CircleMembershipOffer: React.FC<CircleMembershipOfferProps> = ({
  isOpen,
  onClose,
  professionalName,
  professionalVillage,
  professionalVillageColor = '#6366f1',
  professionalCrest = 0,
  onAccept,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium'>('basic');
  
  const tiers = [
    {
      id: 'basic' as const,
      name: 'Basic Circle',
      price: 2000,
      features: [
        'Direct messaging',
        'Priority booking',
        '10% discount on services',
        'Service updates',
      ],
      icon: Users,
      color: '#6366f1',
    },
    {
      id: 'premium' as const,
      name: 'Premium Circle',
      price: 5000,
      features: [
        'All Basic benefits',
        'Emergency contact access',
        '20% discount on services',
        'Skip the queue',
        'First look at new services',
        'Monthly check-ins',
      ],
      icon: Star,
      color: '#f59e0b',
      recommended: true,
    },
  ];
  
  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[121] p-0 sm:p-4"
          >
            <div className="w-full h-full sm:h-auto sm:w-full sm:max-w-lg overflow-hidden">
              <div className={`h-full sm:h-auto rounded-none sm:rounded-2xl shadow-2xl flex flex-col ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}>
                {/* Header */}
                <div 
                  className="px-6 py-6 text-white relative overflow-hidden"
                  style={{ backgroundColor: professionalVillageColor }}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Join My Circle</h2>
                        <p className="text-sm opacity-90">Stay connected with {professionalName}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={onClose}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Decorative circles */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/10" />
                </div>
                
                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                  {/* Professional Info */}
                  <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg"
                      style={{ backgroundColor: professionalVillageColor }}
                    >
                      {professionalName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {professionalName}
                        </p>
                        {professionalCrest && professionalCrest > 0 && (
                          <span className="text-sm">
                            {'⭐'.repeat(professionalCrest)}
                          </span>
                        )}
                      </div>
                      {professionalVillage && (
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {professionalVillage}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Info Message */}
                  <div className={`p-4 rounded-xl mb-6 ${
                    theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                      <strong>Great work together!</strong> Stay connected for future jobs, priority booking, and exclusive discounts.
                    </p>
                  </div>
                  
                  {/* Tier Selection */}
                  <div className="space-y-3 mb-6">
                    {tiers.map((tier) => {
                      const Icon = tier.icon;
                      const isSelected = selectedTier === tier.id;
                      
                      return (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedTier(tier.id)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${
                            isSelected
                              ? tier.id === 'premium'
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-purple-500 bg-purple-500/10'
                              : theme === 'dark'
                              ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          {tier.recommended && (
                            <div className="absolute -top-2 right-4 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              RECOMMENDED
                            </div>
                          )}
                          
                          <div className="flex items-start gap-3">
                            <div 
                              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}
                              style={isSelected ? { backgroundColor: tier.color } : {}}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className={`font-bold text-lg ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {tier.name}
                                </h3>
                                <div className="text-right">
                                  <p className={`text-2xl font-bold ${
                                    isSelected
                                      ? tier.id === 'premium' ? 'text-amber-500' : 'text-purple-500'
                                      : theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    ₵{tier.price.toLocaleString()}
                                  </p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    one-time
                                  </p>
                                </div>
                              </div>
                              
                              <ul className="space-y-1.5">
                                {tier.features.map((feature, index) => (
                                  <li key={index} className={`flex items-center gap-2 text-sm ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    <Check className={`w-4 h-4 flex-shrink-0 ${
                                      isSelected
                                        ? tier.id === 'premium' ? 'text-amber-500' : 'text-purple-500'
                                        : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                    }`} />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Benefits Preview */}
                  <div className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Award className="w-4 h-4" />
                      What You Get
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <MessageCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Direct Chat
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Fast Booking
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Discounts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Priority Support
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className={`px-6 py-4 border-t flex items-center gap-3 flex-shrink-0 ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                }`}>
                  <button
                    onClick={onClose}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Maybe Later
                  </button>
                  
                  <button
                    onClick={handleAccept}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-white transition-colors ${
                      selectedTier === 'premium'
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    Join Circle - ₵{tiers.find(t => t.id === selectedTier)?.price.toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CircleMembershipOffer;