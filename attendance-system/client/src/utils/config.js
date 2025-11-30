// This automatically detects if you are on localhost or deployed
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";