import React from 'react';
import { useAppSelector } from '@store/hooks';

interface GradientBackgroundProps {
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === 'light'
          ? 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden'
      }`}
    >
      {theme === 'dark' && (
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-amber-900/20 to-transparent pointer-events-none" />
      )}
      {children}
    </div>
  );
};