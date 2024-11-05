import React, { useState } from 'react';
import { Shield, Menu, X, Users, FileText, Calendar, Settings, Bell, User, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SettingsModal from './SettingsModal';
import NotificationsModal from './NotificationsModal';
import { useNotificationsStore } from '../stores/notificationsStore';

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  currentUser: { username: string; isAdmin: boolean } | null;
}

export default function Navbar({ isLoggedIn, setIsLoggedIn, isMobileMenuOpen, setIsMobileMenuOpen, currentUser }: NavbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = useNotificationsStore((state) => state.getUnreadCount());
  const location = useLocation();

  const navItems = [
    { name: 'Tableau de bord', icon: Shield, path: '/' },
    ...(currentUser?.isAdmin ? [{ name: 'Personnel', icon: Users, path: '/personnel' }] : []),
    { name: 'Rapports', icon: FileText, path: '/reports' },
    { name: 'Planning', icon: Calendar, path: '/planning' },
    { name: 'Communications', icon: MessageSquare, path: '/communications' },
  ];

  return (
    <>
      <nav className="bg-white shadow-lg dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Gestion du Régiment</span>
              </div>
              
              <div className="hidden md:ml-6 md:flex md:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    } rounded-md`}
                  >
                    <item.icon className="h-5 w-5 mr-1.5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-6 w-6" />
                  </button>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentUser.username}
                      {currentUser.isAdmin && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                          Admin
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={setIsLoggedIn}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-base font-medium ${
                    location.pathname === item.path
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
            {currentUser && (
              <div className="px-4 py-2 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 mt-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentUser.username}
                    {currentUser.isAdmin && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        Admin
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentUser={currentUser}
      />

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        currentUser={currentUser}
      />
    </>
  );
}