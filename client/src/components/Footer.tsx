import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="footer-address">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="leading-relaxed">1217 Sovereign Row Suite 107, Oklahoma City, OK 73108</span>
          </div>
          <div className="text-xs text-muted-foreground/80 mt-1" data-testid="footer-copyright">
            © 2025 Functional Genomic AI. All rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
