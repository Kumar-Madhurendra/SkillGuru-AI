// This file contains sensitive configuration that should not be exposed in client-side code
// For a production application, these values should be loaded from environment variables

// Use environment variable or fallback to default API key
const DEFAULT_API_KEY = "AIzaSyDtpZoBoekX7PL4OBg46AqMmDGspmGPHyk";

// In Vite, environment variables are exposed using import.meta.env
// and need to be prefixed with VITE_ instead of REACT_APP_
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_API_KEY;

// API configurations
const API_CONFIG = {
  // API key setup
  GEMINI_API_KEY: API_KEY,
  
  // API endpoints and other configuration
  ENDPOINTS: {
    GEMINI: "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
  },
  
  // Timeouts and other settings
  SETTINGS: {
    REQUEST_TIMEOUT_MS: 30000,
    MAX_TOKENS: 1024,
  }
};

export default API_CONFIG;