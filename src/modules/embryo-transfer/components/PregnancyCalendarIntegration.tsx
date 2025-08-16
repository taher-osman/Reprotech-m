import React from 'react';
import { format, isToday, isBefore, isAfter, differenceInDays } from 'date-fns';
import { Calendar, Heart, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { PregnancyCheckpoint } from '../types/transferTypes';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'pregnancy_check' | 'parturition';
  animalId: string;
  transferId: string;
  assignedTo?: string;
  status: 'pending' | 'overdue' | 'completed' | 'due_today';
  checkpoint: PregnancyCheckpoint;
}

interface PregnancyCalendarIntegrationProps {
  transfers: any[]; // Would be properly typed TransferRecord[]
  onEventClick?: (event: CalendarEvent) => void;
}

const PregnancyCalendarIntegration: React.FC<PregnancyCalendarIntegrationProps> = ({
  transfers,
  onEventClick
}) => {
  
  // Generate calendar events from pregnancy checkpoints
  const generateCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const today = new Date();

    transfers.forEach(transfer => {
      if (transfer.pregnancyTracking?.checkpoints) {
        transfer.pregnancyTracking.checkpoints.forEach(checkpoint => {
          if (!checkpoint.performed) {
            const scheduledDate = new Date(checkpoint.scheduledDate);
            let status: 'pending' | 'overdue' | 'completed' | 'due_today' = 'pending';
            
            if (isToday(scheduledDate)) {
              status = 'due_today';
            } else if (isBefore(scheduledDate, today)) {
              status = 'overdue';
            }

            events.push({
              id: `${transfer.id}-${checkpoint.id}`,
              title: `${checkpoint.title} - ${transfer.recipientName}`,
              date: scheduledDate,
              type: checkpoint.isParturition ? 'parturition' : 'pregnancy_check',
              animalId: transfer.recipientId,
              transferId: transfer.transferId,
              assignedTo: transfer.veterinarian,
              status,
              checkpoint
            });
          }
        });
      }
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const events = generateCalendarEvents();
  const upcomingEvents = events.filter(event => 
    isAfter(event.date, new Date()) || isToday(event.date)
  ).slice(0, 5);
  
  const overdueEvents = events.filter(event => 
    event.status === 'overdue'
  );
  
  const todayEvents = events.filter(event => 
    event.status === 'due_today'
  );

  const getEventIcon = (event: CalendarEvent) => {
    switch (event.status) {
      case 'due_today': return Clock;
      case 'overdue': return AlertTriangle;
      case 'completed': return CheckCircle;
      default: return Heart;
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    switch (event.status) {
      case 'due_today': return 'text-orange-600 bg-orange-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const formatEventTitle = (event: CalendarEvent) => {
    const daysUntil = differenceInDays(event.date, new Date());
    if (daysUntil === 0) return 'Due Today';
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
    return `In ${daysUntil} days`;
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-medium">Overdue Checks</p>
              <p className="text-2xl font-bold text-red-900">{overdueEvents.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-800 font-medium">Due Today</p>
              <p className="text-2xl font-bold text-orange-900">{todayEvents.length}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium">Upcoming</p>
              <p className="text-2xl font-bold text-blue-900">{upcomingEvents.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Overdue Events - Priority */}
      {overdueEvents.length > 0 && (
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Overdue Pregnancy Checks - Immediate Action Required
          </h3>
          <div className="space-y-3">
            {overdueEvents.map(event => {
              const EventIcon = getEventIcon(event);
              return (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200 cursor-pointer hover:bg-red-50"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <EventIcon className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {event.transferId} • {format(event.date, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    {formatEventTitle(event)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Due Today
          </h3>
          <div className="space-y-3">
            {todayEvents.map(event => {
              const EventIcon = getEventIcon(event);
              return (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 cursor-pointer hover:bg-orange-50"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <EventIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {event.transferId} • Assigned to {event.assignedTo}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    Due Today
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Upcoming Pregnancy Checks
        </h3>
        <div className="space-y-3">
          {upcomingEvents.slice(0, 8).map(event => {
            const EventIcon = getEventIcon(event);
            return (
              <div 
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => onEventClick?.(event)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getEventColor(event)}`}>
                    <EventIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {event.transferId} • {format(event.date, 'MMM dd, yyyy')} • {event.assignedTo}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventColor(event)}`}>
                  {formatEventTitle(event)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Export Button */}
      <div className="flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Calendar className="h-4 w-4 mr-2" />
          Export to Calendar
        </button>
      </div>
    </div>
  );
};

// Utility function to create calendar events for external calendar systems
export const exportPregnancyEventsToCalendar = (transfers: any[]): string => {
  // This would generate iCal format or integrate with calendar APIs
  const events: CalendarEvent[] = [];
  
  transfers.forEach(transfer => {
    if (transfer.pregnancyTracking?.checkpoints) {
      transfer.pregnancyTracking.checkpoints.forEach(checkpoint => {
        if (!checkpoint.performed) {
          events.push({
            id: `${transfer.id}-${checkpoint.id}`,
            title: `${checkpoint.title} - ${transfer.recipientName}`,
            date: new Date(checkpoint.scheduledDate),
            type: checkpoint.isParturition ? 'parturition' : 'pregnancy_check',
            animalId: transfer.recipientId,
            transferId: transfer.transferId,
            assignedTo: transfer.veterinarian,
            status: 'pending',
            checkpoint
          });
        }
      });
    }
  });

  // Generate iCal format
  let icalContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Reprotech//Pregnancy Tracking//EN\n';
  
  events.forEach(event => {
    icalContent += 'BEGIN:VEVENT\n';
    icalContent += `DTSTART:${format(event.date, 'yyyyMMdd')}T090000Z\n`;
    icalContent += `DTEND:${format(event.date, 'yyyyMMdd')}T100000Z\n`;
    icalContent += `SUMMARY:${event.title}\n`;
    icalContent += `DESCRIPTION:Pregnancy check for ${event.transferId} - Assigned to ${event.assignedTo}\n`;
    icalContent += `UID:${event.id}@reprotech.com\n`;
    icalContent += 'END:VEVENT\n';
  });
  
  icalContent += 'END:VCALENDAR';
  
  return icalContent;
};

export default PregnancyCalendarIntegration; 