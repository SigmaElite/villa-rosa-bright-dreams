import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

// Validation schema
const bookingSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное")
    .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, "Имя содержит недопустимые символы"),
  
  phone: z.string()
    .trim()
    .regex(/^\+375\s?\(?\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/, "Формат: +375 (XX) XXX-XX-XX")
    .max(20, "Телефон слишком длинный"),
  
  email: z.string()
    .trim()
    .email("Неверный формат email")
    .max(255, "Email слишком длинный"),
  
  roomType: z.string().min(1, "Выберите тип номера"),
});

type Room = {
  id: string;
  title: string;
  price: number;
};

const BookingForm = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [roomType, setRoomType] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingId, setBookingId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('id, title, price')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setRooms(data || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error("Ошибка загрузки номеров");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Необходимо войти в систему для бронирования");
      navigate("/auth");
      return;
    }

    // Validate dates
    if (!checkIn || !checkOut) {
      toast.error("Пожалуйста, выберите даты заезда и выезда");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      toast.error("Дата заезда не может быть в прошлом");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Дата выезда должна быть позже даты заезда");
      return;
    }

    // Validate form data with zod
    const result = bookingSchema.safeParse({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      roomType: roomType,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Пожалуйста, проверьте введенные данные");
      return;
    }

    // Calculate nights and total price
    const nights = differenceInDays(checkOut, checkIn);
    const selectedRoom = rooms.find(r => r.id === roomType);
    if (!selectedRoom) {
      toast.error("Выбранный номер не найден");
      return;
    }
    const total = nights * selectedRoom.price;
    setTotalPrice(total);

    // Save booking to database
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          name: result.data.name,
          phone: result.data.phone,
          email: result.data.email,
          room_type: roomType,
          check_in: format(checkIn, 'yyyy-MM-dd'),
          check_out: format(checkOut, 'yyyy-MM-dd'),
          total_price: total,
          payment_status: 'pending',
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setBookingId(data.id);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error("Ошибка при создании бронирования");
    }
  };

  const handlePayment = async () => {
    // Mock payment - in real implementation this would integrate with YooKassa
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'completed' })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success("Оплата успешно завершена! Мы отправим подтверждение на ваш email.");
      setShowPayment(false);
      
      // Reset form
      setCheckIn(undefined);
      setCheckOut(undefined);
      setRoomType("");
      setName("");
      setPhone("");
      setEmail("");
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error("Ошибка при обработке оплаты");
    }
  };

  return (
    <section id="booking" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Бронирование
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">
            Заполните форму, и мы свяжемся с вами для подтверждения
          </p>
        </div>

        <Card className="animate-scale-in border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-card-foreground">Форма бронирования</CardTitle>
            <CardDescription>Введите данные для резервирования номера</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        const newErrors = { ...errors };
                        delete newErrors.name;
                        setErrors(newErrors);
                      }
                    }}
                    placeholder="Иван Иванов"
                    required
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) {
                        const newErrors = { ...errors };
                        delete newErrors.phone;
                        setErrors(newErrors);
                      }
                    }}
                    placeholder="+375 (29) 123-45-67"
                    required
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      const newErrors = { ...errors };
                      delete newErrors.email;
                      setErrors(newErrors);
                    }
                  }}
                  placeholder="example@mail.com"
                  required
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Label>Тип номера *</Label>
                <Select 
                  value={roomType} 
                  onValueChange={(value) => {
                    setRoomType(value);
                    if (errors.roomType) {
                      const newErrors = { ...errors };
                      delete newErrors.roomType;
                      setErrors(newErrors);
                    }
                  }} 
                  required
                  disabled={loading}
                >
                  <SelectTrigger className={errors.roomType ? "border-destructive" : ""}>
                    <SelectValue placeholder={loading ? "Загрузка..." : "Выберите тип номера"} />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.title} ({room.price} BYN/сутки)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roomType && <p className="text-sm text-destructive">{errors.roomType}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="space-y-2">
                  <Label>Дата заезда *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP", { locale: ru }) : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Дата выезда *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP", { locale: ru }) : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date <= (checkIn || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: '0.5s' }}
              >
                Забронировать и оплатить
              </Button>
            </form>
          </CardContent>
        </Card>

        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Оплата бронирования</DialogTitle>
              <DialogDescription>
                Подтвердите оплату для завершения бронирования
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Имя: {name}</p>
                <p className="text-sm text-muted-foreground">Email: {email}</p>
                <p className="text-sm text-muted-foreground">Телефон: {phone}</p>
                <p className="text-sm text-muted-foreground">
                  Даты: {checkIn && format(checkIn, "dd.MM.yyyy")} - {checkOut && format(checkOut, "dd.MM.yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Тип номера: {rooms.find(r => r.id === roomType)?.title}
                </p>
              </div>
              <div className="border-t pt-4">
                <p className="text-2xl font-bold text-foreground">Итого: {totalPrice} BYN</p>
              </div>
              <Button 
                onClick={handlePayment}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
              >
                Оплатить (Фиктивная оплата)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default BookingForm;
