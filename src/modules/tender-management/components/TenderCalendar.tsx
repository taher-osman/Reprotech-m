import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Award, 
  AlertTriangle,
  Eye
} from 'lucide-react';
import { TenderCalendarEvent, TenderStatus } from '../types/tenderTypes';

interface TenderCalendarProps {
  events: TenderCalendarEvent[];
  onEventClick?: (event: TenderCalendarEvent) => void;
  className?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: TenderCalendarEvent[];
}

const statusColors = {
  [TenderStatus.OPEN]: 'bg-green-500',
  [TenderStatus.DRAFT]: 'bg-gray-500',
  [TenderStatus.SUBMITTED]: 'bg-blue-500',
  [TenderStatus.EVALUATING]: 'bg-yellow-500',
  [TenderStatus.NEGOTIATING]: 'bg-purple-500',
  [TenderStatus.AWARDED]: 'bg-emerald-500',
  [TenderStatus.REJECTED]: 'bg-red-500',
  [TenderStatus.CANCELLED]: 'bg-slate-500'
};

const eventTypeIcons = {
  deadline: Clock,
  opening: Eye,
  award: Award,
  milestone: AlertTriangle
};

const eventTypeColors = {
  deadline: 'bg-red-100 text-red-800 border-red-200',
  opening: 'bg-blue-100 text-blue-800 border-blue-200',
  award: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  milestone: 'bg-purple-100 text-purple-800 border-purple-200'
};

export const TenderCalendar: React.FC<TenderCalendarProps> = ({
  events,
  onEventClick,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, events]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === current.toDateString();
      });
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDayClass = (day: CalendarDay) => {
    let classes = 'h-32 p-2 border border-gray-200 relative';
    
    if (!day.isCurrentMonth) {
      classes += ' bg-gray-50 text-gray-400';
    } else if (day.isToday) {
      classes += ' bg-blue-50 border-blue-300';
    }
    
    return classes;
  };

  const getEventClass = (event: TenderCalendarEvent) => {
    const baseClass = 'text-xs px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-80';
    return `${baseClass} ${eventTypeColors[event.type]}`;
  };

  const handleEventClick = (event: TenderCalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Tender Calendar
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="text-center text-lg font-medium text-gray-900">
        {formatDate(currentDate)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div key={index} className={getDayClass(day)}>
                  <div className="text-sm font-medium mb-1">
                    {day.date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {day.events.map((event, eventIndex) => {
                      const EventIcon = eventTypeIcons[event.type];
                      return (
                        <div
                          key={eventIndex}
                          className={getEventClass(event)}
                          onClick={(e) => handleEventClick(event, e)}
                          title={`${event.title} - ${new Date(event.date).toLocaleDateString()}`}
                        >
                          <div className="flex items-center space-x-1">
                            <EventIcon className="h-3 w-3" />
                            <span className="truncate">{event.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upcoming Events
            </h3>
            
            <div className="space-y-3">
              {getUpcomingEvents().map((event, index) => {
                const EventIcon = eventTypeIcons[event.type];
                return (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded ${eventTypeColors[event.type]}`}>
                        <EventIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div 
                            className={`w-2 h-2 rounded-full ${statusColors[event.status]}`}
                          />
                          <span className="text-xs text-gray-600">
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {getUpcomingEvents().length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming events
                </p>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Event Types
            </h3>
            
            <div className="space-y-2">
              {Object.entries(eventTypeIcons).map(([type, Icon]) => (
                <div key={type} className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${eventTypeColors[type as keyof typeof eventTypeColors]}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="text-sm text-gray-600 capitalize">
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderCalendar; 