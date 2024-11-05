import React from 'react';
import { X, Bell, FileText, Users, Calendar, Trash2 } from 'lucide-react';
import { useNotificationsStore } from '../stores/notificationsStore';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { username: string; isAdmin: boolean } | null;
}

export default function NotificationsModal({ isOpen, onClose, currentUser }: NotificationsModalProps) {
  const { notifications, removeNotification, markAsRead } = useNotificationsStore();

  const userNotifications = notifications.filter(n => 
    !n.forAdmin || (n.forAdmin && currentUser?.isAdmin)
  );

  const handleRemoveNotification = (id: string) => {
    removeNotification(id);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <FileText className="w-5 h-5" />;
      case 'warning':
        return <Users className="w-5 h-5" />;
      case 'success':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {userNotifications.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Aucune notification
            </p>
          ) : (
            userNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${
                  notification.read 
                    ? 'bg-gray-50 dark:bg-gray-700' 
                    : 'bg-blue-50 dark:bg-blue-900'
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${
                    notification.type === 'warning' ? 'text-yellow-500' :
                    notification.type === 'success' ? 'text-green-500' :
                    'text-blue-500'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium dark:text-white">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-3 flex flex-col space-y-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Marquer comme lu
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveNotification(notification.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}