import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface TabsContextType {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<TabsProps> = ({ defaultValue = '', value, onValueChange, children, className }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const tabValue = value !== undefined ? value : internalValue;
  const setValue = (val: string) => {
    if (onValueChange) onValueChange(val);
    setInternalValue(val);
  };
  return (
    <TabsContext.Provider value={{ value: tabValue, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={className} style={{ display: 'flex', gap: 8 }}>{children}</div>
);

export const TabsTrigger: React.FC<{ value: string; children: ReactNode; className?: string }> = ({ value, children, className }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs');
  const active = ctx.value === value;
  return (
    <button
      className={className}
      style={{ 
        fontWeight: active ? 'bold' : 'normal', 
        borderTop: 'none',
        borderLeft: 'none', 
        borderRight: 'none',
        borderBottom: active ? '2px solid #333' : 'none', 
        background: 'none', 
        padding: 8, 
        cursor: 'pointer' 
      }}
      onClick={() => ctx.setValue(value)}
      type="button"
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{ value: string; children: ReactNode; className?: string }> = ({ value, children, className }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be used within Tabs');
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}; 