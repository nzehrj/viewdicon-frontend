import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle,
  Shield,
  Users,
  FileText,
  Upload,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Scale,
  Eye,
  Lock,
  Gavel,
  Send,
  Image,
  Download,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

// Types
type MootStatus = 
  | 'initiated'
  | 'mediator_assigned'
  | 'evidence_submission'
  | 'review'
  | 'deliberation'
  | 'resolved'
  | 'escalated';

type ResolutionOutcome = 
  | 'full_refund'
  | 'partial_refund'
  | 'no_refund'
  | 'additional_work'
  | 'custom';

interface Evidence {
  id: string;
  type: 'document' | 'image' | 'message' | 'proof_of_work';
  url: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: 'payer' | 'beneficiary';
  description: string;
}

interface MootMessage {
  id: string;
  sender: 'payer' | 'beneficiary' | 'mediator';
  message: string;
  timestamp: string;
  isPrivate: boolean;
}

interface ResolutionTerms {
  outcome: ResolutionOutcome;
  refundAmount?: number;
  refundPercentage?: number;
  additionalWorkRequired?: string;
  deadline?: string;
  customTerms?: string;
}

interface DisputeResolutionProps {
  escrowId: string;
  disputeId?: string;
  mootId?: string;
  sessionId: string;
  amount: number;
  raisedBy: 'payer' | 'beneficiary';
  status: MootStatus;
  parties: {
    payer: { id: string; name: string; crest: number };
    beneficiary: { id: string; name: string; crest: number };
  };
  mediator?: {
    id: string;
    name: string;
    village: string;
    crest: number;
    mootsResolved: number;
  };
  resolution?: ResolutionTerms;
  evidence: Evidence[];
  messages: MootMessage[];
  timeline: {
    initiated: string;
    mediatorAssigned?: string;
    evidenceDeadline?: string;
    resolved?: string;
  };
  onFileUpload: (file: File, description: string) => Promise<void>;
  onSendMessage: (message: string, isPrivate: boolean) => Promise<void>;
  onAcceptResolution: () => Promise<void>;
  onRejectResolution: () => Promise<void>;
  onEscalate: (reason: string) => Promise<void>;
  onClose: () => void;
}

/**
 * DISPUTE RESOLUTION (MOOT) - MOBILE-FRIENDLY
 * 
 * Complete dispute resolution interface for business sessions
 * 
 * Features:
 * - Mobile-responsive design
 * - Working close button
 * - Touch-optimized tabs
 * - Evidence submission
 * - Real-time messaging
 * - Resolution acceptance/rejection
 * - Council escalation
 * 
 * Mobile Optimizations:
 * - Responsive padding and text sizes
 * - Touch-friendly buttons (min 44px)
 * - Horizontal scrollable tabs
 * - Flexible layouts
 * - Working close functionality
 * 
 * Location: src/components/business/DisputeResolution.tsx
 */
const DisputeResolution: React.FC<DisputeResolutionProps> = ({
  escrowId,
  disputeId,
  mootId,
  sessionId,
  amount,
  raisedBy,
  status,
  parties,
  mediator,
  resolution,
  evidence,
  messages,
  timeline,
  onFileUpload,
  onSendMessage,
  onAcceptResolution,
  onRejectResolution,
  onEscalate,
  onClose
}) => {
  const currentUserId = useAppSelector(state => state.auth.userId);
  const theme = useAppSelector(state => state.theme.theme);
  const userRole = currentUserId === parties.payer.id ? 'payer' : 'beneficiary';

  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'messages' | 'resolution'>('overview');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileDescription, setFileDescription] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isPrivateMessage, setIsPrivateMessage] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fileDescription.trim()) return;

    setUploadingFile(true);
    try {
      await onFileUpload(file, fileDescription);
      setFileDescription('');
      e.target.value = '';
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage, isPrivateMessage);
      setNewMessage('');
      setIsPrivateMessage(false);
    } catch (error) {
      console.error('Message send failed:', error);
    }
  };

  const handleEscalate = async () => {
    if (!escalationReason.trim()) return;

    try {
      await onEscalate(escalationReason);
      setShowEscalateModal(false);
      setEscalationReason('');
    } catch (error) {
      console.error('Escalation failed:', error);
    }
  };

  const getStatusInfo = (currentStatus: MootStatus) => {
    const statusMap = {
      initiated: { color: 'yellow', label: 'Dispute Initiated', icon: AlertCircle },
      mediator_assigned: { color: 'blue', label: 'Mediator Assigned', icon: Users },
      evidence_submission: { color: 'purple', label: 'Gathering Evidence', icon: FileText },
      review: { color: 'indigo', label: 'Under Review', icon: Eye },
      deliberation: { color: 'orange', label: 'Deliberation', icon: Scale },
      resolved: { color: 'green', label: 'Resolved', icon: CheckCircle },
      escalated: { color: 'red', label: 'Escalated', icon: Gavel }
    };
    return statusMap[currentStatus];
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header - Mobile Optimized */}
        <div className={`bg-gradient-to-r from-${statusInfo.color}-600 to-${statusInfo.color}-700 px-4 sm:px-6 py-3 sm:py-4 text-white shrink-0`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg shrink-0">
                <StatusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-xl font-bold truncate">Moot - Dispute Resolution</h2>
                <p className="text-xs sm:text-sm text-white/90 truncate">
                  {mootId || disputeId || `Session: ${sessionId.slice(0, 8)}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors shrink-0"
              aria-label="Close dispute resolution"
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Status Badge - Mobile Responsive */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-full">
              <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold">{statusInfo.label}</span>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-white/70">Disputed Amount</p>
              <p className="text-base sm:text-lg font-bold">₦{amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs - Horizontal Scroll on Mobile */}
        <div className={`border-b ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        } shrink-0`}>
          <div className="flex overflow-x-auto hide-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'evidence', label: 'Evidence', icon: FileText },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'resolution', label: 'Resolution', icon: Scale }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-shrink-0 px-4 sm:px-6 py-3 flex items-center justify-center gap-2 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? theme === 'dark'
                        ? 'text-orange-500 bg-gray-900'
                        : 'text-orange-600 bg-white'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Parties */}
                <div className={`${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                } rounded-xl p-3 sm:p-4`}>
                  <h3 className={`font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    Parties Involved
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    } rounded-lg p-3 sm:p-4`}>
                      <p className="text-xs text-gray-500 mb-1">Client (Payer)</p>
                      <p className={`font-semibold text-sm sm:text-base ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{parties.payer.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm text-gray-600">Crest {parties.payer.crest}</span>
                      </div>
                      {raisedBy === 'payer' && (
                        <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Raised Dispute
                        </span>
                      )}
                    </div>
                    <div className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    } rounded-lg p-3 sm:p-4`}>
                      <p className="text-xs text-gray-500 mb-1">Professional (Beneficiary)</p>
                      <p className={`font-semibold text-sm sm:text-base ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{parties.beneficiary.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm text-gray-600">Crest {parties.beneficiary.crest}</span>
                      </div>
                      {raisedBy === 'beneficiary' && (
                        <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Raised Dispute
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mediator */}
                {mediator && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 sm:p-4">
                    <h3 className={`font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Gavel className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Assigned Mediator
                    </h3>
                    <div className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    } rounded-lg p-3 sm:p-4`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm sm:text-base ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{mediator.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{mediator.village} Village Elder</p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                              <span className="text-xs sm:text-sm text-gray-600">Crest {mediator.crest}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm text-gray-600">{mediator.mootsResolved} Moots</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full shrink-0">
                          NEUTRAL
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className={`${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                } rounded-xl p-3 sm:p-4`}>
                  <h3 className={`font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    Timeline
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {Object.entries(timeline).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <div key={key} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-2 h-2 bg-orange-600 rounded-full shrink-0" />
                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className={`text-xs sm:text-sm capitalize ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {key.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(value).toLocaleString('en-NG', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Escrow Status */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold mb-1 text-sm sm:text-base ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Funds Secured</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        ₦{amount.toLocaleString()} is held in escrow until resolution
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg inline-block break-all">
                        <strong>Escrow ID:</strong> {escrowId}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* EVIDENCE TAB */}
            {activeTab === 'evidence' && (
              <motion.div
                key="evidence"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Upload Section */}
                {status === 'evidence_submission' && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 sm:p-4">
                    <h3 className={`font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      Submit Evidence
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Evidence Description
                        </label>
                        <textarea
                          value={fileDescription}
                          onChange={(e) => setFileDescription(e.target.value)}
                          placeholder="Describe what this evidence shows..."
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block w-full cursor-pointer">
                          <div className={`px-3 sm:px-4 py-3 sm:py-4 border-2 border-dashed rounded-lg hover:border-purple-500 transition-colors text-center ${
                            theme === 'dark'
                              ? 'border-gray-700 hover:bg-gray-800'
                              : 'border-purple-300 hover:bg-purple-50'
                          }`}>
                            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
                            <span className="text-xs sm:text-sm text-purple-600 font-medium block">
                              {uploadingFile ? 'Uploading...' : 'Tap to upload document or image'}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOC, JPG, PNG (Max 10MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            disabled={uploadingFile || !fileDescription.trim()}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Evidence List */}
                <div>
                  <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Submitted Evidence</h3>
                  {evidence.length === 0 ? (
                    <div className={`text-center py-8 sm:py-12 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm sm:text-base text-gray-600">No evidence submitted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {evidence.map((item) => (
                        <div
                          key={item.id}
                          className={`border rounded-lg p-3 sm:p-4 hover:border-purple-300 transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg shrink-0">
                              {item.type === 'image' ? (
                                <Image className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                              ) : (
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className={`font-medium text-sm sm:text-base truncate ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {item.fileName}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                    {item.description}
                                  </p>
                                </div>
                                <a
                                  href={item.url}
                                  download
                                  className={`p-1.5 sm:p-2 rounded-lg transition-colors shrink-0 ${
                                    theme === 'dark'
                                      ? 'hover:bg-gray-700'
                                      : 'hover:bg-gray-100'
                                  }`}
                                >
                                  <Download className="w-4 h-4 text-gray-600" />
                                </a>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  item.uploadedBy === 'payer'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                }`}>
                                  {item.uploadedBy === 'payer' ? 'Client' : 'Professional'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(item.uploadedAt).toLocaleString('en-NG', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Messages List */}
                <div className="space-y-2 sm:space-y-3 max-h-[50vh] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className={`text-center py-8 sm:py-12 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm sm:text-base text-gray-600">No messages yet</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isCurrentUser = 
                        (msg.sender === 'payer' && userRole === 'payer') ||
                        (msg.sender === 'beneficiary' && userRole === 'beneficiary');
                      const isMediator = msg.sender === 'mediator';

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${
                              isMediator
                                ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                                : isCurrentUser
                                ? 'bg-orange-600 text-white'
                                : theme === 'dark'
                                ? 'bg-gray-800 text-gray-100'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold">
                                {msg.sender === 'mediator'
                                  ? mediator?.name || 'Mediator'
                                  : msg.sender === 'payer'
                                  ? parties.payer.name
                                  : parties.beneficiary.name}
                              </span>
                              {msg.isPrivate && (
                                <Lock className="w-3 h-3" />
                              )}
                            </div>
                            <p className="text-xs sm:text-sm break-words">{msg.message}</p>
                            <p className={`text-xs mt-2 ${
                              isMediator
                                ? 'text-blue-600 dark:text-blue-400'
                                : isCurrentUser
                                ? 'text-white/70'
                                : 'text-gray-500'
                            }`}>
                              {new Date(msg.timestamp).toLocaleString('en-NG', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                {status !== 'resolved' && (
                  <div className={`rounded-xl p-3 sm:p-4 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div className="space-y-3">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-900 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        rows={3}
                      />
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPrivateMessage}
                            onChange={(e) => setIsPrivateMessage(e.target.checked)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Private (Mediator only)</span>
                        </label>
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors text-sm sm:text-base"
                        >
                          <Send className="w-4 h-4" />
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* RESOLUTION TAB */}
            {activeTab === 'resolution' && (
              <motion.div
                key="resolution"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                {resolution ? (
                  <>
                    {/* Resolution Terms */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 sm:p-6 border-2 border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-2 sm:gap-3 mb-4">
                        <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-1 shrink-0" />
                        <div>
                          <h3 className={`font-bold text-base sm:text-lg ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Mediator's Resolution
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Both parties must accept this resolution to proceed
                          </p>
                        </div>
                      </div>

                      <div className={`rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                      }`}>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Outcome</p>
                          <p className={`font-semibold text-base sm:text-lg capitalize ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {resolution.outcome.replace('_', ' ')}
                          </p>
                        </div>

                        {resolution.refundAmount !== undefined && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Refund Amount</p>
                            <p className="font-bold text-xl sm:text-2xl text-green-600">
                              ₦{resolution.refundAmount.toLocaleString()}
                            </p>
                            {resolution.refundPercentage && (
                              <p className="text-xs sm:text-sm text-gray-600">
                                ({resolution.refundPercentage}% of disputed amount)
                              </p>
                            )}
                          </div>
                        )}

                        {resolution.additionalWorkRequired && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Additional Work Required</p>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                              {resolution.additionalWorkRequired}
                            </p>
                          </div>
                        )}

                        {resolution.deadline && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Completion Deadline</p>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                              {new Date(resolution.deadline).toLocaleDateString('en-NG', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}

                        {resolution.customTerms && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Additional Terms</p>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                              {resolution.customTerms}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {status === 'deliberation' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <button
                          onClick={onAcceptResolution}
                          className="px-4 sm:px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                        >
                          <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                          Accept Resolution
                        </button>
                        <button
                          onClick={onRejectResolution}
                          className="px-4 sm:px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                        >
                          <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                          Reject & Escalate
                        </button>
                      </div>
                    )}

                    {status === 'resolved' && (
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 text-center">
                        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2" />
                        <p className={`font-semibold text-sm sm:text-base ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-900'
                        }`}>Resolution Accepted</p>
                        <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 mt-1">
                          Escrow funds will be distributed according to the resolution terms
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`text-center py-8 sm:py-12 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <Scale className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm sm:text-base text-gray-600 mb-2">No resolution proposed yet</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {status === 'evidence_submission'
                        ? 'Awaiting evidence submission'
                        : status === 'review'
                        ? 'Mediator is reviewing the evidence'
                        : 'Mediator is deliberating on the case'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions - Mobile Optimized */}
        {status !== 'resolved' && status !== 'escalated' && (
          <div className={`border-t px-4 sm:px-6 py-3 sm:py-4 shrink-0 ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
              <button
                onClick={() => setShowEscalateModal(true)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                  theme === 'dark'
                    ? 'text-red-400 hover:bg-red-900/20'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Escalate to Village Council
              </button>
              <button
                onClick={onClose}
                className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Escalation Modal - Mobile Optimized */}
      <AnimatePresence>
        {showEscalateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3 mb-4">
                <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900/40 rounded-lg shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className={`font-bold text-base sm:text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Escalate to Village Council
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    This will involve senior elders. Please explain why escalation is necessary.
                  </p>
                </div>
              </div>

              <textarea
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Explain why you believe this case should be escalated..."
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4 text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows={4}
              />

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowEscalateModal(false);
                    setEscalationReason('');
                  }}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEscalate}
                  disabled={!escalationReason.trim()}
                  className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors text-sm sm:text-base"
                >
                  Escalate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DisputeResolution;