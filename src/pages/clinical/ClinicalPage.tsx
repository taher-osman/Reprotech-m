import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const ClinicalPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clinical & Laboratory</h1>
        <p className="text-gray-600 mt-1">Medical procedures and laboratory management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Comprehensive clinical and laboratory management system including
            health records, treatments, diagnostics, and equipment management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicalPage;

