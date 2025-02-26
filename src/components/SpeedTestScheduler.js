import { useState, useEffect } from 'react';

export default function SpeedTestScheduler({ onTestComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [nextTestTime, setNextTestTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [manualTestInProgress, setManualTestInProgress] = useState(false);

  // Function to run a speed test
  const runSpeedTest = async (isManual = false) => {
    if (isManual) {
      setManualTestInProgress(true);
    } else {
      setIsRunning(true);
    }

    try {
      const response = await fetch('/api/speedtest', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success && onTestComplete) {
        onTestComplete(result.data);
      }
    } catch (error) {
      console.error('Speed test failed:', error);
    } finally {
      if (isManual) {
        setManualTestInProgress(false);
      } else {
        setIsRunning(false);
        // Schedule next test
        const next = new Date();
        next.setMinutes(next.getMinutes() + 15);
        setNextTestTime(next);
      }
    }
  };

  // Initialize the scheduler
  useEffect(() => {
    // Run a test immediately when the component mounts
    runSpeedTest();

    // Set up the interval for running tests every 15 minutes
    const intervalId = setInterval(() => {
      runSpeedTest();
    }, 15 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!nextTestTime) return;

    const timerId = setInterval(() => {
      const now = new Date();
      const diff = nextTestTime - now;
      
      if (diff <= 0) {
        setCountdown(null);
        clearInterval(timerId);
        return;
      }
      
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timerId);
  }, [nextTestTime]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Speed Test Scheduler</h3>
          <p className="text-sm text-gray-500 mt-1">
            {isRunning 
              ? 'Running scheduled test...' 
              : countdown 
                ? `Next test in ${countdown}` 
                : 'Initializing...'}
          </p>
        </div>
        <button
          onClick={() => runSpeedTest(true)}
          disabled={manualTestInProgress}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {manualTestInProgress ? 'Testing...' : 'Run Test Now'}
        </button>
      </div>
    </div>
  );
} 