import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { Users, Clock, AlertCircle } from 'lucide-react';

const PatientQueue: React.FC = () => {
  const patients = [
    { id: 1, name: 'Adebayo Okonkwo', time: '09:00 AM', status: 'waiting', priority: 'normal' },
    { id: 2, name: 'Fatima Hassan', time: '09:15 AM', status: 'waiting', priority: 'urgent' },
    { id: 3, name: 'Chinedu Eze', time: '09:30 AM', status: 'in-progress', priority: 'normal' },
    { id: 4, name: 'Amina Musa', time: '09:45 AM', status: 'waiting', priority: 'normal' },
    { id: 5, name: 'Kwame Mensah', time: '10:00 AM', status: 'waiting', priority: 'normal' },
  ];

  return (
    <WidgetContainer
      title="Patient Queue"
      icon={Users}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Add Patient
        </button>
      }
    >
      <div className="space-y-3">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-afro-green to-afro-green/70 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {patient.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{patient.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {patient.priority === 'urgent' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'waiting'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}
                >
                  {patient.status === 'waiting' ? 'Waiting' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>5 patients</strong> in queue • Average wait time: <strong>15 mins</strong>
        </p>
      </div>
    </WidgetContainer>
  );
};

export default PatientQueue;