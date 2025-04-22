// Generate a unique message ID
export const generateMessageId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format timestamp for messages
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Simulate AI response delay (between 1-3 seconds)
export const getRandomResponseDelay = (): number => {
  return Math.floor(Math.random() * 2000) + 1000;
};

// Sample AI responses based on persona
export const getAIResponse = (message: string, persona: string): string => {
  // Simple response logic based on persona
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