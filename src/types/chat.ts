export type MessageSender = 'user' | 'ai';
export type AIPersona = 'Math Expert' | 'History Mentor' | 'Coding Coach' | 'General Tutor';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: number;
  isTyping?: boolean;
}

export interface ChatState {
  messages: Message[];
  activePersona: AIPersona | null;
  isAITyping: boolean;
  error: string | null;
  hasSelectedSubject: boolean;
}