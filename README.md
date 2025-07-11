# SkillGuru AI Chat Application

## Overview

This application provides an AI chat interface powered by Google's Gemini API. Users can interact with the AI assistant for educational purposes, ask questions, and receive AI-generated responses.

## Features

- Interactive chat interface with AI assistance
- Support for markdown and code formatting in responses
- Real-time typing indicators
- Secure API key management
- Fallback offline responses when API is unavailable

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/auro.edu.git
cd auro.edu
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your API key:
   - The application uses a default API key for development purposes
   - For production, create a `.env` file with `VITE_GEMINI_API_KEY=your_api_key_here`

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` in your browser.

## API Configuration

The application uses Google's Gemini API. Configuration settings are available in `src/utils/config.ts`.

### API Key Setup

For development, a default API key is provided. For production use:

1. Create a `.env` file in the root directory
2. Add your Gemini API key as `VITE_GEMINI_API_KEY=your_api_key_here`
3. The config.ts file is set up to use this environment variable

```typescript
// Example of secure production configuration
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_API_KEY;
```

### API Endpoints

The application is configured to use the Gemini 1.5 Flash model:
```
https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent
```

## Deployment

### Deploying to Netlify

1. Push your code to a GitHub repository

2. In Netlify Dashboard:
   - Create a new site from GitHub
   - Select your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable `VITE_GEMINI_API_KEY` with your API key

3. For SPA routing, the project includes a `netlify.toml` file with the necessary redirect rules

4. Advanced Settings:
   - Set Node.js version to 20 if needed for React 19 compatibility

### Troubleshooting Deployment

If deployment fails:
- Check Netlify build logs for specific errors
- Ensure environment variables are correctly set
- Verify Node.js version compatibility (project uses React 19)
- Make sure there are no TypeScript errors that would prevent compilation

## Architecture

- `src/components/` - React components for the UI
- `src/hooks/` - Custom React hooks including the useChat hook
- `src/utils/` - Utility functions including API communication
- `src/types/` - TypeScript type definitions

## Security Considerations

- API keys should not be exposed in client-side code for production applications
- The current implementation is for demonstration purposes only
- In a production environment, API requests should be proxied through a secure backend

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Generative AI for providing the Gemini API
- React team for the framework
- TypeScript team for the type system
