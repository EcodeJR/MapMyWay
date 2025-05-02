// frontend/src/components/EditLocation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // If navigated via handleEdit, state.loc will have the data
  const initial = location.state?.loc || null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1) If we don’t have initial data, fetch from API
  useEffect(() => {
    if (initial) {
      setFormData({
        name: initial.name,
        description: initial.description || '',
        lat: initial.coordinates.lat,
        lng: initial.coordinates.lng,
      });
    } else {
      axios.get(`http://localhost:5000/api/locations/${id}`)
        .then(res => {
          const loc = res.data;
          setFormData({
            name: loc.name,
            description: loc.description || '',
            lat: loc.coordinates.lat,
            lng: loc.coordinates.lng,
          });
        })
        .catch(err => {
          console.error('Failed to load location:', err);
          setMessage('Error loading location data');
        });
    }
  }, [id, initial]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onFileChange = e => {
    setImageFile(e.target.files[0]);
  };

  // 2) Submit the updated data
  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('coordinates[lat]', formData.lat);
      data.append('coordinates[lng]', formData.lng);
      if (imageFile) data.append('image', imageFile);

      const token = localStorage.getItem('token'); // raw JWT
      await axios.put(
        `http://localhost:5000/api/locations/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token,
          },
        }
      );

      setMessage('Location updated successfully!');
      navigate('/locations');
    } catch (err) {
      console.error('Update failed', err);
      setMessage('Failed to update location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6 my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Location</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Location Name"
          value={formData.name}
          onChange={onChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={onChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          value={formData.lat}
          onChange={onChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="lng"
          placeholder="Longitude"
          value={formData.lng}
          onChange={onChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={onFileChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 rounded ${
            isLoading
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-red-600">{message}</p>
      )}
    </div>
  );
};

export default EditLocation;
