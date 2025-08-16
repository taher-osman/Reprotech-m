import React, { useState, ReactNode } from 'react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children, className }) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInternalValue(e.target.value);
    if (onValueChange) onValueChange(e.target.value);
  };
  return (
    <select className={className} value={value ?? internalValue} onChange={handleChange}>
      {children}
    </select>
  );
};

export const SelectTrigger: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <>{children}</>
);

export const SelectContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <>{children}</>
);

export const SelectItem: React.FC<{ value: string; children: ReactNode; className?: string }> = ({ value, children, className }) => (
  <option className={className} value={value}>{children}</option>
);

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <option value="" disabled hidden>{placeholder}</option>
); 