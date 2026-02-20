import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import logoUrl from '@assets/logo2_1763479558697.png';

const STATUS_MESSAGES = [
  "Analyzing your question...",
  "Searching knowledge base...",
  "Preparing a personalized response...",
];

export default function TypingIndicator() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2 sm:gap-3 mr-auto max-w-[80%] md:max-w-[70%] animate-fade-in" data-testid="typing-indicator">
      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
        <AvatarImage src={logoUrl} alt="Functional Genomics AI" />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-semibold">
          FG
        </AvatarFallback>
      </Avatar>

      <div className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl rounded-tl-sm bg-card text-card-foreground border border-card-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot-1" />
            <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot-2" />
            <span className="w-2 h-2 rounded-full bg-primary animate-typing-dot-3" />
          </div>
          <span className="text-sm text-muted-foreground transition-opacity duration-300" data-testid="text-typing-status">
            {STATUS_MESSAGES[statusIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
