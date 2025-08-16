import React, { useState } from 'react';
import { Users, DollarSign, Star, Plus, Search } from 'lucide-react';

const SimpleCustomersAdvancedPageMinimal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Customer Relationship Management</h1>
            <p className="text-purple-100 mb-4">Advanced CRM with customer analytics and communication tracking</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">360° Customer View</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Automated Workflows</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Revenue Analytics</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 03:02 PM</div>
            <div className="text-purple-200">CRM System: Active</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-blue-900">247</p>
              <p className="text-blue-600 text-sm">+12 this month</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Monthly Revenue</p>
              <p className="text-3xl font-bold text-green-900">$89,500</p>
              <p className="text-green-600 text-sm">+15% vs last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Avg Satisfaction</p>
              <p className="text-3xl font-bold text-purple-900">4.7</p>
              <p className="text-purple-600 text-sm">⭐⭐⭐⭐⭐</p>
            </div>
            <Star className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Active Contracts</p>
              <p className="text-3xl font-bold text-orange-900">156</p>
              <p className="text-orange-600 text-sm">Renewal rate: 94%</p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Customer
          </button>
          <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Customers
          </button>
          <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Generate Invoice
          </button>
          <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 flex items-center gap-2">
            <Star className="w-5 h-5" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Customer Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Payment received from John Smith</p>
              <p className="text-xs text-gray-500">$15,000 - Embryo Transfer Package - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">New customer registration: Sarah Wilson</p>
              <p className="text-xs text-gray-500">Wilson Dairy Farm - Premium tier - 4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Customer satisfaction survey completed</p>
              <p className="text-xs text-gray-500">Mike Brown - 5/5 stars - 6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCustomersAdvancedPageMinimal;

