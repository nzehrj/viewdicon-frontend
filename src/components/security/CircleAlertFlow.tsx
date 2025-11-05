import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, X, Phone, Clock, Loader } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { CircleAlert, EmergencyContact } from '@/types/security.types';
import { Button } from '@components/common/Button';

interface CircleAlertFlowProps {
  alert: CircleAlert;
  contacts: EmergencyContact[];
  onSendAlert: () => void;
  onCancel: () => void;
}

export const CircleAlertFlow: React.FC<CircleAlertFlowProps> = ({
  alert,
  contacts,
  onSendAlert,
  onCancel,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await onSendAlert();
    setSending(false);
  };

  const getConfirmationStatus = (contactId: string) => {
    const confirmation = alert.confirmations.find(c => c.from_afro_id === contactId);
    if (!confirmation) return 'pending';
    return confirmation.confirmed ? 'confirmed' : 'denied';
  };

  const confirmedCount = alert.confirmations.filter(c => c.confirmed).length;
  const deniedCount = alert.confirmations.filter(c => !c.confirmed).length;
  const pendingCount = contacts.length - alert.confirmations.length;

  return (
    <div className={`rounded-2xl p-4 sm:p-6 ${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg sm:text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Calling Your Circle
          </h3>
          <p className={`text-xs sm:text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {alert.status === 'pending' 
              ? 'Waiting for responses...'
              : alert.status === 'confirmed'
              ? 'Your identity has been confirmed'
              : alert.status === 'denied'
              ? 'Verification failed - escalating to council'
              : 'Escalated to elders for review'
            }
          </p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className={`p-3 rounded-xl text-center ${
          theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
        }`}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className={`text-xl sm:text-2xl font-bold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {confirmedCount}
            </span>
          </div>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-green-400' : 'text-green-700'
          }`}>
            Confirmed
          </p>
        </div>

        <div className={`p-3 rounded-xl text-center ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className={`text-xl sm:text-2xl font-bold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {pendingCount}
            </span>
          </div>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Pending
          </p>
        </div>

        <div className={`p-3 rounded-xl text-center ${
          theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className={`text-xl sm:text-2xl font-bold ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>
              {deniedCount}
            </span>
          </div>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-red-400' : 'text-red-700'
          }`}>
            Denied
          </p>
        </div>
      </div>

      {/* Contact List */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <p className={`text-sm font-semibold ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Your Trusted Circle:
        </p>

        <AnimatePresence>
          {contacts.map((contact) => {
            const status = getConfirmationStatus(contact.afro_id);
            
            return (
              <motion.div
                key={contact.afro_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  status === 'confirmed'
                    ? 'border-green-500 bg-green-500/10'
                    : status === 'denied'
                    ? 'border-red-500 bg-red-500/10'
                    : theme === 'dark'
                    ? 'border-gray-700 bg-gray-800/50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {contact.display_name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm sm:text-base truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {contact.display_name}
                    </p>
                    <p className={`text-xs sm:text-sm truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {contact.relationship}
                    </p>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {status === 'confirmed' && (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {status === 'denied' && (
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {status === 'pending' && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <Clock className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Info Box */}
      <div className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 ${
        theme === 'dark' ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-start gap-2 sm:gap-3">
          <Phone className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <p className={`text-xs sm:text-sm ${
            theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
          }`}>
            We've sent SMS and app notifications to your trusted contacts. They'll be asked to confirm your identity.
          </p>
        </div>
      </div>

      {/* Actions */}
      {alert.status === 'pending' && (
        <div className="flex flex-col sm:flex-row gap-3">
          {alert.confirmations.length === 0 && (
            <>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                className="flex-1"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Send Alerts
                  </>
                )}
              </Button>
            </>
          )}

          {alert.confirmations.length > 0 && (
            <div className={`w-full text-center p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <Loader className={`w-6 h-6 mx-auto mb-2 animate-spin ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Waiting for responses...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CircleAlertFlow;