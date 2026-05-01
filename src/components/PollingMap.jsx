'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

// Inner component to handle the Places API logic
function PlacesSearch({ position, setStations }) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!map || !placesLib || !position) return;

    const service = new placesLib.PlacesService(map);
    const request = {
      location: position,
      radius: '3000', // 3km radius
      keyword: 'school OR municipal OR community center' // Typical polling station locations in India
    };

    service.nearbySearch(request, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results) {
        // Limit to top 8 results so the map isn't completely cluttered
        setStations(results.slice(0, 8));
      }
    });
  }, [map, placesLib, position, setStations]);

  return null;
}

export default function PollingMap() {
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to New Delhi
  const [zoom, setZoom] = useState(12);
  const [stations, setStations] = useState([]);

  const INDIA_BOUNDS = {
    north: 37.0902,
    south: 8.0689,
    west: 68.1114,
    east: 97.3956,
  };

  useEffect(() => {
    // Automatically grab user's location on load
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setZoom(14); // Zoom in closer when we have their real location
        },
        (error) => {
          console.warn("Geolocation denied or failed", error);
        }
      );
    }
  }, []);

  // Premium Silver/Light Map Theme for Tiranga Aesthetic
  const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#dadada" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9c9c9" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    }
  ];

  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: '230px', borderRadius: '16px', overflow: 'hidden' }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map 
          center={position} 
          zoom={zoom} 
          gestureHandling={'greedy'} 
          disableDefaultUI={true}
          styles={mapStyles}
          restriction={{ latLngBounds: INDIA_BOUNDS, strictBounds: false }}
        >
          {/* User's Current Location (Blue Pulsing Dot) */}
          <Marker 
            position={position} 
            title="Your Location" 
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10" fill="%234285F4" stroke="white" stroke-width="3"/%3E%3C/svg%3E`,
              anchor: { x: 12, y: 12 }
            }}
          />

          {/* Actual Polling Stations (Saffron Modern Pins) */}
          {stations.map((station, i) => (
            <Marker 
              key={i} 
              position={station.geometry.location} 
              title={station.name} 
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 24 36"%3E%3Cpath fill="%23FF9933" d="M12 0C5.373 0 0 5.373 0 12c0 8.542 11.163 22.825 11.583 23.364.225.289.585.289.814 0C12.837 34.825 24 20.542 24 12 24 5.373 18.627 0 12 0zm0 17c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/%3E%3Ccircle cx="12" cy="12" r="4" fill="white"/%3E%3C/svg%3E`,
                anchor: { x: 14, y: 40 }
              }}
            />
          ))}

          {/* Hidden component that runs the Places API search */}
          <PlacesSearch position={position} setStations={setStations} />
        </Map>
      </APIProvider>
    </Box>
  );
}
