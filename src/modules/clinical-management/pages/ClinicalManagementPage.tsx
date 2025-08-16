import React from 'react';
import { Building } from 'lucide-react';
import { PlaceholderPage } from '../../../components/ui/PlaceholderPage';

export const ClinicalManagementPage: React.FC = () => {
  const features = [
    'Workflow management',
    'Resource allocation',
    'Staff scheduling',
    'Protocol standardization',
    'Quality assurance',
    'Performance monitoring',
    'Equipment utilization',
    'Cost optimization'
  ];

  return (
    <PlaceholderPage
      title="Clinical Management"
      description="Clinical workflow and resource management system"
      icon={Building}
      color="purple"
      features={features}
    />
  );
}; 