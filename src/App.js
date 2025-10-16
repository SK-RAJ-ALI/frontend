import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const RALA_PNG_API = 'https://backend-vgio.onrender.com:10000/api/rala-png'; // Update to Render URL when deployed

function App() {
  const [imageUrl, setImageUrl] = React.useState(null);
  const intervalRef = useRef();

  // Example bounds for CONUS, adjust as needed
  const bounds = [
    [24.396308, -125.0], // Southwest
    [49.384358, -66.93457] // Northeast
  ];

  useEffect(() => {
    const fetchRALA = async () => {
      try {
        // To avoid caching, add a timestamp
        setImageUrl(`${RALA_PNG_API}?t=${Date.now()}`);
      } catch (err) {
        setImageUrl(null);
      }
    };
    fetchRALA();
    intervalRef.current = setInterval(fetchRALA, 300000); // 5 min
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="App">
      <h1>Weather Radar Display (MRMS RALA)</h1>
      <MapContainer center={[37.8, -96]} zoom={4} scrollWheelZoom={true} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {imageUrl && <ImageOverlay url={imageUrl} bounds={bounds} opacity={0.6} />}
      </MapContainer>
    </div>
  );
}

export default App;
