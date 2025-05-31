import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiUserAddLine, RiMailLine, RiLockPasswordLine, RiShieldUserLine, RiKeyLine } from 'react-icons/ri';
import api from '../services/api';

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
      const res = await api.post('/auth/signup', formData);
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

  // ------------Start ---------------------
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us to explore amazing locations
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {/* Username Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiUserAddLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={onChange}
              required
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiMailLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={onChange}
              required
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={onChange}
              required
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Role Selection */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiShieldUserLine className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={onChange}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="user">Regular User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Admin Code Field - Conditional Rendering */}
          {formData.role === 'admin' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiKeyLine className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="adminCode"
                placeholder="Admin Access Code"
                value={formData.adminCode}
                onChange={onChange}
                required
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={!isFormValid() || isLoading}
            className={`
              group relative w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium
              transition-all duration-200 
              ${isFormValid() && !isLoading 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}
            `}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Error Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
  // ------------End ---------------------
};

export default Signup;