import React from 'react';
import { Bell, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useAppSelector } from '@store/hooks';
import { ThemeToggle } from '@components/common/ThemeToggle';
import { getGreeting } from '@utils/helpers';

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const DashboardHeader: React.FC = () => {
  const { logout } = useAuth();
  const user = useAppSelector((state) => state.user.user);
  const language = useAppSelector((state) => state.i18n.language);

  const greeting = getGreeting(language);
  const userName = user?.full_name?.split(' ')[0] || user?.afro_id || 'Friend';
  const fullName = user?.full_name || user?.afro_id || 'User';

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting}, {userName}!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user?.role_name || 'Welcome back'}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-afro-green text-white flex items-center justify-center font-semibold">
              {fullName !== 'User' ? getInitials(fullName) : <User className="w-5 h-5" />}
            </div>

            {/* User Info */}
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {fullName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user?.afro_id || ''}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;