import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { Beef, AlertCircle, CheckCircle } from 'lucide-react';

const HerdTracker: React.FC = () => {
  const livestock = [
    {
      id: 1,
      tagId: 'COW-001',
      type: 'Cattle',
      breed: 'Holstein',
      health: 'healthy',
      age: '3 years',
      weight: 450,
      lastCheckup: '2025-10-15'
    },
    {
      id: 2,
      tagId: 'COW-002',
      type: 'Cattle',
      breed: 'Jersey',
      health: 'needs_attention',
      age: '2 years',
      weight: 380,
      lastCheckup: '2025-10-10'
    },
    {
      id: 3,
      tagId: 'GOAT-015',
      type: 'Goat',
      breed: 'Boer',
      health: 'healthy',
      age: '1 year',
      weight: 45,
      lastCheckup: '2025-10-18'
    },
    {
      id: 4,
      tagId: 'SHEEP-008',
      type: 'Sheep',
      breed: 'Merino',
      health: 'healthy',
      age: '2 years',
      weight: 65,
      lastCheckup: '2025-10-17'
    },
  ];

  return (
    <WidgetContainer
      title="Herd Tracker"
      icon={Beef}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Add Livestock
        </button>
      }
    >
      <div className="space-y-3">
        {livestock.map((animal) => (
          <div
            key={animal.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Beef className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {animal.tagId}
                    </h4>
                    {animal.health === 'healthy' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {animal.breed} {animal.type}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                animal.health === 'healthy'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {animal.health === 'healthy' ? 'Healthy' : 'Needs Attention'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Age</p>
                <p className="font-semibold text-gray-900 dark:text-white">{animal.age}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Weight</p>
                <p className="font-semibold text-gray-900 dark:text-white">{animal.weight}kg</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Checkup</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(animal.lastCheckup).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">24</p>
          <p className="text-xs text-blue-600 dark:text-blue-500">Total</p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">22</p>
          <p className="text-xs text-green-600 dark:text-green-500">Healthy</p>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">2</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-500">Attention</p>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default HerdTracker;