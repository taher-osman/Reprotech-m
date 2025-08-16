import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Search, Filter, User, MapPin, Phone, Mail, AlertCircle, CheckCircle, Calendar as CalendarIcon, Users, Activity, Bell } from 'lucide-react';

const SimpleClinicalSchedulingPage = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [appointments, setAppointments] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [staff, setStaff] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setAppointments([
      { 
        id: 'APT-001', 
        animalId: 'A001', 
        animalName: 'Bella', 
        owner: 'John Smith', 
        type: 'Routine Checkup', 
        date: '2025-08-16', 
        time: '09:00', 
        duration: '30 min',
        veterinarian: 'Dr. Johnson', 
        status: 'Confirmed',
        priority: 'Normal',
        notes: 'Annual health examination'
      },
      { 
        id: 'APT-002', 
        animalId: 'A002', 
        animalName: 'Thunder', 
        owner: 'Sarah Wilson', 
        type: 'Ultrasound', 
        date: '2025-08-16', 
        time: '10:30', 
        duration: '45 min',
        veterinarian: 'Dr. Smith', 
        status: 'Confirmed',
        priority: 'High',
        notes: 'Pregnancy confirmation'
      },
      { 
        id: 'APT-003', 
        animalId: 'A003', 
        animalName: 'Princess', 
        owner: 'Mike Brown', 
        type: 'Vaccination', 
        date: '2025-08-16', 
        time: '14:00', 
        duration: '15 min',
        veterinarian: 'Dr. Wilson', 
        status: 'Pending',
        priority: 'Normal',
        notes: 'Annual vaccination schedule'
      },
      { 
        id: 'APT-004', 
        animalId: 'A004', 
        animalName: 'Champion', 
        owner: 'Lisa Davis', 
        type: 'Surgery Consultation', 
        date: '2025-08-17', 
        time: '11:00', 
        duration: '60 min',
        veterinarian: 'Dr. Johnson', 
        status: 'Confirmed',
        priority: 'Urgent',
        notes: 'Pre-surgical evaluation'
      }
    ]);

    setProcedures([
      { 
        id: 'PROC-001', 
        name: 'Embryo Transfer', 
        animalId: 'A005', 
        animalName: 'Luna', 
        scheduledDate: '2025-08-17', 
        scheduledTime: '08:00',
        estimatedDuration: '120 min',
        veterinarian: 'Dr. Smith', 
        technician: 'Tech. Anderson',
        status: 'Scheduled',
        preparation: 'Fasting required 12h prior',
        equipment: 'Ultrasound, Transfer catheter'
      },
      { 
        id: 'PROC-002', 
        name: 'OPU (Ovum Pick-up)', 
        animalId: 'A006', 
        animalName: 'Star', 
        scheduledDate: '2025-08-17', 
        scheduledTime: '10:00',
        estimatedDuration: '90 min',
        veterinarian: 'Dr. Wilson', 
        technician: 'Tech. Martinez',
        status: 'Scheduled',
        preparation: 'Sedation protocol prepared',
        equipment: 'OPU needle, Ultrasound'
      },
      { 
        id: 'PROC-003', 
        name: 'Artificial Insemination', 
        animalId: 'A007', 
        animalName: 'Grace', 
        scheduledDate: '2025-08-18', 
        scheduledTime: '09:30',
        estimatedDuration: '45 min',
        veterinarian: 'Dr. Johnson', 
        technician: 'Tech. Thompson',
        status: 'Confirmed',
        preparation: 'Estrus synchronization complete',
        equipment: 'AI gun, Semen straws'
      }
    ]);

    setStaff([
      { id: 'VET-001', name: 'Dr. Johnson', role: 'Senior Veterinarian', availability: 'Available', schedule: '8:00 AM - 6:00 PM' },
      { id: 'VET-002', name: 'Dr. Smith', role: 'Reproduction Specialist', availability: 'Busy', schedule: '9:00 AM - 5:00 PM' },
      { id: 'VET-003', name: 'Dr. Wilson', role: 'Clinical Veterinarian', availability: 'Available', schedule: '7:00 AM - 4:00 PM' },
      { id: 'TECH-001', name: 'Tech. Anderson', role: 'Senior Technician', availability: 'Available', schedule: '8:00 AM - 5:00 PM' },
      { id: 'TECH-002', name: 'Tech. Martinez', role: 'Lab Technician', availability: 'Available', schedule: '9:00 AM - 6:00 PM' }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600 bg-green-100';
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-gray-600 bg-gray-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'text-green-600 bg-green-100';
      case 'Busy': return 'text-red-600 bg-red-100';
      case 'Break': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clinical Scheduling Management</h1>
            <p className="text-blue-100 mb-4">Comprehensive appointment scheduling, procedure planning, and staff coordination</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Real-time Scheduling</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Staff Coordination</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Automated Reminders</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:53 PM</div>
            <div className="text-blue-200">Scheduling System: Active</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'calendar', label: 'Calendar View', icon: Calendar },
          { id: 'appointments', label: 'Appointments', icon: Clock },
          { id: 'procedures', label: 'Procedures', icon: Activity },
          { id: 'staff', label: 'Staff Schedule', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calendar View Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Today's Schedule Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Today's Appointments</p>
                  <p className="text-3xl font-bold text-blue-900">8</p>
                  <p className="text-blue-600 text-sm">Scheduled visits</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Procedures</p>
                  <p className="text-3xl font-bold text-green-900">3</p>
                  <p className="text-green-600 text-sm">Scheduled today</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Available Staff</p>
                  <p className="text-3xl font-bold text-purple-900">4</p>
                  <p className="text-purple-600 text-sm">On duty today</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Urgent Cases</p>
                  <p className="text-3xl font-bold text-orange-900">1</p>
                  <p className="text-orange-600 text-sm">Requires attention</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Calendar Interface */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">August 2025</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Today</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Week</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Month</button>
              </div>
            </div>
            
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Interactive Calendar View</p>
                <p className="text-gray-500">Full calendar interface would appear here</p>
                <p className="text-sm text-gray-400 mt-2">Showing appointments, procedures, and staff schedules</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Appointment Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Types</option>
                <option>Routine Checkup</option>
                <option>Ultrasound</option>
                <option>Vaccination</option>
                <option>Surgery</option>
              </select>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veterinarian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{appointment.animalName}</div>
                        <div className="text-gray-500">{appointment.animalId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.owner}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{appointment.date}</div>
                        <div className="text-gray-500">{appointment.time} ({appointment.duration})</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.veterinarian}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(appointment.priority)}`}>
                        {appointment.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-green-600 hover:text-green-900">Complete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Procedures Tab */}
      {activeTab === 'procedures' && (
        <div className="space-y-6">
          {/* Procedure Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search procedures..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Procedures</option>
                <option>Embryo Transfer</option>
                <option>OPU</option>
                <option>Artificial Insemination</option>
                <option>Surgery</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Procedure
            </button>
          </div>

          {/* Procedures Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {procedures.map((procedure) => (
              <div key={procedure.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{procedure.name}</h3>
                    <p className="text-sm text-gray-600">{procedure.id}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(procedure.status)}`}>
                    {procedure.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{procedure.animalName} ({procedure.animalId})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{procedure.scheduledDate} at {procedure.scheduledTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">Duration: {procedure.estimatedDuration}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{procedure.veterinarian}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{procedure.technician}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-2">
                    <strong>Preparation:</strong> {procedure.preparation}
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Equipment:</strong> {procedure.equipment}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                    View Details
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Schedule Tab */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Staff Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Staff Status</h3>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-green-600">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Busy:</span>
                  <span className="font-medium text-red-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Staff:</span>
                  <span className="font-medium text-blue-600">5</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Today's Workload</h3>
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointments:</span>
                  <span className="font-medium text-blue-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Procedures:</span>
                  <span className="font-medium text-green-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Load:</span>
                  <span className="font-medium text-purple-600">2.2/staff</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Alerts</h3>
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-yellow-50 rounded text-sm">
                  <span className="text-yellow-800">Dr. Smith overbooked</span>
                </div>
                <div className="p-2 bg-green-50 rounded text-sm">
                  <span className="text-green-800">All procedures on schedule</span>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Schedule Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Staff Schedule</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today's Load</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.schedule}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(member.availability)}`}>
                        {member.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.name === 'Dr. Smith' ? '4 appointments' : 
                       member.name === 'Dr. Johnson' ? '2 appointments' : 
                       member.name === 'Dr. Wilson' ? '2 appointments' : '1 procedure'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Schedule</button>
                      <button className="text-green-600 hover:text-green-900">Contact</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleClinicalSchedulingPage;

