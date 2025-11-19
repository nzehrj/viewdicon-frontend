import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageCircle,
  Phone,
  Video,
  Shield,
  Award,
  ChevronRight,
  ChevronLeft,
  Eye
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface BusinessSessionProps {
  professionalId: string;
  professionalName: string;
  professionalVillage?: string;
  professionalVillageColor?: string;
  professionalCrest?: number;
  serviceType?: string;
  onClose?: () => void;
}

type SessionStage = 
  | 'request'        // 1. Initial request
  | 'negotiation'    // 2. Price & terms discussion
  | 'agreement'      // 3. Final agreement & escrow
  | 'inProgress'     // 4. Work in progress
  | 'review'         // 5. Client reviews work
  | 'completion'     // 6. Payment released
  | 'dispute';       // 7. If issues arise

interface SessionData {
  sessionId?: string;
  stage: SessionStage;
  serviceDescription: string;
  location: string;
  estimatedDuration: string;
  startDate?: string;
  agreedPrice?: number;
  escrowAmount?: number;
  termsAccepted: boolean;
  clientNotes?: string;
  professionalResponse?: string;
  workProof?: string[]; // Photos/videos of completed work
  rating?: number;
  review?: string;
  disputeReason?: string;
}

/**
 * BUSINESS SESSION COMPONENT
 * 
 * The core workflow for professional work requests and transactions.
 * This is what makes Viewdicon unique - NOT open chat, but structured business.
 * 
 * Flow Stages:
 * 
 * 1. REQUEST
 *    - Client describes work needed
 *    - Location, timeline, budget hints
 *    - Submit request
 * 
 * 2. NEGOTIATION
 *    - Professional responds with quote
 *    - Back-and-forth on price/terms
 *    - Can chat, call, or video call
 * 
 * 3. AGREEMENT
 *    - Final terms locked
 *    - Client deposits to escrow (50-100%)
 *    - Both parties sign digitally
 * 
 * 4. IN PROGRESS
 *    - Work begins
 *    - Client can track progress
 *    - Professional uploads proof
 * 
 * 5. REVIEW
 *    - Client reviews completed work
 *    - Can accept or request changes
 *    - Can escalate to dispute
 * 
 * 6. COMPLETION
 *    - Payment released from escrow
 *    - Both parties rate each other
 *    - Business Link created
 * 
 * 7. DISPUTE (if needed)
 *    - Either party raises issue
 *    - Evidence submitted
 *    - Village Council mediates
 * 
 * Location: src/components/business/BusinessSession.tsx
 */
export const BusinessSession: React.FC<BusinessSessionProps> = ({
  professionalId: _professionalId,
  professionalName,
  professionalVillage,
  professionalVillageColor,
  professionalCrest,
  serviceType,
  onClose,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [session, setSession] = useState<SessionData>({
    stage: 'request',
    serviceDescription: '',
    location: '',
    estimatedDuration: '',
    termsAccepted: false,
  });
  
  const stages: Array<{ id: SessionStage; label: string; icon: React.ElementType }> = [
    { id: 'request', label: 'Request', icon: FileText },
    { id: 'negotiation', label: 'Negotiate', icon: MessageCircle },
    { id: 'agreement', label: 'Agreement', icon: CheckCircle },
    { id: 'inProgress', label: 'In Progress', icon: Clock },
    { id: 'review', label: 'Review', icon: Eye },
    { id: 'completion', label: 'Complete', icon: Award },
  ];
  
  const currentStageIndex = stages.findIndex(s => s.id === session.stage);
  
  const handleSubmitRequest = () => {
    if (!session.serviceDescription || !session.location) {
      return;
    }
    
    setSession({ ...session, stage: 'negotiation' });
    // TODO: API call to create session
    console.log('Submit request:', session);
  };
  
  const handleAcceptQuote = (price: number) => {
    setSession({ 
      ...session, 
      agreedPrice: price,
      stage: 'agreement' 
    });
    // TODO: API call
  };
  
  const handleDepositEscrow = () => {
    if (!session.agreedPrice || !session.termsAccepted) {
      return;
    }
    
    setSession({
      ...session,
      escrowAmount: session.agreedPrice,
      stage: 'inProgress'
    });
    // TODO: Payment flow
    console.log('Deposit to escrow:', session.agreedPrice);
  };
  
  const handleApproveWork = () => {
    setSession({ ...session, stage: 'completion' });
    // TODO: Release escrow
    console.log('Release payment');
  };
  
  const handleRaiseDispute = (reason: string) => {
    setSession({ 
      ...session, 
      disputeReason: reason,
      stage: 'dispute' 
    });
    // TODO: API call
    console.log('Raise dispute:', reason);
  };
  
  const handleRating = (rating: number, review: string) => {
    setSession({ ...session, rating, review });
    // TODO: API call
    console.log('Submit rating:', rating, review);
    onClose?.();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className={`absolute right-0 top-0 bottom-0 w-full md:w-[600px] overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 p-4 border-b ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Business Session
                </h2>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                with {professionalName}
              </p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;
              
              return (
                <div key={stage.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-purple-600'
                        : isCompleted
                        ? 'bg-green-600'
                        : theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        isActive || isCompleted ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className={`text-xs mt-1 hidden sm:block ${
                      isActive
                        ? 'text-purple-600 font-semibold'
                        : isCompleted
                        ? 'text-green-600'
                        : theme === 'dark'
                        ? 'text-gray-500'
                        : 'text-gray-500'
                    }`}>
                      {stage.label}
                    </span>
                  </div>
                  
                  {index < stages.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${
                      isCompleted
                        ? 'bg-green-600'
                        : theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Professional Card */}
          <div className={`p-4 rounded-xl border mb-4 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: professionalVillageColor || '#8b5cf6' }}
              >
                {professionalName.charAt(0)}
              </div>
              
              <div className="flex-1">
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {professionalName}
                </p>
                {professionalVillage && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {professionalVillage}
                  </p>
                )}
              </div>
              
              {professionalCrest && (
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-amber-500">
                    {professionalCrest}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Stage Content */}
          <AnimatePresence mode="wait">
            {session.stage === 'request' && (
              <motion.div
                key="request"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Request Work
                  </h3>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Describe what you need done. Be specific about requirements and timeline.
                  </p>
                </div>
                
                {serviceType && (
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-50'
                  }`}>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
                    }`}>
                      Service: {serviceType}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    What do you need done? *
                  </label>
                  <textarea
                    value={session.serviceDescription}
                    onChange={(e) => setSession({ ...session, serviceDescription: e.target.value })}
                    placeholder="Describe the work in detail..."
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-3 w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      value={session.location}
                      onChange={(e) => setSession({ ...session, location: e.target.value })}
                      placeholder="Where is the work?"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={session.startDate || ''}
                      onChange={(e) => setSession({ ...session, startDate: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Duration
                    </label>
                    <input
                      type="text"
                      value={session.estimatedDuration}
                      onChange={(e) => setSession({ ...session, estimatedDuration: e.target.value })}
                      placeholder="e.g., 2 days"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-blue-600/10 border-blue-600/30' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                      }`}>
                        Safe & Secure
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        All payments are held in escrow until work is complete. Your money is protected.
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmitRequest}
                  disabled={!session.serviceDescription || !session.location}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    !session.serviceDescription || !session.location
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                  Submit Request
                </button>
              </motion.div>
            )}
            
            {session.stage === 'negotiation' && (
              <motion.div
                key="negotiation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Negotiation
                  </h3>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Discuss price and terms with {professionalName}
                  </p>
                </div>
                
                {/* Mock professional quote */}
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: professionalVillageColor || '#8b5cf6' }}
                    >
                      {professionalName.charAt(0)}
                    </div>
                    <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {professionalName}'s Quote
                    </p>
                  </div>
                  
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    I can do this work for you. Based on your requirements, here's my quote:
                  </p>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-600/20 border border-purple-600/30">
                    <span className="text-purple-400 font-medium">Total Cost</span>
                    <span className="text-2xl font-bold text-purple-400">₵45,000</span>
                  </div>
                  
                  <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Estimated completion: 3 days
                  </p>
                </div>
                
                {/* Communication Options */}
                <div className="grid grid-cols-3 gap-2">
                  <button className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:border-purple-600'
                      : 'bg-white border-gray-200 hover:border-purple-600'
                  } transition-colors`}>
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium">Chat</span>
                  </button>
                  
                  <button className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:border-purple-600'
                      : 'bg-white border-gray-200 hover:border-purple-600'
                  } transition-colors`}>
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium">Call</span>
                  </button>
                  
                  <button className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:border-purple-600'
                      : 'bg-white border-gray-200 hover:border-purple-600'
                  } transition-colors`}>
                    <Video className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium">Video</span>
                  </button>
                </div>
                
                <button
                  onClick={() => handleAcceptQuote(45000)}
                  className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept Quote
                </button>
                
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Counter Offer
                </button>
              </motion.div>
            )}
            
            {session.stage === 'agreement' && (
              <motion.div
                key="agreement"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Agreement & Escrow
                  </h3>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Review final terms and deposit payment to escrow
                  </p>
                </div>
                
                {/* Agreement Summary */}
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Work Agreement
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Service</span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {session.serviceDescription.substring(0, 30)}...
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Location</span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {session.location}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Duration</span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        3 days
                      </span>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-gray-700 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold text-purple-600">
                        ₵{session.agreedPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Terms Checkbox */}
                <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={session.termsAccepted}
                    onChange={(e) => setSession({ ...session, termsAccepted: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded text-purple-600"
                  />
                  <div>
                    <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      I agree to the terms
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Payment will be held in escrow and released only when work is complete and approved.
                    </p>
                  </div>
                </label>
                
                <button
                  onClick={handleDepositEscrow}
                  disabled={!session.termsAccepted}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    !session.termsAccepted
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  Deposit ₵{session.agreedPrice?.toLocaleString()} to Escrow
                </button>
              </motion.div>
            )}
            
            {session.stage === 'inProgress' && (
              <motion.div
                key="inProgress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Work In Progress
                  </h3>
                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {professionalName} is working on your request
                  </p>
                </div>
                
                {/* Status */}
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-green-600/10 border-green-600/30' : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <p className="font-bold text-green-600">Day 2 of 3</p>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    Work is on schedule
                  </p>
                </div>
                
                {/* Escrow Info */}
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Funds in Escrow
                      </span>
                    </div>
                    <span className="font-bold text-purple-600">
                      ₵{session.escrowAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Communication */}
                <button className={`w-full py-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 hover:border-purple-600 text-white'
                    : 'bg-white border-gray-200 hover:border-purple-600 text-gray-900'
                }`}>
                  <MessageCircle className="w-5 h-5" />
                  Chat with {professionalName}
                </button>
                
                {/* Mark Complete */}
                <button
                  onClick={handleApproveWork}
                  className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Work Complete - Release Payment
                </button>
                
                <button
                  onClick={() => handleRaiseDispute('Quality issues')}
                  className={`w-full py-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors ${
                    theme === 'dark'
                      ? 'border-red-600/30 hover:bg-red-600/10 text-red-400'
                      : 'border-red-200 hover:bg-red-50 text-red-600'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  Raise Dispute
                </button>
              </motion.div>
            )}
            
            {session.stage === 'completion' && (
              <motion.div
                key="completion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Work Complete!
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Payment has been released to {professionalName}
                  </p>
                </div>
                
                {/* Rate Experience */}
                <div>
                  <h4 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Rate Your Experience
                  </h4>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSession({ ...session, rating: star })}
                        className="text-3xl transition-transform hover:scale-110"
                      >
                        {(session.rating || 0) >= star ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    value={session.review || ''}
                    onChange={(e) => setSession({ ...session, review: e.target.value })}
                    placeholder="Share your experience (optional)"
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                
                <button
                  onClick={() => handleRating(session.rating || 5, session.review || '')}
                  className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
                >
                  Submit & Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessSession;