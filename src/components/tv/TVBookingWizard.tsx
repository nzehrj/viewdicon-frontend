// src/components/tv/TVBookingWizard.tsx
// TV Booking Wizard - Multi-Step Village Hour Booking

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, FileText, Coins, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface TVBookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  villageName: string;
  villageColor: string;
  price: number;
  availableSlots: Array<{ date: string; timeSlot: string }>;
  onSubmit?: (booking: BookingData) => void;
}

interface BookingData {
  date: string;
  timeSlot: string;
  programTitle: string;
  programDescription: string;
  paymentMethod: 'wallet' | 'escrow';
}

export const TVBookingWizard: React.FC<TVBookingWizardProps> = ({
  isOpen,
  onClose,
  villageName,
  villageColor,
  price,
  availableSlots,
  onSubmit,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const userBalance = 15000; // TODO: Get from Redux
  
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    paymentMethod: 'wallet',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: 'Date & Time', icon: Calendar },
    { number: 2, title: 'Program Details', icon: FileText },
    { number: 3, title: 'Payment', icon: Coins },
    { number: 4, title: 'Confirmation', icon: CheckCircle2 },
  ];

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!bookingData.date) newErrors.date = 'Please select a date';
      if (!bookingData.timeSlot) newErrors.timeSlot = 'Please select a time slot';
    }

    if (step === 2) {
      if (!bookingData.programTitle || bookingData.programTitle.length < 5) {
        newErrors.programTitle = 'Title must be at least 5 characters';
      }
      if (!bookingData.programDescription || bookingData.programDescription.length < 20) {
        newErrors.programDescription = 'Description must be at least 20 characters';
      }
      if (bookingData.programDescription && bookingData.programDescription.length > 500) {
        newErrors.programDescription = 'Description cannot exceed 500 characters';
      }
    }

    if (step === 3) {
      if (!bookingData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
      if (bookingData.paymentMethod === 'wallet' && userBalance < price) {
        newErrors.payment = 'Insufficient balance';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        onSubmit?.(bookingData as BookingData);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        className={`relative w-full max-w-2xl rounded-3xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl`}
      >
        {/* Header */}
        <div
          className="p-6 text-white"
          style={{ background: `linear-gradient(135deg, ${villageColor} 0%, ${villageColor}dd 100%)` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Book Village Hour</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90">{villageName} • {price.toLocaleString()} Cowries</p>
        </div>

        {/* Progress Steps */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = step === s.number;
            const isCompleted = step > s.number;

            return (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-400'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`text-xs font-semibold text-center hidden sm:block ${
                    isActive
                      ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        step > s.number ? 'bg-green-500' : 'bg-transparent'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Choose Date & Time
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={`${slot.date}-${slot.timeSlot}`}
                      onClick={() => setBookingData({ ...bookingData, date: slot.date, timeSlot: slot.timeSlot })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        bookingData.date === slot.date && bookingData.timeSlot === slot.timeSlot
                          ? 'border-purple-600 bg-purple-600/10'
                          : theme === 'dark'
                          ? 'border-gray-800 hover:border-gray-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {slot.timeSlot}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
              </motion.div>
            )}

            {/* Step 2: Program Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Program Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Program Title *
                    </label>
                    <input
                      type="text"
                      value={bookingData.programTitle || ''}
                      onChange={(e) => setBookingData({ ...bookingData, programTitle: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.programTitle
                          ? 'border-red-500'
                          : theme === 'dark'
                          ? 'border-gray-800 bg-gray-800 text-white'
                          : 'border-gray-200 bg-white'
                      }`}
                      placeholder="Enter program title"
                    />
                    {errors.programTitle && <p className="text-red-500 text-sm mt-1">{errors.programTitle}</p>}
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Description * ({bookingData.programDescription?.length || 0}/500)
                    </label>
                    <textarea
                      value={bookingData.programDescription || ''}
                      onChange={(e) => setBookingData({ ...bookingData, programDescription: e.target.value })}
                      rows={6}
                      maxLength={500}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.programDescription
                          ? 'border-red-500'
                          : theme === 'dark'
                          ? 'border-gray-800 bg-gray-800 text-white'
                          : 'border-gray-200 bg-white'
                      }`}
                      placeholder="Describe your program..."
                    />
                    {errors.programDescription && <p className="text-red-500 text-sm mt-1">{errors.programDescription}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Payment Method
                </h3>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setBookingData({ ...bookingData, paymentMethod: 'wallet' })}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between ${
                      bookingData.paymentMethod === 'wallet'
                        ? 'border-purple-600 bg-purple-600/10'
                        : theme === 'dark'
                        ? 'border-gray-800'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Coins className="w-6 h-6 text-yellow-500" />
                      <div className="text-left">
                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Cowrie Wallet
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Balance: {userBalance.toLocaleString()} ₵
                        </p>
                      </div>
                    </div>
                    {bookingData.paymentMethod === 'wallet' && <CheckCircle2 className="w-6 h-6 text-purple-600" />}
                  </button>
                </div>

                {/* Summary */}
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex justify-between mb-2">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Slot Price</span>
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {price.toLocaleString()} ₵
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">{price.toLocaleString()} ₵</span>
                  </div>
                </div>

                {errors.payment && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-500 text-sm">{errors.payment}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Booking Submitted!
                </h3>
                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your booking is pending Village Council approval
                </p>

                <div className={`p-6 rounded-xl text-left ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Booking Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Date & Time</span>
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {bookingData.date && new Date(bookingData.date).toLocaleDateString()} • {bookingData.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Program</span>
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {bookingData.programTitle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Amount Paid</span>
                      <span className="font-bold text-green-500">{price.toLocaleString()} ₵</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        {step < 4 && (
          <div className={`flex gap-3 p-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            {step > 1 && (
              <button
                onClick={handleBack}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {step === 3 ? 'Confirm Booking' : 'Continue'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TVBookingWizard;