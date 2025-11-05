import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Calendar, Settings, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeRooms: 0,
    totalBookings: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch rooms stats
      const { count: totalRooms } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true });

      const { count: activeRooms } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Fetch bookings stats
      const { count: totalBookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

      const { count: pendingPayments } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "pending");

      setStats({
        totalRooms: totalRooms || 0,
        activeRooms: activeRooms || 0,
        totalBookings: totalBookings || 0,
        pendingPayments: pendingPayments || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
          <p className="text-muted-foreground">
            Добро пожаловать в административную панель Вилла Роза
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего номеров</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRooms}</div>
              <p className="text-xs text-muted-foreground">
                Активных: {stats.activeRooms}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего бронирований</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                За все время
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ожидают оплаты</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Требуют внимания
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Настройки</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Активно</div>
              <p className="text-xs text-muted-foreground">
                Система работает нормально
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Быстрый старт</CardTitle>
            <CardDescription>
              Основные функции административной панели
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">📋 Управление номерами</h3>
              <p className="text-sm text-muted-foreground">
                Добавляйте, редактируйте и удаляйте информацию о номерах отеля
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">📅 Просмотр бронирований</h3>
              <p className="text-sm text-muted-foreground">
                Отслеживайте все бронирования и их статусы оплаты
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">⚙️ Настройки сайта</h3>
              <p className="text-sm text-muted-foreground">
                Изменяйте тексты, контакты и другие параметры сайта
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
