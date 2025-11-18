import IntriguingQuestions from '@/components/IntriguingQuestions';
import HeroSection from '@/components/HeroSection';
import logoUrl from '@assets/logo2_1763479558697.png';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))]"
        aria-hidden="true"
      />

      {/* Decorative Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
        aria-hidden="true"
      />

      {/* Logo in Top Left */}
      <div className="absolute top-4 left-6 md:top-8 md:left-12 z-10">
        <img 
          src={logoUrl} 
          alt="Functional Genomic Medicine Logo" 
          className="h-15 w-15 md:h-20 md:w-20"
          data-testid="img-logo"
        />
      </div>

      {/* Floating Intriguing Questions Layer */}
      <IntriguingQuestions />

      {/* Hero Content */}
      <HeroSection />
    </div>
  );
}
