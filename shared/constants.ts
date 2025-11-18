import type { ServiceCard } from "./schema";

// Service images mapping to the uploaded assets
export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: 1,
    title: "ASD/PANDAS + Mental Wellness",
    description: "Comprehensive genomic analysis for autism spectrum disorders, PANDAS/PANS, and mental wellness",
    image: "1 ASD PANDAS Mental Wellness Report_1763424265352.png",
    question: "What if you could understand the root biological cause of your child's autism?"
  },
  {
    id: 2,
    title: "Brain Optimization & Cognitive Health",
    description: "Advanced testing for cognitive decline, Alzheimer's prevention, and brain wellness",
    image: "2 Brain Optimization Testing for Cognitive Health & Wellness_1763424265352.png",
    question: "Worried about memory loss? What if you could protect your brain's future today?"
  },
  {
    id: 3,
    title: "Executive Combination",
    description: "Optimize mental and physical performance for peak cognitive function",
    image: "3 Executive Combination_1763424265352.png",
    question: "Your DNA holds the secrets to your health. Are you ready to listen?"
  },
  {
    id: 4,
    title: "Complete Health Assessment",
    description: "Comprehensive genomic analysis across all body systems",
    image: "4 Medical Overview Complete Health Assessment_1763424265352.png",
    question: "Is your immune system attacking you? What if your genes hold the answer?"
  },
  {
    id: 5,
    title: "Mental Wellness Testing",
    description: "Deep dive into neurotransmitter pathways for clarity, focus, and emotional health",
    image: "5 Mental Wellness Testing for Clarity Focus & Emotional Health_1763424265352.png",
    question: "Tired of anxiety and depression? What if your mood is written in your DNA?"
  },
  {
    id: 6,
    title: "Mighty Mind and Body",
    description: "The Posey Protocol - Personalized 8-step genomic protocol for transformative health",
    image: "6 Mighty Mind and Body Combination_1763424265352.png",
    question: "What if a personalized, 8-step protocol could unlock your child's true potential?"
  }
];

// Question positions for the floating questions layer
// Positions adjusted to avoid logo overlap on mobile (logo is top-4 left-6)
export const QUESTION_POSITIONS = [
  { top: '20%', right: '8%' },    // Moved to right side to avoid logo
  { top: '30%', right: '12%' },
  { top: '50%', left: '10%' },    // Lower position, safer from logo
  { top: '65%', right: '15%' },
  { top: '80%', left: '12%' },    // Much lower, well below logo
  { top: '40%', right: '8%' }
];

// Timing constants for animations (in milliseconds)
export const ANIMATION_TIMINGS = {
  FADE_IN: 1000,
  VISIBLE: 5000,
  FADE_OUT: 1000,
  PAUSE: 2000,
  CAROUSEL_INTERVAL: 4000
};
