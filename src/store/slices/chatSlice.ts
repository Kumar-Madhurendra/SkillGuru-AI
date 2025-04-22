import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AIPersona, ChatState, Message } from '../../types/chat';
import { generateMessageId } from '../../utils/chatUtils';

const initialState: ChatState = {
  messages: [],
  activePersona: 'General Tutor',
  isAITyping: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      const { text, sender, isTyping } = action.payload;
      
      // Generate a unique ID for the message
      const id = generateMessageId();
      
      // Add the message to the state
      state.messages.push({
        id,
        text,
        sender,
        timestamp: Date.now(),
        isTyping: isTyping || false,
      });
      
      // For debugging
      console.log(`Added message with ID: ${id}, content: ${text.substring(0, 20)}...`);
    },
    
    updateMessage: (state, action: PayloadAction<{ id: string; updates: Partial<Message> }>) => {
      const { id, updates } = action.payload;
      
      // Find the message to update
      const messageIndex = state.messages.findIndex(message => message.id === id);
      
      // If found, update it
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { 
          ...state.messages[messageIndex], 
          ...updates 
        };
        console.log(`Updated message at index ${messageIndex} with ID: ${id}`);
      } else {
        // If not found by ID, try to find the last AI message
        if (updates.isTyping === false) {
          const lastAiIndex = [...state.messages]
            .reverse()
            .findIndex(m => m.sender === 'ai' && m.isTyping);
          
          if (lastAiIndex !== -1) {
            const actualIndex = state.messages.length - 1 - lastAiIndex;
            state.messages[actualIndex] = {
              ...state.messages[actualIndex],
              ...updates
            };
            console.log(`Updated last AI message at index ${actualIndex}`);
          } else {
            console.log(`Could not find message with ID: ${id} to update`);
          }
        }
      }
    },
    
    setAITypingStatus: (state, action: PayloadAction<boolean>) => {
      state.isAITyping = action.payload;
    },
    
    setActivePersona: (state, action: PayloadAction<AIPersona>) => {
      state.activePersona = action.payload;
    },
    
    clearMessages: (state) => {
      state.messages = [];
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  addMessage, 
  updateMessage, 
  setAITypingStatus, 
  setActivePersona, 
  clearMessages,
  setError
} = chatSlice.actions;

export default chatSlice.reducer;