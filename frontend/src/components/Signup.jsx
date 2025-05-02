import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // default role
    adminCode: '', // only required if role is admin
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      setMessage(res.data.msg);
      navigate('/login');
    } catch (err) {
      setMessage(err.response.data.msg || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!formData.username || !formData.email || !formData.password) {
      return false;
    }
    
    // If role is admin, admin code is required
    if (formData.role === 'admin' && !formData.adminCode) {
      return false;
    }
    
    return true;
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6 my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={onChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          name="role"
          value={formData.role}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {formData.role === 'admin' && (
          <input
            type="text"
            name="adminCode"
            placeholder="Enter Admin Code"
            value={formData.adminCode}
            onChange={onChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        )}
        <button 
          type="submit" 
          disabled={!isFormValid() || isLoading}
          className={`w-full p-2 rounded ${
            isFormValid() && !isLoading 
              ? "bg-blue-500 text-white hover:bg-blue-600" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Processing..." : "Register"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default Signup;