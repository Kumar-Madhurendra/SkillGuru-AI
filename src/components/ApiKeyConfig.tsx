import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ApiKeyConfigProps {
  onSave: (apiKey: string) => void;
  onCancel: () => void;
  defaultApiKey?: string;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ 
  onSave, 
  onCancel, 
  defaultApiKey = ''
}) => {
  const [apiKey, setApiKey] = useState(defaultApiKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage if available
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey);
      onSave(apiKey);
    }
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Configure Gemini API
      </h2>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        To enable AI responses, enter your Gemini API key below. You can get a free API key from{' '}
        <a 
          href="https://aistudio.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Google AI Studio
        </a>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            API Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your Gemini API key"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 dark:text-gray-400"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear
          </button>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!apiKey.trim()}
            >
              Save API Key
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ApiKeyConfig; 