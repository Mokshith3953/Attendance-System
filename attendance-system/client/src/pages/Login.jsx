import { API_URL } from "../utils/config";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate(
        data.role === "manager" ? "/manager-dashboard" : "/employee-dashboard"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 relative overflow-hidden items-center justify-center">
      {/* Animated Background Blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4"
          >
            <Activity className="text-white" size={32} />
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-blue-200 mt-2 text-sm">
            Sign in to access your workspace
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-medium text-blue-300 mb-1 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                name="email"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="name@company.com"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-medium text-blue-300 mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="password"
                name="password"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-blue-900/50 hover:shadow-blue-900/80 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In"} <ArrowRight size={20} />
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          New Employee?{" "}
          <Link
            to="/register"
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline"
          >
            Register Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
