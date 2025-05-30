// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import MapView from './components/MapView';
import LocationList from './components/LocationList';
import Signup from './components/Signup';
import Login from './components/Login';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import AddLocation from './components/AddLocation';
import EditLocation from './components/EditLocation';
import { TbMenu2 } from "react-icons/tb";
import { CgClose } from "react-icons/cg";

const App = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);       // mobile menu toggle
  const navigate = useNavigate();

  useEffect(() => {

      // 1️⃣ Try loading the stored user first
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
        return; // we already have the user, no need to decode again
      }
    
      // 2️⃣ Fallback: decode the JWT if present
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp < now) {
            // session expired
            localStorage.removeItem('token');
            setUser(null);
          } else {
            setUser({ username: decoded.username });
          }
        } catch {
          // invalid token
          localStorage.removeItem('token');
          setUser(null);
        }
      }
     }, []);
    

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-white text-2xl font-bold">
                MapMyWay
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link to="/map" className="text-white hover:text-gray-300">Map</Link>
              <Link to="/locations" className="text-white hover:text-gray-300">Locations</Link>
              <Link to="/add-location" className="text-white hover:text-gray-300">Add Location</Link>
            </div>

            {/* User links (desktop) */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <>
                  <span className="text-white">Welcome, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="text-white hover:text-gray-300">Signup</Link>
                  <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-200 hover:text-white"
              >
                {menuOpen ? (
                    <CgClose className='text-2xl' />
                ) : (
                  <TbMenu2 className='text-2xl' />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-gray-700 px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/map"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded text-white hover:bg-gray-600"
            >
              Map
            </Link>
            <Link
              to="/locations"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded text-white hover:bg-gray-600"
            >
              Locations
            </Link>
            <Link
              to="/add-location"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded text-white hover:bg-gray-600"
            >
              Add Location
            </Link>
            <div className="border-t border-gray-600 my-2" />
            {user ? (
              <div className='flex items-center justify-around'>
                <span className="block px-3 py-2 text-white">Welcome, {user.username}</span>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-[30%] flex items-center justify-center text-left px-3 py-2 rounded bg-red-600 text-white hover:bg-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded text-white hover:bg-gray-600"
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded text-white hover:bg-gray-600"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      <div className="container  mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/locations" element={<LocationList />} />
          <Route path="/add-location" element={<AddLocation />} />
          <Route path="/locations/edit/:id" element={<EditLocation />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
