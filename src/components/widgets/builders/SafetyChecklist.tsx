import React, { useState } from 'react';
import WidgetContainer from '../WidgetContainer';
import { CheckSquare, Square, AlertTriangle, Shield } from 'lucide-react';

const SafetyChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([1, 2, 5]);

  const safetyItems = [
    { id: 1, item: 'Hard hats available and worn', category: 'PPE' },
    { id: 2, item: 'Safety boots inspected', category: 'PPE' },
    { id: 3, item: 'Scaffolding secured', category: 'Equipment' },
    { id: 4, item: 'Fire extinguishers accessible', category: 'Emergency' },
    { id: 5, item: 'First aid kit stocked', category: 'Emergency' },
    { id: 6, item: 'Electrical tools grounded', category: 'Equipment' },
    { id: 7, item: 'Safety barriers in place', category: 'Site' },
    { id: 8, item: 'Emergency exits clear', category: 'Site' },
  ];

  const toggleItem = (id: number) => {
    setCheckedItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const completionRate = ((checkedItems.length / safetyItems.length) * 100).toFixed(0);

  return (
    <WidgetContainer
      title="Safety Checklist"
      icon={Shield}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Submit Report
        </button>
      }
    >
      {/* Progress */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Daily Safety Check
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {completionRate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-afro-green rounded-full h-2 transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {checkedItems.length} of {safetyItems.length} items completed
        </p>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {safetyItems.map((safety) => (
          <button
            key={safety.id}
            onClick={() => toggleItem(safety.id)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors text-left flex items-center gap-3"
          >
            {checkedItems.includes(safety.id) ? (
              <CheckSquare className="w-5 h-5 text-afro-green flex-shrink-0" />
            ) : (
              <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                checkedItems.includes(safety.id)
                  ? 'text-gray-500 dark:text-gray-400 line-through'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {safety.item}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {safety.category}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Warning */}
      {checkedItems.length < safetyItems.length && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            Complete all safety checks before starting work
          </p>
        </div>
      )}
    </WidgetContainer>
  );
};

export default SafetyChecklist;