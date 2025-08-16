import React from 'react';
import { Stethoscope } from 'lucide-react';
import { PlaceholderPage } from './components/ui/PlaceholderPage';

export const InternalMedicinePage: React.FC = () => {
  const features = [
    'Clinical examination records',
    'Diagnostic protocols',
    'Treatment plans',
    'Medical history tracking',
    'Drug administration',
    'Health monitoring',
    'Clinical decision support',
    'Therapeutic interventions'
  ];

  return (
    <PlaceholderPage
      title="Internal Medicine"
      description="Comprehensive internal medicine and clinical care management"
      icon={Stethoscope}
      color="purple"
      features={features}
    />
  );
}; 