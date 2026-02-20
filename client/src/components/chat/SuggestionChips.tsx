import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface SuggestionChipsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

export default function SuggestionChips({ suggestions, onSuggestionClick, disabled }: SuggestionChipsProps) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 ml-10 sm:ml-12 animate-fade-in" data-testid="suggestion-chips">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => !disabled && onSuggestionClick(suggestion)}
          disabled={disabled}
          className="gap-1.5 whitespace-normal text-left"
          data-testid={`button-suggestion-${index}`}
        >
          <MessageCircle className="w-3 h-3 text-primary flex-shrink-0" />
          <span>{suggestion}</span>
        </Button>
      ))}
    </div>
  );
}
