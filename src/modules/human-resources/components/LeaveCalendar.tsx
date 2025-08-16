import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Print,
  Eye,
  Edit,
  Flag,
  Star,
  MapPin
} from 'lucide-react';
import { 
  LeaveCalendar as LeaveCalendarType, 
  PublicHoliday, 
  EmployeeRequest 
} from '../types/hrTypes';

interface LeaveCalendarProps {
  viewMode?: 'personal' | 'team' | 'manager';
  employeeId?: string;
  teamMembers?: string[];
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  viewMode = 'personal',
  employeeId = 'EMP-001',
  teamMembers = []
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'agenda'>('month');
  const [leaveEvents, setLeaveEvents] = useState<LeaveCalendarType[]>([]);
  const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<LeaveCalendarType | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, viewMode, employeeId]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      // Mock leave events data
      const mockLeaveEvents: LeaveCalendarType[] = [
        {
          id: 'LEAVE-001',
          employeeId: 'EMP-001',
          departmentId: 'IT',
          leaveType: 'Annual Leave',
          startDate: '2025-02-15',
          endDate: '2025-02-22',
          totalDays: 7,
          status: 'Approved',
          isPublicHoliday: false,
          isCompanyEvent: false,
          conflictsWith: [],
          coveringEmployee: 'EMP-003',
          handoverCompleted: true,
          emergencyContact: {
            name: 'Fatima Al-Zahra',
            phone: '+966 55 123 4567',
            relationship: 'Spouse'
          }
        },
        {
          id: 'LEAVE-002',
          employeeId: 'EMP-002',
          departmentId: 'IT',
          leaveType: 'Sick Leave',
          startDate: '2025-01-10',
          endDate: '2025-01-12',
          totalDays: 3,
          status: 'Approved',
          isPublicHoliday: false,
          isCompanyEvent: false,
          conflictsWith: [],
          handoverCompleted: false
        },
        {
          id: 'LEAVE-003',
          employeeId: 'EMP-003',
          departmentId: 'IT',
          leaveType: 'Emergency Leave',
          startDate: '2025-03-05',
          endDate: '2025-03-06',
          totalDays: 2,
          status: 'Pending',
          isPublicHoliday: false,
          isCompanyEvent: false,
          conflictsWith: [],
          handoverCompleted: false
        }
      ];

      // Mock public holidays
      const mockPublicHolidays: PublicHoliday[] = [
        {
          id: 'HOLIDAY-001',
          name: {
            arabic: 'يوم التأسيس',
            english: 'Founding Day'
          },
          date: '2025-02-22',
          isNational: true,
          isReligious: false,
          isOptional: false,
          isRecurring: true,
          affectedEmployees: 'All'
        },
        {
          id: 'HOLIDAY-002',
          name: {
            arabic: 'اليوم الوطني',
            english: 'National Day'
          },
          date: '2025-09-23',
          isNational: true,
          isReligious: false,
          isOptional: false,
          isRecurring: true,
          affectedEmployees: 'All'
        },
        {
          id: 'HOLIDAY-003',
          name: {
            arabic: 'عيد الفطر',
            english: 'Eid Al-Fitr'
          },
          date: '2025-03-30',
          isNational: false,
          isReligious: true,
          isOptional: false,
          isRecurring: true,
          affectedEmployees: 'Muslims'
        },
        {
          id: 'HOLIDAY-004',
          name: {
            arabic: 'عيد الأضحى',
            english: 'Eid Al-Adha'
          },
          date: '2025-06-06',
          isNational: false,
          isReligious: true,
          isOptional: false,
          isRecurring: true,
          affectedEmployees: 'Muslims'
        }
      ];

      setLeaveEvents(mockLeaveEvents);
      setPublicHolidays(mockPublicHolidays);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];
    
    // Add empty days for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(new Date(year, month, -startingDayOfWeek + i + 1));
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add empty days for next month to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date): (LeaveCalendarType | PublicHoliday)[] => {
    const dateStr = date.toISOString().split('T')[0];
    const events: (LeaveCalendarType | PublicHoliday)[] = [];

    // Add leave events
    leaveEvents.forEach(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      if (date >= startDate && date <= endDate) {
        events.push(leave);
      }
    });

    // Add public holidays
    publicHolidays.forEach(holiday => {
      if (holiday.date === dateStr) {
        events.push(holiday);
      }
    });

    return events;
  };

  const getEventColor = (event: LeaveCalendarType | PublicHoliday): string => {
    if ('name' in event) {
      // Public holiday
      if (event.isNational) return 'bg-green-100 text-green-800 border-green-200';
      if (event.isReligious) return 'bg-purple-100 text-purple-800 border-purple-200';
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      // Leave event
      switch (event.status) {
        case 'Approved':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Rejected':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const getLeaveTypeIcon = (leaveType: string) => {
    switch (leaveType) {
      case 'Annual Leave':
        return <Calendar className="w-3 h-3" />;
      case 'Sick Leave':
        return <AlertTriangle className="w-3 h-3" />;
      case 'Emergency Leave':
        return <Clock className="w-3 h-3" />;
      case 'Maternity/Paternity':
        return <Users className="w-3 h-3" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const filteredEvents = leaveEvents.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesEmployee = filterEmployee === 'all' || event.employeeId === filterEmployee;
    return matchesStatus && matchesEmployee;
  });

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const today = new Date();
    const currentMonth = currentDate.getMonth();

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isToday = day.toDateString() === today.toDateString();
            const events = getEventsForDate(day);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      onClick={() => {
                        if ('leaveType' in event) {
                          setSelectedEvent(event);
                          setShowEventModal(true);
                        }
                      }}
                      className={`text-xs p-1 rounded cursor-pointer border ${getEventColor(event)}`}
                    >
                      {'name' in event ? (
                        <div className="flex items-center space-x-1">
                          <Flag className="w-3 h-3" />
                          <span className="truncate">{event.name.english}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          {getLeaveTypeIcon(event.leaveType)}
                          <span className="truncate">{event.leaveType}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => (
    <div className="space-y-4">
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => {
              setSelectedEvent(event);
              setShowEventModal(true);
            }}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getEventColor(event)}`}>
                  {getLeaveTypeIcon(event.leaveType)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{event.leaveType}</h4>
                  <p className="text-sm text-gray-600">Employee ID: {event.employeeId}</p>
                </div>
              </div>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventColor(event)}`}>
                {event.status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                {event.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                {event.status}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Duration:</span> {event.totalDays} days
              </div>
              <div>
                <span className="font-medium">From:</span> {new Date(event.startDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">To:</span> {new Date(event.endDate).toLocaleDateString()}
              </div>
            </div>
            
            {event.coveringEmployee && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Cover:</span> {event.coveringEmployee}
              </div>
            )}
            
            {event.conflictsWith.length > 0 && (
              <div className="mt-2 flex items-center space-x-1 text-sm text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Has conflicts</span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Leave Events</h3>
          <p className="text-gray-500">No leave events found for the selected filters.</p>
        </div>
      )}
    </div>
  );

  const EventModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Leave Details</h3>
            <button
              onClick={() => setShowEventModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        
        {selectedEvent && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                <div className="mt-1 text-gray-900">{selectedEvent.leaveType}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventColor(selectedEvent)}`}>
                  {selectedEvent.status}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <div className="mt-1 text-gray-900">{new Date(selectedEvent.startDate).toLocaleDateString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <div className="mt-1 text-gray-900">{new Date(selectedEvent.endDate).toLocaleDateString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Days</label>
                <div className="mt-1 text-gray-900">{selectedEvent.totalDays} days</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <div className="mt-1 text-gray-900">{selectedEvent.employeeId}</div>
              </div>
            </div>
            
            {selectedEvent.coveringEmployee && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Covering Employee</label>
                <div className="mt-1 text-gray-900">{selectedEvent.coveringEmployee}</div>
              </div>
            )}
            
            {selectedEvent.emergencyContact && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                <div className="mt-1 space-y-1">
                  <div className="text-gray-900">{selectedEvent.emergencyContact.name}</div>
                  <div className="text-sm text-gray-600">{selectedEvent.emergencyContact.phone}</div>
                  <div className="text-sm text-gray-600">{selectedEvent.emergencyContact.relationship}</div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`w-5 h-5 ${selectedEvent.handoverCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-700">Handover Completed</span>
              </div>
            </div>
            
            {selectedEvent.conflictsWith.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conflicts</label>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">This leave conflicts with other team members</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowEventModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
            {viewMode === 'manager' && selectedEvent?.status === 'Pending' && (
              <>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Reject
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Calendar</h2>
          <p className="text-gray-600">
            {viewMode === 'personal' && 'View your leave schedule and public holidays'}
            {viewMode === 'team' && 'Team leave overview and planning'}
            {viewMode === 'manager' && 'Manage team leave and approve requests'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                calendarView === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCalendarView('agenda')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                calendarView === 'agenda' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Agenda
            </button>
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Print className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      {calendarView === 'month' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Today
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        
        {viewMode !== 'personal' && (
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Employees</option>
            <option value="EMP-001">Ahmed Al-Mansouri</option>
            <option value="EMP-002">Fatima Hassan</option>
            <option value="EMP-003">Mohammed Al-Rashid</option>
          </select>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-700">Approved Leave</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-sm text-gray-700">Pending Leave</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-700">National Holiday</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
            <span className="text-sm text-gray-700">Religious Holiday</span>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {calendarView === 'month' && renderMonthView()}
      {calendarView === 'agenda' && renderAgendaView()}

      {/* Event Modal */}
      {showEventModal && <EventModal />}
    </div>
  );
};

export default LeaveCalendar; 