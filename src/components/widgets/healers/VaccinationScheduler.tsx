import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { Syringe, Calendar, CheckCircle, Clock } from 'lucide-react';

const VaccinationScheduler: React.FC = () => {
  const vaccinations = [
    { 
      id: 1, 
      patient: 'Baby Chiamaka Eze', 
      vaccine: 'BCG', 
      date: '2025-10-25', 
      status: 'scheduled',
      age: '2 weeks'
    },
    { 
      id: 2, 
      patient: 'Aisha Mohammed', 
      vaccine: 'Polio (OPV)', 
      date: '2025-10-23', 
      status: 'completed',
      age: '6 weeks'
    },
    { 
      id: 3, 
      patient: 'Kwame Osei', 
      vaccine: 'DPT + Hep B', 
      date: '2025-10-26', 
      status: 'scheduled',
      age: '10 weeks'
    },
    { 
      id: 4, 
      patient: 'Zainab Hassan', 
      vaccine: 'Measles', 
      date: '2025-10-28', 
      status: 'scheduled',
      age: '9 months'
    },
  ];

  return (
    <WidgetContainer
      title="Vaccination Scheduler"
      icon={Syringe}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Add Schedule
        </button>
      }
    >
      <div className="space-y-3">
        {vaccinations.map((vax) => (
          <div
            key={vax.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {vax.patient}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({vax.age})
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {vax.vaccine}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(vax.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
              </div>
              <div>
                {vax.status === 'completed' ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Done</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">12</p>
          <p className="text-xs text-green-600 dark:text-green-500">Completed</p>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">3</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-500">Upcoming</p>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default VaccinationScheduler;