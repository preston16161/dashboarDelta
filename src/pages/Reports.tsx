import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Trash2, X, Eye } from 'lucide-react';
import ReportForm from '../components/ReportForm';
import { useNotificationsStore } from '../stores/notificationsStore';
import { useActivityLogStore } from '../stores/activityLogStore';

interface ReportsProps {
  currentUser: { username: string; isAdmin: boolean } | null;
}

export default function Reports({ currentUser }: ReportsProps) {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<any[]>([]);

  const { addNotification } = useNotificationsStore();
  const { addLog } = useActivityLogStore();

  useEffect(() => {
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const handleDeleteReport = (reportId: number) => {
    if (!currentUser?.isAdmin) {
      alert('Seul un administrateur peut supprimer des rapports.');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      const reportToDelete = reports.find(r => r.id === reportId);
      const updatedReports = reports.filter(report => report.id !== reportId);
      setReports(updatedReports);
      localStorage.setItem('reports', JSON.stringify(updatedReports));

      // Ajouter une notification et un log d'activité
      addNotification({
        title: 'Rapport supprimé',
        message: `Le rapport "${reportToDelete.title}" a été supprimé par ${currentUser.username}`,
        type: 'warning',
        forAdmin: true
      });

      addLog({
        action: 'Suppression de rapport',
        details: `Le rapport "${reportToDelete.title}" a été supprimé`,
        username: currentUser.username
      });
    }
  };

  const handleViewDetails = (report: any) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      const newReports = JSON.parse(savedReports);
      setReports(newReports);

      // Ajouter une notification pour le nouveau rapport
      const latestReport = newReports[newReports.length - 1];
      addNotification({
        title: 'Nouveau rapport',
        message: `Un nouveau rapport "${latestReport.title}" a été créé par ${latestReport.author}`,
        type: 'info'
      });
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = (
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.participants?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilter = filter === 'all' || report.type.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Rapports</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <FileText className="w-5 h-5 mr-2" />
          Nouveau Rapport
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="all">Tous les types</option>
              <option value="mission">Missions</option>
              <option value="training">Entraînements</option>
              <option value="incident">Incidents</option>
            </select>
            <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md dark:text-gray-400 dark:border-gray-600 dark:hover:text-white">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Auteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Priorité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredReports.map((report: any) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{report.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{report.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{report.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.priority === 'critique' ? 'bg-red-100 text-red-800' :
                      report.priority === 'haute' ? 'bg-orange-100 text-orange-800' :
                      report.priority === 'moyenne' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Voir les détails"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {currentUser?.isAdmin && (
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Nouveau Rapport</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <ReportForm onSubmit={handleFormSubmit} currentUser={currentUser} />
          </div>
        </div>
      )}

      {showDetails && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Détails du Rapport</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold dark:text-white">Titre</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedReport.title}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold dark:text-white">Type</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedReport.type}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold dark:text-white">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedReport.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold dark:text-white">Participants</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedReport.participants}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold dark:text-white">Résultat/Conclusion</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedReport.outcome}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold dark:text-white">Priorité</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedReport.priority === 'critique' ? 'bg-red-100 text-red-800' :
                    selectedReport.priority === 'haute' ? 'bg-orange-100 text-orange-800' :
                    selectedReport.priority === 'moyenne' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedReport.priority}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold dark:text-white">Statut</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedReport.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}