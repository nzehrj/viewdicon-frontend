import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Grid, Shield } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import VillageSquare from '@components/circle/VillageSquare';
import MyCircle from '@components/circle/MyCircle';
import Rooms from '@components/circle/Rooms';
import CouncilAppeals from '@components/circle/CouncilAppeals';

type CircleSubType = 'square' | 'mycircle' | 'rooms' | 'council';

export const CircleHub: React.FC = () => {
  const [activeCircleSubType, setActiveCircleSubType] = useState<CircleSubType>('square');
  const theme = useAppSelector((state) => state.theme.theme);

  const circleSubTabs = [
    { id: 'square' as const, label: 'Village Square', icon: MessageSquare },
    { id: 'mycircle' as const, label: 'My Circle', icon: Users },
    { id: 'rooms' as const, label: 'Rooms', icon: Grid },
    { id: 'council' as const, label: 'Council', icon: Shield },
  ];

  return (
    <div>
      <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .hide-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
            overflow-y: hidden !important;
          }
        `}
      </style>
      {/* Sub-tabs inside Circle */}
      <div className={`flex gap-2 overflow-x-auto pb-2 mb-4 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } border-none hide-scrollbar`}>
        {circleSubTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCircleSubType === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCircleSubType(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium outline-none whitespace-nowrap flex items-center gap-2 transition-colors ${
                isActive
                  ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Circle Content */}
      <AnimatePresence mode="wait">
        {activeCircleSubType === 'square' && (
          <motion.div 
            key="square" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <VillageSquare />
          </motion.div>
        )}
        
        {activeCircleSubType === 'mycircle' && (
          <motion.div 
            key="mycircle" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <MyCircle />
          </motion.div>
        )}
        
        {activeCircleSubType === 'rooms' && (
          <motion.div 
            key="rooms" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <Rooms />
          </motion.div>
        )}
        
        {activeCircleSubType === 'council' && (
          <motion.div 
            key="council" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <CouncilAppeals />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CircleHub;