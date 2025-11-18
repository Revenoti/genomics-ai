import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@shared/schema';
import logoUrl from '@assets/logo2_1763479558697.png';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse ml-auto' : 'mr-auto'} max-w-[85%] sm:max-w-[80%] md:max-w-[70%]`}
      data-testid={`message-${message.role}`}
    >
      {/* Avatar */}
      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
        {isUser ? (
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src={logoUrl} alt="Functional Genomics AI" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-semibold">
              FG
            </AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Message Content */}
      <div
        className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card text-card-foreground rounded-tl-sm border border-card-border'
        }`}
      >
        {isUser ? (
          <p className="text-base leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="font-semibold underline hover:scale-105 transition-transform inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="text-base leading-relaxed mb-2 last:mb-0" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc list-inside space-y-1 my-2" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal list-inside space-y-1 my-2" />
                ),
                strong: ({ node, ...props }) => (
                  <strong {...props} className="font-semibold" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
