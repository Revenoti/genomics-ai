import { useState, useEffect } from 'react';
import { SERVICE_CARDS, ANIMATION_TIMINGS } from '@shared/constants';

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

  return (
    <div
      className="relative w-full max-w-3xl mx-auto mt-12 mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="carousel-container"
    >
      <div className="relative aspect-[3/4] max-h-[60vh] mx-auto overflow-hidden rounded-lg shadow-2xl">
        {SERVICE_CARDS.map((service, index) => (
          <div
            key={service.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            data-testid={`carousel-slide-${index}`}
          >
            <img
              src={`/attached_assets/${service.image}`}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {SERVICE_CARDS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            data-testid={`carousel-dot-${index}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-primary w-8'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
