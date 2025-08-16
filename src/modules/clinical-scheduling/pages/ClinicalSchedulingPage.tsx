import React from 'react';
import { Clock } from 'lucide-react';
import { PlaceholderPage } from '../../../components/ui/PlaceholderPage';

export const ClinicalSchedulingPage: React.FC = () => {
  const features = [
    'Appointment scheduling',
    'Procedure planning',
    'Resource booking',
    'Staff allocation',
    'Equipment scheduling',
    'Timeline optimization',
    'Conflict resolution',
    'Automated reminders'
  ];

  return (
    <PlaceholderPage
      title="Clinical Scheduling"
      description="Advanced scheduling system for clinical procedures and appointments"
      icon={Clock}
      color="purple"
      features={features}
    />
  );
}; 