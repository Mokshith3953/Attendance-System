import { API_URL } from '../utils/config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogIn, LogOut, Clock, Calendar, Briefcase, CheckCircle, AlertCircle, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';



const EmployeeDashboard = () => {
  const [attendance, setAttendance] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const todayRes = await axios.get(`${API_URL}/api/attendance/today`, config);
      setAttendance(todayRes.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (!attendance) {
        await axios.post(`${API_URL}/api/attendance/checkin`, {}, config);
      } else if (!attendance.checkOutTime) {
        await axios.post(`${API_URL}/api/attendance/checkout`, {}, config);
      }
      fetchDashboardData();
    } catch (error) {
      alert("Action Failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 text-indigo-600 font-bold">
      Loading Dashboard...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      
      {/* 1. Navbar - Perfectly Aligned Content */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Briefcase size={22} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">WorkTrack</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-700">{user.name}</p>
               <p className="text-xs text-slate-400 font-medium">{user.department} Dept</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          
          {/* 2. Header Section - Flex Alignment */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Good Morning, {user.name.split(' ')[0]}</h1>
              <p className="text-slate-500 mt-2 flex items-center gap-2 font-medium">
                 <Calendar size={18} className="text-indigo-500"/> 
                 {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <Clock size={24} className="text-indigo-600" />
              <div>
                <p className="text-2xl font-mono font-bold text-slate-800 leading-none">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Realtime Clock</p>
              </div>
            </div>
          </motion.div>

          {/* 3. Main Grid Layout - Correct Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: The Big Action Card */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden flex flex-col justify-between min-h-[360px]"
            >
              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                
                {/* Status Badge & Text */}
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md
                        ${attendance?.checkOutTime ? 'bg-green-500/20 border-green-400/30 text-green-100' : 
                          attendance ? 'bg-blue-400/20 border-blue-300/30 text-blue-100' : 
                          'bg-white/20 border-white/20 text-indigo-100'}`}>
                        {attendance?.checkOutTime ? "Shift Completed" : attendance ? "Currently Active" : "Not Started"}
                     </span>
                   </div>
                   <h2 className="text-5xl font-bold leading-tight">
                     {attendance?.checkOutTime ? "You're all done!" : attendance ? "Have a productive day!" : "Ready to work?"}
                   </h2>
                   <p className="text-indigo-100 text-lg opacity-90 max-w-md">
                     {attendance?.checkOutTime ? "Great job today. See you tomorrow!" : attendance ? "Don't forget to take breaks." : "Mark your attendance to begin your shift."}
                   </p>
                </div>

                {/* Big Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAttendance}
                  disabled={attendance && attendance.checkOutTime}
                  className={`mt-8 w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all
                    ${!attendance 
                        ? 'bg-white text-indigo-700 hover:bg-indigo-50' 
                        : !attendance.checkOutTime 
                            ? 'bg-rose-500 text-white hover:bg-rose-600 border border-rose-400/30 shadow-rose-900/20' 
                            : 'bg-indigo-900/40 text-indigo-200 cursor-not-allowed border border-white/10'}`}
                >
                  {!attendance ? (
                    <> <LogIn size={24} /> Swipe to Check In </>
                  ) : !attendance.checkOutTime ? (
                    <> <LogOut size={24} /> Swipe to Check Out </>
                  ) : (
                    <> <CheckCircle size={24} /> Attendance Recorded </>
                  )}
                </motion.button>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            </motion.div>

            {/* Right Column: Stacked Stats Cards */}
            <div className="flex flex-col gap-6">
               {/* Card 1: Status */}
               <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow h-full">
                 <div className={`p-4 rounded-2xl ${attendance?.status === 'present' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {attendance ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Current Status</p>
                   <p className="text-2xl font-bold text-slate-800 capitalize">{attendance?.status || 'Absent'}</p>
                 </div>
               </motion.div>

               {/* Card 2: Check In Time */}
               <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow h-full">
                 <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                    <LogIn size={28} />
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Check In Time</p>
                   <p className="text-2xl font-bold text-slate-800">
                     {attendance?.checkInTime ? new Date(attendance.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}
                   </p>
                 </div>
               </motion.div>

               {/* Card 3: Working Hours */}
               <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow h-full">
                 <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                    <Timer size={28} />
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Duration</p>
                   <p className="text-2xl font-bold text-slate-800">
                     {attendance?.totalHours ? `${attendance.totalHours} Hrs` : '0 Hrs'}
                   </p>
                 </div>
               </motion.div>
            </div>
          </div>

          {/* 4. Table Section - Aligned & Padded */}
          <motion.div variants={itemVariants} className="mt-10 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
               <button className="text-indigo-600 text-sm font-semibold hover:underline">View Full History</button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                   <tr>
                     <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check In</th>
                     <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check Out</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   <tr className="hover:bg-slate-50 transition-colors group">
                     <td className="px-8 py-5 text-sm font-medium text-slate-600">
                        {new Date().toLocaleDateString()} <span className="ml-2 text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">Today</span>
                     </td>
                     <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                         ${attendance ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                         {attendance?.status || 'Pending'}
                       </span>
                     </td>
                     <td className="px-8 py-5 text-sm text-slate-600 font-mono">
                        {attendance?.checkInTime ? new Date(attendance.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}
                     </td>
                     <td className="px-8 py-5 text-sm text-slate-600 font-mono">
                        {attendance?.checkOutTime ? new Date(attendance.checkOutTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}
                     </td>
                   </tr>
                   {/* You can map more rows here later */}
                 </tbody>
               </table>
             </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;