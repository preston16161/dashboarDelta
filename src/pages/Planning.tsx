import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, List, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useNotificationsStore } from '../stores/notificationsStore';
import { useRolesStore } from '../stores/rolesStore';

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
}

interface PlanningProps {
  currentUser: { username: string; isAdmin: boolean; roles?: string[] } | null;
}

export default function Planning({ currentUser }: PlanningProps) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    type: 'mission',
    date: '',
    description: ''
  });

  const { addNotification } = useNotificationsStore();
  const { hasPermission } = useRolesStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: number) => {
    const month = currentDate.getMonth() + 1;
    const dateStr = `${currentDate.getFullYear()}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setCurrentEvent(prev => ({ ...prev, date: dateStr }));
    setShowEventForm(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const getEventsForDate = (date: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      ...currentEvent
    };
    setEvents([...events, newEvent]);
    setCurrentEvent({
      title: '',
      type: 'mission',
      date: '',
      description: ''
    });
    setShowEventForm(false);

    addNotification({
      title: 'Nouvel événement',
      message: `L'événement "${newEvent.title}" a été créé`,
      type: 'success'
    });
  };

  const handleDelete = (id: string) => {
    if (!currentUser?.isAdmin && !hasPermission(currentUser?.roles || [], 'manage_events')) {
      addNotification({
        title: 'Accès refusé',
        message: 'Vous n\'avez pas les permissions nécessaires pour supprimer des événements',
        type: 'warning'
      });
      return;
    }

    const eventToDelete = events.find(event => event.id === id);
    if (eventToDelete && window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      setEvents(events.filter(event => event.id !== id));
      setShowEventDetails(false);
      setSelectedEvent(null);
      addNotification({
        title: 'Événement supprimé',
        message: `L'événement "${eventToDelete.title}" a été supprimé`,
        type: 'warning'
      });
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // En-têtes des jours de la semaine
    const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    daysOfWeek.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="font-semibold text-center p-2 text-gray-700 dark:text-gray-300">
          {day}
        </div>
      );
    });

    // Cases vides pour le début du mois
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-50 dark:bg-gray-800 p-2 min-h-[120px] border border-gray-200 dark:border-gray-700" />
      );
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`relative p-2 min-h-[120px] border border-gray-200 dark:border-gray-700 cursor-pointer
            ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}
            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
        >
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full
            ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {day}
          </span>
          <div className="mt-2 space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                onClick={(e) => handleEventClick(e, event)}
                className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-75
                  ${event.type === 'mission' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  event.type === 'entrainement' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  event.type === 'reunion' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planning</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowEventList(!showEventList)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <List className="w-5 h-5 mr-2" />
            Voir les événements
          </button>
          <button
            onClick={() => {
              setSelectedDate(new Date().toISOString().split('T')[0]);
              setShowEventForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvel événement
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {/* Modal des détails d'un événement */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Détails de l'événement</h2>
                <button
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold dark:text-white">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedEvent.date).toLocaleDateString()} - {selectedEvent.type}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>

                {(currentUser?.isAdmin || hasPermission(currentUser?.roles || [], 'manage_events')) && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => handleDelete(selectedEvent.id)}
                      className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5 mr-1" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Autres modals (liste des événements et formulaire) restent inchangés */}
      {showEventList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">Liste des événements</h2>
                <button
                  onClick={() => setShowEventList(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Aucun événement planifié
                  </p>
                ) : (
                  events.map(event => (
                    <div
                      key={event.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium dark:text-white">{event.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString()} - {event.type}
                          </p>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">
                            {event.description}
                          </p>
                        </div>
                        {(currentUser?.isAdmin || hasPermission(currentUser?.roles || [], 'manage_events')) && (
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">
                  {currentEvent.id ? 'Modifier l\'événement' : 'Nouvel événement'}
                </h2>
                <button
                  onClick={() => setShowEventForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={currentEvent.title}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <select
                    value={currentEvent.type}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="mission">Mission</option>
                    <option value="entrainement">Entraînement</option>
                    <option value="reunion">Réunion</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <input
                    type="date"
                    value={currentEvent.date}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={currentEvent.description}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {currentEvent.id ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}