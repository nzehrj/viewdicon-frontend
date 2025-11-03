import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  required?: boolean;
  theme?: 'light' | 'dark';
  maxDate?: Date;
}

type ViewMode = 'days' | 'months' | 'years';

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
  theme = 'light',
  maxDate = new Date(),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('days');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position based on available space
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Calendar needs about 450px height
      const requiredSpace = 450;
      
      // If not enough space below but more space above, show on top
      if (spaceBelow < requiredSpace && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen, viewMode]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('days'); // Reset to days view when closing
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
    setViewMode('days');
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setViewMode('days');
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setViewMode('months');
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    if (nextMonth <= maxDate) {
      setCurrentMonth(nextMonth);
    }
  };

  const goToPreviousYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
  };

  const goToNextYear = () => {
    const nextYear = new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1);
    if (nextYear <= maxDate) {
      setCurrentMonth(nextYear);
    }
  };

  const renderDaysCalendar = () => {
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
            aspect-square rounded-lg font-semibold transition-all
            min-h-[48px] text-base sm:text-lg
            flex items-center justify-center
            ${isDisabled 
              ? theme === 'dark'
                ? 'text-gray-700 cursor-not-allowed opacity-40'
                : 'text-gray-300 cursor-not-allowed opacity-40'
              : isSelected
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl scale-105'
              : isToday
              ? theme === 'dark'
                ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50 font-bold'
                : 'bg-amber-100 text-amber-700 border-2 border-amber-300 font-bold'
              : theme === 'dark'
              ? 'text-gray-300 hover:bg-gray-700 hover:text-white active:bg-gray-600'
              : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700 active:bg-amber-100'
            }
          `}
        >
          {day}
        </motion.button>
      );
    }

    return calendarDays;
  };

  const renderMonthsSelector = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((month, index) => {
      const isCurrentMonth = currentMonth.getMonth() === index;
      const monthDate = new Date(currentMonth.getFullYear(), index, 1);
      const isDisabled = monthDate > maxDate;

      return (
        <motion.button
          key={month}
          type="button"
          onClick={() => !isDisabled && handleMonthSelect(index)}
          disabled={isDisabled}
          whileHover={!isDisabled ? { scale: 1.05 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          className={`
            p-4 rounded-xl font-semibold transition-all text-base
            ${isDisabled
              ? 'opacity-40 cursor-not-allowed text-gray-400'
              : isCurrentMonth
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'
              : theme === 'dark'
              ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
              : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-700 active:bg-amber-100'
            }
          `}
        >
          {month.substring(0, 3)}
        </motion.button>
      );
    });
  };

  const renderYearsSelector = () => {
    const currentYear = currentMonth.getFullYear();
    const maxYear = maxDate.getFullYear();
    const years = [];
    
    // Show 100 years back from max year
    const startYear = maxYear - 99;
    
    for (let year = maxYear; year >= startYear; year--) {
      const isCurrentYear = currentYear === year;
      
      years.push(
        <motion.button
          key={year}
          type="button"
          onClick={() => handleYearSelect(year)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            p-4 rounded-xl font-semibold transition-all text-base
            ${isCurrentYear
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'
              : theme === 'dark'
              ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
              : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-700 active:bg-amber-100'
            }
          `}
        >
          {year}
        </motion.button>
      );
    }

    return years;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const canGoNext = viewMode === 'days' 
    ? new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) <= maxDate
    : new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1) <= maxDate;

  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      <label className={`block text-sm sm:text-base font-medium mb-2 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-full px-4 py-4 sm:py-4 rounded-xl border-2 transition-all cursor-pointer
          min-h-[56px] touch-manipulation
          ${isOpen
            ? 'border-amber-500 ring-4 ring-amber-500/20'
            : theme === 'dark'
            ? 'border-gray-700 hover:border-gray-600 active:border-amber-500'
            : 'border-gray-300 hover:border-gray-400 active:border-amber-500'
          }
          ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}
        `}
      >
        <div className="flex items-center">
          <Calendar className={`w-6 h-6 mr-3 flex-shrink-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={`flex-1 text-base sm:text-lg ${
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
              className={`ml-2 p-2 rounded-full transition-colors touch-manipulation ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 active:bg-gray-600 text-gray-400'
                  : 'hover:bg-gray-100 active:bg-gray-200 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === 'bottom' ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropdownPosition === 'bottom' ? -10 : 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute left-0 right-0 p-4 sm:p-6 rounded-2xl shadow-2xl z-50
              max-h-[300px] overflow-y-auto overflow-x-hidden
              ${dropdownPosition === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}
              ${theme === 'dark'
                ? 'bg-gray-800 border-2 border-gray-700'
                : 'bg-white border-2 border-gray-200'
              }
              scrollbar-thin
              ${theme === 'dark' 
                ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800' 
                : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
              }
            `}
            style={{
              // Smooth scrolling for mobile
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
            }}
          >
            {/* Header with Month/Year Selection */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={viewMode === 'days' ? goToPreviousMonth : goToPreviousYear}
                className={`p-3 rounded-lg transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 active:bg-gray-600 text-gray-300'
                    : 'hover:bg-gray-100 active:bg-gray-200 text-gray-600'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center gap-1">
                {/* Month Selector Button */}
                {viewMode === 'days' && (
                  <button
                    type="button"
                    onClick={() => setViewMode('months')}
                    className={`px-4 py-2 rounded-lg font-bold text-base sm:text-lg transition-colors flex items-center gap-2 touch-manipulation ${
                      theme === 'dark'
                        ? 'text-white hover:bg-gray-700 active:bg-gray-600'
                        : 'text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                    }`}
                  >
                    {monthNames[currentMonth.getMonth()]}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                
                {/* Year Selector Button */}
                <button
                  type="button"
                  onClick={() => setViewMode('years')}
                  className={`px-4 py-2 rounded-lg font-bold text-base sm:text-lg transition-colors flex items-center gap-2 touch-manipulation ${
                    theme === 'dark'
                      ? 'text-white hover:bg-gray-700 active:bg-gray-600'
                      : 'text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                >
                  {currentMonth.getFullYear()}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* View Mode Indicator */}
                {viewMode !== 'days' && (
                  <p className="text-xs text-gray-500">
                    {viewMode === 'months' ? 'Select Month' : 'Select Year'}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={viewMode === 'days' ? goToNextMonth : goToNextYear}
                disabled={!canGoNext}
                className={`p-3 rounded-lg transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation ${
                  canGoNext
                    ? theme === 'dark'
                      ? 'hover:bg-gray-700 active:bg-gray-600 text-gray-300'
                      : 'hover:bg-gray-100 active:bg-gray-200 text-gray-600'
                    : 'opacity-30 cursor-not-allowed text-gray-500'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Days View */}
            {viewMode === 'days' && (
              <>
                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className={`text-center text-xs sm:text-sm font-bold py-2 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
                  {renderDaysCalendar()}
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
                    w-full py-4 rounded-xl font-semibold transition-all text-base
                    min-h-[52px] touch-manipulation
                    ${theme === 'dark'
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 active:bg-amber-500/40'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 active:bg-amber-200'
                    }
                  `}
                >
                  Select Today
                </button>
              </>
            )}

            {/* Months View */}
            {viewMode === 'months' && (
              <div className="grid grid-cols-3 gap-3">
                {renderMonthsSelector()}
              </div>
            )}

            {/* Years View */}
            {viewMode === 'years' && (
              <div className="grid grid-cols-3 gap-3">
                {renderYearsSelector()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helpful Text */}
      <p className={`text-xs sm:text-sm mt-2 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
      }`}>
        {isOpen 
          ? viewMode === 'days' 
            ? 'Tap date or use month/year selectors above' 
            : viewMode === 'months'
            ? 'Select a month'
            : 'Select a year'
          : 'Tap to open calendar'
        }
      </p>
    </div>
  );
};

export default DatePicker;