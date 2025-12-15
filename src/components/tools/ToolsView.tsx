import React from 'react';
import { motion } from 'framer-motion';
import { Grid } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import * as Icons from 'lucide-react';

interface Tool {
  toolId: string;
  toolName: string;
  description: string;
  icon?: string;
  category?: string;
}

interface ToolsViewProps {
  tools?: Tool[];
  roleName?: string;
  villageColor?: string;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  tools = [],
  roleName = 'User',
  villageColor = '#10b981'
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  // Helper function to resolve icon from string name
  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Grid;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Grid;
  };

  return (
    <motion.div 
      key="tools" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="space-y-6 p-4"
    >
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          My Tools
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {tools.length} tools available for {roleName}
        </p>
      </div>
      
      {/* Empty State */}
      {tools.length === 0 ? (
        <div className={`p-12 rounded-2xl text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Grid className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No Tools Available Yet
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete your profile verification to access your professional tools
          </p>
        </div>
      ) : (
        /* Tools Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const ToolIcon = resolveIcon(tool.icon);
            return (
              <motion.button 
                key={tool.toolId} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className={`p-6 rounded-xl text-left transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-750' 
                    : 'bg-white hover:shadow-lg'
                }`}
              >
                {/* Tool Icon */}
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" 
                  style={{ 
                    backgroundColor: `${villageColor}20`, 
                    color: villageColor 
                  }}
                >
                  <ToolIcon className="w-7 h-7" />
                </div>

                {/* Tool Name */}
                <h4 className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {tool.toolName}
                </h4>

                {/* Tool Description */}
                <p className={`text-sm line-clamp-2 mb-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {tool.description}
                </p>

                {/* Tool Category Badge */}
                {tool.category && (
                  <span 
                    className="inline-block px-2 py-1 text-xs rounded-full" 
                    style={{ 
                      backgroundColor: `${villageColor}15`, 
                      color: villageColor 
                    }}
                  >
                    {tool.category}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ToolsView;