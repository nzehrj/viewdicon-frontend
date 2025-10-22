import React, { useState } from 'react';
import { Users, Plus, Check, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { useAppSelector } from '@store/hooks';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

interface FamilyTreeProps {
  onComplete: () => void;
}

const relationships = [
  'Parent',
  'Child',
  'Sibling',
  'Spouse',
  'Grandparent',
  'Grandchild',
  'Aunt/Uncle',
  'Niece/Nephew',
  'Cousin',
  'Other Family',
];

export const FamilyTree: React.FC<FamilyTreeProps> = ({ onComplete }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentMember, setCurrentMember] = useState({
    name: '',
    relationship: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const theme = useAppSelector((state) => state.theme.theme);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentMember.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!currentMember.relationship) {
      newErrors.relationship = 'Please select a relationship';
    }

    if (!currentMember.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(currentMember.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMember = () => {
    if (!validateForm()) return;

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      ...currentMember,
    };

    setMembers([...members, newMember]);
    setCurrentMember({ name: '', relationship: '', phone: '' });
    setShowForm(false);
    setErrors({});
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const canProceed = members.length >= 3;

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-3xl ${
              theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white shadow-xl'
            }`}
          >
            {/* Header */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className={`text-3xl font-bold text-center mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Build Your Family Tree
            </h2>

            <p className={`text-center mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Add at least 3 family members to continue
            </p>

            {/* Progress */}
            <div className="flex justify-center items-center gap-2 mb-8">
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {members.length} / 3 members added
              </div>
              {canProceed && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Progress Bar */}
            <div className={`h-2 rounded-full mb-8 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${Math.min((members.length / 3) * 100, 100)}%` }}
              />
            </div>

            {/* Family Members List */}
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-4 rounded-xl border-2 ${
                      theme === 'dark'
                        ? 'bg-gray-900/50 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {member.name}
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {member.relationship} • +234 {member.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <X className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Member Form */}
            <AnimatePresence>
              {showForm ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-6 rounded-xl mb-6 ${
                    theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Add Family Member
                  </h3>

                  <div className="space-y-4">
                    {/* Name */}
                    <Input
                      label="Full Name"
                      value={currentMember.name}
                      onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                      error={errors.name}
                      placeholder="Enter full name"
                    />

                    {/* Relationship */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Relationship
                      </label>
                      <select
                        value={currentMember.relationship}
                        onChange={(e) => setCurrentMember({ ...currentMember, relationship: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                          errors.relationship
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : theme === 'dark'
                            ? 'bg-gray-900/50 border-gray-700 focus:border-blue-500 text-white'
                            : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        <option value="">Select relationship</option>
                        {relationships.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>
                      {errors.relationship && (
                        <p className="text-sm text-red-500 mt-1">{errors.relationship}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Phone Number
                      </label>
                      <div className="flex gap-3">
                        <div className={`flex items-center px-4 rounded-xl border-2 ${
                          theme === 'dark'
                            ? 'bg-gray-900/50 border-gray-700'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <span className="text-2xl mr-2">🇳🇬</span>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            +234
                          </span>
                        </div>
                        <Input
                          type="tel"
                          value={currentMember.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              setCurrentMember({ ...currentMember, phone: value });
                            }
                          }}
                          error={errors.phone}
                          placeholder="8012345678"
                          className="flex-1"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setCurrentMember({ name: '', relationship: '', phone: '' });
                          setErrors({});
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMember}
                        className="flex-1"
                      >
                        Add Member
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <Button
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="w-full mb-6"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Family Member
                </Button>
              )}
            </AnimatePresence>

            {/* Info Box */}
            <div className={`p-4 rounded-xl mb-6 ${
              theme === 'dark' ? 'bg-blue-900/20 border-2 border-blue-500/30' : 'bg-blue-50 border-2 border-blue-200'
            }`}>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
              }`}>
                <strong>Family Gate (C1):</strong> Adding family members helps verify your identity 
                and builds your kinship network within the community.
              </p>
            </div>

            {/* Continue Button */}
            <Button
              onClick={onComplete}
              disabled={!canProceed}
              className="w-full"
            >
              {canProceed ? (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                `Add ${3 - members.length} more ${members.length === 2 ? 'member' : 'members'}`
              )}
            </Button>

            {!canProceed && (
              <p className={`text-xs text-center mt-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                You need at least 3 family members to proceed
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};