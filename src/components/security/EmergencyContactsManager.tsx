import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, X, Check, Edit2 } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { EmergencyContact } from '@/types/security.types';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';

interface EmergencyContactsManagerProps {
  contacts: EmergencyContact[];
  maxContacts?: number;
  onAdd: (contact: Omit<EmergencyContact, 'afro_id'>) => void;
  onRemove: (afroId: string) => void;
  onUpdate: (afroId: string, contact: Omit<EmergencyContact, 'afro_id'>) => void;
}

export const EmergencyContactsManager: React.FC<EmergencyContactsManagerProps> = ({
  contacts,
  maxContacts = 5,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    display_name: '',
    relationship: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Name is required';
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd(formData);
    }

    setFormData({ display_name: '', relationship: '', phone: '' });
    setShowAddForm(false);
    setErrors({});
  };

  const handleEdit = (contact: EmergencyContact) => {
    setFormData({
      display_name: contact.display_name,
      relationship: contact.relationship,
      phone: contact.phone,
    });
    setEditingId(contact.afro_id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData({ display_name: '', relationship: '', phone: '' });
    setShowAddForm(false);
    setEditingId(null);
    setErrors({});
  };

  const canAddMore = contacts.length < maxContacts;

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${
      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className={`text-base sm:text-lg font-bold truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Inner Fire Circle
            </h3>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {contacts.length}/{maxContacts} trusted contacts
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 border ${
        theme === 'dark' 
          ? 'bg-purple-900/20 border-purple-700' 
          : 'bg-purple-50 border-purple-200'
      }`}>
        <p className={`text-xs sm:text-sm leading-relaxed ${
          theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
        }`}>
          These people will be contacted if your account needs verification. Choose people you trust who can confirm your identity.
        </p>
      </div>

      {/* Contact List */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <AnimatePresence>
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.afro_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-3 sm:p-4 rounded-xl border-2 ${
                theme === 'dark' 
                  ? 'border-gray-700 bg-gray-900/50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Number Badge */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
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
                    {contact.relationship} • +234 {contact.phone}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(contact)}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                        : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Edit contact"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemove(contact.afro_id)}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-red-900/30 text-red-400'
                        : 'hover:bg-red-50 text-red-500'
                    }`}
                    aria-label="Remove contact"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {contacts.length === 0 && (
          <div className={`text-center py-8 sm:py-12 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">No emergency contacts yet</p>
          </div>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 sm:p-5 rounded-xl mb-4 border ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <h4 className={`text-sm sm:text-base font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {editingId ? 'Edit Contact' : 'Add Emergency Contact'}
            </h4>

            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                error={errors.display_name}
                placeholder="Adebayo Johnson"
              />

              <Input
                label="Relationship"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                error={errors.relationship}
                placeholder="Brother, Mother, Close Friend"
              />

              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Phone Number
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-900/50 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <span className="text-xl sm:text-2xl mr-1.5 sm:mr-2">🇳🇬</span>
                    <span className={`font-medium text-sm sm:text-base ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      +234
                    </span>
                  </div>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setFormData({ ...formData, phone: value });
                      }
                    }}
                    error={errors.phone}
                    placeholder="8012345678"
                    className="flex-1"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className={`w-full sm:flex-1 ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className={`w-full sm:flex-1 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                  }`}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? 'Update' : 'Add'} Contact
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          canAddMore && (
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              fullWidth
              className={`${
                theme === 'dark'
                  ? 'border-purple-600/50 text-purple-400 hover:bg-purple-900/30 hover:border-purple-500'
                  : 'border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400'
              }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Emergency Contact
            </Button>
          )
        )}
      </AnimatePresence>

      {!canAddMore && !showAddForm && (
        <p className={`text-xs sm:text-sm text-center ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
        }`}>
          Maximum contacts reached ({maxContacts})
        </p>
      )}
    </div>
  );
};

export default EmergencyContactsManager;