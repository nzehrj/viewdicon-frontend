import React, { useState } from 'react';
import WidgetContainer from '../WidgetContainer';
import { Calculator, Plus, Package } from 'lucide-react';

const MaterialCalculator: React.FC = () => {
  const [area, setArea] = useState('');
  const [material, setMaterial] = useState('cement');

  const materials = [
    { id: 'cement', name: 'Cement', unit: 'bags', ratio: 7 },
    { id: 'sand', name: 'Sand', unit: 'tons', ratio: 0.5 },
    { id: 'gravel', name: 'Gravel', unit: 'tons', ratio: 0.75 },
    { id: 'blocks', name: 'Blocks', unit: 'pieces', ratio: 10 },
    { id: 'steel', name: 'Steel Rods', unit: 'tons', ratio: 0.05 },
  ];

  const calculate = () => {
    const areaNum = parseFloat(area);
    if (isNaN(areaNum)) return 0;
    const selectedMaterial = materials.find(m => m.id === material);
    return (areaNum * (selectedMaterial?.ratio || 0)).toFixed(2);
  };

  const recentCalculations = [
    { material: 'Cement', area: '100m²', result: '700 bags' },
    { material: 'Blocks', area: '50m²', result: '500 pieces' },
    { material: 'Sand', area: '80m²', result: '40 tons' },
  ];

  return (
    <WidgetContainer
      title="Material Calculator"
      icon={Calculator}
    >
      <div className="space-y-4">
        {/* Calculator Form */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Material
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-afro-green focus:border-transparent"
            >
              {materials.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name} ({mat.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Area (m²)
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter area in square meters"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-afro-green focus:border-transparent"
            />
          </div>

          {area && (
            <div className="p-4 bg-afro-green/10 border-2 border-afro-green rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Estimated Material Needed:
              </p>
              <p className="text-2xl font-bold text-afro-green">
                {calculate()} {materials.find(m => m.id === material)?.unit}
              </p>
            </div>
          )}

          <button className="w-full px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Save Calculation
          </button>
        </div>

        {/* Recent Calculations */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Recent Calculations
          </h4>
          <div className="space-y-2">
            {recentCalculations.map((calc, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {calc.material}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Area: {calc.area}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-afro-green">
                  {calc.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default MaterialCalculator;