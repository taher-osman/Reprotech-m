import React from 'react';
import { TenderStatus } from '../types/tenderTypes';
import { 
  Clock, 
  FileText, 
  Send, 
  Award, 
  X, 
  Eye, 
  MessageSquare, 
  AlertTriangle 
} from 'lucide-react';

interface TenderStatusBadgeProps {
  status: TenderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  [TenderStatus.OPEN]: {
    label: 'Open',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Eye,
    iconColor: 'text-green-600'
  },
  [TenderStatus.DRAFT]: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: FileText,
    iconColor: 'text-gray-600'
  },
  [TenderStatus.SUBMITTED]: {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Send,
    iconColor: 'text-blue-600'
  },
  [TenderStatus.EVALUATING]: {
    label: 'Evaluating',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    iconColor: 'text-yellow-600'
  },
  [TenderStatus.NEGOTIATING]: {
    label: 'Negotiating',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: MessageSquare,
    iconColor: 'text-purple-600'
  },
  [TenderStatus.AWARDED]: {
    label: 'Awarded',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: Award,
    iconColor: 'text-emerald-600'
  },
  [TenderStatus.REJECTED]: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: X,
    iconColor: 'text-red-600'
  },
  [TenderStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: AlertTriangle,
    iconColor: 'text-slate-600'
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const TenderStatusBadge: React.FC<TenderStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  if (!config) {
    return null;
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${config.color}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && (
        <IconComponent 
          className={`w-3 h-3 ${config.iconColor}`} 
        />
      )}
      {config.label}
    </span>
  );
};

export default TenderStatusBadge; 