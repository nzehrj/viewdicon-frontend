import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { Video, Phone, Calendar, Play } from 'lucide-react';

const Telemedicine: React.FC = () => {
  const appointments = [
    { id: 1, patient: 'Nneka Okoro', time: '10:00 AM', type: 'video', duration: '30 min' },
    { id: 2, patient: 'Ibrahim Yusuf', time: '11:30 AM', type: 'phone', duration: '15 min' },
    { id: 3, patient: 'Grace Mensah', time: '02:00 PM', type: 'video', duration: '45 min' },
    { id: 4, patient: 'Kofi Asante', time: '03:30 PM', type: 'video', duration: '30 min' },
  ];

  return (
    <WidgetContainer
      title="Telemedicine Appointments"
      icon={Video}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Schedule Call
        </button>
      }
    >
      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-afro-green transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  appt.type === 'video' 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {appt.type === 'video' ? (
                    <Video className={`w-5 h-5 ${
                      appt.type === 'video' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                  ) : (
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {appt.patient}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{appt.time}</span>
                    </div>
                    <span>•</span>
                    <span>{appt.duration}</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm flex items-center gap-2">
                <Play className="w-4 h-4" />
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">Tip:</strong> Test your audio and video 5 minutes before each call.
        </p>
      </div>
    </WidgetContainer>
  );
};

export default Telemedicine;