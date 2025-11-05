import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Shield,
  Clock,
  Trash2
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { Button } from '@components/common/Button';
import * as Icons from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

interface RoleChangeRequestProps {
  isOpen: boolean;
  onClose: () => void;
  villageId: string;
  villageName: string;
  villageColor: string;
  roleId: string;
  roleName: string;
  roleIcon: string;
  onSubmit: (data: {
    villageId: string;
    roleId: string;
    documents: Document[];
    reason: string;
  }) => void;
}

export const RoleChangeRequest: React.FC<RoleChangeRequestProps> = ({
  isOpen,
  onClose,
  villageId,
  villageName,
  villageColor,
  roleId,
  roleName,
  roleIcon,
  onSubmit,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const [reason, setReason] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const resolveIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp || Shield;
  };

  const RoleIcon = resolveIcon(roleIcon);

  // Required documents based on role
  const requiredDocuments = [
    { id: '1', name: 'Professional Certificate', description: 'Proof of qualification or training' },
    { id: '2', name: 'Work Experience', description: 'Portfolio, resume, or work samples' },
    { id: '3', name: 'Community Referral (Optional)', description: 'Letter from a verified community member' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: Document[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
    }));

    setDocuments([...documents, ...newDocuments]);
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments(documents.filter(d => d.id !== docId));
  };

  const handleSubmit = async () => {
    if (!reason.trim() || documents.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API call to submit request
      await new Promise(resolve => setTimeout(resolve, 2000));

      onSubmit({
        villageId,
        roleId,
        documents,
        reason,
      });

      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={currentStep === 3 ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal - Centered on all screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`
              fixed inset-4 sm:inset-8 md:inset-auto
              md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
              md:w-full md:max-w-2xl md:max-h-[90vh]
              z-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
              rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col
            `}
          >
            {/* Header */}
            <div className={`p-4 sm:p-6 border-b ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentStep === 3 ? 'Request Submitted!' : 'Village Migration Request'}
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              {currentStep !== 3 && (
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 sm:gap-2 ${
                    currentStep >= 1 ? 'text-green-500' : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                      currentStep >= 1 ? 'bg-green-500 text-white' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      {currentStep > 1 ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : '1'}
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Review</span>
                  </div>

                  <div className={`flex-1 h-1 rounded ${
                    currentStep >= 2 ? 'bg-green-500' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  }`} />

                  <div className={`flex items-center gap-1 sm:gap-2 ${
                    currentStep >= 2 ? 'text-green-500' : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                      currentStep >= 2 ? 'bg-green-500 text-white' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      2
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Documents</span>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {/* STEP 1: Review Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Village & Role Display */}
                    <div className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-4 sm:mb-6 border-2`}
                      style={{ borderColor: villageColor }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div 
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                        >
                          <RoleIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm font-semibold mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Requesting to join
                          </p>
                          <h3 className={`text-base sm:text-lg md:text-xl font-bold truncate ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {villageName}
                          </h3>
                          <p className={`text-sm sm:text-base font-semibold truncate`}
                            style={{ color: villageColor }}
                          >
                            {roleName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Info */}
                    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 ${
                      theme === 'dark' ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Clock className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <div>
                          <p className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${
                            theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                          }`}>
                            Migration Timeline
                          </p>
                          <ul className={`text-xs space-y-0.5 sm:space-y-1 ${
                            theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                          }`}>
                            <li>• <strong>Today:</strong> Submit your request</li>
                            <li>• <strong>3-7 days:</strong> Community review & verification</li>
                            <li>• <strong>After approval:</strong> 6-month cooldown begins</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Required Documents List */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className={`text-xs sm:text-sm font-bold mb-2 sm:mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Required Documents
                      </h4>
                      <div className="space-y-2">
                        {requiredDocuments.map((doc) => (
                          <div 
                            key={doc.id}
                            className={`p-2.5 sm:p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <FileText className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs sm:text-sm font-semibold ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {doc.name}
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {doc.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warning */}
                    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${
                      theme === 'dark' ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
                    }`}>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
                          theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                        }`} />
                        <div>
                          <p className={`text-xs sm:text-sm font-semibold mb-1 ${
                            theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                          }`}>
                            Important Notice
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                          }`}>
                            Once approved, you won't be able to change villages or roles for another 6 months. Please ensure this is the right choice for you.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Upload Documents */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Reason for Migration */}
                    <div className="mb-4 sm:mb-6">
                      <label className={`block text-xs sm:text-sm font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Why do you want to join this village and role? *
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Explain your experience, qualifications, and why you're passionate about this role..."
                        rows={4}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border resize-none text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      />
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {reason.length}/500 characters
                      </p>
                    </div>

                    {/* Upload Area */}
                    <div className="mb-4 sm:mb-6">
                      <label className={`block text-xs sm:text-sm font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Upload Documents *
                      </label>
                      
                      <label className={`
                        block p-6 sm:p-8 rounded-lg sm:rounded-xl border-2 border-dashed cursor-pointer transition-colors
                        ${theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                          : 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:bg-gray-100'
                        }
                      `}>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="text-center">
                          <Upload className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <p className={`text-xs sm:text-sm font-semibold mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Click to upload or drag and drop
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            PDF, DOC, DOCX, JPG, PNG (max 10MB each)
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Uploaded Documents */}
                    {documents.length > 0 && (
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className={`text-xs sm:text-sm font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Uploaded Documents ({documents.length})
                        </h4>
                        {documents.map((doc) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 sm:p-4 rounded-lg flex items-center justify-between ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className={`p-1.5 sm:p-2 rounded-lg ${
                                theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                              }`}>
                                <FileText className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs sm:text-sm font-semibold truncate ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {doc.name}
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {formatFileSize(doc.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveDocument(doc.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'hover:bg-red-900/30 text-red-400'
                                  : 'hover:bg-red-50 text-red-600'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: Success */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 sm:py-8"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>

                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Request Submitted!
                    </h3>

                    <p className={`text-xs sm:text-sm mb-4 sm:mb-6 px-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Your village migration request has been submitted successfully.
                    </p>

                    <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl mb-4 sm:mb-6 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-start gap-3 sm:gap-4 text-left">
                        <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
                          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        }`} />
                        <div>
                          <p className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            What happens next?
                          </p>
                          <ul className={`text-xs space-y-0.5 sm:space-y-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <li>• Community elders will review your documents</li>
                            <li>• You'll receive updates via notifications</li>
                            <li>• Review typically takes 3-7 days</li>
                            <li>• Once approved, your migration will be complete</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={onClose}
                      fullWidth
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Done
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer - Buttons Stack on Mobile */}
            {currentStep !== 3 && (
              <div className={`p-4 sm:p-6 border-t ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex flex-col sm:flex-row gap-3">
                  {currentStep === 1 && (
                    <>
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(2)}
                        className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Continue
                      </Button>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="w-full sm:flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!reason.trim() || documents.length === 0 || isSubmitting}
                        className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RoleChangeRequest;