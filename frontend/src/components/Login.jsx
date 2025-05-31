import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiMailLine, RiLockPasswordLine, RiLoginCircleLine } from 'react-icons/ri';
import api from '../services/api';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/signin', formData);
      // Calculate the expiration time (3 days in milliseconds)
      const expiresAt = Date.now() + 3 * 24 * 60 * 60 * 1000;

      // Create an object with the token and its expiration time
        const token = res.data.token
        const role = res.data.role
        console.log(res.data);

      // Store it as a JSON string in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('expiresAt', expiresAt);
      localStorage.setItem('user', JSON.stringify({ username: res.data.username }));
      setUser({ username: res.data.username });
      setMessage(res.data.msg);
      navigate('/');
    } catch (err) {
      setMessage(err.response.data.msg || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return formData.email && formData.password;
  };

  //---------------------Start---------------------
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="text-center">
          <RiLoginCircleLine className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue exploring locations
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
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
          </div>

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
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Error Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-sm ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Sign up Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Optional: Password Reset Link */}
        <div className="text-center">
          <Link 
            to="/forgot-password" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
  //---------------------End---------------------

  // return (
  //   <div className="max-w-md mx-auto bg-white shadow rounded p-6 my-8">
  //     <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
  //     <form onSubmit={onSubmit} className="space-y-4">
  //       <input
  //         type="email"
  //         name="email"
  //         placeholder="Email"
  //         value={formData.email}
  //         onChange={onChange}
  //         required
  //         className="w-full p-2 border border-gray-300 rounded"
  //       />
  //       <input
  //         type="password"
  //         name="password"
  //         placeholder="Password"
  //         value={formData.password}
  //         onChange={onChange}
  //         required
  //         className="w-full p-2 border border-gray-300 rounded"
  //       />
  //       <button 
  //         type="submit"
  //         disabled={!isFormValid() || isLoading}
  //         className={`w-full p-2 rounded ${
  //           isFormValid() && !isLoading
  //             ? "bg-blue-500 text-white hover:bg-blue-600"
  //             : "bg-gray-300 text-gray-500 cursor-not-allowed"
  //         }`}
  //       >
  //         {isLoading ? "Logging in..." : "Login"}
  //       </button>
  //     </form>
  //     {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
  //     <p className="mt-4 text-center">
  //       Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
  //     </p>
  //   </div>
  // );
};

export default Login;