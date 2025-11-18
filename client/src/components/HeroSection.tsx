import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import ImageCarousel from './ImageCarousel';

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 md:pt-28 md:px-12 pb-4 sm:pb-8 text-center">
      {/* Title */}
      <h1 
        className="font-serif text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight"
        data-testid="hero-title"
      >
        A New Paradigm in Personalized Health.{' '}
        <span className="text-primary">Discover the Root Cause.</span>
      </h1>

      {/* Subtitle */}
      <p 
        className="text-xs sm:text-base md:text-lg text-white/90 max-w-3xl mx-auto mb-3 sm:mb-6 leading-snug"
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
        className="mt-6 sm:mt-8 px-6 py-4 sm:px-8 sm:py-6 md:px-12 md:py-7 text-sm sm:text-lg md:text-xl font-semibold
                   bg-primary hover:bg-primary/90 text-primary-foreground
                   shadow-lg hover:shadow-xl transition-all duration-300
                   backdrop-blur-sm w-full sm:w-auto max-w-md sm:max-w-none"
        data-testid="button-start-consultation"
      >
        <span className="block sm:hidden">Start A Free Genomic Consultation</span>
        <span className="hidden sm:block">Start Consultation with Functional Genomics AI</span>
      </Button>
    </div>
  );
}
