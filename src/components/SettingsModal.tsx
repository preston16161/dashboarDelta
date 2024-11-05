import React from 'react';
import { X, Moon, Sun, Bell, ClipboardList } from 'lucide-react';
import { usePreferencesStore } from '../stores/preferencesStore';
import { useNotificationsStore } from '../stores/notificationsStore';
import { useActivityLogStore } from '../stores/activityLogStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { username: string; isAdmin: boolean } | null;
}

export default function SettingsModal({ isOpen, onClose, currentUser }: SettingsModalProps) {
  const { getUserPreferences, setUserPreferences } = usePreferencesStore();
  const { notifications, clearNotifications, removeNotification } = useNotificationsStore();
  const { activityLogs } = useActivityLogStore();
  
  const userPreferences = currentUser ? getUserPreferences(currentUser.username) : { darkMode: false };

  const handleDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) return;
    
    const newDarkMode = e.target.checked;
    setUserPreferences(currentUser.username, {
      ...userPreferences,
      darkMode: newDarkMode
    });
    
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  if (!isOpen) return null;

  const userNotifications = notifications.filter(n => 
    !n.forAdmin || (n.forAdmin && currentUser?.isAdmin)
  );

  const filteredLogs = currentUser?.isAdmin 
    ? activityLogs 
    : activityLogs.filter(log => log.username === currentUser?.username);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Paramètres</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Mode sombre */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {userPreferences.darkMode ? (
                  <Moon className="w-5 h-5 dark:text-white" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                <span className="dark:text-white">Mode sombre</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={userPreferences.darkMode}
                  onChange={handleDarkModeChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 dark:text-white" />
                  <span className="dark:text-white">Notifications</span>
                </div>
                {userNotifications.length > 0 && (
                  <button
                    onClick={() => clearNotifications()}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Tout effacer
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {userNotifications.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">Aucune notification</p>
                ) : (
                  userNotifications.map((notification, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium dark:text-white">{notification.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeNotification(index)}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Journal d'activité */}
            {currentUser && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ClipboardList className="w-5 h-5 dark:text-white" />
                  <span className="dark:text-white">Journal d'activité</span>
                </div>
                <div className="space-y-2">
                  {filteredLogs.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Aucune activité enregistrée</p>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium dark:text-white">{log.action}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{log.details}</p>
                        {currentUser.isAdmin && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Utilisateur: {log.username}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}