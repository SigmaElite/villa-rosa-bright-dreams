import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-villa-roza.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Hero = () => {
  const { settings } = useSiteSettings();
  
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
          {settings.hero_title || "Villa Rosa"}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
          {settings.hero_description || "Classic comfort in the heart of Rome"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={scrollToBooking}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            Book a Room
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-foreground px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            Learn More
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="w-10 h-10 text-white" />
      </div>
    </section>
  );
};

export default Hero;
