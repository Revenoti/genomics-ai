import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import ImageCarousel from './ImageCarousel';

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative z-20 max-w-5xl mx-auto px-6 py-12 md:px-12 md:py-20 text-center">
      {/* Title */}
      <h1 
        className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        data-testid="hero-title"
      >
        A New Paradigm in Personalized Health.{' '}
        <span className="text-primary">Discover the Root Cause.</span>
      </h1>

      {/* Subtitle */}
      <p 
        className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed"
        data-testid="hero-subtitle"
      >
        Chat with our Functional Genomics AI to understand how precision medicine 
        can transform your health journey.
      </p>

      {/* Image Carousel */}
      <ImageCarousel />

      {/* CTA Button */}
      <Button
        onClick={() => setLocation('/chat')}
        size="lg"
        className="mt-12 px-8 py-6 md:px-12 md:py-7 text-lg md:text-xl font-semibold
                   bg-primary hover:bg-primary/90 text-primary-foreground
                   shadow-lg hover:shadow-xl transition-all duration-300
                   backdrop-blur-sm"
        data-testid="button-start-consultation"
      >
        Start Consultation with Functional Genomics AI
      </Button>
    </div>
  );
}
