// frontend/src/components/AddLocation.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { RiMapPinLine, RiImageAddLine, RiLoader4Line } from 'react-icons/ri';

const AddLocation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [errorState, setErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // ← loading state

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const onFileChange = e => {
  //   setImageFile(e.target.files[0]);
  // };
  const [imagePreview, setImagePreview] = useState(null);

  const onFileChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    
    // Create image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);         // ← start loading
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('coordinates[lat]', formData.lat);
      data.append('coordinates[lng]', formData.lng);
      if (imageFile) {
        data.append('image', imageFile);
      }
      const token = localStorage.getItem('token');
      await api.post(
        '/locations/AddLocation',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token,
          },
        }
      );
      setErrorState(true);
      setMessage('Location added successfully!');
      navigate('/locations');
    } catch (err) {
      setErrorState(false);
      console.error(err);
      setMessage('Failed to add location');
    } finally {
      setIsLoading(false);      // ← end loading
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 my-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        <RiMapPinLine className="inline-block mr-2 mb-1" />
        Add New Location
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <RiImageAddLine className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500 text-center">Click to upload location image</p>
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Form Fields Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter location name"
              value={formData.name}
              onChange={onChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Describe this location"
              value={formData.description}
              onChange={onChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Coordinates Section */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                name="lat"
                placeholder="Enter latitude"
                value={formData.lat}
                onChange={onChange}
                required
                step="any"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                name="lng"
                placeholder="Enter longitude"
                value={formData.lng}
                onChange={onChange}
                required
                step="any"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full p-4 rounded-lg font-medium text-lg transition-all duration-200
            ${isLoading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <RiLoader4Line className="animate-spin mr-2" />
              Adding Location...
            </span>
          ) : (
            'Add Location'
          )}
        </button>
      </form>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            errorState 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddLocation;
