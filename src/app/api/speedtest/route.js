import { NextResponse } from 'next/server';

// List of services to ping
const SERVICES = {
  social: [
    { name: 'Facebook', host: 'facebook.com' },
    { name: 'Instagram', host: 'instagram.com' },
    { name: 'Twitter/X', host: 'twitter.com' },
    { name: 'TikTok', host: 'tiktok.com' }
  ],
  games: [
    { name: 'Steam', host: 'steamcommunity.com' },
    { name: 'Epic Games', host: 'epicgames.com' },
    { name: 'Xbox Live', host: 'xbox.com' },
    { name: 'PlayStation', host: 'playstation.com' }
  ]
};

// In-memory storage for speed test results (in a production app, use a database)
let speedTestHistory = [];

// Function to simulate a ping test
const simulatePing = async (host) => {
  // Simulate network latency between 20-150ms
  const pingTime = Math.floor(Math.random() * 130) + 20;
  const alive = Math.random() > 0.05; // 5% chance of failure for realism
  
  return {
    alive,
    time: pingTime,
    packetLoss: alive ? 0 : 100
  };
};

// Function to simulate a speed test
const simulateSpeedTest = async () => {
  // Generate realistic speed values
  const download = Math.floor(Math.random() * 500) + 50; // 50-550 Mbps
  const upload = Math.floor(Math.random() * 100) + 20;   // 20-120 Mbps
  const ping = Math.floor(Math.random() * 50) + 5;       // 5-55 ms
  const jitter = Math.floor(Math.random() * 10) + 1;     // 1-11 ms
  
  return {
    download,
    upload,
    ping,
    jitter,
    packetLoss: Math.random() * 2, // 0-2% packet loss
    isp: "Simulated ISP",
    server: {
      name: "Simulated Server",
      location: "Local Area",
      country: "Local Country",
    }
  };
};

export async function GET() {
  try {
    // Return the stored history
    return NextResponse.json({ 
      success: true, 
      data: speedTestHistory 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Run the simulated speed test
    const result = await simulateSpeedTest();
    
    // Ping various services
    const servicePings = {};
    
    for (const category in SERVICES) {
      servicePings[category] = [];
      for (const service of SERVICES[category]) {
        const pingResult = await simulatePing(service.host);
        servicePings[category].push({
          name: service.name,
          host: service.host,
          alive: pingResult.alive,
          time: pingResult.time,
          packetLoss: pingResult.packetLoss
        });
      }
    }
    
    // Create the test record
    const testRecord = {
      timestamp: new Date().toISOString(),
      download: result.download,
      upload: result.upload,
      ping: result.ping,
      jitter: result.jitter,
      packetLoss: result.packetLoss,
      isp: result.isp,
      server: result.server,
      servicePings
    };
    
    // Add to history (limit to last 1000 tests to prevent memory issues)
    speedTestHistory.unshift(testRecord);
    if (speedTestHistory.length > 1000) {
      speedTestHistory = speedTestHistory.slice(0, 1000);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: testRecord 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 