import { Hotel, Clock, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const About = () => {
  const { settings } = useSiteSettings();
  
  return (
    <section id="about" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {settings.about_title || "About Our Hotel"}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {settings.about_description || "Villa Rosa is a boutique hotel where classic Italian style meets modern comfort. We've created a space for your perfect stay in the heart of Rome."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-card rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-scale-in group">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce-subtle">
              <Hotel className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Comfortable Rooms</h3>
            <p className="text-muted-foreground">
              Cozy rooms with classic design and all amenities
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-scale-in group" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce-subtle">
              <MapPin className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Prime Location</h3>
            <p className="text-muted-foreground">
              {settings.contact_address || "Via del Corso, 150, Rome"} - steps from the city center
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-scale-in group" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce-subtle">
              <Clock className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">24/7 Service</h3>
            <p className="text-muted-foreground">
              Our reception is open around the clock for your convenience
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-scale-in group" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce-subtle">
              <Phone className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Always Available</h3>
            <p className="text-muted-foreground">
              Call us: {settings.contact_phone || "+39 06 1234 5678"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
