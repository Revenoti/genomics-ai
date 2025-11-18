import { useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import type { LeadFormData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import logoUrl from '@assets/logo2_1763479558697.png';

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
    console.log('[FRONTEND] Sending message, current sessionId:', state.sessionId);
    
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
      const requestBody = {
        sessionId: state.sessionId === 'pending' ? null : state.sessionId,
        message: content,
        messages: state.messages.map(m => ({ role: m.role, content: m.content })),
      };
      console.log('[FRONTEND] Request body sessionId:', requestBody.sessionId);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Check if it's a form trigger
      const contentType = response.headers.get('content-type');
      console.log('[FRONTEND] Response content-type:', contentType);
      
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        console.log('[FRONTEND] JSON response data:', data);
        
        if (data.type === 'form') {
          console.log('[FRONTEND] Form trigger received! Setting sessionId:', data.sessionId);
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
                dispatch({ type: 'SET_SESSION_ID', payload: data.sessionId });
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
    console.log('handleFormSubmit called with data:', data);
    console.log('Current sessionId:', state.sessionId);
    
    try {
      console.log('Sending POST to /api/leads');
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          ...data,
        }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', errorText);
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      console.log('Form submission result:', result);
      
      console.log('Dispatching SET_FORM_DATA');
      dispatch({ type: 'SET_FORM_DATA', payload: data });
      console.log('Dispatching SHOW_FORM false');
      dispatch({ type: 'SHOW_FORM', payload: false });

      // Add confirmation message
      const confirmationMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: result.message || 'Thank you for providing that information. It will help me guide you more effectively. Let me analyze your needs and provide a personalized recommendation.',
        timestamp: new Date(),
      };
      console.log('Adding confirmation message');
      dispatch({ type: 'ADD_MESSAGE', payload: confirmationMessage });

      toast({
        title: 'Success',
        description: 'Your information has been submitted.',
      });
      console.log('Form submission complete');
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
        <div className="flex items-center justify-between gap-2 h-full px-4 md:px-6">
          <Link href="/" data-testid="link-home">
            <img 
              src={logoUrl} 
              alt="Functional Genomic Medicine Logo" 
              className="h-10 w-10 md:h-12 md:w-12 hover-elevate rounded-md cursor-pointer"
              data-testid="img-logo-header"
            />
          </Link>
          <h1 className="text-base md:text-lg font-semibold text-foreground" data-testid="chat-header">
            Genomics AI Assistant
          </h1>
          <div className="w-10 md:w-12" />
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
