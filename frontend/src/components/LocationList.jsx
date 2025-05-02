// frontend/src/components/LocationList.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin5Line } from "react-icons/ri";
import { RiFileEditFill } from "react-icons/ri";

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [query, setQuery] = useState('');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`http://localhost:5000/api/locations/GetLocation?q=${query}`)
      .then(res => {
        setLocations(res.data),
        console.log(res.data)
      } )
      .catch(err => console.error(err));
  }, [query]);

  const handleDelete = async id => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/locations/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setLocations(locations.filter(l => l._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };
  
  const handleEdit = loc => {
    // e.g. navigate to an EditLocation form with `loc` data
    navigate(`/locations/edit/${loc._id}`, { state: { loc } });
  };

  
  return (
    <div className="my-8">
      <input
        type="text"
        placeholder="Search locations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {locations.map(loc => (
                // Inside your .map over locations:
                <li key={loc._id} className="bg-white rounded shadow p-4 relative">
                  {loc.imageUrl && (
                    <img src={loc.imageUrl} alt={loc.name} className="w-full h-40 object-cover rounded" />
                  )}
                  <h3 className="font-bold mt-2">{loc.name}</h3>
                  <p className="text-sm">{loc.description}</p>

                  {role === 'admin' && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                      title='Edit'
                        onClick={() => handleEdit(loc)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                      >
                        <RiFileEditFill />
                      </button>
                      <button
                      title="Delete"
                        onClick={() => handleDelete(loc._id)}
                        className="px-2 py-1 bg-red-600 text-white rounded"
                      >
                        <RiDeleteBin5Line />
                      </button>
                    </div>
                  )}
                </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationList; 
{/*

    // frontend/src/components/LocationList.jsx
import React, { useState, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import api from '../services/api';

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [query, setQuery] = useState('');
  const [searchBox, setSearchBox] = useState(null);
  
  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    api.get(`/locations?q=${query}`)
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, [query]);

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.name) {
        setQuery(place.name);
        
        if (place.geometry && place.geometry.location) {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          console.log(`Selected coordinates: ${position.lat}, ${position.lng}`);
          
          // You could do additional things with the coordinates here
          // For example, filter results by proximity or save the location
        }
      }
    }
  };

  return (
    <div className="my-8">
      {isLoaded ? (
        <Autocomplete
          onLoad={box => setSearchBox(box)}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
        </Autocomplete>
      ) : (
        <input
          type="text"
          placeholder="Loading search..."
          disabled
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
      )}
      
      <ul className="space-y-4">
        {locations.map(loc => (
          <li key={loc._id} className="p-4 bg-white rounded shadow">
            <h3 className="font-bold">{loc.name}</h3>
            <p>{loc.description}</p>
            {loc.imageUrl && (
              <img src={loc.imageUrl} alt={loc.name} className="mt-2 rounded" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationList;

------------------------------------------------------------------


*/}

