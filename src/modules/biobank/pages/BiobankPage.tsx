import React from 'react';
import { Package, Thermometer, MapPin, QrCode, Snowflake, AlertTriangle } from 'lucide-react';
import { ModuleTemplate } from '../../../components/ui/ModuleTemplate';

export const BiobankPage: React.FC = () => {
  const features = [
    'Sample storage tracking',
    'Temperature monitoring',
    'Location management',
    'QR code labeling',
    'Chain of custody',
    'Automated alerts',
    'Inventory reports',
    'Compliance tracking'
  ];

  const handleAddSample = () => {
    console.log('Adding new sample...');
  };

  const handleManageStorage = () => {
    console.log('Managing storage units...');
  };

  const StorageUnits = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { name: 'Freezer A1', temp: '-80°C', capacity: '85%', status: 'Normal', icon: Snowflake },
        { name: 'Freezer B2', temp: '-80°C', capacity: '92%', status: 'Near Full', icon: Snowflake },
        { name: 'LN2 Tank #1', temp: '-196°C', capacity: '78%', status: 'Normal', icon: Snowflake },
        { name: 'Refrigerator C1', temp: '4°C', capacity: '45%', status: 'Normal', icon: Thermometer }
      ].map((unit, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <unit.icon className="h-6 w-6 text-teal-600" />
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              unit.status === 'Normal' 
                ? 'bg-green-100 text-green-700' 
                : unit.status === 'Near Full'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {unit.status}
            </span>
          </div>
          <h4 className="font-medium text-gray-900">{unit.name}</h4>
          <p className="text-sm text-gray-600">{unit.temp}</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Capacity</span>
              <span>{unit.capacity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  parseInt(unit.capacity) > 90 ? 'bg-red-500' :
                  parseInt(unit.capacity) > 80 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: unit.capacity }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const RecentSamples = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Samples</h3>
        <p className="text-sm text-gray-600">Latest biobank additions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Animal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temperature
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Stored
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { id: 'BS-001', type: 'Serum', animal: 'A001-Bella', location: 'A1-R2-S15', temp: '-80°C', date: '2025-06-30' },
              { id: 'BS-002', type: 'DNA', animal: 'A002-Max', location: 'B2-R1-S08', temp: '-80°C', date: '2025-06-30' },
              { id: 'BS-003', type: 'Tissue', animal: 'A003-Luna', location: 'LN2-R3-S22', temp: '-196°C', date: '2025-06-29' }
            ].map((sample) => (
              <tr key={sample.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sample.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sample.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sample.animal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {sample.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sample.temp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sample.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <QrCode className="h-4 w-4 text-teal-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <ModuleTemplate
      title="Biobank Management"
      description="Comprehensive sample storage and inventory tracking"
      icon={Package}
      color="teal"
      features={features}
      actions={{
        primary: { label: 'Add Sample', onClick: handleAddSample },
        secondary: { label: 'Manage Storage', onClick: handleManageStorage }
      }}
    >
      <div className="space-y-6">
        <StorageUnits />
        <RecentSamples />
      </div>
    </ModuleTemplate>
  );
}; 