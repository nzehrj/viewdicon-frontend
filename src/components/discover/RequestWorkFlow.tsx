import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Calendar, DollarSign, FileText, Briefcase } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface RequestWorkFlowProps {
  isOpen: boolean;
  onClose: () => void;
  professional: {
    id: string;
    name: string;
    role: string;
    village: string;
    villageColor: string;
    priceHint?: string;
  };
  onSubmitRequest: (requestData: WorkRequest) => void;
}

interface WorkRequest {
  professionalId: string;
  jobTitle: string;
  jobDescription: string;
  proposedPrice?: number;
  urgency: 'normal' | 'urgent' | 'emergency';
  preferredDate?: Date;
  locationDetails: string;
}

/**
 * REQUEST WORK FLOW COMPONENT
 * 
 * Modal that guides users through requesting work from a professional.
 * This STARTS a Business Session (not a regular chat).
 * 
 * Flow:
 * 1. Describe the job
 * 2. Set urgency and date
 * 3. Propose budget (optional)
 * 4. Add location/details
 * 5. Submit → Creates Business Session
 * 
 * Location: src/components/discover/RequestWorkFlow.tsx
 */
export const RequestWorkFlow: React.FC<RequestWorkFlowProps> = ({
  isOpen,
  onClose,
  professional,
  onSubmitRequest,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [step, setStep] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [proposedPrice, setProposedPrice] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  
  const urgencyOptions = [
    { id: 'normal', label: 'Normal', description: 'Within a week', color: '#10b981' },
    { id: 'urgent', label: 'Urgent', description: 'Within 2-3 days', color: '#f59e0b' },
    { id: 'emergency', label: 'Emergency', description: 'Today/Tomorrow', color: '#ef4444' },
  ];
  
  const canProceed = () => {
    if (step === 1) return jobTitle.trim() && jobDescription.trim();
    if (step === 2) return urgency;
    if (step === 3) return locationDetails.trim();
    return false;
  };
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = () => {
    const requestData: WorkRequest = {
      professionalId: professional.id,
      jobTitle,
      jobDescription,
      proposedPrice: proposedPrice ? Number(proposedPrice) : undefined,
      urgency,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      locationDetails,
    };
    
    onSubmitRequest(requestData);
    onClose();
    
    // Reset form
    setStep(1);
    setJobTitle('');
    setJobDescription('');
    setUrgency('normal');
    setProposedPrice('');
    setPreferredDate('');
    setLocationDetails('');
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[111]"
          >
            <div className="w-full h-full sm:h-auto sm:w-full sm:max-w-lg overflow-hidden">
            <div className={`h-full sm:h-auto rounded-none sm:rounded-2xl flex flex-col ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              {/* Header */}
              <div 
                className="px-6 py-4 text-white relative overflow-hidden"
                style={{ backgroundColor: professional.villageColor }}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-xl font-bold">Request Work</h2>
                    <p className="text-sm opacity-90">
                      {professional.name} • {professional.role}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Step Indicator */}
                <div className="flex items-center gap-2 mt-4 relative z-10">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        num <= step ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {/* Step 1: Describe Job */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        What work do you need? *
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Install solar panels for my house"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Describe the work in detail *
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Explain what you need done, any specific requirements, materials needed, etc."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border resize-none ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      />
                    </div>
                    
                    <div className={`flex items-start gap-2 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
                    }`}>
                      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                      }`}>
                        Be specific! Clear job descriptions help professionals give accurate quotes.
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 2: Urgency & Date */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        How urgent is this work? *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {urgencyOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setUrgency(option.id as any)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              urgency === option.id
                                ? 'border-current scale-105'
                                : theme === 'dark'
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={urgency === option.id ? { borderColor: option.color, color: option.color } : {}}
                          >
                            <div className={`text-sm font-bold mb-1 ${
                              urgency === option.id 
                                ? '' 
                                : theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {option.label}
                            </div>
                            <div className={`text-xs ${
                              urgency === option.id
                                ? 'opacity-90'
                                : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Preferred start date (optional)
                      </label>
                      <div className="relative">
                        <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Your budget (optional)
                      </label>
                      <div className="relative">
                        <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                          type="number"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(e.target.value)}
                          placeholder="How much are you willing to pay?"
                          className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                      </div>
                      {professional.priceHint && (
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {professional.name}'s usual range: {professional.priceHint}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {/* Step 3: Location & Submit */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Location & Access Details *
                      </label>
                      <textarea
                        value={locationDetails}
                        onChange={(e) => setLocationDetails(e.target.value)}
                        placeholder="Full address, landmarks, access instructions (gate codes, parking, etc.)"
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border resize-none ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      />
                    </div>
                    
                    {/* Summary */}
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <FileText className="w-4 h-4" />
                        Request Summary
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Job:
                          </span>{' '}
                          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                            {jobTitle}
                          </span>
                        </div>
                        
                        <div>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Urgency:
                          </span>{' '}
                          <span 
                            className="font-medium"
                            style={{ color: urgencyOptions.find(o => o.id === urgency)?.color }}
                          >
                            {urgencyOptions.find(o => o.id === urgency)?.label}
                          </span>
                        </div>
                        
                        {proposedPrice && (
                          <div>
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                              Budget:
                            </span>{' '}
                            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                              ₵{Number(proposedPrice).toLocaleString()}
                            </span>
                          </div>
                        )}
                        
                        {preferredDate && (
                          <div>
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                              Start date:
                            </span>{' '}
                            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                              {new Date(preferredDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex items-start gap-2 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
                    }`}>
                      <Briefcase className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
                      }`}>
                        This will start a <strong>Business Session</strong> with {professional.name}. 
                        Payment is held in escrow until work is completed.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Footer */}
              <div className={`px-6 py-4 border-t flex items-center gap-3 flex-shrink-0 ${
                theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
              }`}>
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Back
                  </button>
                )}
                
                <button
                  onClick={step < 3 ? handleNext : handleSubmit}
                  disabled={!canProceed()}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                    canProceed()
                      ? 'text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={canProceed() ? { backgroundColor: professional.villageColor } : {}}
                >
                  {step < 3 ? 'Next' : 'Submit Request'}
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

export default RequestWorkFlow;