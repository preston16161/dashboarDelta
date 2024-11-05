import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface CalendarProps {
  events: Array<{
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    type: string;
    status: string;
  }>;
  onDayClick?: (date: Date) => void;
  onDeleteEvent?: (eventId: number) => void;
}

export default function Calendar({ events, onDayClick, onDeleteEvent }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventDetails, setShowEventDetails] = useState<number | null>(null);

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

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const handleEventClick = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    setShowEventDetails(eventId === showEventDetails ? null : eventId);
  };

  const handleDeleteClick = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    if (onDeleteEvent) {
      onDeleteEvent(eventId);
    }
    setShowEventDetails(null);
  };

  const renderDays = () => {
    const days = [];
    const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    // Ajouter les jours de la semaine
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="font-semibold text-center p-2 border-b dark:border-gray-700">
          {daysOfWeek[i]}
        </div>
      );
    }

    // Ajouter les cases vides pour le début du mois
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-50 dark:bg-gray-800 p-2 min-h-[100px] border dark:border-gray-700"></div>
      );
    }

    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          onClick={() => onDayClick && onDayClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={`relative p-2 min-h-[100px] border dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
            isToday ? 'bg-blue-50 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div className={`absolute top-1 left-1 w-6 h-6 flex items-center justify-center rounded-full ${
            isToday ? 'bg-blue-500 text-white' : ''
          }`}>
            {day}
          </div>
          <div className="mt-6 space-y-1">
            {dayEvents.map((event) => (
              <div key={event.id} className="relative">
                <div
                  onClick={(e) => handleEventClick(e, event.id)}
                  className={`text-xs p-1 rounded truncate cursor-pointer ${
                    event.type === 'Mission' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    event.type === 'Formation' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    event.type === 'Réunion' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                  title={event.title}
                >
                  {event.title}
                </div>
                {showEventDetails === event.id && (
                  <div className="absolute z-10 left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 border dark:border-gray-700">
                    <div className="text-xs space-y-1">
                      <p className="font-semibold dark:text-white">{event.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">Type: {event.type}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Début: {new Date(event.startDate).toLocaleString()}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Fin: {new Date(event.endDate).toLocaleString()}
                      </p>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={(e) => handleDeleteClick(e, event.id)}
                          className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">
          {monthName} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ChevronRight className="w-5 h-5 dark:text-white" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
}