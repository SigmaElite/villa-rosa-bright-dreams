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
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

// Validation schema
const bookingSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s-]+$/, "Name contains invalid characters"),
  
  phone: z.string()
    .trim()
    .regex(/^\+39\s?\d{2,3}\s?\d{3,4}\s?\d{3,4}$/, "Format: +39 XX XXX XXXX")
    .max(20, "Phone number is too long"),
  
  email: z.string()
    .trim()
    .email("Invalid email format")
    .max(255, "Email is too long"),
  
  roomType: z.string().min(1, "Please select a room type"),
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        toast.error("Error loading rooms");
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
      toast.error("Please sign in to make a booking");
      navigate("/auth");
      return;
    }

    // Validate dates
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      toast.error("Check-in date cannot be in the past");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Check-out date must be after check-in date");
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
      toast.error("Please check your input data");
      return;
    }

    // Calculate nights and total price
    const nights = differenceInDays(checkOut, checkIn);
    const selectedRoom = rooms.find(r => r.id === roomType);
    if (!selectedRoom) {
      toast.error("Selected room not found");
      return;
    }
    const total = nights * selectedRoom.price;

    // Save booking to database and send email
    setIsSubmitting(true);
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
          payment_status: 'confirmed',
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
        body: {
          bookingId: data.id,
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          roomType: selectedRoom.title,
          checkIn: format(checkIn, 'dd.MM.yyyy'),
          checkOut: format(checkOut, 'dd.MM.yyyy'),
          totalPrice: total,
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast.warning("Booking created, but failed to send email notification");
      } else {
        toast.success("Booking successfully created! Confirmation sent to your email.");
      }
      
      // Reset form
      setCheckIn(undefined);
      setCheckOut(undefined);
      setRoomType("");
      setName("");
      setPhone("");
      setEmail("");
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error("Error creating booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Booking
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">
            Fill out the form and we'll contact you to confirm
          </p>
        </div>

        <Card className="animate-scale-in border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-card-foreground">Booking Form</CardTitle>
            <CardDescription>Enter your details to reserve a room</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
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
                    placeholder="John Smith"
                    required
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
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
                    placeholder="+39 06 1234 5678"
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
                <Label>Room Type *</Label>
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
                    <SelectValue placeholder={loading ? "Loading..." : "Select room type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.title} (€{room.price}/night)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roomType && <p className="text-sm text-destructive">{errors.roomType}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="space-y-2">
                  <Label>Check-in Date *</Label>
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
                        {checkIn ? format(checkIn, "PPP", { locale: enUS }) : "Select date"}
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
                  <Label>Check-out Date *</Label>
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
                        {checkOut ? format(checkOut, "PPP", { locale: enUS }) : "Select date"}
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
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: '0.5s' }}
              >
                {isSubmitting ? "Submitting..." : "Book Now"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingForm;
