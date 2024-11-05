import React, { useState } from 'react';
import { FileText } from 'lucide-react';

interface ReportFormProps {
  onSubmit?: () => void;
  currentUser: { username: string; isAdmin: boolean } | null;
}

export default function ReportForm({ onSubmit, currentUser }: ReportFormProps) {
  const [formData, setFormData] = useState({
    type: 'mission',
    title: '',
    description: '',
    participants: '',
    outcome: '',
    priority: 'moyenne',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    const newReport = {
      id: Math.max(0, ...existingReports.map((r: any) => r.id)) + 1,
      ...formData,
      status: 'En cours',
      author: currentUser?.username || 'Inconnu',
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedReports = [...existingReports, newReport];
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    
    alert('Rapport soumis avec succès!');
    setFormData({
      type: 'mission',
      title: '',
      description: '',
      participants: '',
      outcome: '',
      priority: 'moyenne',
    });
    
    if (onSubmit) onSubmit();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Nouveau Rapport</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de rapport</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mission">Rapport de mission</option>
              <option value="training">Rapport d'entraînement</option>
              <option value="incident">Rapport d'incident</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priorité</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
              <option value="critique">Critique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Participants</label>
          <input
            type="text"
            value={formData.participants}
            onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
            placeholder="Noms des participants"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Résultat/Conclusion</label>
          <textarea
            value={formData.outcome}
            onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
            rows={2}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Soumettre le rapport
        </button>
      </form>
    </div>
  );
}