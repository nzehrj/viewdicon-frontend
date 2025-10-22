import React from 'react';
import WidgetContainer from '../WidgetContainer';
import { CloudSun, Droplets, Wind, Sun, CloudRain } from 'lucide-react';

const WeatherOracle: React.FC = () => {
  const forecast = [
    { day: 'Today', temp: 28, condition: 'Sunny', rain: 10, wind: 12, icon: Sun },
    { day: 'Tomorrow', temp: 26, condition: 'Partly Cloudy', rain: 30, wind: 15, icon: CloudSun },
    { day: 'Wednesday', temp: 24, condition: 'Rainy', rain: 80, wind: 20, icon: CloudRain },
    { day: 'Thursday', temp: 25, condition: 'Cloudy', rain: 40, wind: 18, icon: CloudSun },
    { day: 'Friday', temp: 27, condition: 'Sunny', rain: 5, wind: 10, icon: Sun },
  ];

  return (
    <WidgetContainer
      title="Weather Oracle"
      icon={CloudSun}
      actions={
        <button className="px-4 py-2 bg-afro-green text-white rounded-lg hover:bg-afro-green/90 transition-colors text-sm">
          Set Alerts
        </button>
      }
    >
      <div className="space-y-3">
        {forecast.map((day, index) => {
          const IconComponent = day.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                index === 0
                  ? 'border-afro-green bg-afro-green/5'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {day.day}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {day.condition}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {day.temp}°C
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      <span>{day.rain}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="w-3 h-3" />
                      <span>{day.wind}km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Farming Tip:</strong> Rain expected Wednesday - Good time for planting!
        </p>
      </div>
    </WidgetContainer>
  );
};

export default WeatherOracle;