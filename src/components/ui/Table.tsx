import React, { ReactNode } from 'react';

export const Table: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <table className={className} style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
);
export const TableBody: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);
export const TableCell: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <td className={className} style={{ border: '1px solid #ddd', padding: 8 }}>{children}</td>
);
export const TableHead: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <th className={className} style={{ border: '1px solid #ddd', padding: 8, background: '#f9f9f9' }}>{children}</th>
);
export const TableHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <thead className={className}>{children}</thead>
);
export const TableRow: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <tr className={className}>{children}</tr>
); 