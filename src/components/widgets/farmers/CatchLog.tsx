import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { Fish, Scale, TrendingUp } from 'lucide-react';

const CatchLog: React.FC = () => {
  const catches = [
    {
      id: 1,
      date: '2025-10-19',
      species: 'Tilapia',
      quantity: 45,
      weight: 67.5,
      location: 'Lagos Lagoon',
      time: 'Morning'
    },
    {
      id: 2,
      date: '2025-10-19',
      species: 'Catfish',
      quantity: 28,
      weight: 112.0,
      location: 'Lagos Lagoon',
      time: 'Afternoon'
    },
    {
      id: 3,
      date: '2025-10-18',
      species: 'Mackerel',
      quantity: 120,
      weight: 180.0,
      location: 'Atlantic Ocean',
      time: 'Morning'
    },
    {
      id: 4,
      date: '2025-10-18',
      species: 'Red Snapper',
      quantity: 35,
      weight: 87.5,
      location: 'Atlantic Ocean',
      time: 'Evening'
    },
  ];

  const totalToday = catches.filter(c => c.date === '2025-10-19')
    .reduce((sum, c) => sum + c.weight, 0);

  return (
    <WidgetContainer
      title="Catch Log"
      icon={Fish}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Log Catch
        </button>
      }
    >
      <div className="space-y-3">
        {catches.map((catchItem) => (
          <div
            key={catchItem.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Fish className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {catchItem.species}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {catchItem.location} • {catchItem.time}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(catchItem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {catchItem.quantity} fish
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {catchItem.weight} kg
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs text-blue-600 dark:text-blue-500">Today</p>
          </div>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
            {totalToday.toFixed(1)} kg
          </p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-green-600 dark:text-green-500 mb-1">This Week</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-400">892 kg</p>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default CatchLog;