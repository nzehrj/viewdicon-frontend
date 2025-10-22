import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { Search, Camera, FileText, MapPin } from 'lucide-react';

const SiteInspection: React.FC = () => {
  const inspections = [
    {
      id: 1,
      site: 'Residential Complex - VI',
      date: '2025-10-19',
      inspector: 'Engr. Chukwu Obi',
      status: 'passed',
      issues: 0,
      photos: 12
    },
    {
      id: 2,
      site: 'Commercial Plaza - Lekki',
      date: '2025-10-18',
      inspector: 'Engr. Amina Bello',
      status: 'issues-found',
      issues: 3,
      photos: 8
    },
    {
      id: 3,
      site: 'Bridge Construction - Ikoyi',
      date: '2025-10-17',
      inspector: 'Engr. Tunde Adeyemi',
      status: 'passed',
      issues: 0,
      photos: 15
    },
  ];

  return (
    <WidgetContainer
      title="Site Inspections"
      icon={Search}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          New Inspection
        </button>
      }
    >
      <div className="space-y-3">
        {inspections.map((inspection) => (
          <div
            key={inspection.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {inspection.site}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {inspection.inspector}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                inspection.status === 'passed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {inspection.status === 'passed' ? 'Passed' : `${inspection.issues} Issues`}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(inspection.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Photos</p>
                <div className="flex items-center gap-1">
                  <Camera className="w-3 h-3 text-gray-400" />
                  <p className="font-medium text-gray-900 dark:text-white">
                    {inspection.photos}
                  </p>
                </div>
              </div>
              <div>
                <button className="flex items-center gap-1 text-afro-green hover:text-afro-green/80">
                  <FileText className="w-3 h-3" />
                  <span className="font-medium">Report</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">12</p>
          <p className="text-xs text-green-600 dark:text-green-500">Passed</p>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">3</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-500">Issues Found</p>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default SiteInspection;