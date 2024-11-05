import React, { useState } from 'react';
import { Shield, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useRolesStore, Permission, Role } from '../stores/rolesStore';

interface RoleManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const availablePermissions: { id: Permission; label: string }[] = [
  { id: 'manage_users', label: 'Gérer les utilisateurs' },
  { id: 'manage_roles', label: 'Gérer les rôles' },
  { id: 'delete_reports', label: 'Supprimer les rapports' },
  { id: 'manage_events', label: 'Gérer les événements' },
  { id: 'view_activity_logs', label: 'Voir les journaux d\'activité' }
];

export default function RoleManager({ isOpen, onClose }: RoleManagerProps) {
  const { roles, addRole, updateRole, deleteRole } = useRolesStore();
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as Permission[],
    color: '#000000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      updateRole(editingRole.id, formData);
    } else {
      addRole(formData);
    }
    setFormData({ name: '', permissions: [], color: '#000000' });
    setEditingRole(null);
    setShowForm(false);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      permissions: role.permissions,
      color: role.color
    });
    setShowForm(true);
  };

  const handleDelete = (roleId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      deleteRole(roleId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold dark:text-white">Gestion des Rôles</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!showForm ? (
            <>
              <button
                onClick={() => {
                  setEditingRole(null);
                  setFormData({ name: '', permissions: [], color: '#000000' });
                  setShowForm(true);
                }}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Rôle
              </button>

              <div className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: role.color }}
                      />
                      <div>
                        <h3 className="font-medium dark:text-white">{role.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {role.permissions.length} permissions
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {role.id !== 'admin' && (
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom du rôle
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Couleur
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="mt-1 block w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...formData.permissions, permission.id]
                            : formData.permissions.filter((p) => p !== permission.id);
                          setFormData({ ...formData, permissions: newPermissions });
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {permission.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRole(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingRole ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}