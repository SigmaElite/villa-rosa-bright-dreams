import { MapPin, Phone, Clock, Mail } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Контакты
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">
            Мы всегда рады ответить на ваши вопросы
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8 animate-slide-in-left">
            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-slow transition-all">
                <MapPin className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Адрес</h3>
                <p className="text-muted-foreground">ул. Ильича, 150<br />Гомель, Беларусь</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-slow transition-all">
                <Phone className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Телефон</h3>
                <a 
                  href="tel:+375333559767" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +375 33 355-97-67
                </a>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-slow transition-all">
                <Clock className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Время работы</h3>
                <p className="text-muted-foreground">Круглосуточно<br />7 дней в неделю</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-slow transition-all">
                <Mail className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Email</h3>
                <a 
                  href="mailto:info@villaroza.by" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@villaroza.by
                </a>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2396.7774647487744!2d30.967686!3d52.424721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDI1JzI5LjAiTiAzMMKwNTgnMDMuNyJF!5e0!3m2!1sen!2sby!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Вилла Роза на карте"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
