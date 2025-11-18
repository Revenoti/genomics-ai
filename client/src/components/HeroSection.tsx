import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import ImageCarousel from './ImageCarousel';

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:px-12 md:py-20 text-center">
      {/* Title */}
      <h1 
        className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
        data-testid="hero-title"
      >
        A New Paradigm in Personalized Health.{' '}
        <span className="text-primary">Discover the Root Cause.</span>
      </h1>

      {/* Subtitle */}
      <p 
        className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
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
        className="mt-8 sm:mt-12 px-6 py-5 sm:px-8 sm:py-6 md:px-12 md:py-7 text-base sm:text-lg md:text-xl font-semibold
                   bg-primary hover:bg-primary/90 text-primary-foreground
                   shadow-lg hover:shadow-xl transition-all duration-300
                   backdrop-blur-sm w-full sm:w-auto max-w-md sm:max-w-none"
        data-testid="button-start-consultation"
      >
        <span className="block sm:hidden">Start Your Consultation</span>
        <span className="hidden sm:block">Start Consultation with Functional Genomics AI</span>
      </Button>
    </div>
  );
}
