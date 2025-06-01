// frontend/src/components/LocationList.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin5Line, RiFileEditFill, RiSearchLine } from 'react-icons/ri';

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // loading state
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    api.get(`/locations/GetLocation?q=${query}`)
      .then(res => setLocations(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [query]);

  const handleDelete = async id => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/locations/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setLocations(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = loc => {
    navigate(`/locations/edit/${loc._id}`, { state: { loc } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      {/* Search Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Locations</h1>
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No locations found</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {locations.map(loc => (
            <li key={loc._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                {loc.imageUrl ? (
                  <img
                    src={api.getImageUrl(loc.imageUrl)}
                    alt={loc.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', e);
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = '/placeholder.jpg'; // Add a placeholder image
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                {role === 'admin' && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      title="Edit"
                      onClick={() => handleEdit(loc)}
                      className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors duration-200 shadow-lg"
                    >
                      <RiFileEditFill className="text-lg" />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(loc._id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg"
                    >
                      <RiDeleteBin5Line className="text-lg" />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{loc.name}</h3>
                <p className="text-gray-600 line-clamp-2">{loc.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                      onClick={() => {
                        // Pass the full location object as state
                        navigate(`/map`, {
                          state: { selectedLocationId: loc._id }
                        });
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                    >
                      View on map <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationList;
