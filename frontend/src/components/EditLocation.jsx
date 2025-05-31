// frontend/src/components/EditLocation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiMapPinLine, RiImageAddLine, RiSaveLine, RiLoader4Line } from 'react-icons/ri';

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

  // 2) Handle file change for image upload
  // Initialize image preview with existing image if available
  const [imagePreview, setImagePreview] = useState(initial?.imageUrl || null);
  
  // Enhanced file change handler with preview
  const onFileChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2) Submit the updated data
const onSubmit = async e => {
  e.preventDefault();
  setIsLoading(true);
  setMessage('');  // Clear previous messages
  
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
    const response = await axios.put(
      `/locations/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      }
    );

    if (response.data.success) {
      setMessage('Location updated successfully!');
      // Add a small delay before navigation to show the success message
      setTimeout(() => {
        navigate('/locations');
      }, 1500);
    } else {
      throw new Error(response.data.msg || 'Update failed');
    }
  } catch (err) {
    console.error('Update failed:', err);
    setMessage(err.response?.data?.msg || 'Failed to update location');
  } finally {
    setIsLoading(false);
  }
};

  // ------------------- Start ------------------------

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 my-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center">
        <RiMapPinLine className="mr-2 text-blue-500" />
        Edit Location
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="relative group cursor-pointer mb-8">
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Location preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <RiImageAddLine className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500">Click to update location image</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium">Change Image</span>
            </div>
          </div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Form Fields */}
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

          <div className="space-y-2 md:col-span-2">
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/locations')}
            className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`
              flex-1 p-3 rounded-lg font-medium text-white
              flex items-center justify-center gap-2
              ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg'
              }
            `}
          >
            {isLoading ? (
              <>
                <RiLoader4Line className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <RiSaveLine />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Status Message */}
      {message && (
        <div className={`mt-6 p-4 rounded-lg ${
          message.includes('successfully')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );

  // -------------------- End --------------------------

  // return (
  //   <div className="max-w-md mx-auto bg-white shadow rounded p-6 my-8">
  //     <h2 className="text-2xl font-bold mb-4 text-center">Edit Location</h2>
  //     <form onSubmit={onSubmit} className="space-y-4">
  //       <input
  //         type="text"
  //         name="name"
  //         placeholder="Location Name"
  //         value={formData.name}
  //         onChange={onChange}
  //         required
  //         className="w-full p-2 border rounded"
  //       />
  //       <textarea
  //         name="description"
  //         placeholder="Description"
  //         value={formData.description}
  //         onChange={onChange}
  //         className="w-full p-2 border rounded"
  //       />
  //       <input
  //         type="number"
  //         name="lat"
  //         placeholder="Latitude"
  //         value={formData.lat}
  //         onChange={onChange}
  //         required
  //         className="w-full p-2 border rounded"
  //       />
  //       <input
  //         type="number"
  //         name="lng"
  //         placeholder="Longitude"
  //         value={formData.lng}
  //         onChange={onChange}
  //         required
  //         className="w-full p-2 border rounded"
  //       />
  //       <input
  //         type="file"
  //         name="image"
  //         accept="image/*"
  //         onChange={onFileChange}
  //         className="w-full p-2 border rounded"
  //       />
  //       <button
  //         type="submit"
  //         disabled={isLoading}
  //         className={`w-full p-2 rounded ${
  //           isLoading
  //             ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
  //             : 'bg-green-600 text-white hover:bg-green-700'
  //         }`}
  //       >
  //         {isLoading ? 'Saving…' : 'Save Changes'}
  //       </button>
  //     </form>
  //     {message && (
  //       <p className="mt-4 text-center text-sm text-red-600">{message}</p>
  //     )}
  //   </div>
  // );
};

export default EditLocation;
