import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { SERVICE_CARDS, QUESTION_POSITIONS, ANIMATION_TIMINGS } from '@shared/constants';

type AnimationPhase = 'fadeIn' | 'visible' | 'fadeOut' | 'pause';

export default function IntriguingQuestions() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Ref-based state for animation loop
  const phaseRef = useRef<AnimationPhase>('fadeIn');
  const indexRef = useRef(0);
  const phaseStartTime = useRef(performance.now());
  const animationFrame = useRef<number | null>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Single RAF loop with no dependencies - runs once
    const animate = () => {
      const elapsed = performance.now() - phaseStartTime.current;
      let shouldUpdateDisplay = false;
      
      switch (phaseRef.current) {
        case 'fadeIn':
          if (!isVisibleRef.current) {
            isVisibleRef.current = true;
            shouldUpdateDisplay = true;
          }
          if (elapsed >= ANIMATION_TIMINGS.FADE_IN) {
            phaseRef.current = 'visible';
            phaseStartTime.current = performance.now();
          }
          break;
        case 'visible':
          if (elapsed >= ANIMATION_TIMINGS.VISIBLE) {
            phaseRef.current = 'fadeOut';
            phaseStartTime.current = performance.now();
          }
          break;
        case 'fadeOut':
          if (isVisibleRef.current) {
            isVisibleRef.current = false;
            shouldUpdateDisplay = true;
          }
          if (elapsed >= ANIMATION_TIMINGS.FADE_OUT) {
            phaseRef.current = 'pause';
            phaseStartTime.current = performance.now();
          }
          break;
        case 'pause':
          if (elapsed >= ANIMATION_TIMINGS.PAUSE) {
            indexRef.current = (indexRef.current + 1) % SERVICE_CARDS.length;
            phaseRef.current = 'fadeIn';
            phaseStartTime.current = performance.now();
            setCurrentIndex(indexRef.current); // Update displayed card
          }
          break;
      }
      
      // Only update React state when display actually changes
      if (shouldUpdateDisplay) {
        setIsVisible(isVisibleRef.current);
      }
      
      animationFrame.current = requestAnimationFrame(animate);
    };

    // Handle visibility change to prevent drift during inactive tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        phaseStartTime.current = performance.now(); // Reset timing when tab becomes active
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty deps - single loop for component lifetime

  const currentQuestion = SERVICE_CARDS[currentIndex];
  const currentPosition = QUESTION_POSITIONS[currentIndex];

  const handleQuestionClick = () => {
    setLocation('/chat');
  };

  return (
    <button
      onClick={handleQuestionClick}
      data-testid={`question-${currentIndex}`}
      className="fixed z-10 max-w-[280px] sm:max-w-xs md:max-w-md text-white text-xs sm:text-sm md:text-base font-medium 
                 cursor-pointer hover-elevate active-elevate-2 rounded-lg px-3 py-2 sm:px-4 sm:py-3
                 bg-black/20 backdrop-blur-sm border border-white/20
                 transition-all duration-1000 will-change-[opacity,transform]"
      style={{
        ...currentPosition,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      {currentQuestion.question}
    </button>
  );
}
