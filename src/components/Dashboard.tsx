import React, { useState, useEffect } from 'react';
import { FileText, Users, TrendingUp, Activity } from 'lucide-react';
import { useActivityLogStore } from '../stores/activityLogStore';

interface DashboardProps {
  currentUser: { username: string; isAdmin: boolean } | null;
}

export default function Dashboard({ currentUser }: DashboardProps) {
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    weeklyReports: 0,
    totalConnections: 0,
    activeUsers: 0
  });

  const activityLogs = useActivityLogStore((state) => state.activityLogs);

  useEffect(() => {
    // Charger les rapports
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      const allReports = JSON.parse(savedReports);
      const sortedReports = allReports.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 5);
      setRecentReports(sortedReports);

      // Calculer les statistiques des rapports
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const weeklyReports = allReports.filter((report: any) => 
        new Date(report.date) >= oneWeekAgo
      ).length;

      setStats(prev => ({
        ...prev,
        totalReports: allReports.length,
        weeklyReports
      }));
    }

    // Calculer les statistiques des connexions et utilisateurs actifs
    const connections = activityLogs.filter(log => 
      log.action === 'Connexion' &&
      new Date(log.timestamp) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    const uniqueUsers = new Set(
      activityLogs
        .filter(log => 
          new Date(log.timestamp) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
        )
        .map(log => log.username)
    ).size;

    setStats(prev => ({
      ...prev,
      totalConnections: connections,
      activeUsers: uniqueUsers
    }));
  }, [activityLogs]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rapports cette semaine</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.weeklyReports}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total: {stats.totalReports} rapports
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connexions (24h)</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalConnections}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Utilisateurs actifs: {stats.activeUsers}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activité récente</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {activityLogs.slice(0, 10).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Dernières 24 heures
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Membres actifs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                En ligne aujourd'hui
              </p>
            </div>
          </div>
        </div>

        {/* Rapports récents */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Rapports récents</h2>
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {recentReports.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Aucun rapport disponible
              </p>
            ) : (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{report.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-300 mr-3">{report.type}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Par {report.author}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{report.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}