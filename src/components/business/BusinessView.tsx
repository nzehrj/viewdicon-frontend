import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Shield, Activity, MessageSquare, X } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

// ✅ PHASE 6: Business Session Components
import BusinessSession from '@components/business/BusinessSession';
import EscrowManager from '@components/business/EscrowManager';
import DisputeResolution from '@components/business/DisputeResolution';
import SessionHistory from '@components/business/SessionHistory';
import BusinessLinkBadge from '@components/business/BusinessLinkBadge';
import PaymentReceipt from '@components/business/PaymentReceipt';
import { RatingReview } from '@components/business/RatingReview';
import WorkProofGallery from '@components/business/WorkProofGallery';
import { CAWSLawBanner } from '@components/business/CAWSLawBanner';
import { CallWitness } from '@components/business/CallWitness';
import { CircleMembershipOffer } from '@components/business/CircleMembershipOffer';

interface BusinessViewProps {
  villageName?: string;
  villageColor?: string;
}

type BusinessTab = 'sessions' | 'escrow' | 'history' | 'disputes';

export const BusinessView: React.FC<BusinessViewProps> = ({ 
  villageName = 'Village',
  villageColor = '#10b981'
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  
  const [activeBusinessTab, setActiveBusinessTab] = useState<BusinessTab>('sessions');
  const [showBusinessSession, setShowBusinessSession] = useState(false);
  const [showCircleOffer, setShowCircleOffer] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showWorkProof, setShowWorkProof] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<any>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const displayName = user?.full_name || user?.name || phoneNumber || 'User';

  // ✅ Business Tab Configuration
  const businessTabs = [
    { id: 'sessions' as BusinessTab, label: 'Sessions', icon: Briefcase },
    { id: 'escrow' as BusinessTab, label: 'Escrow', icon: Shield },
    { id: 'history' as BusinessTab, label: 'History', icon: Activity },
    { id: 'disputes' as BusinessTab, label: 'Disputes', icon: MessageSquare },
  ];

  // Event Handlers
  const handleCallWitness = (witnessData: any) => {
    console.log('Witness Alert:', witnessData);
    alert('Safety team alerted!');
  };

  const handleAcceptCircle = () => {
    console.log('Circle membership accepted');
    alert('Welcome to the Circle! You now have priority access.');
    setShowCircleOffer(false);
  };

  const handleSubmitRating = (ratingData: any) => {
    console.log('Rating submitted:', ratingData);
    alert('Thank you for your rating!');
    setShowRating(false);
  };

  const handleProofUpload = async (file: File, type: string, caption?: string) => {
    console.log('Uploading proof:', file.name, type, caption);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Proof uploaded successfully!');
  };

  const handleProofDelete = async (proofId: string) => {
    console.log('Deleting proof:', proofId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Proof deleted');
  };

  const handleCaptionUpdate = async (proofId: string, caption: string) => {
    console.log('Updating caption:', proofId, caption);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Caption updated');
  };

  const handleSessionComplete = () => {
    setCurrentProfessional({
      id: 'prof-123',
      name: 'John Doe',
      village: 'Construction Village',
      villageColor: '#10b981',
      crest: 4,
    });
    setShowCircleOffer(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header */}
      <div>
        <h2 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Business Sessions
        </h2>
        <p className={`text-xs sm:text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Manage your professional engagements
        </p>
      </div>

      {/* Business Tabs */}
      <div className={`flex gap-2 overflow-x-auto pb-2 ${ theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } border-b hide-scrollbar`}>
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
          }
          .hide-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}</style>
        
        {businessTabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveBusinessTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${
                activeBusinessTab === tab.id
                  ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Business Tab Content */}
      <AnimatePresence mode="wait">
        {/* SESSIONS TAB */}
        {activeBusinessTab === 'sessions' && (
          <motion.div 
            key="sessions" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            {showBusinessSession ? (
              <div className="space-y-4 sm:space-y-6">
                {/* 1. CAWS LAW BANNER */}
                <CAWSLawBanner 
                  sessionType="work"
                  isExpanded={false}
                />
                
                {/* 2. BUSINESS SESSION COMPONENT */}
                <BusinessSession 
                  professionalId="prof-123"
                  professionalName="John Doe"
                  professionalVillage={villageName}
                  professionalVillageColor={villageColor}
                  professionalCrest={8}
                  serviceType="Professional Service"
                  onClose={() => {
                    console.log('Closing BusinessSession');
                    setShowBusinessSession(false);
                  }}
                />
                
                {/* 4. BUSINESS LINK BADGE */}
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <h3 className={`text-sm font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Partnership Status
                  </h3>
                  <BusinessLinkBadge
                    otherParty={{
                      id: 'prof-123',
                      name: 'John Doe',
                      afroId: 'CONS-ELEC-001',
                      village: 'Construction Village',
                      crest: 8
                    }}
                    linkTier="trusted"
                    stats={{
                      totalSessions: 5,
                      completedSessions: 5,
                      totalValue: 125000,
                      averageRating: 4.8,
                      firstSessionDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                      lastSessionDate: new Date().toISOString(),
                      successRate: 100
                    }}
                    size="large"
                    showDetails={true}
                  />
                </div>
                
                {/* ACTION BUTTONS ROW */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* 3. CALL WITNESS BUTTON */}
                  <CallWitness
                    sessionId="sess-123"
                    location="Port Harcourt, Rivers State"
                    onCallWitness={handleCallWitness}
                  />
                  
                  {/* 7. VIEW WORK PROOF BUTTON */}
                  <button
                    onClick={() => setShowWorkProof(true)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Work Proof
                  </button>
                  
                  {/* COMPLETE SESSION BUTTON */}
                  <button
                    onClick={handleSessionComplete}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                      theme === 'dark'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    Complete
                  </button>
                  
                  {/* 6. LEAVE RATING BUTTON */}
                  <button
                    onClick={() => setShowRating(true)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                      theme === 'dark'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    Rate
                  </button>
                  
                  {/* 5. VIEW RECEIPT BUTTON */}
                  <button
                    onClick={() => setShowReceipt(true)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Receipt
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-6 rounded-xl border text-center ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <Briefcase className={`w-12 h-12 mx-auto mb-3 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-lg font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    No Active Sessions
                  </h3>
                  <p className={`text-sm mb-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Start a new business session with a professional
                  </p>
                  <button
                    onClick={() => setShowBusinessSession(true)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Start New Session
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {/* ESCROW TAB */}
        {activeBusinessTab === 'escrow' && (
          <motion.div key="escrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EscrowManager 
              escrowId="esc-456"
              amount={45000}
              currency="NGN"
              payerId={user?.id || 'user-123'}
              beneficiaryId="prof-123"
              payerName={displayName}
              beneficiaryName="John Doe"
              status="locked"
              createdAt={new Date().toISOString()}
              onFund={() => console.log('Fund escrow')}
              onRelease={() => console.log('Release escrow')}
              onRefund={() => console.log('Refund escrow')}
              onRaiseDispute={(reason, evidence) => console.log('Raise dispute', reason, evidence)}
            />
          </motion.div>
        )}
        
        {/* HISTORY TAB */}
        {activeBusinessTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SessionHistory 
              userId={user?.id || 'user-123'}
              transactions={[]}
              isLoading={false}
              onViewDetails={(sessionId) => console.log('View details', sessionId)}
              onDownloadReceipt={(receiptId) => console.log('Download receipt', receiptId)}
              onViewDispute={(sessionId) => console.log('View dispute', sessionId)}
            />
          </motion.div>
        )}
        
        {/* DISPUTES TAB */}
        {activeBusinessTab === 'disputes' && (
          <motion.div key="disputes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              <div className={`p-6 rounded-xl border text-center ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <MessageSquare className={`w-12 h-12 mx-auto mb-3 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Active Dispute
                </h3>
                <p className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  You have an ongoing dispute that needs resolution
                </p>
                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                >
                  View Dispute Details
                </button>
              </div>
            </div>

            {/* Dispute Resolution Modal */}
            {showDisputeModal && (
              <DisputeResolution 
                escrowId="esc-456"
                disputeId="disp-789"
                mootId="moot-101"
                sessionId="sess-202"
                amount={45000}
                raisedBy="payer"
                status="evidence_submission"
                parties={{
                  payer: { id: user?.id || 'user-123', name: displayName, crest: 7 },
                  beneficiary: { id: 'prof-123', name: 'John Doe', crest: 8 }
                }}
                mediator={{
                  id: 'med-303',
                  name: 'Elder Smith',
                  village: villageName,
                  crest: 10,
                  mootsResolved: 45
                }}
                evidence={[]}
                messages={[]}
                timeline={{
                  initiated: new Date().toISOString(),
                  mediatorAssigned: new Date().toISOString(),
                  evidenceDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                }}
                onFileUpload={async (file, description) => console.log('File upload', file, description)}
                onSendMessage={async (message, isPrivate) => console.log('Send message', message, isPrivate)}
                onAcceptResolution={async () => {
                  console.log('Accept resolution');
                  setShowDisputeModal(false);
                }}
                onRejectResolution={async () => {
                  console.log('Reject resolution');
                  setShowDisputeModal(false);
                }}
                onEscalate={async (reason) => {
                  console.log('Escalate', reason);
                  setShowDisputeModal(false);
                }}
                onClose={() => setShowDisputeModal(false)} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* MODALS */}
      
      {/* Circle Membership Offer Modal */}
      {currentProfessional && (
        <CircleMembershipOffer
          isOpen={showCircleOffer}
          onClose={() => setShowCircleOffer(false)}
          professionalId={currentProfessional.id}
          professionalName={currentProfessional.name}
          professionalVillage={currentProfessional.village}
          professionalVillageColor={currentProfessional.villageColor}
          professionalCrest={currentProfessional.crest}
          onAccept={handleAcceptCircle}
        />
      )}
      
      {/* Payment Receipt Modal */}
      {showReceipt && (
        <PaymentReceipt
          receiptId="REC-2024-001"
          sessionId="SESS-123"
          escrowId="ESC-456"
          date={new Date().toISOString()}
          payer={{
            name: displayName,
            afroId: user?.afro_id || 'AFR-000',
            village: villageName
          }}
          beneficiary={{
            name: 'John Doe',
            afroId: 'CONS-ELEC-001',
            village: 'Construction Village'
          }}
          service={{
            name: 'Electrical Installation',
            category: 'Construction Services'
          }}
          subtotal={45000}
          platformFee={2250}
          total={47250}
          paymentMethod="escrow"
          status="paid"
          completedAt={new Date().toISOString()}
          notes="Payment released after successful completion and client approval"
          onClose={() => setShowReceipt(false)}
        />
      )}
      
      {/* Rating & Review Modal */}
      {currentProfessional && (
        <RatingReview
          isOpen={showRating}
          onClose={() => setShowRating(false)}
          sessionId="SESS-123"
          ratingFor="professional"
          targetUserId={currentProfessional.id}
          targetUserName={currentProfessional.name}
          targetUserVillage={currentProfessional.village}
          targetUserVillageColor={currentProfessional.villageColor}
          serviceType="Electrical Installation"
          onSubmit={handleSubmitRating}
          onSkip={() => setShowRating(false)}
        />
      )}
      
      {/* Work Proof Gallery Modal */}
      {showWorkProof && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-auto relative">
            <WorkProofGallery
              sessionId="SESS-123"
              proofs={[
                {
                  id: 'proof-1',
                  type: 'before',
                  mediaType: 'image',
                  url: 'https://via.placeholder.com/400',
                  fileName: 'before-1.jpg',
                  fileSize: 1024000,
                  uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  uploadedBy: 'beneficiary',
                  caption: 'Initial state before work started',
                  order: 1
                },
                {
                  id: 'proof-2',
                  type: 'progress',
                  mediaType: 'image',
                  url: 'https://via.placeholder.com/400',
                  fileName: 'progress-1.jpg',
                  fileSize: 1024000,
                  uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                  uploadedBy: 'beneficiary',
                  caption: 'Work in progress - wiring completed',
                  order: 2
                },
                {
                  id: 'proof-3',
                  type: 'after',
                  mediaType: 'image',
                  url: 'https://via.placeholder.com/400',
                  fileName: 'after-1.jpg',
                  fileSize: 1024000,
                  uploadedAt: new Date().toISOString(),
                  uploadedBy: 'beneficiary',
                  caption: 'Final result - all installations complete',
                  order: 3
                }
              ]}
              canUpload={true}
              userRole="payer"
              sessionStatus="in_progress"
              onUpload={handleProofUpload}
              onDelete={handleProofDelete}
              onUpdateCaption={handleCaptionUpdate}
            />
            
            {/* Close Button */}
            <button
              onClick={() => setShowWorkProof(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessView;