import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Image, Paperclip, X } from 'lucide-react';
import { useCommunicationsStore } from '../../stores/communicationsStore';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatPanelProps {
  currentUser: { username: string; isAdmin: boolean; roles?: string[] } | null;
}

export default function ChatPanel({ currentUser }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const { messages, addMessage, onlineUsers } = useCommunicationsStore();
  const chatMessages = useCommunicationsStore((state) => state.getChatMessages(null));

  useEffect(() => {
    if (currentUser) {
      useCommunicationsStore.getState().addOnlineUser(currentUser.username);
    }
    return () => {
      if (currentUser) {
        useCommunicationsStore.getState().removeOnlineUser(currentUser.username);
      }
    };
  }, [currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !selectedFile) || !currentUser) return;

    let mediaUrl = '';
    if (selectedFile) {
      // Ici, vous pouvez implémenter la logique pour télécharger le fichier
      // et obtenir son URL. Pour l'exemple, nous utilisons une URL locale
      mediaUrl = URL.createObjectURL(selectedFile);
    }

    addMessage({
      sender: currentUser.username,
      receiver: null,
      content: message.trim(),
      mediaUrl: mediaUrl || undefined,
      mediaType: selectedFile?.type || undefined
    });

    setMessage('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Le fichier est trop volumineux. Taille maximum : 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addEmoji = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === currentUser?.username ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[70%] space-x-2 ${
                msg.sender === currentUser?.username ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {msg.sender[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className={`flex items-center space-x-2 ${
                    msg.sender === currentUser?.username ? 'justify-end' : ''
                  }`}>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {msg.sender === currentUser?.username ? 'Vous' : msg.sender}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`mt-1 rounded-lg overflow-hidden ${
                    msg.sender === currentUser?.username
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    {msg.mediaUrl && (
                      <div className="mb-2">
                        {msg.mediaType?.startsWith('image/') ? (
                          <img 
                            src={msg.mediaUrl} 
                            alt="Image partagée"
                            className="max-w-full rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-200 dark:bg-gray-600 rounded-lg">
                            <a 
                              href={msg.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Fichier partagé
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.content && (
                      <div className="p-3">
                        {msg.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Preview Area */}
      {previewUrl && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <div className="relative inline-block">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-32 rounded-lg"
            />
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Image className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
          <div className="relative">
            <button
              type="button"
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Smile className="w-5 h-5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-50">
                <Picker 
                  data={data} 
                  onEmojiSelect={addEmoji}
                  theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!message.trim() && !selectedFile}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}