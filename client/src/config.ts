// API configuration for local and production environment
export const API_BASE_URL = import.meta.env.DEV
  ? ""
  : "https://rommo-app.onrender.com";
