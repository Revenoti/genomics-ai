import { MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2" data-testid="footer-address">
            <MapPin className="h-4 w-4 text-primary" />
            <span>1217 Sovereign Row Suite 107, Oklahoma City, OK 73108</span>
          </div>
          <div className="hidden sm:block text-border">|</div>
          <a 
            href="tel:+14059050854" 
            className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 transition-colors"
            data-testid="footer-phone"
          >
            <Phone className="h-4 w-4 text-primary" />
            <span>(405) 905-0854</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
