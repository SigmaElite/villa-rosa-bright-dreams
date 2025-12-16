import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Contact = () => {
  const { settings } = useSiteSettings();
  
  return (
    <section id="contact" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">
            We're always happy to answer your questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8 animate-slide-in-left">
            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-slow transition-all">
                <MapPin className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Address</h3>
                <p className="text-muted-foreground">{settings.contact_address || "Via del Corso, 150, 00186 Rome, Italy"}</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-slow transition-all">
                <Phone className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Phone</h3>
                <a 
                  href={`tel:${settings.contact_phone?.replace(/\s/g, '') || '+390612345678'}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {settings.contact_phone || "+39 06 1234 5678"}
                </a>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-slow transition-all">
                <Clock className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Working Hours</h3>
                <p className="text-muted-foreground">24/7<br />7 days a week</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-slow transition-all">
                <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Email</h3>
                <a 
                  href={`mailto:${settings.contact_email || 'info@villarosa.it'}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {settings.contact_email || "info@villarosa.it"}
                </a>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.6557489647!2d12.4804!3d41.9028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61a49eaac8a1%3A0x9f9b60c45d7b5d8a!2sVia%20del%20Corso%2C%20Roma%20RM%2C%20Italy!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Villa Rosa on map"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
