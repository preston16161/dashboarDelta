import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Reports from './pages/Reports';
import Personnel from './pages/Personnel';
import Planning from './pages/Planning';
import Communications from './pages/Communications';
import { usePreferencesStore } from './stores/preferencesStore';
import { useNotificationsStore } from './stores/notificationsStore';
import { useActivityLogStore } from './stores/activityLogStore';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{username: string; isAdmin: boolean} | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { getUserPreferences } = usePreferencesStore();
  const { addNotification } = useNotificationsStore();
  const { addLog } = useActivityLogStore();

  useEffect(() => {
    if (currentUser) {
      const preferences = getUserPreferences(currentUser.username);
      document.documentElement.classList.toggle('dark', preferences.darkMode);
    }
  }, [currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'Preston1616' && password === 'preston1616') {
      setIsLoggedIn(true);
      setCurrentUser({ username: 'Preston1616', isAdmin: true });
      addLog({
        action: 'Connexion',
        details: 'Connexion administrateur',
        username: 'admin'
      });
      return;
    }

    const savedMembers = localStorage.getItem('members');
    if (savedMembers) {
      const members = JSON.parse(savedMembers);
      const user = members.find(
        (member: any) => 
          member.username === username && 
          member.password === password
      );

      if (user) {
        if (user.status === 'Inactif') {
          alert('Ce compte a été désactivé. Veuillez contacter un administrateur.');
          return;
        }
        setIsLoggedIn(true);
        setCurrentUser({ username: user.username, isAdmin: false });
        addLog({
          action: 'Connexion',
          details: `Connexion de l'utilisateur ${user.username}`,
          username: user.username
        });
        return;
      }
    }

    alert('Identifiants incorrects');
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog({
        action: 'Déconnexion',
        details: `Déconnexion de l'utilisateur ${currentUser.username}`,
        username: currentUser.username
      });
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
        />
        <Routes>
          <Route path="/" element={<Dashboard currentUser={currentUser} />} />
          <Route 
            path="/personnel" 
            element={
              currentUser?.isAdmin ? (
                <Personnel currentUser={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/reports" element={<Reports currentUser={currentUser} />} />
          <Route path="/planning" element={<Planning currentUser={currentUser} />} />
          <Route path="/communications" element={<Communications currentUser={currentUser} />} />
        </Routes>
      </div>
    </Router>
  );
}