import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mr-auto max-w-[80%] md:max-w-[70%]" data-testid="typing-indicator">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
          FG
        </AvatarFallback>
      </Avatar>

      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card text-card-foreground border border-card-border">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
