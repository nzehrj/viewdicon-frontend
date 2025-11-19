import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Star, 
  Shield,
  Zap,
  Calendar,
  Award,
  SlidersHorizontal
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface DiscoverFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

export interface FilterState {
  // Distance
  maxDistance?: number; // in km
  
  // Availability
  availableNow?: boolean;
  
  // Price Range
  minPrice?: number;
  maxPrice?: number;
  
  // Trust & Safety
  minCrestTier?: number; // 1-5
  shieldState?: ('green' | 'amber' | 'red')[];
  
  // Experience
  minRating?: number; // 1-5
  minCompletedJobs?: number;
  
  // Honor Stage
  honorStages?: string[];
}

/**
 * DISCOVER FILTERS COMPONENT
 * 
 * Advanced filter modal for the Discover marketplace.
 * 
 * Filters:
 * - Distance/Proximity (radius in km)
 * - Availability (available now only)
 * - Price range (min/max Cowrie)
 * - Trust level (crest tier, shield state)
 * - Experience (rating, completed jobs)
 * - Honor stages
 * 
 * Location: src/components/discover/DiscoverFilters.tsx
 */
export const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters = {},
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };
  
  const handleReset = () => {
    setFilters({});
  };
  
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 p-4 border-b ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <h2 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Filters
                  </h2>
                </div>
                
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  } transition-colors`}
                >
                  <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              
              <button
                onClick={handleReset}
                className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                Reset All
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-6 pb-24">
              {/* Distance Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <label className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Maximum Distance
                  </label>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.maxDistance || 25}
                    onChange={(e) => updateFilter('maxDistance', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      1 km
                    </span>
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      {filters.maxDistance || 25} km
                    </span>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      50 km
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Availability Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-green-500" />
                  <label className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Availability
                  </label>
                </div>
                
                <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors`}>
                  <input
                    type="checkbox"
                    checked={filters.availableNow || false}
                    onChange={(e) => updateFilter('availableNow', e.target.checked)}
                    className="w-5 h-5 rounded text-purple-600"
                  />
                  <div>
                    <p className={`font-medium text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Available Now Only
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Show only professionals who are online and ready
                    </p>
                  </div>
                </label>
              </div>
              
              {/* Price Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  <label className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Price Range (Cowrie Coins)
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Min Price
                    </label>
                    <input
                      type="number"
                      placeholder="₵0"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-xs mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Max Price
                    </label>
                    <input
                      type="number"
                      placeholder="₵999,999"
                      value={filters.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Trust Level */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-amber-500" />
                  <label className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Minimum Trust Level
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => updateFilter('minCrestTier', tier)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        (filters.minCrestTier || 1) === tier
                          ? 'bg-amber-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {'⭐'.repeat(tier)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Shield State */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-green-500" />
                  <label className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Shield Status
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  {[
                    { value: 'green', label: 'Green', color: 'bg-green-500' },
                    { value: 'amber', label: 'Amber', color: 'bg-amber-500' },
                    { value: 'red', label: 'Red', color: 'bg-red-500' },
                  ].map((shield) => (
                    <button
                      key={shield.value}
                      onClick={() => {
                        const current = filters.shieldState || ['green'];
                        const updated = current.includes(shield.value as any)
                          ? current.filter((s) => s !== shield.value)
                          : [...current, shield.value as any];
                        updateFilter('shieldState', updated.length > 0 ? updated : undefined);
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        (filters.shieldState || ['green']).includes(shield.value as any)
                          ? `${shield.color} text-white`
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {shield.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rating */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-amber-500" />
                  <label className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Minimum Rating
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  {[3.0, 3.5, 4.0, 4.5, 5.0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => updateFilter('minRating', rating)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.minRating === rating
                          ? 'bg-amber-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Completed Jobs */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <label className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Minimum Completed Jobs
                  </label>
                </div>
                
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minCompletedJobs || ''}
                  onChange={(e) => updateFilter('minCompletedJobs', e.target.value ? Number(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className={`fixed bottom-0 left-0 right-0 p-4 border-t ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DiscoverFilters;