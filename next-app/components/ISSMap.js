// components/ISSMap.js
import { useEffect, useRef } from 'react';
import Head from 'next/head';

export default function ISSMap({ issPosition }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  
  // Initialize the map only once
  useEffect(() => {
    let isCancelled = false;
    
    if (leafletRef.current?.map) {
      // Map already initialized
      return;
    }
    
    // Dynamically import Leaflet since it's a client-side library
    const initMap = async () => {
      const L = await import('leaflet');
      
      // Ensure the map container exists
      const mapContainer = document.getElementById('iss-map');
      if (!mapContainer || isCancelled) {
        console.error('Map container element not found or component unmounted');
        return;
      }
      
      // Create the map
      const map = L.map('iss-map', {
        center: [0, 0],
        zoom: 2,
        zoomControl: true,
        attributionControl: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors | ISS Data',
        maxZoom: 18,
        minZoom: 2
      }).addTo(map);

      // Create custom ISS icon
      const issIcon = L.divIcon({
        html: '🛰️',
        className: 'iss-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      let marker = null;

      // Function to update ISS position on map
      const updateISS = (lat, lng) => {
        if (marker) {
          map.removeLayer(marker);
        }

        marker = L.marker([lat, lng], { icon: issIcon })
          .addTo(map)
          .bindPopup(`
            <div class="iss-popup">
              <h3>🛰️ International Space Station</h3>
              <p><strong>Position:</strong> ${lat.toFixed(4)}°, ${lng.toFixed(4)}°</p>
              <p><strong>Altitude:</strong> 408 km</p>
              <p><strong>Speed:</strong> 27,600 km/h</p>
              <p><strong>Crew:</strong> 7 astronauts</p>
            </div>
          `)
          .openPopup();

        // Center map on ISS with animation
        map.setView([lat, lng], map.getZoom(), {
          animate: true,
          duration: 1.5
        });
      };

      leafletRef.current = { map, marker, updateISS };
    };

    initMap();
    
    // Cleanup function to remove the map when component unmounts
    return () => {
      isCancelled = true;
      if (leafletRef.current?.map) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
  }, []); // Empty dependency array to ensure initialization only happens once

  // Update the ISS position when it changes
  useEffect(() => {
    if (issPosition && leafletRef.current?.updateISS) {
      leafletRef.current.updateISS(issPosition.latitude, issPosition.longitude);
    }
  }, [issPosition]); // Only runs when issPosition changes

  return (
    <div>
      <Head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <style>{`
          .iss-map-container {
            height: 400px;
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #2a3441;
          }
          
          #iss-map {
            width: 100%;
            height: 100%;
          }
          
          .iss-icon {
            font-size: 24px;
            text-align: center;
            line-height: 30px;
            background: rgba(0, 102, 204, 0.1);
            border-radius: 50%;
            border: 2px solid #0066cc;
          }
          
          .iss-popup h3 {
            margin: 0 0 5px 0;
            color: #4A90E2;
          }
          
          .iss-popup p {
            margin: 3px 0;
            font-size: 0.9rem;
          }
        `}</style>
      </Head>
      <div id="iss-map" className="iss-map-container"></div>
    </div>
  );
}