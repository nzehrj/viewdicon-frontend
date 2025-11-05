import React from 'react';
import { motion } from 'framer-motion';
import { Grid, ChevronRight } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import * as Icons from 'lucide-react';

interface Tool {
  toolId: string;
  toolName: string;
  description: string;
  icon?: string;
  category?: string;
}

interface ToolsSectionProps {
  tools: Tool[];
  villageColor: string;
  onToolClick?: (toolId: string) => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({ tools, villageColor, onToolClick }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Grid;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Grid;
  };

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
            <div 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
            >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
                <h2 className={`text-base sm:text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                My Tools
                </h2>
                <p className={`text-xs sm:text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {tools.length} tools available
                </p>
            </div>
            </div>
            
            <button 
            className={`text-xs sm:text-sm font-semibold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            } hover:underline`}
            >
            View All
            </button>
        </div>

        {/* Tools Grid - Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {tools.slice(0, 8).map((tool) => {
            const ToolIcon = resolveIcon(tool.icon);
            
            return (
                <motion.button
                key={tool.toolId}
                onClick={() => onToolClick?.(tool.toolId)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all ${
                    theme === 'dark' 
                    ? 'bg-gray-900/50 hover:bg-gray-900' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                >
                <div 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3"
                    style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                >
                    <ToolIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className={`font-semibold text-xs sm:text-sm mb-1 line-clamp-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    {tool.toolName}
                </h4>
                <p className={`text-xs line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    {tool.description}
                </p>
                </motion.button>
            );
            })}
        </div>

        {/* View All Button */}
        {tools.length > 8 && (
            <button className={`
            w-full mt-3 sm:mt-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2
            transition-colors
            ${theme === 'dark'
                ? 'bg-gray-900/50 hover:bg-gray-900 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }
            `}>
            View All {tools.length} Tools
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
        )}
    </div>
  );
};

export default ToolsSection;