import { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import DynamicFormMessage from './DynamicFormMessage';
import WelcomeMessage from './WelcomeMessage';
import SuggestionChips from './SuggestionChips';
import type { LeadFormData } from '@shared/schema';

interface MessageListProps {
  onFormSubmit: (data: LeadFormData) => void;
  onSendMessage?: (message: string) => void;
}

export default function MessageList({ onFormSubmit, onSendMessage }: MessageListProps) {
  const { state } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isStreaming, state.suggestions]);

  const hasMessages = state.messages.length > 0;

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        {!hasMessages && !state.isStreaming && (
          <WelcomeMessage
            onQuestionClick={(question) => onSendMessage?.(question)}
            disabled={state.isStreaming}
          />
        )}

        {state.messages.map((message, index) => (
          <div key={message.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}>
            <MessageBubble message={message} />
          </div>
        ))}

        {state.isStreaming && <TypingIndicator />}

        {!state.isStreaming && state.suggestions.length > 0 && (
          <SuggestionChips
            suggestions={state.suggestions}
            onSuggestionClick={(suggestion) => onSendMessage?.(suggestion)}
            disabled={state.isStreaming}
          />
        )}

        {state.showForm && !state.formData && (
          <DynamicFormMessage
            message="To help me provide the best recommendation, I need to gather a little more information. Please fill out the brief form below."
            onSubmit={onFormSubmit}
          />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
