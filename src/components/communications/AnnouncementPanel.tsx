import React, { useState, useEffect } from 'react';
import { Pin, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useCommunicationsStore } from '../../stores/communicationsStore';
import { useNotificationsStore } from '../../stores/notificationsStore';

interface AnnouncementPanelProps {
  currentUser: { username: string; isAdmin: boolean; roles?: string[] } | null;
}

export default function AnnouncementPanel({ currentUser }: AnnouncementPanelProps) {
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal',
    pinned: false
  });

  const { announcements, addAnnouncement, deleteAnnouncement, togglePinAnnouncement } = useCommunicationsStore();
  const { addNotification } = useNotificationsStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.isAdmin) {
      addNotification({
        title: 'Accès refusé',
        message: 'Seuls les administrateurs peuvent publier des annonces',
        type: 'warning'
      });
      return;
    }

    addAnnouncement({
      author: currentUser.username,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority as 'normal' | 'important' | 'urgent',
      pinned: announcement.pinned
    });

    addNotification({
      title: 'Nouvelle annonce',
      message: `Une nouvelle annonce "${announcement.title}" a été publiée`,
      type: 'info'
    });

    setAnnouncement({
      title: '',
      content: '',
      priority: 'normal',
      pinned: false
    });
    setShowNewAnnouncement(false);
  };

  const handleDelete = (id: string) => {
    if (!currentUser?.isAdmin) {
      addNotification({
        title: 'Accès refusé',
        message: 'Seuls les administrateurs peuvent supprimer des annonces',
        type: 'warning'
      });
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      deleteAnnouncement(id);
      addNotification({
        title: 'Annonce supprimée',
        message: 'L\'annonce a été supprimée avec succès',
        type: 'warning'
      });
    }
  };

  const handlePin = (id: string) => {
    if (!currentUser?.isAdmin) {
      addNotification({
        title: 'Accès refusé',
        message: 'Seuls les administrateurs peuvent épingler des annonces',
        type: 'warning'
      });
      return;
    }

    togglePinAnnouncement(id);
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Annonces</h2>
        {currentUser?.isAdmin && (
          <button
            onClick={() => setShowNewAnnouncement(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Nouvelle annonce
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune annonce pour le moment</p>
          </div>
        ) : (
          sortedAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`${
                ann.pinned
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              } border rounded-lg p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {ann.pinned && (
                    <Pin className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {ann.title}
                      </h3>
                      {ann.priority !== 'normal' && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ann.priority === 'urgent'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {ann.priority.charAt(0).toUpperCase() + ann.priority.slice(1)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {ann.content}
                    </p>
                    <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Par {ann.author}</span>
                      <span>•</span>
                      <span>{new Date(ann.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {currentUser?.isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePin(ann.id)}
                      className={`text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 ${
                        ann.pinned && 'text-yellow-600 dark:text-yellow-500'
                      }`}
                    >
                      <Pin className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showNewAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Nouvelle annonce
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={announcement.title}
                    onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contenu
                  </label>
                  <textarea
                    value={announcement.content}
                    onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priorité
                  </label>
                  <select
                    value={announcement.priority}
                    onChange={(e) => setAnnouncement({ ...announcement, priority: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="normal">Normale</option>
                    <option value="important">Importante</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={announcement.pinned}
                    onChange={(e) => setAnnouncement({ ...announcement, pinned: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pinned" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Épingler cette annonce
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewAnnouncement(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Publier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}