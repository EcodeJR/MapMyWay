// frontend/src/components/MapView.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import api from '../services/api';
import { useLocation } from 'react-router-dom';


const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 8.5, // Nigeria's approximate center latitude
  lng: 8.0  // Nigeria's approximate center longitude
};

// Helper functions for location validation
const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

const getGeolocationErrorMessage = (code) => {
  switch (code) {
    case 1:
      return 'Location access denied. Please enable location services.';
    case 2:
      return 'Location unavailable. Please try again.';
    case 3:
      return 'Location request timed out. Please try again.';
    default:
      return 'Unknown location error occurred.';
  }
};

const MapView = () => {
  const location = useLocation();
  // Memoize libraries; adding navigation library
  const libraries = useMemo(() => ['places'], []);
  
  // State declarations
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [directionsError, setDirectionsError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [locationsError, setLocationsError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  // Voice navigation states
  const [isNavigating, setIsNavigating] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [nextManeuverDistance, setNextManeuverDistance] = useState(null);
  const [lastSpokenInstruction, setLastSpokenInstruction] = useState('');
  const watchPositionId = useRef(null);
  const speechSynthesis = useRef(window.speechSynthesis);
  const voiceVolume = useRef(1.0); // Default full volume
  
  // Include DirectionsService library
  const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apikey,
    libraries,
    onError: (error) => {
      console.error("Google Maps loading error:", error);
      setMapError(`Error loading Google Maps: ${error.message || 'Unknown error'}`);
    }
  });

  // Use effect to handle location state from navigation

  useEffect(() => {
    if (location.state?.selectedLocationId && locations.length > 0) {
      setIsLoadingLocation(true);
      
      try {
        const selectedLoc = locations.find(loc => loc._id === location.state.selectedLocationId);
        if (selectedLoc) {
          setSelectedLocation(selectedLoc);
          
          if (mapRef) {
            mapRef.panTo({
              lat: selectedLoc.coordinates.lat,
              lng: selectedLoc.coordinates.lng
            });
            mapRef.setZoom(15);
          }
        }
      } catch (error) {
        console.error("Error centering map:", error);
        setLocationError("Failed to center map on selected location");
      } finally {
        setIsLoadingLocation(false);
      }
    }
  }, [location.state, locations, mapRef]);



  // Handle Google Maps loading error
  useEffect(() => {
    if (loadError) {
      console.error("Error loading Google Maps:", loadError);
      setMapError(`Failed to load Google Maps: ${loadError.message || 'Unknown error'}`);
    }
  }, [loadError]);

  // Get user's current location with improved error handling
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      setLocationError(null);

      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (isValidCoordinates(lat, lng)) {
            const userPos = { lat, lng };
            setUserLocation(userPos);
            // console.log("User location set:", userPos);

            if (mapRef) {
              try {
                mapRef.panTo(userPos);
                mapRef.setZoom(14);
              } catch (error) {
                console.error("Error centering map on user location:", error);
              }
            }
          } else {
            setLocationError("Invalid coordinates received from geolocation");
          }
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationError(`Location error: ${getGeolocationErrorMessage(error.code)}`);
          setIsLoadingLocation(false);
        },
        options
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, [mapRef]);

  // Recenter map when both mapRef and userLocation are available
  useEffect(() => {
    if (mapRef && userLocation) {
      try {
        // console.log("Centering map on user's location:", userLocation);
        mapRef.panTo(userLocation);
        mapRef.setZoom(14);
      } catch (error) {
        console.error("Error centering map on user location:", error);
      }
    }
  }, [mapRef, userLocation]);

  // Load locations from API
  useEffect(() => {
    setLocationsError(null);
    
    api.get('/locations/GetLocation')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          // console.log("Locations loaded:", res.data);
          setLocations(res.data);
          
          // Fit map bounds if mapRef is available
          if (res.data.length > 0 && mapRef) {
            try {
              const bounds = new window.google.maps.LatLngBounds();
              res.data.forEach(loc => {
                if (loc.coordinates && typeof loc.coordinates.lat === 'number' && typeof loc.coordinates.lng === 'number') {
                  bounds.extend({ lat: loc.coordinates.lat, lng: loc.coordinates.lng });
                }
              });
              mapRef.fitBounds(bounds);
            } catch (error) {
              console.error("Error setting map bounds:", error);
            }
          }
        } else {
          console.error("Invalid locations data format:", res.data);
          setLocationsError("Received invalid locations data from server");
        }
      })
      .catch(err => {
        console.error("Error fetching locations:", err);
        setLocationsError(`Failed to load locations: ${err.message || 'Server error'}`);
      });
  }, [mapRef]);

  // Function to get directions to selected location
  const getDirectionsToLocation = () => {
    if (!userLocation || !selectedLocation || !window.google || !window.google.maps) {
      setDirectionsError("Cannot get directions: Missing required data");
      return;
    }
    
    setIsLoadingDirections(true);
    setDirectionsError(null);
    
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation,
          destination: {
            lat: selectedLocation.coordinates.lat,
            lng: selectedLocation.coordinates.lng
          },
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          setIsLoadingDirections(false);
          
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            setDirectionsError(`Error getting directions: ${status}`);
            console.error(`Error getting directions: ${status}`, result);
          }
        }
      );
    } catch (error) {
      setIsLoadingDirections(false);
      setDirectionsError(`Error initializing directions: ${error.message}`);
      console.error("Error initializing directions:", error);
    }
  };

  // Voice navigation functions
  
  // Function to speak text using the Web Speech API
  const speak = (text) => {
    if (!voiceEnabled || !text || text === lastSpokenInstruction) return;
    
    // Cancel any ongoing speech
    speechSynthesis.current.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = voiceVolume.current;
    utterance.rate = 1.0;  // Normal speaking rate
    
    // Use the default voice (system will choose the best one)
    const voices = speechSynthesis.current.getVoices();
    if (voices.length > 0) {
      // Try to find an English voice
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-') && voice.localService
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }
    
    // Speak the instruction
    speechSynthesis.current.speak(utterance);
    setLastSpokenInstruction(text);
    
    // console.log("Speaking:", text);
  };

  // Parse HTML instructions to plain text
  const parseInstructions = (htmlInstructions) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlInstructions;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Start navigation mode with voice guidance
  const startNavigation = () => {
    if (!directions || !userLocation) return;
    
    setIsNavigating(true);
    setCurrentStepIndex(0);
    
    // Announce start of navigation
    const destination = selectedLocation.name;
    speak(`Starting navigation to ${destination}. ${parseInstructions(directions.routes[0].legs[0].steps[0].instructions)}`);
    
    // Start tracking user's position
    startLocationTracking();
  };
  
  // Stop navigation mode
  const stopNavigation = () => {
    setIsNavigating(false);
    
    // Stop tracking location
    if (watchPositionId.current) {
      navigator.geolocation.clearWatch(watchPositionId.current);
      watchPositionId.current = null;
    }
    
    // Cancel any ongoing speech
    speechSynthesis.current.cancel();
  };
  
  // Start tracking user location for navigation
  const startLocationTracking = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      // Clear any existing watch
      if (watchPositionId.current) {
        navigator.geolocation.clearWatch(watchPositionId.current);
      }
      
      watchPositionId.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handlePositionError,
        options
      );
    }
  };
  
  // Handle errors in position tracking
  const handlePositionError = (error) => {
    console.error("Error tracking position:", error);
    speak("Having trouble tracking your location. Please check your GPS signal.");
  };
  
  // Handle position updates during navigation
  const handlePositionUpdate = (position) => {
    if (!isNavigating || !directions) return;
    
    const currentPos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    
    // Update user location on map
    setUserLocation(currentPos);
    
    // Get current navigation steps
    const steps = directions.routes[0].legs[0].steps;
    
    if (currentStepIndex >= steps.length) {
      // We've reached the destination
      speak("You have arrived at your destination.");
      stopNavigation();
      return;
    }
    
    // Calculate distance to next maneuver
    const nextStep = steps[currentStepIndex];
    const endLocation = nextStep.end_location;
    
    const distance = calculateDistance(
      currentPos.lat,
      currentPos.lng,
      endLocation.lat(),
      endLocation.lng()
    );
    
    setNextManeuverDistance(distance);
    
    // Check if we need to announce the next instruction
    if (shouldAnnounceNextStep(distance, nextStep.distance.value)) {
      const instruction = parseInstructions(nextStep.instructions);
      speak(instruction);
      
      // Check if we've completed this step
      if (distance < 20) { // Within 20 meters means we've made the turn
        // Move to next step
        setCurrentStepIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex < steps.length) {
            // Pre-announce the next step
            setTimeout(() => {
              speak(`In ${(steps[nextIndex].distance.value / 1000).toFixed(1)} kilometers, ${parseInstructions(steps[nextIndex].instructions)}`);
            }, 2000);
          }
          return nextIndex;
        });
      }
    }
  };
  
  // Calculate distance between two points in meters using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    
    return d; // distance in meters
  };
  
  // Determine when to announce the next step based on distance and original step length
  const shouldAnnounceNextStep = (currentDistance, originalDistance) => {
    // Always announce when we're within announcement thresholds
    const thresholds = [
      { distance: 50, announced: false },     // Within 50 meters of turn
      { distance: 200, announced: false },    // Within 200 meters of turn
      { distance: 500, announced: false },    // Within 500 meters of turn
      { distance: 1000, announced: false },   // Within 1 km of turn
    ];
    
    // Find applicable threshold
    for (const threshold of thresholds) {
      if (currentDistance <= threshold.distance && !threshold.announced) {
        threshold.announced = true;
        
        // Don't announce small distances for very short steps
        if (originalDistance < threshold.distance * 2) {
          return false;
        }
        
        return true;
      }
    }
    
    return false;
  };
  
  // Toggle voice guidance
  const toggleVoiceGuidance = () => {
    setVoiceEnabled(prev => {
      const newState = !prev;
      if (newState) {
        speak("Voice guidance enabled");
      }
      return newState;
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Cancel any ongoing speech
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
      
      // Clear any location watches
      if (watchPositionId.current) {
        navigator.geolocation.clearWatch(watchPositionId.current);
      }
    };
  }, []);

  // Clear directions and navigation when closing info window
  const handleCloseInfoWindow = () => {
    setSelectedLocation(null);
    setDirections(null);
    setDirectionsError(null);
    stopNavigation();
  };

  const onLoad = (map) => {
    setMapRef(map);
  };

  const onUnmount = () => {
    setMapRef(null);
  };


  // Display loading/error states
  if (mapError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <h3 className="font-bold mb-2">Map Error</h3>
        <p>{mapError}</p>
        <p className="mt-2 text-sm">
          Please check your Google Maps API key and billing configuration.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="p-4 text-center">Loading map resources...</div>;
  }

  return (
    <div className="relative">
      {isLoadingLocation && (
        <div className="p-3 mb-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
          <p>Getting your location...</p>
        </div>
      )}

      {locationError && (
        <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
          <p>{locationError}</p>
        </div>
      )}

      {locationsError && (
        <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
          <p>{locationsError}</p>
        </div>
      )}
      
      {/* Navigation status bar */}
      {isNavigating && (
        <div className="p-3 mb-4 bg-blue-600 text-white rounded-md flex justify-between items-center">
          <div>
            <p className="font-bold">Navigating to: {selectedLocation.name}</p>
            {nextManeuverDistance && (
              <p className="text-sm">
                Next: {parseInstructions(directions.routes[0].legs[0].steps[currentStepIndex].instructions)} 
                in {(nextManeuverDistance < 1000) ? 
                  `${Math.round(nextManeuverDistance)} m` : 
                  `${(nextManeuverDistance/1000).toFixed(1)} km`}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={toggleVoiceGuidance}
              className={`p-2 rounded ${voiceEnabled ? 'bg-blue-700' : 'bg-gray-600'}`}
              title={voiceEnabled ? "Mute voice" : "Unmute voice"}
            >
              {voiceEnabled ? "🔊" : "🔇"}
            </button>
            <button 
              onClick={stopNavigation}
              className="p-2 bg-red-600 rounded"
              title="Stop navigation"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={userLocation ? 14 : 6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: true,
          mapTypeControl: true,
          streetViewControl: true,
          zoomControl: true
        }}
      >
        {/* User's current location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40)
            }}
            title="Your location"
          />
        )}
        
        {/* Location markers */}
        {locations.map(loc => (
          <Marker
            key={loc._id}
            position={{ lat: loc.coordinates.lat, lng: loc.coordinates.lng }}
            onClick={() => setSelectedLocation(loc)}
          />
        ))}

        {/* Info window for selected location */}
        {selectedLocation && (
          <InfoWindow
            position={{ 
              lat: selectedLocation.coordinates.lat, 
              lng: selectedLocation.coordinates.lng 
            }}
            onCloseClick={handleCloseInfoWindow}
          >
            <div className="max-w-xs">
              <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
              <p className="text-sm my-1">{selectedLocation.description}</p>
              {selectedLocation.imageUrl && (
                <img 
                  src={selectedLocation.imageUrl} 
                  alt={selectedLocation.name} 
                  className="mt-2 rounded w-full"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/200x150?text=Image+Not+Available";
                  }}
                />
              )}
              
              {userLocation && !directions && (
                <button
                  onClick={getDirectionsToLocation}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm w-full"
                  disabled={isLoadingDirections}
                >
                  {isLoadingDirections ? 'Getting directions...' : 'Get Directions'}
                </button>
              )}
              
              {directions && !isNavigating && (
                <button
                  onClick={startNavigation}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded text-sm w-full"
                >
                  Start Voice Navigation
                </button>
              )}
              
              {directionsError && (
                <p className="mt-2 text-red-500 text-sm">{directionsError}</p>
              )}
            </div>
          </InfoWindow>
        )}

        {/* Render directions if available */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 5
              }
            }}
          />
        )}
      </GoogleMap>
      
      {/* Location info panel */}
      {directions && selectedLocation && !isNavigating && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h3 className="font-bold">Directions to {selectedLocation.name}</h3>
          <div className="mt-2">
            <p>Distance: {directions.routes[0].legs[0].distance.text}</p>
            <p>Duration: {directions.routes[0].legs[0].duration.text}</p>
            
            <div className="mt-3">
              <h4 className="font-semibold">Steps:</h4>
              <ol className="list-decimal list-inside mt-1">
                {directions.routes[0].legs[0].steps.map((step, index) => (
                  <li key={index} className="text-sm my-1">
                    <span dangerouslySetInnerHTML={{ __html: step.instructions }} />
                    <span className="text-gray-500 ml-1">({step.distance.text})</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="mt-4 flex space-x-3">
              <button
                onClick={startNavigation}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm"
              >
                Start Voice Navigation
              </button>
              
              <button
                onClick={() => { setDirections(null) }}
                className="px-4 py-2 bg-gray-500 text-white rounded text-sm"
              >
                Clear Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;