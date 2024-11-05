import { create } from 'zustand';

export interface Member {
  id: number;
  username: string;
  name: string;
  rank: string;
  division: string;
  status: string;
  email: string;
  phone: string;
  joinDate: string;
}

interface PersonnelState {
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'status' | 'joinDate'>) => void;
  updateMember: (id: number, updates: Partial<Member>) => void;
  toggleStatus: (id: number) => void;
}

export const usePersonnelStore = create<PersonnelState>((set) => ({
  members: [],
  addMember: (member) => set((state) => ({
    members: [...state.members, {
      id: Date.now(),
      status: 'Actif',
      joinDate: new Date().toISOString().split('T')[0],
      ...member
    }]
  })),
  updateMember: (id, updates) => set((state) => ({
    members: state.members.map((member) =>
      member.id === id ? { ...member, ...updates } : member
    )
  })),
  toggleStatus: (id) => set((state) => ({
    members: state.members.map((member) =>
      member.id === id
        ? { ...member, status: member.status === 'Actif' ? 'Inactif' : 'Actif' }
        : member
    )
  }))
}));