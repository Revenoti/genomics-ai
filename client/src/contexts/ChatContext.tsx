import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { ChatMessage, LeadFormData } from '@shared/schema';

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  showForm: boolean;
  formData: LeadFormData | null;
  sessionId: string | null;
  suggestions: string[];
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_LAST_MESSAGE'; payload: string }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SHOW_FORM'; payload: boolean }
  | { type: 'SET_FORM_DATA'; payload: LeadFormData | null }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'LOAD_MESSAGES'; payload: ChatMessage[] }
  | { type: 'SET_SUGGESTIONS'; payload: string[] }
  | { type: 'RESET_CHAT' };

const initialState: ChatState = {
  messages: [],
  isStreaming: false,
  showForm: false,
  formData: null,
  sessionId: null,
  suggestions: [],
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
    case 'LOAD_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
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
