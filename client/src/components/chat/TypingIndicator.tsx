import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mr-auto max-w-[80%] md:max-w-[70%]" data-testid="typing-indicator">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
          FG
        </AvatarFallback>
      </Avatar>

      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card text-card-foreground border border-card-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>AI is analyzing your question...</span>
        </div>
      </div>
    </div>
  );
}
