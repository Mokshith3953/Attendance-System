import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, LogOut, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // 1. Fetch Employee List (Table Data)
      const employeeRes = await axios.get('http://localhost:5000/api/manager/all', config);
      setEmployees(employeeRes.data);

      // 2. Fetch Real Chart Stats (Graph Data)
      const statsRes = await axios.get('http://localhost:5000/api/manager/stats', config);
      setChartData(statsRes.data);

    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const downloadCSV = () => {
    const headers = ["Employee Name, Department, Status, Check In Time, Check Out Time"];
    const rows = employees.map(emp => {
      const checkIn = emp.checkInTime ? new Date(emp.checkInTime).toLocaleTimeString() : '-';
      const checkOut = emp.checkOutTime ? new Date(emp.checkOutTime).toLocaleTimeString() : '-';
      return `${emp.name},${emp.department},${emp.status},${checkIn},${checkOut}`;
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold flex items-center gap-2">
           <Users className="text-blue-600" /> Manager Dashboard
        </h1>
        <div className="flex gap-4">
            <button onClick={downloadCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                <FileDown size={20} /> Export CSV
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium">
                <LogOut size={20} /> Logout
            </button>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Weekly Trend Bar Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance Trend</h3>
          {/* Ensure container has height so chart renders */}
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Present" fill="#4CAF50" />
                <Bar dataKey="Absent" fill="#FF5252" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Stats Table */}
        <div className="bg-white p-6 rounded shadow">
           <h3 className="text-lg font-semibold mb-4">Department Overview</h3>
           <div className="overflow-y-auto h-64">
             <table className="w-full text-left">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="p-2">Department</th>
                   <th className="p-2">Employees</th>
                 </tr>
               </thead>
               <tbody>
                 {[...new Set(employees.map(item => item.department))].map((dept, index) => (
                   <tr key={index} className="border-b">
                     <td className="p-2 font-medium">{dept || "General"}</td>
                     <td className="p-2">{employees.filter(e => e.department === dept).length}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Today's Detailed Status</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-4 border-b">Employee Name</th>
              <th className="p-4 border-b">Department</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Check In Time</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="p-4 border-b font-medium">{emp.name}</td>
                <td className="p-4 border-b text-gray-500">{emp.department}</td>
                <td className="p-4 border-b">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                    ${emp.status === 'present' ? 'bg-green-100 text-green-700' : 
                      emp.status === 'absent' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 border-b text-gray-600">
                  {emp.checkInTime ? new Date(emp.checkInTime).toLocaleTimeString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerDashboard;
