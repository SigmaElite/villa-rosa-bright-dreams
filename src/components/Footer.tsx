import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();
  
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">{settings.site_title || "Villa Rosa"}</h3>
            <p className="text-primary-foreground/80">
              {settings.site_subtitle || "A boutique hotel in the heart of Rome, where classic Italian style meets modern comfort."}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#rooms" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Rooms
                </a>
              </li>
              <li>
                <a href="#booking" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Booking
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>{settings.contact_address || "Via del Corso, 150, Rome, Italy"}</li>
              <li>
                <a href={`tel:${settings.contact_phone?.replace(/\s/g, '') || '+390612345678'}`} className="hover:text-primary-foreground transition-colors">
                  {settings.contact_phone || "+39 06 1234 5678"}
                </a>
              </li>
              <li>24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 text-center text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} {settings.site_title || "Villa Rosa"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
