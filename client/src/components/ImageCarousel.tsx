import { useState, useEffect } from 'react';
import { SERVICE_CARDS, ANIMATION_TIMINGS } from '@shared/constants';

// Import service images using @assets alias
import asdPandasImage from '@assets/1 ASD PANDAS Mental Wellness Report_1763424265352.png';
import brainOptimizationImage from '@assets/2 Brain Optimization Testing for Cognitive Health & Wellness_1763424265352.png';
import executiveCombinationImage from '@assets/3 Executive Combination_1763424265352.png';
import completeHealthImage from '@assets/4 Medical Overview Complete Health Assessment_1763424265352.png';
import mentalWellnessImage from '@assets/5 Mental Wellness Testing for Clarity Focus & Emotional Health_1763424265352.png';
import mightyMindBodyImage from '@assets/6 Mighty Mind and Body Combination_1763424265352.png';

// Map image filenames to imported assets
const imageMap: Record<string, string> = {
  "1 ASD PANDAS Mental Wellness Report_1763424265352.png": asdPandasImage,
  "2 Brain Optimization Testing for Cognitive Health & Wellness_1763424265352.png": brainOptimizationImage,
  "3 Executive Combination_1763424265352.png": executiveCombinationImage,
  "4 Medical Overview Complete Health Assessment_1763424265352.png": completeHealthImage,
  "5 Mental Wellness Testing for Clarity Focus & Emotional Health_1763424265352.png": mentalWellnessImage,
  "6 Mighty Mind and Body Combination_1763424265352.png": mightyMindBodyImage,
};

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % SERVICE_CARDS.length);
      }, ANIMATION_TIMINGS.CAROUSEL_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto mt-3 md:mt-12 mb-0 md:mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-testid="carousel-container"
    >
      <div className="relative aspect-[3/4] max-h-[52vh] md:max-h-[60vh] mx-auto overflow-hidden rounded-lg shadow-2xl">
        {SERVICE_CARDS.map((service, index) => (
          <div
            key={service.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            data-testid={`carousel-slide-${index}`}
          >
            <img
              src={imageMap[service.image]}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        ))}
        
        {/* Navigation Dots - Absolutely Positioned Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-3 z-10">
          {SERVICE_CARDS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              data-testid={`carousel-dot-${index}`}
              className={`rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] p-5 flex items-center justify-center ${
                index === currentIndex
                  ? 'bg-primary w-10 h-2.5'
                  : 'bg-white/40 hover:bg-white/60 w-2.5 h-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
