import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-hotel.jpg";

const Hero = () => {
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
          Вилла Роза
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
          Классический комфорт в сердце Гомеля
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={scrollToBooking}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            Забронировать номер
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-white text-white hover:bg-white hover:text-foreground px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            Узнать больше
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
