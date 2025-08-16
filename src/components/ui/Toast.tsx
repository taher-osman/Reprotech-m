import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Button } from './Button';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // Convenience methods
  showSuccess: (title: string, message?: string, options?: Partial<Toast>) => string;
  showError: (title: string, message?: string, options?: Partial<Toast>) => string;
  showWarning: (title: string, message?: string, options?: Partial<Toast>) => string;
  showInfo: (title: string, message?: string, options?: Partial<Toast>) => string;
  showLoading: (title: string, message?: string) => string;
  showValidationError: (errors: string[], warnings?: string[]) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: toast.type === 'loading' ? 0 : (toast.duration ?? 5000),
      dismissible: toast.dismissible !== false,
      ...toast,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev].slice(0, maxToasts);
      return updated;
    });

    // Auto-dismiss if duration is set
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const showError = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, message, duration: 7000, ...options });
  }, [addToast]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, message, duration: 6000, ...options });
  }, [addToast]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  const showLoading = useCallback((title: string, message?: string) => {
    return addToast({ type: 'loading', title, message, dismissible: false });
  }, [addToast]);

  const showValidationError = useCallback((errors: string[], warnings?: string[]) => {
    const errorCount = errors.length;
    const warningCount = warnings?.length || 0;
    
    let title = '';
    let message = '';
    
    if (errorCount > 0 && warningCount > 0) {
      title = `${errorCount} error${errorCount > 1 ? 's' : ''} and ${warningCount} warning${warningCount > 1 ? 's' : ''} found`;
      message = `Errors: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`;
    } else if (errorCount > 0) {
      title = `${errorCount} validation error${errorCount > 1 ? 's' : ''}`;
      message = errors.slice(0, 3).join(', ') + (errors.length > 3 ? '...' : '');
    } else if (warningCount > 0) {
      title = `${warningCount} validation warning${warningCount > 1 ? 's' : ''}`;
      message = warnings!.slice(0, 3).join(', ') + (warnings!.length > 3 ? '...' : '');
    }

    return addToast({ 
      type: errorCount > 0 ? 'error' : 'warning', 
      title, 
      message,
      duration: 8000
    });
  }, [addToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showValidationError
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const getToastConfig = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
      case 'loading':
        return {
          icon: Loader2,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700'
        };
    }
  };

  const config = getToastConfig(toast.type);
  const Icon = config.icon;

  return (
    <div className={`
      max-w-sm w-full ${config.bgColor} border ${config.borderColor} rounded-lg shadow-lg
      transform transition-all duration-300 ease-in-out
      animate-slideInRight
    `}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon 
              className={`h-5 w-5 ${config.iconColor} ${toast.type === 'loading' ? 'animate-spin' : ''}`} 
            />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${config.titleColor}`}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={`mt-1 text-sm ${config.messageColor}`}>
                {toast.message}
              </p>
            )}
            {toast.action && (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toast.action.onClick}
                  className="text-xs"
                >
                  {toast.action.label}
                </Button>
              </div>
            )}
          </div>
          {toast.dismissible && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`
                  inline-flex ${config.iconColor} hover:${config.titleColor}
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  rounded-md p-1.5 transition-colors
                `}
                onClick={() => onRemove(toast.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress bar for timed toasts */}
      {toast.duration > 0 && (
        <div className="h-1 bg-gray-200 overflow-hidden">
          <div 
            className={`h-full ${config.iconColor.replace('text-', 'bg-')} animate-shrinkWidth`}
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

// Enhanced AlertModal for validation errors
interface ValidationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  errors: string[];
  warnings?: string[];
  title?: string;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({
  isOpen,
  onClose,
  errors,
  warnings = [],
  title = 'Validation Issues'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        <div className="p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          
          <div className="mt-4 space-y-4">
            {errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2">
                  Errors ({errors.length})
                </h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-700 mb-2">
                  Warnings ({warnings.length})
                </h4>
                <ul className="text-sm text-yellow-600 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form field with integrated validation display
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  warning?: string;
  info?: string;
  required?: boolean;
  helperText?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  error,
  warning,
  info,
  required,
  helperText,
  className = '',
  ...props
}) => {
  const hasError = !!error;
  const hasWarning = !!warning && !hasError;
  const hasInfo = !!info && !hasError && !hasWarning;

  const getInputClasses = () => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors';
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500 focus:border-red-500`;
    }
    if (hasWarning) {
      return `${baseClasses} border-yellow-400 focus:ring-yellow-500 focus:border-yellow-400`;
    }
    if (hasInfo) {
      return `${baseClasses} border-blue-400 focus:ring-blue-500 focus:border-blue-400`;
    }
    
    return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  };

  const getMessage = () => {
    if (hasError) return { text: error, color: 'text-red-600', icon: AlertCircle };
    if (hasWarning) return { text: warning, color: 'text-yellow-600', icon: AlertTriangle };
    if (hasInfo) return { text: info, color: 'text-blue-600', icon: Info };
    return null;
  };

  const message = getMessage();

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        className={`${getInputClasses()} ${className}`}
        {...props}
      />
      
      {helperText && !message && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      
      {message && (
        <div className={`flex items-start mt-1 ${message.color}`}>
          <message.icon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
          <p className="text-xs">{message.text}</p>
        </div>
      )}
    </div>
  );
}; 