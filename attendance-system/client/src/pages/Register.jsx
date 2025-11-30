import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register via Backend API
      const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Save token and redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/employee-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Register</button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/" className="text-blue-500">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;