import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { ChatMessage, LeadFormData } from '@shared/schema';

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  showForm: boolean;
  formData: LeadFormData | null;
  sessionId: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_LAST_MESSAGE'; payload: string }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SHOW_FORM'; payload: boolean }
  | { type: 'SET_FORM_DATA'; payload: LeadFormData | null }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'RESET_CHAT' };

const initialState: ChatState = {
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am the Functional Genomics AI Assistant. I'm here to help you understand how our personalized, root-cause approach can help you or your loved ones. To start, could you tell me a little about what brought you here today?",
      timestamp: new Date(),
    }
  ],
  isStreaming: false,
  showForm: false,
  formData: null,
  sessionId: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'UPDATE_LAST_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg, idx) =>
          idx === state.messages.length - 1
            ? { ...msg, content: msg.content + action.payload }
            : msg
        ),
      };
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };
    case 'SHOW_FORM':
      return { ...state, showForm: action.payload };
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'RESET_CHAT':
      return initialState;
    default:
      return state;
  }
}

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
