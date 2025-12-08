import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, children, href, ...props }) => (
                  <a
                    {...props}
                    href={href}
                    className="text-primary font-medium underline underline-offset-2 decoration-primary/50 hover:decoration-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-external"
                  >
                    {children}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="text-base leading-relaxed mb-3 last:mb-0" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc pl-5 space-y-1.5 my-3 text-base" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal pl-5 space-y-1.5 my-3 text-base" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="leading-relaxed" />
                ),
                strong: ({ node, ...props }) => (
                  <strong {...props} className="font-semibold text-foreground" />
                ),
                em: ({ node, ...props }) => (
                  <em {...props} className="italic text-muted-foreground" />
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-xl font-bold mb-3 mt-4 first:mt-0 text-foreground" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-lg font-semibold mb-2 mt-3 first:mt-0 text-foreground" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-base font-semibold mb-2 mt-3 first:mt-0 text-foreground" />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote 
                    {...props} 
                    className="border-l-4 border-primary/30 pl-4 py-1 my-3 italic text-muted-foreground bg-muted/30 rounded-r-md" 
                  />
                ),
                code: ({ node, className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code 
                        {...props} 
                        className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  );
                },
                pre: ({ node, ...props }) => (
                  <pre 
                    {...props} 
                    className="bg-muted p-3 rounded-lg my-3 overflow-x-auto text-sm font-mono" 
                  />
                ),
                hr: ({ node, ...props }) => (
                  <hr {...props} className="my-4 border-border" />
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
