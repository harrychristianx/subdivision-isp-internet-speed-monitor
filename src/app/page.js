'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import SpeedTestDisplay from '@/components/SpeedTestDisplay';
import SpeedTestScheduler from '@/components/SpeedTestScheduler';

const fetcher = url => fetch(url).then(res => res.json());

export default function Home() {
  const { data, error, mutate } = useSWR('/api/speedtest', fetcher, {
    refreshInterval: 60000, // Refresh data every minute
  });
  
  const [speedTestData, setSpeedTestData] = useState([]);

  useEffect(() => {
    if (data && data.success) {
      setSpeedTestData(data.data);
    }
  }, [data]);

  const handleTestComplete = (newTestData) => {
    setSpeedTestData(prev => [newTestData, ...prev]);
    mutate(); // Refresh the data
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Subdivision ISP<br/>Internet Speed Monitor</h1>
          <p className="text-gray-600 dark:text-gray-400">
 
</p>

        </header>

        <SpeedTestScheduler onTestComplete={handleTestComplete} />
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>Error loading speed test data. Please try again later.</p>
          </div>
        )}
        
        {!data && !error && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {speedTestData && speedTestData.length > 0 && (
          <SpeedTestDisplay data={speedTestData} />
        )}
        
        {speedTestData && speedTestData.length === 0 && !error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p>No speed test data available yet. The first test is being run now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
