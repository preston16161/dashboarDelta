import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Permission = 
  | 'manage_users'        // Gérer les utilisateurs
  | 'manage_roles'        // Gérer les rôles
  | 'delete_reports'      // Supprimer les rapports
  | 'manage_events'       // Gérer les événements
  | 'view_activity_logs'  // Voir les journaux d'activité
  | 'manage_all';         // Permission admin (tout faire)

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  color: string;
}

interface RolesState {
  roles: Role[];
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  hasPermission: (userRoles: string[], permission: Permission) => boolean;
}

const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    permissions: ['manage_all'],
    color: '#DC2626' // Rouge
  },
  {
    id: 'moderator',
    name: 'Modérateur',
    permissions: ['delete_reports', 'manage_events', 'view_activity_logs'],
    color: '#2563EB' // Bleu
  },
  {
    id: 'chef_division',
    name: 'Chef de Division',
    permissions: ['manage_events', 'view_activity_logs'],
    color: '#059669' // Vert
  },
  {
    id: 'officier',
    name: 'Officier',
    permissions: ['view_activity_logs'],
    color: '#D97706' // Orange
  },
  {
    id: 'membre',
    name: 'Membre',
    permissions: [],
    color: '#6B7280' // Gris
  }
];

export const useRolesStore = create<RolesState>()(
  persist(
    (set, get) => ({
      roles: defaultRoles,
      
      addRole: (role) => set((state) => ({
        roles: [...state.roles, { ...role, id: Date.now().toString() }]
      })),
      
      updateRole: (id, updates) => set((state) => ({
        roles: state.roles.map((role) =>
          role.id === id ? { ...role, ...updates } : role
        )
      })),
      
      deleteRole: (id) => set((state) => ({
        roles: state.roles.filter((role) => role.id !== id)
      })),
      
      hasPermission: (userRoles, permission) => {
        const roles = get().roles;
        return userRoles.some(roleId => {
          const role = roles.find(r => r.id === roleId);
          return role?.permissions.includes('manage_all') || role?.permissions.includes(permission);
        });
      }
    }),
    {
      name: 'roles-storage'
    }
  )
);