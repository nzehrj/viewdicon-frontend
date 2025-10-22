import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';

interface ToolCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  color: string;
  onClick: () => void;
  isActive?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({
  icon: Icon,
  name,
  description,
  color,
  onClick,
  isActive = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-2xl text-left transition-all w-full ${
        isActive
          ? `border-2 ${
              theme === 'dark'
                ? 'bg-gray-700 border-green-500'
                : 'bg-green-50 border-green-500'
            }`
          : `border-2 ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
            }`
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {name}
          </h3>
          <p className={`text-sm line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 pt-4 border-t border-green-500/20">
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            Active Tool
          </span>
        </div>
      )}
    </motion.button>
  );
};

export { ToolCard };
export default ToolCard;