import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { DeadlineCountdown as DeadlineCountdownType } from '../types/tenderTypes';

interface DeadlineCountdownProps {
  deadline: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const calculateTimeRemaining = (deadline: string): DeadlineCountdownType => {
  const now = new Date().getTime();
  const deadlineTime = new Date(deadline).getTime();
  const timeDifference = deadlineTime - now;

  if (timeDifference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      status: 'urgent',
      is_overdue: true
    };
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  let status: 'urgent' | 'warning' | 'normal' = 'normal';
  if (days <= 1) {
    status = 'urgent';
  } else if (days <= 7) {
    status = 'warning';
  }

  return {
    days,
    hours,
    minutes,
    status,
    is_overdue: false
  };
};

const statusConfig = {
  urgent: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-500'
  },
  warning: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Clock,
    iconColor: 'text-yellow-500'
  },
  normal: {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-500'
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({
  deadline,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState<DeadlineCountdownType>(
    calculateTimeRemaining(deadline)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(deadline));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [deadline]);

  const config = statusConfig[timeRemaining.status];
  const IconComponent = config.icon;

  const formatTime = () => {
    if (timeRemaining.is_overdue) {
      return 'Overdue';
    }

    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours}h`;
    } else if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
    } else {
      return `${timeRemaining.minutes}m`;
    }
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${config.bgColor} ${config.color} ${config.borderColor}
        ${sizeClasses[size]}
        ${className}
        ${timeRemaining.is_overdue ? 'animate-pulse' : ''}
      `}
    >
      {showIcon && (
        <IconComponent 
          className={`w-3 h-3 ${config.iconColor}`} 
        />
      )}
      {formatTime()}
    </span>
  );
};

export default DeadlineCountdown; 