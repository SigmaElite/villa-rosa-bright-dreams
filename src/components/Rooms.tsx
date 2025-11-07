import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Wifi, Tv, Coffee, Wind, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  amenities: string[];
  is_active: boolean;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      toast.error("Ошибка загрузки номеров");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка номеров...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Номера пока не добавлены</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {rooms.map((room, index) => (
              <Card 
                key={room.id} 
                className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up border-border"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative h-64 overflow-hidden group/carousel">
                  <Carousel className="w-full h-full" opts={{ loop: true }}>
                    <CarouselContent className="h-64">
                      {room.images.map((image, imgIndex) => (
                        <CarouselItem key={imgIndex} className="h-64">
                          <img 
                            src={image || "/placeholder.svg"} 
                            alt={`${room.title} - фото ${imgIndex + 1}`}
                            className="w-full h-64 object-cover cursor-pointer"
                            onClick={() => setSelectedRoom(room)}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {room.images.length > 1 && (
                      <>
                        <CarouselPrevious 
                          className="left-2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity" 
                          onClick={(e) => e.stopPropagation()} 
                        />
                        <CarouselNext 
                          className="right-2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity" 
                          onClick={(e) => e.stopPropagation()} 
                        />
                      </>
                    )}
                  </Carousel>
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold pointer-events-none z-10">
                    от {room.price} BYN/сутки
                  </div>
                  {room.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1 pointer-events-none z-10">
                      <ImageIcon className="w-4 h-4" />
                      {room.images.length}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-card-foreground">{room.title}</CardTitle>
                  <CardDescription className="text-base line-clamp-2">{room.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {room.amenities.slice(0, 4).map((amenity, i) => {
                      const Icon = amenityIcons[amenity];
                      return (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToBooking();
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
                  >
                    Забронировать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif">{selectedRoom?.title}</DialogTitle>
            </DialogHeader>
            {selectedRoom && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRoom.images.map((image, i) => (
                    <img 
                      key={i}
                      src={image} 
                      alt={`${selectedRoom.title} - фото ${i + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Описание</h3>
                  <p className="text-muted-foreground">{selectedRoom.description}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Удобства</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedRoom.amenities.map((amenity, i) => {
                      const Icon = amenityIcons[amenity];
                      return (
                        <div key={i} className="flex items-center gap-2">
                          {Icon && <Icon className="w-5 h-5 text-primary" />}
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Цена за ночь</p>
                    <p className="text-3xl font-bold text-primary">{selectedRoom.price} BYN</p>
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => {
                      setSelectedRoom(null);
                      scrollToBooking();
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Забронировать
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Rooms;
