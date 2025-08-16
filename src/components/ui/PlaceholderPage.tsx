import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ModuleTemplate } from './ModuleTemplate';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  features: string[];
  comingSoon?: boolean;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon,
  color = 'blue',
  features,
  comingSoon = true
}) => {
  const handlePrimaryAction = () => {
    console.log(`${title} primary action triggered...`);
  };

  const handleSecondaryAction = () => {
    console.log(`${title} secondary action triggered...`);
  };

  return (
    <ModuleTemplate
      title={title}
      description={description}
      icon={icon}
      color={color}
      badge={comingSoon ? "COMING SOON" : undefined}
      features={features}
      actions={{
        primary: { label: `Create ${title.split(' ')[0]}`, onClick: handlePrimaryAction },
        secondary: { label: 'Import Data', onClick: handleSecondaryAction }
      }}
    >
      {/* This will show the default "No data available" message */}
    </ModuleTemplate>
  );
}; 