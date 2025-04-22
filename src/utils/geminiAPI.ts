import { AIPersona } from '../types/chat';
import API_CONFIG from './config';

// Base URL for Gemini API
const API_URL = API_CONFIG.ENDPOINTS.GEMINI;

// Different persona contexts
const personaContexts = {
  'Math Expert': 'You are an expert mathematics tutor. Provide clear, step-by-step explanations for mathematical concepts and problem-solving techniques. Focus on being educational and helpful.',
  'History Mentor': 'You are a history education specialist. Provide accurate historical information with context and relevant details. Focus on educational content appropriate for students.',
  'Coding Coach': 'You are a programming instructor specializing in teaching coding concepts and practices. Provide code examples when appropriate and explain technical concepts clearly.',
  'General Tutor': 'You are a general educational assistant. Provide helpful, accurate information across a variety of academic subjects. Focus on being educational and supportive.'
};

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export async function generateGeminiResponse(message: string, persona: AIPersona): Promise<string> {
  try {
    const apiKey = API_CONFIG.GEMINI_API_KEY;
    if (!apiKey || apiKey.length < 10) {
      console.error('Valid API key not found in configuration');
      throw new Error('API key not properly configured');
    }
    
    // Log only first and last few characters for debugging, never the full key
    console.log(`Using API Key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
    
    const systemContext = personaContexts[persona] || personaContexts['General Tutor'];
    
    const requestBody = {
      contents: [
        {
          parts: [
            { text: `${systemContext}` },
            { text: `User: ${message}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: API_CONFIG.SETTINGS.MAX_TOKENS,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const url = `${API_URL}?key=${apiKey}`;
    console.log('Making API request to:', API_URL);
    
    try {
      const controller = new AbortController();
      // Set timeout for the fetch request
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.SETTINGS.REQUEST_TIMEOUT_MS);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('API response status:', response.status);
      
      const responseText = await response.text();
      // Don't log the entire response as it could contain sensitive data
      console.log('Received API response');
      
      if (!response.ok) {
        console.error('API Error Response Status:', response.status);
        return `Error from Gemini API (${response.status}): Unable to process request.`;
      }

      // Parse the response text as JSON
      const data = JSON.parse(responseText) as GeminiResponse;
      
      // Check for error in the response
      if (data.error) {
        console.error('API Error Code:', data.error.code);
        return `Error from Gemini API: ${data.error.message} (Code: ${data.error.code})`;
      }
      
      // Check if response was blocked for safety reasons
      if (data.promptFeedback?.blockReason) {
        console.warn('Response blocked:', data.promptFeedback.blockReason);
        return `I cannot provide a response to this query due to content safety policy (${data.promptFeedback.blockReason}).`;
      }
      
      // Extract the generated text
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const responseText = data.candidates[0].content.parts[0].text;
        console.log('Successfully generated response');
        return responseText;
      } else {
        console.error('No valid content in response');
        throw new Error('No valid response content generated');
      }
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        console.error('Request timed out after', API_CONFIG.SETTINGS.REQUEST_TIMEOUT_MS, 'ms');
        return "The request to the AI service timed out. Please try again later.";
      }
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in generateGeminiResponse:', error.message);
      return `API Error: ${error.message}. Please check your API configuration.`;
    } else {
      console.error('Unknown error in generateGeminiResponse:', error);
      return "I'm sorry, I encountered an error generating a response. Please try again later.";
    }
  }
}

// Fallback function to use when API isn't configured
export function getAIResponse(message: string, persona: string): string {
  // Simple response logic based on persona (same as before for fallback)
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return `Hello! I'm your ${persona} assistant. How can I help you today?`;
  }
  
  switch (persona) {
    case 'Math Expert':
      return "I can help you with various math concepts. Feel free to ask about algebra, calculus, or statistics!";
    case 'History Mentor':
      return "I'd be happy to discuss historical events, figures, or time periods with you. What would you like to explore?";
    case 'Coding Coach':
      return "I can assist with programming concepts, algorithms, or specific languages. What are you working on?";
    default:
      return "That's an interesting question. Can you tell me more about what you're trying to learn?";
  }
}; 