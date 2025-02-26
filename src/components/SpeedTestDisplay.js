import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import MapDisplay from '@/components/MapDisplay';

export default function SpeedTestDisplay({ data }) {
  const [averages, setAverages] = useState({
    download: 0,
    upload: 0,
    ping: 0
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const downloadSum = data.reduce((sum, item) => sum + item.download, 0);
      const uploadSum = data.reduce((sum, item) => sum + item.upload, 0);
      const pingSum = data.reduce((sum, item) => sum + item.ping, 0);
      
      setAverages({
        download: (downloadSum / data.length).toFixed(2),
        upload: (uploadSum / data.length).toFixed(2),
        ping: (pingSum / data.length).toFixed(2)
      });
    }
  }, [data]);

  // Prepare chart data - limit to last 20 tests
  const chartData = data 
    ? data.slice(0, 20).map(item => ({
        time: format(new Date(item.timestamp), 'HH:mm'),
        download: item.download,
        upload: item.upload,
        ping: item.ping
      })).reverse()
    : [];

  // Chart configuration for Shadcn
  const chartConfig = {
    download: {
      label: "Download",
      color: "hsl(var(--chart-1))",
    },
    upload: {
      label: "Upload",
      color: "hsl(var(--chart-2))",
    },
    ping: {
      label: "Ping",
      color: "hsl(var(--chart-3))",
    }
  };

  const latestTest = data && data.length > 0 ? data[0] : null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Download</h3>
          <p className="text-3xl font-bold">{latestTest ? latestTest.download.toFixed(2) : '--'} <span className="text-sm">Mbps</span></p>
          <p className="text-sm text-gray-500 mt-2">Avg: {averages.download} Mbps</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Upload</h3>
          <p className="text-3xl font-bold">{latestTest ? latestTest.upload.toFixed(2) : '--'} <span className="text-sm">Mbps</span></p>
          <p className="text-sm text-gray-500 mt-2">Avg: {averages.upload} Mbps</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Ping</h3>
          <p className="text-3xl font-bold">{latestTest ? latestTest.ping.toFixed(0) : '--'} <span className="text-sm">ms</span></p>
          <p className="text-sm text-gray-500 mt-2">Avg: {averages.ping} ms</p>
        </div>
      </div>

      {/* Map Display */}
      <MapDisplay />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Speed History</h3>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey="time" 
              tickLine={false} 
              tickMargin={10} 
              axisLine={false}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="download" 
              stroke="var(--color-download)" 
              strokeWidth={2} 
              dot={false} 
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="upload" 
              stroke="var(--color-upload)" 
              strokeWidth={2} 
              dot={false} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="ping" 
              stroke="var(--color-ping)" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ChartContainer>
      </div>

      {latestTest && latestTest.servicePings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Social Media Ping</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2">Service</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Ping</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTest.servicePings.social.map((service, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="py-2">{service.name}</td>
                      <td className="py-2">
                        <span className={`inline-block w-3 h-3 rounded-full ${service.alive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      </td>
                      <td className="py-2">{service.alive ? `${service.time} ms` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Gaming Services Ping</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2">Service</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Ping</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTest.servicePings.games.map((service, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="py-2">{service.name}</td>
                      <td className="py-2">
                        <span className={`inline-block w-3 h-3 rounded-full ${service.alive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      </td>
                      <td className="py-2">{service.alive ? `${service.time} ms` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 