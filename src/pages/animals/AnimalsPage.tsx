import React from 'react';
import { Navigate } from 'react-router-dom';

const AnimalsPage: React.FC = () => {
  // Redirect to animals database by default
  return <Navigate to="/animals/database" replace />;
};

export default AnimalsPage;

