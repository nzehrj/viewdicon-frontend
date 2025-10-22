import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { Calendar, Sprout, CheckCircle, Clock } from 'lucide-react';

const CropCalendar: React.FC = () => {
  const crops = [
    {
      id: 1,
      name: 'Tomatoes',
      planted: '2025-09-15',
      harvest: '2025-12-15',
      status: 'growing',
      progress: 65,
      daysLeft: 57
    },
    {
      id: 2,
      name: 'Maize',
      planted: '2025-08-01',
      harvest: '2025-11-01',
      status: 'ready',
      progress: 100,
      daysLeft: 0
    },
    {
      id: 3,
      name: 'Cassava',
      planted: '2025-07-10',
      harvest: '2026-01-10',
      status: 'growing',
      progress: 45,
      daysLeft: 83
    },
    {
      id: 4,
      name: 'Yam',
      planted: '2025-06-20',
      harvest: '2025-12-20',
      status: 'growing',
      progress: 70,
      daysLeft: 62
    },
  ];

  return (
    <WidgetContainer
      title="Crop Calendar"
      icon={Calendar}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Add Crop
        </button>
      }
    >
      <div className="space-y-4">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {crop.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Planted: {new Date(crop.planted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              {crop.status === 'ready' ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {crop.daysLeft} days
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span className="font-medium">{crop.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-afro-green rounded-full h-2 transition-all"
                  style={{ width: `${crop.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Expected harvest: {new Date(crop.harvest).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
};

export default CropCalendar;