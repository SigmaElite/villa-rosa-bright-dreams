import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  room_type: string;
  total_price: number;
  payment_status: string;
  created_at: string;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Ошибка загрузки бронирований");
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Загрузка...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Бронирования</h2>
          <p className="text-muted-foreground">Все бронирования отеля</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список бронирований</CardTitle>
            <CardDescription>
              Всего бронирований: {bookings.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Даты</TableHead>
                    <TableHead>Номер</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Создано</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{booking.email}</div>
                          <div className="text-muted-foreground">{booking.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(booking.check_in), "dd MMM yyyy", { locale: ru })}</div>
                          <div className="text-muted-foreground">
                            {format(new Date(booking.check_out), "dd MMM yyyy", { locale: ru })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.room_type}</TableCell>
                      <TableCell className="font-medium">{booking.total_price} BYN</TableCell>
                      <TableCell>
                        <Badge
                          variant={booking.payment_status === "completed" ? "default" : "secondary"}
                        >
                          {booking.payment_status === "completed" ? "Оплачено" : "Ожидает оплаты"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(booking.created_at), "dd MMM yyyy HH:mm", { locale: ru })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BookingsPage;
