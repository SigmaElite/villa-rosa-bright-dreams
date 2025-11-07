import { Hotel, Clock, MapPin, Phone } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            О нашем отеле
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Вилла Роза - это мини-отель, где классический стиль сочетается с современным комфортом. 
            Мы создали пространство для вашего идеального отдыха в центре Гомеля.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-card rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-scale-in group">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce-subtle">
              <Hotel className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Комфортные номера</h3>
            <p className="text-muted-foreground">
              Уютные номера с классическим дизайном и всеми удобствами
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-scale-in group" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce-subtle">
              <MapPin className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Удобное расположение</h3>
            <p className="text-muted-foreground">
              ул. Ильича, 150, Гомель - в доступной близости от центра
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-scale-in group" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce-subtle">
              <Clock className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Работаем круглосуточно</h3>
            <p className="text-muted-foreground">
              Наша стойка регистрации работает 24/7 для вашего удобства
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2 animate-scale-in group" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce-subtle">
              <Phone className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Всегда на связи</h3>
            <p className="text-muted-foreground">
              Звоните нам: +375 33 355-97-67
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
