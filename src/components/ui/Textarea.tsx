import React, { TextareaHTMLAttributes } from 'react';

export const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} />
);

export default Textarea; 