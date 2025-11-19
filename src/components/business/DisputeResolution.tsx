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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r from-${statusInfo.color}-600 to-${statusInfo.color}-700 px-6 py-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Moot - Dispute Resolution</h2>
                <p className="text-sm text-white/90">
                  {mootId || disputeId || `Session: ${sessionId.slice(0, 8)}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
              <StatusIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">{statusInfo.label}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/70">Disputed Amount</p>
              <p className="text-lg font-bold">₦{amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
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
                  className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-orange-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Parties */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    Parties Involved
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Client (Payer)</p>
                      <p className="font-semibold text-gray-900">{parties.payer.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Crest {parties.payer.crest}</span>
                      </div>
                      {raisedBy === 'payer' && (
                        <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Raised Dispute
                        </span>
                      )}
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Professional (Beneficiary)</p>
                      <p className="font-semibold text-gray-900">{parties.beneficiary.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Crest {parties.beneficiary.crest}</span>
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
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Gavel className="w-5 h-5 text-blue-600" />
                      Assigned Mediator
                    </h3>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{mediator.name}</p>
                          <p className="text-sm text-gray-600">{mediator.village} Village Elder</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-600">Crest {mediator.crest}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-600">{mediator.mootsResolved} Moots Resolved</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          NEUTRAL
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(timeline).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-600 rounded-full" />
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm text-gray-700 capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-gray-500">
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
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Funds Secured</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        ₦{amount.toLocaleString()} is held in escrow until resolution
                      </p>
                      <p className="text-xs text-amber-700 bg-amber-100 px-3 py-2 rounded-lg inline-block">
                        <strong>Escrow ID:</strong> {escrowId}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'evidence' && (
              <motion.div
                key="evidence"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Upload Section */}
                {status === 'evidence_submission' && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-purple-600" />
                      Submit Evidence
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Evidence Description
                        </label>
                        <textarea
                          value={fileDescription}
                          onChange={(e) => setFileDescription(e.target.value)}
                          placeholder="Describe what this evidence shows..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block w-full cursor-pointer">
                          <div className="px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 transition-colors text-center">
                            <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <span className="text-sm text-purple-600 font-medium">
                              {uploadingFile ? 'Uploading...' : 'Click to upload document or image'}
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
                  <h3 className="font-semibold text-gray-900 mb-4">Submitted Evidence</h3>
                  {evidence.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No evidence submitted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {evidence.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              {item.type === 'image' ? (
                                <Image className="w-5 h-5 text-purple-600" />
                              ) : (
                                <FileText className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {item.fileName}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {item.description}
                                  </p>
                                </div>
                                <a
                                  href={item.url}
                                  download
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                                >
                                  <Download className="w-4 h-4 text-gray-600" />
                                </a>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  item.uploadedBy === 'payer'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
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

            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Messages List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No messages yet</p>
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
                            className={`max-w-[80%] rounded-lg p-4 ${
                              isMediator
                                ? 'bg-blue-50 border border-blue-200'
                                : isCurrentUser
                                ? 'bg-orange-600 text-white'
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
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-2 ${
                              isMediator
                                ? 'text-blue-600'
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
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="space-y-3">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPrivateMessage}
                            onChange={(e) => setIsPrivateMessage(e.target.checked)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <Lock className="w-4 h-4" />
                          <span>Private (Mediator only)</span>
                        </label>
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
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

            {activeTab === 'resolution' && (
              <motion.div
                key="resolution"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {resolution ? (
                  <>
                    {/* Resolution Terms */}
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-start gap-3 mb-4">
                        <Scale className="w-6 h-6 text-green-600 mt-1" />
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            Mediator's Resolution
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Both parties must accept this resolution to proceed
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Outcome</p>
                          <p className="font-semibold text-gray-900 text-lg capitalize">
                            {resolution.outcome.replace('_', ' ')}
                          </p>
                        </div>

                        {resolution.refundAmount !== undefined && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Refund Amount</p>
                            <p className="font-bold text-2xl text-green-600">
                              ₦{resolution.refundAmount.toLocaleString()}
                            </p>
                            {resolution.refundPercentage && (
                              <p className="text-sm text-gray-600">
                                ({resolution.refundPercentage}% of disputed amount)
                              </p>
                            )}
                          </div>
                        )}

                        {resolution.additionalWorkRequired && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Additional Work Required</p>
                            <p className="text-sm text-gray-700">
                              {resolution.additionalWorkRequired}
                            </p>
                          </div>
                        )}

                        {resolution.deadline && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Completion Deadline</p>
                            <p className="text-sm text-gray-700">
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
                            <p className="text-sm text-gray-700">
                              {resolution.customTerms}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {status === 'deliberation' && (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={onAcceptResolution}
                          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <ThumbsUp className="w-5 h-5" />
                          Accept Resolution
                        </button>
                        <button
                          onClick={onRejectResolution}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <ThumbsDown className="w-5 h-5" />
                          Reject & Escalate
                        </button>
                      </div>
                    )}

                    {status === 'resolved' && (
                      <div className="bg-green-100 rounded-xl p-4 text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-green-900">Resolution Accepted</p>
                        <p className="text-sm text-green-700 mt-1">
                          Escrow funds will be distributed according to the resolution terms
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Scale className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">No resolution proposed yet</p>
                    <p className="text-sm text-gray-500">
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

        {/* Footer Actions */}
        {status !== 'resolved' && status !== 'escalated' && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowEscalateModal(true)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Escalate to Village Council
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Escalation Modal */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Escalate to Village Council
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This will involve senior elders. Please explain why escalation is necessary.
                  </p>
                </div>
              </div>

              <textarea
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Explain why you believe this case should be escalated..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                rows={4}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEscalateModal(false);
                    setEscalationReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEscalate}
                  disabled={!escalationReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
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