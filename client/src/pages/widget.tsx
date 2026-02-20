import { useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import type { LeadFormData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import logoUrl from '@assets/logo2_1763479558697.png';
import { Button } from '@/components/ui/button';
import { RotateCcw, X } from 'lucide-react';

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxRetries = 2
): Promise<Response> => {
  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 30000)
        ),
      ]);

      if (response.ok) return response;
      lastResponse = response;
      if (attempt === maxRetries) return response;

      const waitTime = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    } catch (error: any) {
      lastError = error;
      if (attempt === maxRetries) {
        if (error.message === 'Connection timeout') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
      const waitTime = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError || new Error('Request failed after retries');
};

export default function Widget() {
  const { state, dispatch } = useChat();
  const { toast } = useToast();

  useEffect(() => {
    const loadSession = async () => {
      const savedSessionId = localStorage.getItem('genomic-ai-widget-session');
      if (savedSessionId && savedSessionId !== 'pending') {
        try {
          const response = await fetch(`/api/sessions/${savedSessionId}/messages`);
          if (response.ok) {
            const data = await response.json();
            dispatch({ type: 'SET_SESSION_ID', payload: savedSessionId });
            dispatch({
              type: 'LOAD_MESSAGES',
              payload: data.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            });
            const hasFormMessage = data.messages.some((msg: any) => msg.type === 'form');
            const formTriggeredButNotSubmitted = hasFormMessage && !data.formSubmitted;
            if (formTriggeredButNotSubmitted) {
              dispatch({ type: 'SHOW_FORM', payload: true });
            }
          } else {
            localStorage.removeItem('genomic-ai-widget-session');
            dispatch({ type: 'SET_SESSION_ID', payload: 'pending' });
          }
        } catch {
          dispatch({ type: 'SET_SESSION_ID', payload: 'pending' });
        }
      } else {
        dispatch({ type: 'SET_SESSION_ID', payload: 'pending' });
      }
    };
    loadSession();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_STREAMING', payload: true });
    dispatch({ type: 'SET_SUGGESTIONS', payload: [] });

    try {
      const requestBody = {
        sessionId: state.sessionId === 'pending' ? null : state.sessionId,
        message: content,
        messages: state.messages.map((m) => ({ role: m.role, content: m.content })),
      };

      const response = await fetchWithRetry(
        '/api/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        },
        2
      );

      if (!response.ok) throw new Error('Failed to get response');

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.type === 'form') {
          localStorage.setItem('genomic-ai-widget-session', data.sessionId);
          dispatch({ type: 'SET_SESSION_ID', payload: data.sessionId });
          dispatch({ type: 'SHOW_FORM', payload: true });
          dispatch({ type: 'SET_STREAMING', payload: false });
          return;
        }
        if (data.type === 'message') {
          if (data.sessionId && (state.sessionId === 'pending' || !state.sessionId)) {
            localStorage.setItem('genomic-ai-widget-session', data.sessionId);
            dispatch({ type: 'SET_SESSION_ID', payload: data.sessionId });
          }
          const assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant' as const,
            content: data.content,
            timestamp: new Date(),
          };
          dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
          dispatch({ type: 'SET_STREAMING', payload: false });
          return;
        }
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let sessionId = state.sessionId;
      let buffer = '';

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

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.sessionId) {
                if (sessionId === 'pending' || !sessionId) {
                  sessionId = data.sessionId;
                  localStorage.setItem('genomic-ai-widget-session', data.sessionId);
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
              if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
                dispatch({ type: 'SET_SUGGESTIONS', payload: data.suggestions });
              }
            } catch {
            }
          }
        }
      }
    } catch (error) {
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
        body: JSON.stringify({ sessionId: state.sessionId, ...data }),
      });

      if (!response.ok) throw new Error('Failed to submit form');

      const result = await response.json();
      dispatch({ type: 'SET_FORM_DATA', payload: data });
      dispatch({ type: 'SHOW_FORM', payload: false });

      const confirmationMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content:
          result.message ||
          'Thank you for providing that information. It will help me guide you more effectively.',
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: confirmationMessage });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleNewChat = () => {
    localStorage.removeItem('genomic-ai-widget-session');
    dispatch({ type: 'RESET_CHAT' });
  };

  const handleClose = () => {
    window.parent.postMessage({ type: 'genomic-widget-close' }, '*');
  };

  return (
    <div className="flex flex-col h-screen bg-background" data-testid="widget-container">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-2 h-12 px-3 border-b border-border bg-primary text-primary-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-7 w-7 rounded-md flex-shrink-0"
            data-testid="widget-logo"
          />
          <span className="text-sm font-semibold truncate" data-testid="widget-title">
            Genomics AI Assistant
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            className="text-primary-foreground"
            data-testid="widget-button-reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-primary-foreground"
            data-testid="widget-button-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <MessageList onFormSubmit={handleFormSubmit} onSendMessage={handleSendMessage} />

      <MessageInput onSend={handleSendMessage} disabled={state.isStreaming} />
    </div>
  );
}
