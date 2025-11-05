import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const roomSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(100),
  description: z.string().min(10, "Описание должно быть минимум 10 символов").max(500),
  price: z.number().min(0, "Цена должна быть положительной"),
  amenities: z.string().min(1, "Укажите хотя бы одно удобство"),
});

interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  amenities: string[];
  is_active: boolean;
  display_order: number;
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    amenities: "",
    is_active: true,
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Ошибка загрузки номеров");
      return;
    }

    setRooms(data || []);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("room-images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast.success("Изображение загружено");
    } catch (error) {
      toast.error("Ошибка загрузки изображения");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = roomSchema.safeParse({
      title: formData.title,
      description: formData.description,
      price: formData.price,
      amenities: formData.amenities,
    });

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    const amenitiesArray = formData.amenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);

    try {
      if (editingRoom) {
        const { error } = await supabase
          .from("rooms")
          .update({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            amenities: amenitiesArray,
            is_active: formData.is_active,
            image_url: formData.image_url || editingRoom.image_url,
          })
          .eq("id", editingRoom.id);

        if (error) throw error;
        toast.success("Номер обновлен");
      } else {
        const { error } = await supabase.from("rooms").insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          amenities: amenitiesArray,
          is_active: formData.is_active,
          image_url: formData.image_url || "/placeholder.svg",
          display_order: rooms.length + 1,
        });

        if (error) throw error;
        toast.success("Номер добавлен");
      }

      setIsDialogOpen(false);
      setEditingRoom(null);
      setFormData({
        title: "",
        description: "",
        price: 0,
        amenities: "",
        is_active: true,
        image_url: "",
      });
      fetchRooms();
    } catch (error) {
      toast.error("Ошибка сохранения номера");
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      title: room.title,
      description: room.description,
      price: room.price,
      amenities: room.amenities.join(", "),
      is_active: room.is_active,
      image_url: room.image_url,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот номер?")) return;

    const { error } = await supabase.from("rooms").delete().eq("id", id);

    if (error) {
      toast.error("Ошибка удаления номера");
      return;
    }

    toast.success("Номер удален");
    fetchRooms();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Управление номерами</h2>
            <p className="text-muted-foreground">Добавляйте и редактируйте номера отеля</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingRoom(null);
                setFormData({
                  title: "",
                  description: "",
                  price: 0,
                  amenities: "",
                  is_active: true,
                  image_url: "",
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить номер
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRoom ? "Редактировать номер" : "Добавить новый номер"}
                </DialogTitle>
                <DialogDescription>
                  Заполните информацию о номере
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Стандартный номер"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Уютный номер с видом на море..."
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Цена (BYN за ночь)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amenities">Удобства (через запятую)</Label>
                  <Input
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="Wi-Fi, Кондиционер, Балкон"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Изображение</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={uploading}
                    />
                    {uploading && <span className="text-sm">Загрузка...</span>}
                  </div>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Активен (показывать на сайте)</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingRoom ? "Сохранить" : "Добавить"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <img src={room.image_url} alt={room.title} className="w-full h-48 object-cover rounded-md mb-4" />
                <CardTitle>{room.title}</CardTitle>
                <CardDescription>{room.price} BYN / ночь</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${room.is_active ? "text-green-600" : "text-gray-500"}`}>
                    {room.is_active ? "Активен" : "Неактивен"}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(room)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(room.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RoomsPage;
