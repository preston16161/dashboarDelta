import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  sender: string;
  receiver: string | null;
  content: string;
  timestamp: number;
  read: boolean;
  mediaUrl?: string;
  mediaType?: string;
}

export interface Announcement {
  id: string;
  author: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  timestamp: number;
  pinned: boolean;
}

interface CommunicationsState {
  messages: Message[];
  announcements: Announcement[];
  onlineUsers: string[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp'>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;
  markMessageAsRead: (id: string) => void;
  addOnlineUser: (username: string) => void;
  removeOnlineUser: (username: string) => void;
  getUnreadCount: (username: string) => number;
  getChatMessages: (receiver: string | null) => Message[];
}

export const useCommunicationsStore = create<CommunicationsState>()(
  persist(
    (set, get) => ({
      messages: [],
      announcements: [],
      onlineUsers: [],

      addMessage: (message) => {
        const newMessage = {
          ...message,
          id: Date.now().toString(),
          timestamp: Date.now(),
          read: false
        };

        set((state) => ({
          messages: [...state.messages, newMessage]
        }));
      },

      addAnnouncement: (announcement) => {
        const newAnnouncement = {
          ...announcement,
          id: Date.now().toString(),
          timestamp: Date.now()
        };

        set((state) => ({
          announcements: [...state.announcements, newAnnouncement]
        }));
      },

      deleteAnnouncement: (id) => {
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id)
        }));
      },

      togglePinAnnouncement: (id) => {
        set((state) => ({
          announcements: state.announcements.map((a) =>
            a.id === id ? { ...a, pinned: !a.pinned } : a
          )
        }));
      },

      markMessageAsRead: (id) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, read: true } : m
          )
        }));
      },

      addOnlineUser: (username) => {
        set((state) => ({
          onlineUsers: state.onlineUsers.includes(username) 
            ? state.onlineUsers 
            : [...state.onlineUsers, username]
        }));
      },

      removeOnlineUser: (username) => {
        set((state) => ({
          onlineUsers: state.onlineUsers.filter(user => user !== username)
        }));
      },

      getUnreadCount: (username) => {
        return get().messages.filter(
          (m) => !m.read && m.receiver === username
        ).length;
      },

      getChatMessages: (receiver) => {
        return get().messages.filter(
          (m) => m.receiver === receiver || (receiver === null && m.receiver === null)
        ).sort((a, b) => a.timestamp - b.timestamp);
      }
    }),
    {
      name: 'communications-storage'
    }
  )
);