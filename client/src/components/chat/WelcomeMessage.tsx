import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, HeartPulse, Dna } from 'lucide-react';
import logoUrl from '@assets/logo2_1763479558697.png';

const STARTER_QUESTIONS = [
  {
    label: "What is functional genomic medicine?",
    icon: Dna,
  },
  {
    label: "Tell me about the Posey Protocol",
    icon: Brain,
  },
  {
    label: "How can genomics help my child with autism?",
    icon: HeartPulse,
  },
  {
    label: "What services do you offer?",
    icon: Sparkles,
  },
];

interface WelcomeMessageProps {
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

export default function WelcomeMessage({ onQuestionClick, disabled }: WelcomeMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 animate-fade-in" data-testid="welcome-message">
      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mb-4">
        <AvatarImage src={logoUrl} alt="Functional Genomics AI" />
        <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
          FG
        </AvatarFallback>
      </Avatar>

      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 text-center" data-testid="text-welcome-title">
        Functional Genomics AI Assistant
      </h2>

      <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md mb-6 leading-relaxed" data-testid="text-welcome-subtitle">
        I'm here to help you understand how personalized, root-cause medicine can transform your health journey. What would you like to explore?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-lg">
        {STARTER_QUESTIONS.map((q) => (
          <Button
            key={q.label}
            variant="outline"
            size="default"
            onClick={() => !disabled && onQuestionClick(q.label)}
            disabled={disabled}
            className="justify-start gap-2 text-left whitespace-normal"
            data-testid={`button-starter-${q.label.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`}
          >
            <q.icon className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="leading-snug text-sm">{q.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
