import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const CustomersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer & CRM</h1>
        <p className="text-gray-600 mt-1">Customer relationship management and services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Comprehensive customer relationship management system including
            customer profiles, contracts, billing, and service management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;

