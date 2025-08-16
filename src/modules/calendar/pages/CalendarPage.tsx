import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  Grid,
  List,
  Download,
  Search,
  Users,
  Activity,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import apiService from '../../../services/api';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'ultrasonography' | 'breeding' | 'flushing' | 'embryo-transfer';
  animals: {
    count: number;
    list?: Array<{
      id: string;
      animalID: string;
      name: string;
      species: string;
    }>;
  };
  location?: string;
  technician?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  module: string;
  moduleData?: any; // Original data from the source module
}

interface SessionSummary {
  date: string;
  sessions: Array<{
    type: string;
    count: number;
    events: CalendarEvent[];
  }>;
  totalAnimals: number;
  totalSessions: number;
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReproductionData();
  }, [currentDate, viewMode]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, typeFilter, statusFilter]);

  const fetchReproductionData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from all reproduction modules
      const [ultrasoundResponse, breedingResponse, flushingResponse] = await Promise.all([
        apiService.get<{ exams?: any[] }>('/ultrasound/exams'),
        apiService.get<{ sessions?: any[] }>('/breeding/sessions'),
        apiService.get<{ sessions?: any[] }>('/flushing/sessions')
      ]);

      const combinedEvents: CalendarEvent[] = [];

      // Convert ultrasound exams to calendar events
      if (ultrasoundResponse.exams) {
        ultrasoundResponse.exams.forEach(exam => {
          combinedEvents.push({
            id: `ultrasound-${exam.id}`,
            title: `Ultrasound Session - ${exam.examType}`,
            date: exam.examDate,
            time: `${8 + Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 6)}0`,
            type: 'ultrasonography',
            animals: {
              count: 1,
              list: [{
                id: exam.animalId,
                animalID: exam.animalId,
                name: `Animal ${exam.animalId}`,
                species: 'BOVINE'
              }]
            },
            location: 'Ultrasound Room',
            technician: exam.veterinarian,
            priority: 'MEDIUM',
            status: 'COMPLETED',
            description: `${exam.examType} - ${exam.findings?.pregnancyStatus || 'Examination'}`,
            module: 'ultrasound',
            moduleData: exam
          });
        });
      }

      // Convert breeding sessions to calendar events
      if (breedingResponse.sessions) {
        breedingResponse.sessions.forEach(session => {
          combinedEvents.push({
            id: `breeding-${session.id}`,
            title: `Breeding Session - ${session.method}`,
            date: session.breedingDate,
            time: `${8 + Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 6)}0`,
            type: 'breeding',
            animals: {
              count: 2,
              list: [
                {
                  id: session.femaleId,
                  animalID: session.femaleId,
                  name: `Female ${session.femaleId}`,
                  species: 'BOVINE'
                },
                {
                  id: session.maleId,
                  animalID: session.maleId,
                  name: `Male ${session.maleId}`,
                  species: 'BOVINE'
                }
              ]
            },
            location: session.location,
            technician: session.technician,
            priority: session.success ? 'HIGH' : 'MEDIUM',
            status: session.success ? 'COMPLETED' : 'SCHEDULED',
            description: `${session.method} breeding - ${session.success ? 'Successful' : 'Pending'}`,
            module: 'breeding',
            moduleData: session
          });
        });
      }

      // Convert flushing sessions to calendar events
      if (flushingResponse.sessions) {
        flushingResponse.sessions.forEach(session => {
          combinedEvents.push({
            id: `flushing-${session.id}`,
            title: `Flushing Session - ${session.sessionType}`,
            date: session.sessionDate,
            time: `${8 + Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 6)}0`,
            type: 'flushing',
            animals: {
              count: 1,
              list: [{
                id: session.donorId,
                animalID: session.donorId,
                name: `Donor ${session.donorId}`,
                species: 'BOVINE'
              }]
            },
            location: session.location,
            technician: session.technician,
            priority: 'HIGH',
            status: 'COMPLETED',
            description: `${session.sessionType} - ${session.embryosCollected} embryos collected (${session.viableEmbryos} viable)`,
            module: 'flushing',
            moduleData: session
          });
        });
      }

      setEvents(combinedEvents);
    } catch (error) {
      console.error('Error fetching reproduction data:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.technician?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => event.date === dateStr);
  };

  const getSessionSummary = (date: Date): SessionSummary => {
    const dayEvents = getEventsForDate(date);
    const sessionsByType = dayEvents.reduce((acc, event) => {
      if (!acc[event.type]) {
        acc[event.type] = {
          type: event.type,
          count: 0,
          events: []
        };
      }
      acc[event.type].count++;
      acc[event.type].events.push(event);
      return acc;
    }, {} as Record<string, any>);

    return {
      date: date.toISOString().split('T')[0],
      sessions: Object.values(sessionsByType),
      totalAnimals: dayEvents.reduce((sum, event) => sum + event.animals.count, 0),
      totalSessions: dayEvents.length
    };
  };

  const toggleSessionExpansion = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setViewMode('day');
    setCurrentDate(date);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'ultrasonography': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'breeding': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'flushing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'embryo-transfer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

    return (
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-0 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-gray-900 bg-gray-50 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, index) => {
            const summary = getSessionSummary(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate === day.toISOString().split('T')[0];

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`min-h-24 p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth(day) ? 'bg-gray-50 text-gray-400' : ''
                } ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center' : ''
                }`}>
                  {day.getDate()}
                </div>
                
                {/* Collapsed Session Summary */}
                <div className="space-y-1">
                  {summary.sessions.slice(0, 2).map((session, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-1 rounded border ${getEventColor(session.type)}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{session.type}</span>
                        <span className="text-xs">{session.count}</span>
                      </div>
                      <div className="text-xs opacity-75">
                        {session.events.reduce((sum, e) => sum + e.animals.count, 0)} animals
                      </div>
                    </div>
                  ))}
                  {summary.sessions.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{summary.sessions.length - 2} more
                    </div>
                  )}
                  {summary.totalSessions > 0 && (
                    <div className="text-xs text-blue-600 font-medium">
                      Total: {summary.totalAnimals} animals
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

  const renderDayView = () => {
    const summary = getSessionSummary(currentDate);

    return (
      <div className="bg-white rounded-lg shadow border">
        {/* Day Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('month')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Month</span>
              </button>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-sm text-gray-600">
                  {summary.totalSessions} sessions • {summary.totalAnimals} animals
                </p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>Add Session</span>
            </button>
          </div>
        </div>

        {/* Day Content */}
        <div className="p-6">
          {summary.sessions.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reproductive activities scheduled for this day</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Schedule Activity
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {summary.sessions.map((session, index) => {
                const sessionKey = `${summary.date}-${session.type}`;
                const isExpanded = expandedSessions.has(sessionKey);

                return (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Session Header - Collapsed View */}
                    <div
                      onClick={() => toggleSessionExpansion(sessionKey)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${getEventColor(session.type)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="font-semibold capitalize">
                            {session.type.replace('-', ' ')} Sessions
                          </div>
                          <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                            {session.count} session{session.count > 1 ? 's' : ''}
                          </span>
                          <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                            {session.events.reduce((sum, e) => sum + e.animals.count, 0)} animals
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            {isExpanded ? 'Hide Details' : 'Show Details'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Session Details - Expanded View */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-white">
                        {session.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="p-4 border-b border-gray-100 last:border-b-0">
                            {/* Event Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  {event.time && (
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{event.time}</span>
                                    </div>
                                  )}
                                  {event.location && (
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                  {event.technician && (
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-3 w-3" />
                                      <span>{event.technician}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                                  {event.status}
                                </span>
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Animals Table */}
                            {event.animals.list && event.animals.list.length > 0 && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">
                                  Animals ({event.animals.count})
                                </h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full">
                                    <thead>
                                      <tr className="text-xs text-gray-500 uppercase tracking-wider">
                                        <th className="text-left py-1">Animal ID</th>
                                        <th className="text-left py-1">Name</th>
                                        <th className="text-left py-1">Species</th>
                                        <th className="text-left py-1">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {event.animals.list.map((animal, animalIndex) => (
                                        <tr key={animalIndex} className="text-sm">
                                          <td className="py-2 font-medium text-gray-900">{animal.animalID}</td>
                                          <td className="py-2 text-gray-700">{animal.name}</td>
                                          <td className="py-2 text-gray-700">{animal.species}</td>
                                          <td className="py-2">
                                            <button className="text-blue-600 hover:text-blue-800 mr-2">
                                              <Eye className="h-3 w-3" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-800">
                                              <Edit className="h-3 w-3" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Event Description */}
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📅 Reproduction Calendar
          </h1>
          <p className="text-gray-600 mt-1">
            Unified calendar for all reproductive activities and sessions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={goToToday}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-50 rounded-l-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 text-sm font-medium min-w-48 text-center">
              {formatDate(currentDate)}
            </div>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-50 rounded-r-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 text-sm rounded-l-lg transition-colors ${
                viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 text-sm rounded-r-lg transition-colors ${
                viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Users className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Animals Involved</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, event) => sum + event.animals.count, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => {
                  const eventDate = new Date(e.date);
                  return eventDate.getMonth() === currentDate.getMonth() && 
                         eventDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {getEventsForDate(new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Session Types</option>
              <option value="ultrasonography">Ultrasonography</option>
              <option value="breeding">Breeding</option>
              <option value="flushing">Flushing</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Calendar Content */}
      {loading ? (
        <div className="bg-white rounded-lg shadow border p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading reproductive activities...</p>
        </div>
      ) : viewMode === 'month' ? (
        renderMonthView()
      ) : (
        renderDayView()
      )}
    </div>
  );
};

export default CalendarPage; 