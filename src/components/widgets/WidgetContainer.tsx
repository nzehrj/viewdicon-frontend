import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WidgetContainerProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({
  title,
  icon: Icon,
  children,
  actions,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 bg-afro-green/10 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-afro-green" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default WidgetContainer;
