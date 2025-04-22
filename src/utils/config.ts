// This file contains sensitive configuration that should not be exposed in client-side code
// For a production application, these values should be loaded from environment variables

// Default API key - In a real application, you would set this via environment variables
// during build time, not directly in the code
const DEFAULT_API_KEY = "AIzaSyDtpZoBoekX7PL4OBg46AqMmDGspmGPHyk";

// API configurations
const API_CONFIG = {
  // API key setup
  GEMINI_API_KEY: DEFAULT_API_KEY,
  
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