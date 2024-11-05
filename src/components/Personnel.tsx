import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, Mail, Phone, Shield, X } from 'lucide-react';
import { db, User } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface MemberFormData {
  username: string;
  password: string;
  name: string;
  rank: string;
  division: string;
  email: string;
  phone: string;
}

export default function Personnel() {
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    username: '',
    password: '',
    name: '',
    rank: '',
    division: '',
    email: '',
    phone: '',
  });

  const members = useLiveQuery(
    () => db.users.where('username').notEqual('admin').toArray(),
    []
  );

  const handleNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.users.add({
        ...formData,
        status: 'Actif',
        joinDate: new Date().toISOString().split('T')[0]
      });
      setShowNewMemberForm(false);
      setFormData({
        username: '',
        password: '',
        name: '',
        rank: '',
        division: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Erreur lors de l\'ajout du membre');
    }
  };

  const handleEdit = (member: User) => {
    setEditingMember(member);
    setFormData({
      username: member.username,
      password: member.password,
      name: member.name,
      rank: member.rank,
      division: member.division,
      email: member.email,
      phone: member.phone,
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.id) return;

    try {
      await db.users.update(editingMember.id, {
        ...editingMember,
        ...formData
      });
      setShowEditForm(false);
      setEditingMember(null);
      setFormData({
        username: '',
        password: '',
        name: '',
        rank: '',
        division: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Erreur lors de la mise à jour du membre');
    }
  };

  const handleDeactivate = async (memberId: number) => {
    try {
      const member = await db.users.get(memberId);
      if (member) {
        await db.users.update(memberId, {
          ...member,
          status: member.status === 'Actif' ? 'Inactif' : 'Actif'
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Rest of the component remains the same, just update the form to include username and password fields
  // ... (previous JSX code)
}