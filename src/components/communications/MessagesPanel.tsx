import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Send, Smile } from 'lucide-react';
import { useCommunicationsStore } from '../../stores/communicationsStore';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessagesPanelProps {
  currentUser: { username: string; isAdmin: boolean; roles?: string[] } | null;
}

export default function MessagesPanel({ currentUser }: MessagesPanelProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversationSettings, setConversationSettings] = useState({
    notifications: true,
    readReceipts: true
  });

  // Récupérer tous les membres depuis le localStorage
  const [allMembers, setAllMembers] = useState<any[]>(() => {
    const savedMembers = localStorage.getItem('members');
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  const { messages, addMessage, onlineUsers } = useCommunicationsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser && currentUser) {
      addMessage({
        sender: currentUser.username,
        receiver: selectedUser,
        content: newMessage.trim()
      });
      setNewMessage('');
    }
  };

  const addEmoji = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const filteredMessages = messages.filter(
    msg => 
      (msg.sender === currentUser?.username && msg.receiver === selectedUser) ||
      (msg.sender === selectedUser && msg.receiver === currentUser?.username)
  );

  // Filtrer la liste des membres en excluant l'utilisateur actuel
  const availableUsers = allMembers
    .filter(member => member.username !== currentUser?.username)
    .map(member => ({
      ...member,
      isOnline: onlineUsers.includes(member.username)
    }));

  return (
    <div className="flex flex-col h-full">
      {/* Liste des utilisateurs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {availableUsers.map((user) => (
              <button
                key={user.username}
                onClick={() => setSelectedUser(user.username)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
                  selectedUser === user.username
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span>{user.username}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {selectedUser[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedUser}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {onlineUsers.includes(selectedUser) ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === currentUser?.username ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      message.sender === currentUser?.username
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Smile className="w-6 h-6" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              {showEmojiPicker && (
                <div className="absolute bottom-20 right-4">
                  <Picker 
                    data={data} 
                    onEmojiSelect={addEmoji}
                    theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Sélectionnez un utilisateur pour commencer une conversation
            </p>
          </div>
        )}
      </div>

      {/* Modal des paramètres */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Paramètres de la conversation
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notifications
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        checked={conversationSettings.notifications}
                        onChange={(e) => setConversationSettings(prev => ({
                          ...prev,
                          notifications: e.target.checked
                        }))}
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Activer les notifications
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confidentialité
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        checked={conversationSettings.readReceipts}
                        onChange={(e) => setConversationSettings(prev => ({
                          ...prev,
                          readReceipts: e.target.checked
                        }))}
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Accusés de lecture
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}