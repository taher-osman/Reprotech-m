import React, { useEffect, useState } from 'react';
import FertilizationAnalyticsDashboard from '../components/FertilizationAnalyticsDashboard';
import fertilizationApi from '../services/fertilizationApi';
import { FertilizationSession, GeneratedEmbryo } from '../types/fertilizationTypes';

const AnalyticsDashboardPage: React.FC = () => {
  const [sessions, setSessions] = useState<FertilizationSession[]>([]);
  const [embryos, setEmbryos] = useState<GeneratedEmbryo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const sessionData = await fertilizationApi.getSessions();
      // Assume embryos are fetched via a dedicated API or from sessions
      let allEmbryos: GeneratedEmbryo[] = [];
      for (const session of sessionData) {
        if (session.embryos) {
          allEmbryos = allEmbryos.concat(session.embryos);
        }
      }
      setSessions(sessionData);
      setEmbryos(allEmbryos);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <FertilizationAnalyticsDashboard sessions={sessions} embryos={embryos} />
    </div>
  );
};

export default AnalyticsDashboardPage; 