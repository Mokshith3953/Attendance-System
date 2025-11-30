import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/config'; // 1. Import the config

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 2. EXPERT FIX: Use API_URL instead of 'http://localhost:5000'
      // This ensures it works on Vercel (Cloud) AND Localhost automatically.
      const { data } = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/employee-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register Employee</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <input type="text" name="employeeId" placeholder="Employee ID (e.g. EMP001)" onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-6">
            <input type="text" name="department" placeholder="Department" onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
             {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/" className="text-blue-500">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;