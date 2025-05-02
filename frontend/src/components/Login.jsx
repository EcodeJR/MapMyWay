import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
      const res = await axios.post('http://localhost:5000/api/auth/signin', formData);
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

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6 my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={onSubmit} className="space-y-4">
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
        <button 
          type="submit"
          disabled={!isFormValid() || isLoading}
          className={`w-full p-2 rounded ${
            isFormValid() && !isLoading
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
      </p>
    </div>
  );
};

export default Login;