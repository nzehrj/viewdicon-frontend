// src/components/tv/VillageHourSlot.tsx
// Village Hour - Daily 17:00-19:00 Village Programming

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Coins, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface VillageHourSlot {
  date: string;
  timeSlot: string; // "17:00-18:00" or "18:00-19:00"
  isBooked: boolean;
  bookedBy?: {
    name: string;
    programTitle: string;
  };
  price: number;
  isAvailable: boolean;
}

interface VillageHourSlotProps {
  villageName: string;
  villageColor: string;
  slots: VillageHourSlot[];
  onBookSlot?: (date: string, timeSlot: string) => void;
}

export const VillageHourSlot: React.FC<VillageHourSlotProps> = ({
  villageName,
  villageColor,
  slots,
  onBookSlot,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [selectedDate, setSelectedDate] = useState<string>(slots[0]?.date || '');

  const todaySlots = slots.filter(slot => slot.date === selectedDate);
  const dates = [...new Set(slots.map(slot => slot.date))];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div 
        className="p-6 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${villageColor} 0%, ${villageColor}dd 100%)` }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wider">Daily Programming</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {villageName} Village Hour
          </h2>
          <p className="text-white/90 text-sm">
            Secure your daily broadcast slot • 17:00 - 19:00 WAT
          </p>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
          <Clock className="w-full h-full" />
        </div>
      </div>

      {/* Date Selector */}
      <div className={`p-4 border-b ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => {
            const isToday = date === new Date().toISOString().split('T')[0];
            const isSelected = date === selectedDate;
            
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <div>{formatDate(date)}</div>
                    {isToday && (
                      <div className="text-xs opacity-80">Today</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="p-6 space-y-4">
        {todaySlots.map((slot, index) => (
          <motion.div
            key={slot.timeSlot}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border-2 transition-all ${
              slot.isBooked
                ? theme === 'dark'
                  ? 'border-gray-800 bg-gray-800/30'
                  : 'border-gray-200 bg-gray-50'
                : slot.isAvailable
                ? 'border-purple-600/30 bg-purple-600/5 hover:border-purple-600 cursor-pointer'
                : theme === 'dark'
                ? 'border-gray-800 bg-gray-800/10'
                : 'border-gray-200 bg-gray-50'
            }`}
            onClick={() => {
              if (slot.isAvailable && !slot.isBooked) {
                onBookSlot?.(slot.date, slot.timeSlot);
              }
            }}
          >
            <div className="flex items-start justify-between mb-3">
              {/* Time */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: slot.isBooked 
                      ? theme === 'dark' ? '#374151' : '#f3f4f6'
                      : `${villageColor}20`,
                    color: slot.isBooked
                      ? theme === 'dark' ? '#9ca3af' : '#6b7280'
                      : villageColor,
                  }}
                >
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {slot.timeSlot}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    1 hour slot
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {slot.isBooked ? (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Booked</span>
                  </div>
                ) : slot.isAvailable ? (
                  <div className="flex items-center gap-1.5 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-orange-500">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Pending</span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Info */}
            {slot.isBooked && slot.bookedBy && (
              <div className={`p-3 rounded-lg mb-3 ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
              }`}>
                <p className={`text-sm font-semibold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {slot.bookedBy.programTitle}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  by {slot.bookedBy.name}
                </p>
              </div>
            )}

            {/* Price & CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className={`w-5 h-5 ${
                  slot.isBooked 
                    ? theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    : 'text-yellow-500'
                }`} />
                <span className={`text-lg font-bold ${
                  slot.isBooked
                    ? theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    : theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {slot.price.toLocaleString()} Cowries
                </span>
              </div>

              {slot.isAvailable && !slot.isBooked && (
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-sm transition-all"
                >
                  Book Now
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Footer */}
      <div className={`p-4 border-t ${
        theme === 'dark' ? 'border-gray-800 bg-gray-800/30' : 'border-gray-200 bg-gray-50'
      }`}>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          💡 <span className="font-semibold">Note:</span> All bookings require Village Council approval. 
          Payment is held in escrow until broadcast completion.
        </p>
      </div>
    </div>
  );
};

export default VillageHourSlot;