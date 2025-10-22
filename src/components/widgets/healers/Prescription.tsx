import React, { useState } from 'react';
import WidgetContainer from '../WidgetContainer';
import { Pill, Plus, Search, Eye } from 'lucide-react';

const Prescription: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const recentPrescriptions = [
    { 
      id: 1, 
      patient: 'Adebayo Okonkwo', 
      medication: 'Amoxicillin 500mg', 
      dosage: '3x daily',
      duration: '7 days',
      date: 'Today' 
    },
    { 
      id: 2, 
      patient: 'Fatima Hassan', 
      medication: 'Ibuprofen 400mg', 
      dosage: '2x daily',
      duration: '5 days',
      date: 'Yesterday' 
    },
    { 
      id: 3, 
      patient: 'Chinedu Eze', 
      medication: 'Paracetamol 1000mg', 
      dosage: 'As needed',
      duration: '10 days',
      date: '2 days ago' 
    },
    { 
      id: 4, 
      patient: 'Blessing Nwosu', 
      medication: 'Metformin 850mg', 
      dosage: '2x daily',
      duration: '30 days',
      date: '3 days ago' 
    },
  ];

  return (
    <WidgetContainer
      title="Prescriptions"
      icon={Pill}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Prescription
        </button>
      }
    >
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search medications or patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-afro-green focus:border-transparent"
          />
        </div>
      </div>

      {/* Recent Prescriptions */}
      <div className="space-y-3">
        {recentPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {rx.patient}
                </h4>
                <p className="text-sm font-semibold text-afro-green mb-1">
                  {rx.medication}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <span>{rx.dosage}</span>
                  <span>•</span>
                  <span>{rx.duration}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {rx.date}
                </p>
              </div>
              <button className="p-2 text-sm text-afro-green hover:bg-afro-green/10 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>4 prescriptions</strong> issued this week
        </p>
      </div>
    </WidgetContainer>
  );
};

export default Prescription;