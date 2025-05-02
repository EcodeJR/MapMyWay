// frontend/src/components/AddLocation.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const onFileChange = e => {
    setImageFile(e.target.files[0]);
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
      await axios.post(
        'http://localhost:5000/api/locations/AddLocation',
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
    <div className="max-w-md mx-auto bg-white shadow rounded p-6 my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Location</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Location Name"
          value={formData.name}
          onChange={onChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          value={formData.lat}
          onChange={onChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="lng"
          placeholder="Longitude"
          value={formData.lng}
          onChange={onChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={onFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full p-2 rounded
            ${isLoading
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'}
          `}
        >
          {isLoading ? 'Adding…' : 'Add Location'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            errorState ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddLocation;
