import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertCircle,
  FileText,
  RefreshCw,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Upload,
  Mic,
  Image as ImageIcon
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface Appeal {
  id: string;
  type: 'dispute' | 'shield_appeal' | 'crest_review' | 'role_switch' | 'safety_request';
  title: string;
  description: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  responseAt?: Date;
  councilResponse?: string;
}

type AppealType = 'dispute' | 'shield_appeal' | 'crest_review' | 'role_switch' | 'safety_request';

/**
 * COUNCIL APPEALS COMPONENT
 * 
 * Interface for users to interact with village councils:
 * - Dispute resolution (payment, quality, harassment)
 * - Shield appeals (Amber/Red → Green)
 * - Crest review requests
 * - Role switch requests (change village/role)
 * - Safety requests (Warrior escort, Safe House)
 * 
 * Location: src/components/circle/CouncilAppeals.tsx
 */
export const CouncilAppeals: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const userVillage = useAppSelector((state) => state.user.village);
  
  const [showNewAppeal, setShowNewAppeal] = useState(false);
  const [selectedType, setSelectedType] = useState<AppealType>('dispute');
  const [appealTitle, setAppealTitle] = useState('');
  const [appealDescription, setAppealDescription] = useState('');
  
  // Mock appeals data - TODO: Replace with API call
  const [appeals, setAppeals] = useState<Appeal[]>([
    {
      id: '1',
      type: 'dispute',
      title: 'Payment Issue - Job #4523',
      description: 'Client refuses to release escrow after completing solar installation. All proof submitted.',
      status: 'under_review',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'shield_appeal',
      title: 'Shield Status Appeal - False Amber',
      description: 'Shield turned Amber after client disputed completed work. I have full proof of completion.',
      status: 'approved',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      responseAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      councilResponse: 'Appeal approved. Proof verified. Shield restored to Green. Client given warning.',
    },
  ]);
  
  const appealTypes: Array<{
    id: AppealType;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }> = [
    {
      id: 'dispute',
      label: 'Dispute Resolution',
      description: 'Payment disputes, quality issues, contract disagreements',
      icon: AlertCircle,
      color: '#ef4444',
    },
    {
      id: 'shield_appeal',
      label: 'Shield Appeal',
      description: 'Appeal Amber or Red shield status',
      icon: Shield,
      color: '#f59e0b',
    },
    {
      id: 'crest_review',
      label: 'Crest Review',
      description: 'Request trust level upgrade review',
      icon: FileText,
      color: '#10b981',
    },
    {
      id: 'role_switch',
      label: 'Role Switch',
      description: 'Request to change village or role',
      icon: RefreshCw,
      color: '#3b82f6',
    },
    {
      id: 'safety_request',
      label: 'Safety Request',
      description: 'Warrior escort, Safe House, emergency protection',
      icon: User,
      color: '#8b5cf6',
    },
  ];
  
  const getStatusColor = (status: Appeal['status']) => {
    switch (status) {
      case 'pending': return '#6b7280';
      case 'under_review': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
    }
  };
  
  const getStatusLabel = (status: Appeal['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
    }
  };
  
  const getStatusIcon = (status: Appeal['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'under_review': return AlertCircle;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  
  const handleSubmitAppeal = () => {
    if (!appealTitle.trim() || !appealDescription.trim()) return;
    
    const newAppeal: Appeal = {
      id: Date.now().toString(),
      type: selectedType,
      title: appealTitle,
      description: appealDescription,
      status: 'pending',
      submittedAt: new Date(),
    };
    
    setAppeals([newAppeal, ...appeals]);
    setAppealTitle('');
    setAppealDescription('');
    setShowNewAppeal(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Council & Appeals
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Request help from {userVillage?.villageName || 'Village'} Council
          </p>
        </div>
        
        <button
          onClick={() => setShowNewAppeal(!showNewAppeal)}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium flex items-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4" />
          New Appeal
        </button>
      </div>
      
      {/* New Appeal Form */}
      {showNewAppeal && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`p-6 rounded-xl border-2 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Submit New Appeal
          </h3>
          
          {/* Appeal Type Selector */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Appeal Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {appealTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-3 rounded-lg text-left transition-all border-2 ${
                      isSelected
                        ? 'border-current'
                        : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={isSelected ? { borderColor: type.color } : {}}
                  >
                    <div className="flex items-start gap-2">
                      <Icon 
                        className="w-5 h-5 flex-shrink-0" 
                        style={{ color: type.color }}
                      />
                      <div>
                        <p className={`font-semibold text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {type.label}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Title Input */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Title
            </label>
            <input
              type="text"
              value={appealTitle}
              onChange={(e) => setAppealTitle(e.target.value)}
              placeholder="Brief summary of your appeal..."
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          
          {/* Description Textarea */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Detailed Explanation
            </label>
            <textarea
              value={appealDescription}
              onChange={(e) => setAppealDescription(e.target.value)}
              placeholder="Provide full details, evidence, and context..."
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border resize-none ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          
          {/* Attachments */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Supporting Evidence
            </label>
            <div className="flex items-center gap-2">
              <button className={`flex-1 p-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
              } transition-colors`}>
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Files</span>
              </button>
              <button className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}>
                <ImageIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
              <button className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}>
                <Mic className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmitAppeal}
              disabled={!appealTitle.trim() || !appealDescription.trim()}
              className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Appeal
            </button>
            <button
              onClick={() => setShowNewAppeal(false)}
              className={`px-4 py-2 rounded-lg font-medium ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Appeals List */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Your Appeals
        </h3>
        
        {appeals.map((appeal) => {
          const StatusIcon = getStatusIcon(appeal.status);
          const typeData = appealTypes.find(t => t.id === appeal.type);
          const TypeIcon = typeData?.icon || FileText;
          
          return (
            <motion.div
              key={appeal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${typeData?.color || '#6b7280'}20` }}
                  >
                    <TypeIcon className="w-5 h-5" style={{ color: typeData?.color }} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-base mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {appeal.title}
                    </h4>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {typeData?.label} • {formatDate(appeal.submittedAt)}
                    </p>
                  </div>
                </div>
                
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${getStatusColor(appeal.status)}20`,
                    color: getStatusColor(appeal.status)
                  }}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {getStatusLabel(appeal.status)}
                </div>
              </div>
              
              {/* Description */}
              <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {appeal.description}
              </p>
              
              {/* Council Response */}
              {appeal.councilResponse && (
                <div className={`p-3 rounded-lg border-l-4 ${
                  theme === 'dark' ? 'bg-gray-900 border-green-500' : 'bg-green-50 border-green-500'
                }`}>
                  <p className={`text-xs font-semibold mb-1 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  }`}>
                    Council Response • {appeal.responseAt && formatDate(appeal.responseAt)}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {appeal.councilResponse}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {appeals.length === 0 && (
        <div className={`p-12 text-center rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <FileText className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-lg font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No appeals yet
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            You can submit appeals for disputes, shield status, or other issues
          </p>
        </div>
      )}
    </div>
  );
};

export default CouncilAppeals;