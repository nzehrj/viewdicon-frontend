import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, UserPlus, Heart } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

export const FamilyTreeSection: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  // Mock data - TODO: Get from Redux/API
  const familyMembers = [
    { id: '1', name: 'Adebayo Johnson', relationship: 'Brother', avatar: '' },
    { id: '2', name: 'Chiamaka Okonkwo', relationship: 'Close Friend', avatar: '' },
    { id: '3', name: 'Oluwaseun Adeyemi', relationship: 'Cousin', avatar: '' },
  ];

  const totalMembers = 7;

  return (
    <div className={`rounded-2xl p-6 ${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Family Tree
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {totalMembers} family members
            </p>
          </div>
        </div>
        
        <button 
          className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          } hover:underline flex items-center gap-1`}
        >
          View Tree
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Family Members */}
      <div className="space-y-3 mb-4">
        {familyMembers.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ scale: 1.01 }}
            className={`p-3 rounded-xl cursor-pointer transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-900/50 hover:bg-gray-900' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {member.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {member.name}
                </p>
                <p className={`text-xs truncate ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {member.relationship}
                </p>
              </div>

              {/* Relationship Icon */}
              <Heart className={`w-4 h-4 ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              }`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Member Button */}
      <button className={`
        w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
        transition-colors
        ${theme === 'dark'
          ? 'bg-gray-900/50 hover:bg-gray-900 text-white border border-gray-700'
          : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
        }
      `}>
        <UserPlus className="w-4 h-4" />
        Add Family Member
      </button>
    </div>
  );
};

export default FamilyTreeSection;