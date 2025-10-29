import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  required?: boolean;
  theme?: 'light' | 'dark';
  maxDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
  theme = 'light',
  maxDate = new Date(),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Check if date is in the future
    if (newDate > maxDate) return;
    
    setSelectedDate(newDate);
    onChange(newDate.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    // Don't allow going to future months beyond maxDate
    if (nextMonth <= maxDate) {
      setCurrentMonth(nextMonth);
    }
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const today = new Date();
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }

    // Add days of the month
    for (let day = 1; day <= days; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && 
        date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      const isFuture = date > maxDate;
      const isDisabled = isFuture;

      calendarDays.push(
        <motion.button
          key={day}
          type="button"
          onClick={() => !isDisabled && handleDateSelect(day)}
          disabled={isDisabled}
          whileHover={!isDisabled ? { scale: 1.05 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          className={`
            aspect-square rounded-lg text-sm sm:text-base font-medium transition-all
            min-h-[44px] sm:min-h-[48px]
            flex items-center justify-center
            ${isDisabled 
              ? theme === 'dark'
                ? 'text-gray-700 cursor-not-allowed opacity-40'
                : 'text-gray-300 cursor-not-allowed opacity-40'
              : isSelected
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg scale-105'
              : isToday
              ? theme === 'dark'
                ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50'
                : 'bg-amber-100 text-amber-700 border-2 border-amber-300'
              : theme === 'dark'
              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
              : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
            }
          `}
        >
          {day}
        </motion.button>
      );
    }

    return calendarDays;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const canGoNext = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) <= maxDate;

  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      <label className={`block text-sm font-medium mb-2 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-full px-4 py-3 sm:py-4 rounded-xl border-2 transition-all cursor-pointer
          min-h-[52px] sm:min-h-[56px]
          ${isOpen
            ? 'border-amber-500 ring-2 ring-amber-500/20'
            : theme === 'dark'
            ? 'border-gray-700 hover:border-gray-600'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}
        `}
      >
        <div className="flex items-center">
          <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={`flex-1 text-sm sm:text-base ${
            selectedDate
              ? theme === 'dark' ? 'text-white' : 'text-gray-900'
              : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {selectedDate ? formatDate(selectedDate) : 'Select your birth date'}
          </span>
          {selectedDate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(null);
                onChange('');
              }}
              className={`ml-2 p-1.5 sm:p-2 rounded-full transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute top-full left-0 right-0 mt-2 p-4 sm:p-6 rounded-2xl shadow-2xl z-50
              ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
              }
            `}
          >
            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className={`p-2 sm:p-2.5 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className={`font-bold text-base sm:text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                disabled={!canGoNext}
                className={`p-2 sm:p-2.5 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  canGoNext
                    ? theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                    : 'opacity-30 cursor-not-allowed text-gray-500'
                }`}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className={`text-center text-xs sm:text-sm font-semibold py-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {renderCalendar()}
            </div>

            {/* Today Button */}
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today);
                handleDateSelect(today.getDate());
              }}
              className={`
                w-full mt-4 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-medium transition-all
                min-h-[44px]
                ${theme === 'dark'
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }
              `}
            >
              Select Today
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helpful Text */}
      <p className={`text-xs mt-2 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      }`}>
        {isOpen ? 'Select a date from the calendar' : 'Click to open calendar'}
      </p>
    </div>
  );
};

export default DatePicker;