import { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import DynamicFormMessage from './DynamicFormMessage';
import type { LeadFormData } from '@shared/schema';

interface MessageListProps {
  onFormSubmit: (data: LeadFormData) => void;
}

export default function MessageList({ onFormSubmit }: MessageListProps) {
  const { state } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-4">
        {state.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {state.isStreaming && <TypingIndicator />}

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
