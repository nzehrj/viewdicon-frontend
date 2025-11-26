import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Phone, 
  MapPin, 
  Clock, 
  Shield, 
  AlertCircle,
  CheckCircle,
  X,
  Send
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface CallWitnessProps {
  sessionId: string;
  location?: string;
  onCallWitness?: (witnessData: WitnessAlert) => void;
}

interface WitnessAlert {
  sessionId: string;
  reason: string;
  location: string;
  emergencyContact?: string;
  additionalInfo?: string;
  timestamp: Date;
}

/**
 * CALL WITNESS COMPONENT
 * 
 * Emergency safety feature for Business Sessions.
 * Allows users to alert trusted contacts or platform moderators
 * when they feel unsafe or suspect fraud.
 * 
 * Features:
 * - One-tap emergency alert
 * - Location sharing
 * - Reason selection
 * - Emergency contact notification
 * - Platform moderator alert
 * - Session freeze
 * 
 * When to Call Witness:
 * - Feel physically unsafe
 * - Suspect fraud or scam
 * - Work differs from agreement
 * - Payment dispute
 * - Harassment or abuse
 * - Location concerns
 * 
 * What Happens:
 * 1. Immediate alert sent to:
 *    - Your emergency contacts
 *    - Platform safety team
 *    - Local village moderators
 * 
 * 2. Session Actions:
 *    - Session immediately frozen
 *    - Escrow protected
 *    - GPS location logged
 *    - Chat history preserved
 *    - Photos/videos timestamped
 * 
 * 3. Response:
 *    - Safety team contacts you within 5 minutes
 *    - Police can be dispatched if needed
 *    - Mediator assigned if fraud
 *    - Evidence collected for investigation
 * 
 * Location: src/components/business/CallWitness.tsx
 */
export const CallWitness: React.FC<CallWitnessProps> = ({
  sessionId,
  location,
  onCallWitness,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  
  const reasons = [
    { id: 'safety', label: 'Feel Unsafe', description: 'Physical danger or threatening behavior', priority: 'emergency' },
    { id: 'fraud', label: 'Suspect Fraud', description: 'Scam or dishonest behavior', priority: 'high' },
    { id: 'dispute', label: 'Work Dispute', description: 'Work differs from agreement', priority: 'medium' },
    { id: 'payment', label: 'Payment Issue', description: 'Money or escrow concerns', priority: 'medium' },
    { id: 'harassment', label: 'Harassment', description: 'Abuse, threats, or inappropriate behavior', priority: 'high' },
    { id: 'location', label: 'Location Concerns', description: 'Unsafe area or wrong location', priority: 'high' },
    { id: 'other', label: 'Other', description: 'Something else needs attention', priority: 'low' },
  ];
  
  const handleCallWitness = () => {
    setShowModal(true);
  };
  
  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    
    const witnessData: WitnessAlert = {
      sessionId,
      reason: selectedReason,
      location: location || 'Unknown',
      additionalInfo,
      timestamp: new Date(),
    };
    
    // TODO: Send to backend
    if (onCallWitness) {
      onCallWitness(witnessData);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setAlertSent(true);
    
    // Auto-close after showing success
    setTimeout(() => {
      setShowModal(false);
      setAlertSent(false);
      setSelectedReason('');
      setAdditionalInfo('');
    }, 3000);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return theme === 'dark' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200';
      case 'high': return theme === 'dark' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium': return theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  
  return (
    <>
      {/* Call Witness Button */}
      <button
        onClick={handleCallWitness}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          theme === 'dark'
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
        }`}
      >
        <Eye className="w-5 h-5" />
        <span>Call Witness</span>
      </button>
      
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && !alertSent && setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120]"
            />
            
            {/* Modal Content */}
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
                  {!alertSent ? (
                    <>
                      {/* Header */}
                      <div className="px-6 py-4 border-b border-red-500/30 bg-red-500/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className={`text-lg font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                Call Witness
                              </h2>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Alert safety team immediately
                              </p>
                            </div>
                          </div>
                          
                          {!isSubmitting && (
                            <button
                              onClick={() => setShowModal(false)}
                              className={`p-2 rounded-lg ${
                                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                              }`}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                        {/* Info Alert */}
                        <div className={`flex items-start gap-2 p-3 rounded-lg mb-4 ${
                          theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
                        }`}>
                          <Shield className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                          }`}>
                            Your alert will be sent to emergency contacts, safety team, 
                            and local moderators. Response within 5 minutes.
                          </p>
                        </div>
                        
                        {/* Current Location */}
                        {location && (
                          <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <MapPin className={`w-4 h-4 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {location}
                            </span>
                          </div>
                        )}
                        
                        {/* Reason Selection */}
                        <div className="mb-4">
                          <label className={`block text-sm font-semibold mb-3 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Why are you calling a witness? *
                          </label>
                          <div className="space-y-2">
                            {reasons.map((reason) => (
                              <button
                                key={reason.id}
                                onClick={() => setSelectedReason(reason.id)}
                                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                  selectedReason === reason.id
                                    ? getPriorityColor(reason.priority)
                                    : theme === 'dark'
                                    ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className={`font-semibold text-sm mb-1 ${
                                      selectedReason === reason.id
                                        ? ''
                                        : theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {reason.label}
                                    </p>
                                    <p className={`text-xs ${
                                      selectedReason === reason.id
                                        ? 'opacity-90'
                                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                      {reason.description}
                                    </p>
                                  </div>
                                  {reason.priority === 'emergency' && (
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Additional Info */}
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Additional details (optional)
                          </label>
                          <textarea
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="Provide any additional context that can help..."
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border resize-none ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 focus:ring-red-500`}
                          />
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className={`px-6 py-4 border-t flex items-center gap-3 flex-shrink-0 ${
                        theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
                      }`}>
                        <button
                          onClick={() => setShowModal(false)}
                          disabled={isSubmitting}
                          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-800 text-white hover:bg-gray-700'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          Cancel
                        </button>
                        
                        <button
                          onClick={handleSubmit}
                          disabled={!selectedReason || isSubmitting}
                          className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />
                              <span>Sending Alert...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Alert</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Success State */
                    <div className="p-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className={`text-xl font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Alert Sent!
                      </h3>
                      <p className={`text-sm mb-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Safety team has been notified and will contact you within 5 minutes.
                      </p>
                      <div className={`flex items-center justify-center gap-2 text-sm ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        <Phone className="w-4 h-4" />
                        <span>Emergency contacts have been alerted</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CallWitness;