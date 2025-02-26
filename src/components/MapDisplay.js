'use client';

import { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapDisplay() {
  // Default coordinates from your input
  const [viewState, setViewState] = useState({
    longitude: 120.9857347236033,
    latitude:  14.598477361206529,
    zoom: 12
  });

  
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">Network Location</h3>
      <div className="h-[300px] w-full rounded-md overflow-hidden">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          dragRotate={false}          // Disables rotation with right click + drag
          pitchWithRotate={false}     // Prevents pitch/rotation with touch gestures
          touchZoomRotate={false}     // Disables two-finger touch gestures for rotation
          keyboard={false}            // Disables keyboard controls for rotation
          scrollZoom={{ around: 'center' }} 
        >
          <Marker 
            longitude={viewState.longitude} 
            latitude={viewState.latitude} 
            color="#EE4B2B"
          />
        </Map>
      </div>
      <div className="mt-3 text-sm text-gray-500">
        <p>Location: {viewState.latitude.toFixed(6)}, {viewState.longitude.toFixed(6)}</p>
        <p className="mt-1">Note: This is your approximate network location. For privacy reasons, it may not be exact.</p>
      </div>
    </div>
  );
} 