import { useState } from "react";
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

const BookingForm = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [roomType, setRoomType] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingId, setBookingId] = useState("");

  const roomPrices = {
    standard: 80,
    deluxe: 120,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut || !roomType || !name || !phone || !email) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    // Calculate nights and total price
    const nights = differenceInDays(checkOut, checkIn);
    const pricePerNight = roomPrices[roomType as keyof typeof roomPrices];
    const total = nights * pricePerNight;
    setTotalPrice(total);

    // Save booking to database
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          name,
          phone,
          email,
          room_type: roomType,
          check_in: format(checkIn, 'yyyy-MM-dd'),
          check_out: format(checkOut, 'yyyy-MM-dd'),
          total_price: total,
          payment_status: 'pending'
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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Иванов"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+375 (__) ___-__-__"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Тип номера *</Label>
                <Select value={roomType} onValueChange={setRoomType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип номера" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Стандарт (80 BYN/сутки)</SelectItem>
                    <SelectItem value="deluxe">Делюкс (120 BYN/сутки)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg transition-all duration-300 hover:scale-105"
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
                  Тип номера: {roomType === 'standard' ? 'Стандарт' : 'Делюкс'}
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
