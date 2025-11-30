import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard'; // Import this

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/employee-dashboard" 
          element={
            <PrivateRoute>
              <EmployeeDashboard />
            </PrivateRoute>
          } 
        />
        
        {/* ADD THIS ROUTE */}
        <Route 
          path="/manager-dashboard" 
          element={
            <PrivateRoute>
              <ManagerDashboard />
            </PrivateRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;