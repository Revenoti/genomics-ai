import { useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import type { LeadFormData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Chat() {
  const { state, dispatch } = useChat();
  const { toast } = useToast();

  // Initialize session if needed
  useEffect(() => {
    if (!state.sessionId) {
      // Session will be created on first message
      dispatch({ type: 'SET_SESSION_ID', payload: 'pending' });
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_STREAMING', payload: true });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId === 'pending' ? null : state.sessionId,
          message: content,
          messages: state.messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Check if it's a form trigger
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.type === 'form') {
          dispatch({ type: 'SET_SESSION_ID', payload: data.sessionId });
          dispatch({ type: 'SHOW_FORM', payload: true });
          dispatch({ type: 'SET_STREAMING', payload: false });
          return;
        }
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let accumulatedContent = '';
      let sessionId = state.sessionId;
      
      // Add initial empty assistant message
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: '',
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.sessionId) {
              if (sessionId === 'pending' || !sessionId) {
                sessionId = data.sessionId;
                dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
              }
            }
            
            if (data.content) {
              accumulatedContent += data.content;
              dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: data.content });
            }
            
            if (data.done) {
              dispatch({ type: 'SET_STREAMING', payload: false });
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      dispatch({ type: 'SET_STREAMING', payload: false });
    }
  };

  const handleFormSubmit = async (data: LeadFormData) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      
      dispatch({ type: 'SET_FORM_DATA', payload: data });
      dispatch({ type: 'SHOW_FORM', payload: false });

      // Add confirmation message
      const confirmationMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: result.message || 'Thank you for providing that information. It will help me guide you more effectively. Let me analyze your needs and provide a personalized recommendation.',
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: confirmationMessage });

      toast({
        title: 'Success',
        description: 'Your information has been submitted.',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-center h-full px-4">
          <h1 className="text-lg font-semibold text-foreground" data-testid="chat-header">
            Genomics AI Assistant
          </h1>
        </div>
      </header>

      {/* Messages */}
      <MessageList onFormSubmit={handleFormSubmit} />

      {/* Input */}
      <MessageInput
        onSend={handleSendMessage}
        disabled={state.isStreaming}
      />
    </div>
  );
}
