import React, { useState } from 'react';
import WidgetContainer from '../WidgetContainer';
import { Zap, AlertCircle } from 'lucide-react';

const CircuitCalculator: React.FC = () => {
  const [voltage, setVoltage] = useState('220');
  const [power, setPower] = useState('');
  const [wireLength, setWireLength] = useState('');

  const calculateCurrent = (): string => {
    const v = parseFloat(voltage);
    const p = parseFloat(power);
    if (isNaN(v) || isNaN(p) || v === 0) return '0';
    return (p / v).toFixed(2);
  };

  const recommendWireSize = () => {
    const current = parseFloat(calculateCurrent());
    if (current <= 5) return '1.5mm²';
    if (current <= 10) return '2.5mm²';
    if (current <= 16) return '4mm²';
    if (current <= 25) return '6mm²';
    if (current <= 32) return '10mm²';
    return '16mm²';
  };

  const calculateVoltageDrop = (): string => {
    const current = parseFloat(calculateCurrent());
    const length = parseFloat(wireLength);
    if (isNaN(current) || isNaN(length)) return '0';
    // Simplified voltage drop calculation (assuming copper wire, 2.5mm²)
    const resistance = 0.00724; // ohms per meter for 2.5mm²
    const drop = (2 * current * length * resistance);
    return drop.toFixed(2);
  };

  const recentCalculations = [
    { load: 'Air Conditioner', power: '2000W', current: '9.09A', wire: '2.5mm²' },
    { load: 'Water Heater', power: '3000W', current: '13.64A', wire: '4mm²' },
    { load: 'Lighting Circuit', power: '500W', current: '2.27A', wire: '1.5mm²' },
  ];

  return (
    <WidgetContainer
      title="Circuit Calculator"
      icon={Zap}
    >
      <div className="space-y-4">
        {/* Calculator Form */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voltage (V)
              </label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-afro-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Power (W)
              </label>
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-afro-green focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wire Length (m)
            </label>
            <input
              type="number"
              value={wireLength}
              onChange={(e) => setWireLength(e.target.value)}
              placeholder="e.g. 25"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-afro-green focus:border-transparent"
            />
          </div>

          {power && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-500 mb-1">
                  Calculated Current
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {calculateCurrent()} A
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-green-600 dark:text-green-500 mb-1">
                  Recommended Wire Size
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {recommendWireSize()}
                </p>
              </div>

              {wireLength && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-amber-600 dark:text-amber-500 mb-1">
                        Voltage Drop
                      </p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                        {calculateVoltageDrop()} V
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {calc.load}
                  </p>
                  <span className="text-xs px-2 py-1 bg-afro-green/10 text-afro-green rounded-full font-medium">
                    {calc.wire}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <span>{calc.power}</span>
                  <span>•</span>
                  <span>{calc.current}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default CircuitCalculator;