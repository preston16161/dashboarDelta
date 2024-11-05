import React, { useState } from 'react';
import { Users, UserPlus, Search, Filter, Shield, X } from 'lucide-react';
import { useRolesStore } from '../stores/rolesStore';

interface Member {
  id: number;
  name: string;
  username: string;
  password: string;
  rank: string;
  status: string;
  division: string;
  joinDate: string;
  roles: string[];
}

interface MemberFormData {
  name: string;
  username: string;
  password: string;
  rank: string;
  division: string;
  roles: string[];
}

interface PersonnelProps {
  currentUser: { username: string; isAdmin: boolean } | null;
}

const militaryRanks = [
  // Officers
  { id: 'O-6-COL', code: 'O-6', name: 'Colonel', abbr: 'Colonel - COL' },
  { id: 'O-5-LTC', code: 'O-5', name: 'Lieutenant Colonel', abbr: 'Lieutenant Colonel - LTC' },
  { id: 'O-4-MAJ', code: 'O-4', name: 'Major', abbr: 'Major - MAJ' },
  { id: 'O-3-CPT', code: 'O-3', name: 'Captain', abbr: 'Captain - CPT' },
  { id: 'O-2-1LT', code: 'O-2', name: 'First Lieutenant', abbr: 'First Lieutenant - 1LT' },
  { id: 'O-1-2LT', code: 'O-1', name: 'Second Lieutenant', abbr: 'Second Lieutenant - 2LT' },
  
  // Senior NCOs
  { id: 'E-9-CSM', code: 'E-9', name: 'Command Sergeant Major', abbr: 'Command Sergeant Major - CSM' },
  { id: 'E-9-SGM', code: 'E-9', name: 'Sergeant Major', abbr: 'Sergeant Major - SGM' },
  { id: 'E-8-1SG', code: 'E-8', name: 'First Sergeant', abbr: 'First Sergeant - 1SG' },
  { id: 'E-8-MSG', code: 'E-8', name: 'Master Sergeant', abbr: 'Master Sergeant - MSG' },
  { id: 'E-7-SFC', code: 'E-7', name: 'Sergeant First Class', abbr: 'Sergeant First Class - SFC' },
  { id: 'E-6-SSG', code: 'E-6', name: 'Staff Sergeant', abbr: 'Staff Sergeant - SSG' },
  
  // NCOs
  { id: 'E-5-SGT', code: 'E-5', name: 'Sergeant', abbr: 'Sergeant - SGT' },
  { id: 'E-4-CPL', code: 'E-4', name: 'Corporal', abbr: 'Corporal - CPL' },
  { id: 'E-4-SPC', code: 'E-4', name: 'Specialist', abbr: 'Specialist - SPC' },
  
  // Junior Enlisted
  { id: 'E-3-PFC', code: 'E-3', name: 'Private First Class', abbr: 'Private First Class - PFC' },
  { id: 'E-2-PV2', code: 'E-2', name: 'Private', abbr: 'Private - PV2' },
  { id: 'E-1-PV1', code: 'E-1', name: 'Private', abbr: 'Private - PV1' }
];

export default function Personnel({ currentUser }: PersonnelProps) {
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    username: '',
    password: '',
    rank: '',
    division: '',
    roles: []
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const savedMembers = localStorage.getItem('members');
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  const { roles } = useRolesStore();

  const handleNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      id: members.length + 1,
      ...formData,
      status: 'Actif',
      joinDate: new Date().toISOString().split('T')[0],
    };
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    localStorage.setItem('members', JSON.stringify(updatedMembers));
    setShowNewMemberForm(false);
    setFormData({
      name: '',
      username: '',
      password: '',
      rank: '',
      division: '',
      roles: []
    });
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      username: member.username,
      password: member.password,
      rank: member.rank,
      division: member.division,
      roles: member.roles || []
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const updatedMembers = members.map((member) =>
      member.id === editingMember.id
        ? {
            ...member,
            ...formData,
          }
        : member
    );
    setMembers(updatedMembers);
    localStorage.setItem('members', JSON.stringify(updatedMembers));
    setShowEditForm(false);
    setEditingMember(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      rank: '',
      division: '',
      roles: []
    });
  };

  const handleDeactivate = (memberId: number) => {
    const updatedMembers = members.map((member) =>
      member.id === memberId
        ? { ...member, status: member.status === 'Actif' ? 'Inactif' : 'Actif' }
        : member
    );
    setMembers(updatedMembers);
    localStorage.setItem('members', JSON.stringify(updatedMembers));
  };

  const handleDelete = (memberId: number) => {
    if (!currentUser?.isAdmin) {
      alert('Seul un administrateur peut supprimer des membres');
      return;
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      const updatedMembers = members.filter(member => member.id !== memberId);
      setMembers(updatedMembers);
      localStorage.setItem('members', JSON.stringify(updatedMembers));
    }
  };

  const MemberForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => void, title: string }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">{title}</h2>
          <button
            onClick={() => {
              setShowNewMemberForm(false);
              setShowEditForm(false);
              setEditingMember(null);
              setFormData({
                name: '',
                username: '',
                password: '',
                rank: '',
                division: '',
                roles: []
              });
            }}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom d'utilisateur</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grade</label>
            <select
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Sélectionner un grade</option>
              {militaryRanks.map((rank) => (
                <option key={rank.id} value={rank.abbr}>
                  {rank.abbr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Division</label>
            <select
              value={formData.division}
              onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Sélectionner une division</option>
              <option value="Commandement">Commandement</option>
              <option value="Opérations">Opérations</option>
              <option value="Formation">Formation</option>
              <option value="Logistique">Logistique</option>
            </select>
          </div>
          {currentUser?.isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rôles</label>
              <div className="mt-2 space-y-2">
                {roles.map((role) => (
                  <label key={role.id} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role.id)}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.roles, role.id]
                          : formData.roles.filter(r => r !== role.id);
                        setFormData({ ...formData, roles: newRoles });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span 
                      className="ml-2 text-sm"
                      style={{ color: role.color }}
                    >
                      {role.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingMember ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion du Personnel</h1>
        {currentUser?.isAdmin && (
          <button
            onClick={() => setShowNewMemberForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Nouveau Membre
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Rechercher un membre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-4 w-full sm:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Toutes les divisions</option>
              <option value="command">Commandement</option>
              <option value="operations">Opérations</option>
              <option value="training">Formation</option>
              <option value="logistics">Logistique</option>
            </select>
            <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md dark:text-gray-400 dark:border-gray-600">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{member.rank}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.status === 'Actif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    member.status === 'En mission' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    member.status === 'Inactif' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {member.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Division: {member.division}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date d'entrée: {member.joinDate}</p>
                  {member.roles && member.roles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.roles.map(roleId => {
                        const role = roles.find(r => r.id === roleId);
                        if (role) {
                          return (
                            <span
                              key={role.id}
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: `${role.color}20`,
                                color: role.color
                              }}
                            >
                              {role.name}
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
                {currentUser?.isAdmin && (
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeactivate(member.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      {member.status === 'Actif' ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNewMemberForm && (
        <MemberForm onSubmit={handleNewMember} title="Nouveau Membre" />
      )}

      {showEditForm && (
        <MemberForm onSubmit={handleEditSubmit} title="Modifier le Membre" />
      )}
    </div>
  );
}