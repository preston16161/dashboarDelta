import React, { useState } from 'react';
import MessagesPanel from '../components/communications/MessagesPanel';
import AnnouncementPanel from '../components/communications/AnnouncementPanel';
import ChatPanel from '../components/communications/ChatPanel';
import { useCommunicationsStore } from '../stores/communicationsStore';
import { Users } from 'lucide-react';

interface CommunicationsProps {
  currentUser: { username: string; isAdmin: boolean; roles?: string[] } | null;
}

export default function Communications({ currentUser }: CommunicationsProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'messages' | 'announcements'>('chat');
  const { onlineUsers } = useCommunicationsStore();

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex h-[calc(100vh-10rem)] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
        {/* Sidebar - Online Users */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Membres en ligne
            </h2>
          </div>
          <div className="p-4">
            {onlineUsers.length > 0 ? (
              <ul className="space-y-2">
                {onlineUsers.map((user) => (
                  <li key={user} className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-700 dark:text-gray-300">{user}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Aucun membre en ligne</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4 px-4">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'chat'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Chat général
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Messages privés
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'announcements'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Annonces
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' && <ChatPanel currentUser={currentUser} />}
            {activeTab === 'messages' && <MessagesPanel currentUser={currentUser} />}
            {activeTab === 'announcements' && <AnnouncementPanel currentUser={currentUser} />}
          </div>
        </div>
      </div>
    </div>
  );
}