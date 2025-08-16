import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const ReproductionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reproduction Management</h1>
        <p className="text-gray-600 mt-1">Advanced breeding and reproduction technologies</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reproduction Suite</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Complete reproduction management system including OPU, embryo transfer,
            breeding calendar, and genetic selection programs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReproductionPage;

