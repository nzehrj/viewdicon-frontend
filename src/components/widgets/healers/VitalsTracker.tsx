import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';

const VitalsTracker: React.FC = () => {
  const patients = [
    {
      id: 1,
      name: 'Adebayo Okonkwo',
      vitals: {
        bp: '120/80',
        pulse: 72,
        temp: 36.8,
        respRate: 16
      },
      status: 'normal',
      time: '10 mins ago'
    },
    {
      id: 2,
      name: 'Fatima Hassan',
      vitals: {
        bp: '145/95',
        pulse: 88,
        temp: 37.2,
        respRate: 20
      },
      status: 'elevated',
      time: '25 mins ago'
    },
    {
      id: 3,
      name: 'Chinedu Eze',
      vitals: {
        bp: '118/78',
        pulse: 68,
        temp: 36.5,
        respRate: 14
      },
      status: 'normal',
      time: '1 hour ago'
    },
  ];

  return (
    <WidgetContainer
      title="Patient Vitals"
      icon={Activity}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Record Vitals
        </button>
      }
    >
      <div className="space-y-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {patient.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {patient.time}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                patient.status === 'normal'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {patient.status === 'normal' ? 'Normal' : 'Elevated'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">BP</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {patient.vitals.bp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pulse</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {patient.vitals.pulse} bpm
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Temp</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {patient.vitals.temp}°C
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Wind className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Resp</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {patient.vitals.respRate}/min
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
};

export default VitalsTracker;