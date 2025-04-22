import { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  addMessage, 
  setAITypingStatus, 
  updateMessage,
  clearMessages,
  setError
} from '../store/slices/chatSlice';
import { generateGeminiResponse, getAIResponse } from '../utils/geminiAPI';
import { generateMessageId, getRandomResponseDelay } from '../utils/chatUtils';
import API_CONFIG from '../utils/config';

export const useChat = () => {
  const dispatch = useDispatch();
  const { messages, activePersona, isAITyping, error, hasSelectedSubject } = useSelector((state: RootState) => state.chat);
  const lastMessageIdRef = useRef('');
  const [useApi, setUseApi] = useState(true); // Set to true by default
  const [showApiConfig, setShowApiConfig] = useState(false);

  // Initialize API functionality
  useEffect(() => {
    // Check if we have a valid API key
    const hasValidApiKey = !!API_CONFIG.GEMINI_API_KEY && API_CONFIG.GEMINI_API_KEY.length > 10;
    
    // Set API usage based on key availability
    setUseApi(hasValidApiKey);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !activePersona || !hasSelectedSubject) return;

    try {
      // Add user message
      dispatch(addMessage({
        text,
        sender: 'user',
      }));

      // Simulate AI typing
      dispatch(setAITypingStatus(true));
      
      // Generate a new message ID for the AI response
      const aiMessageId = generateMessageId();
      lastMessageIdRef.current = aiMessageId;
      
      // Add typing indicator message
      dispatch(addMessage({
        text: '',
        sender: 'ai',
        isTyping: true,
      }));

      // Get the response either from API or local function
      let response: string;
      
      if (useApi) {
        try {
          // Use a delay to make typing indicator visible
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get real API response
          response = await generateGeminiResponse(text, activePersona);
        } catch (error) {
          console.error("API Call failed:", error);
          // Fallback to local response on error
          response = getAIResponse(text, activePersona);
        }
      } else {
        // Use simulated response with delay
        await new Promise(resolve => setTimeout(resolve, getRandomResponseDelay()));
        response = getAIResponse(text, activePersona);
      }

      // Find the last AI message (which should be our typing indicator)
      const typingMessage = [...messages].reverse().find(m => m.sender === 'ai' && m.isTyping);
      const messageToUpdateId = typingMessage?.id || lastMessageIdRef.current;
      
      // Update the message with the actual response
      dispatch(updateMessage({
        id: messageToUpdateId,
        updates: { 
          text: response,
          isTyping: false
        }
      }));
      
      // Clear any previous errors
      if (error) {
        dispatch(setError(null));
      }
    } catch (err) {
      console.error('Error in chat flow:', err);
      dispatch(setError('Failed to get response. Please try again.'));
    } finally {
      dispatch(setAITypingStatus(false));
    }
  }, [dispatch, activePersona, messages, error, useApi, hasSelectedSubject]);

  const clearChat = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const setApiKey = useCallback((apiKey: string) => {
    // This would normally update the API key in a secure way
    // For this implementation, we're just setting the useApi flag
    setUseApi(!!apiKey && apiKey.length > 10);
    setShowApiConfig(false);
  }, []);

  return {
    messages,
    activePersona,
    isAITyping,
    error,
    hasSelectedSubject,
    sendMessage,
    clearChat,
    useApi,
    showApiConfig,
    setApiKey,
    setShowApiConfig
  };
};

export default useChat; 