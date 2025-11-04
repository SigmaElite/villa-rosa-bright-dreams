import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Tv, Coffee, Wind } from "lucide-react";
import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";

const Rooms = () => {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const rooms = [
    {
      title: "Стандарт",
      price: "80 BYN",
      image: roomStandard,
      description: "Уютный номер с классическим интерьером, идеален для одного или двух гостей",
      amenities: ["Wi-Fi", "ТВ", "Кондиционер", "Мини-бар"]
    },
    {
      title: "Делюкс",
      price: "120 BYN",
      image: roomDeluxe,
      description: "Просторный номер повышенной комфортности с зоной отдыха",
      amenities: ["Wi-Fi", "ТВ", "Кондиционер", "Кофемашина"]
    }
  ];

  const amenityIcons: { [key: string]: any } = {
    "Wi-Fi": Wifi,
    "ТВ": Tv,
    "Кофемашина": Coffee,
    "Кондиционер": Wind,
    "Мини-бар": Coffee
  };

  return (
    <section id="rooms" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Наши номера
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите идеальный номер для вашего комфортного проживания
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {rooms.map((room, index) => (
            <Card 
              key={index} 
              className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up border-border"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold">
                  от {room.price}/сутки
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-card-foreground">{room.title}</CardTitle>
                <CardDescription className="text-base">{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  {room.amenities.map((amenity, i) => {
                    const Icon = amenityIcons[amenity];
                    return (
                      <div key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
                <Button 
                  onClick={scrollToBooking}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
                >
                  Забронировать
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
