import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";

interface Setting {
  key: string;
  value: string;
  description: string | null;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (error) {
      toast.error("Ошибка загрузки настроек");
      setLoading(false);
      return;
    }

    const settingsMap: Record<string, string> = {};
    data?.forEach((setting: Setting) => {
      settingsMap[setting.key] = setting.value;
    });
    setSettings(settingsMap);
    setLoading(false);
  };

  const handleSave = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value })
      .eq("key", key);

    if (error) {
      toast.error("Ошибка сохранения");
      return;
    }

    toast.success("Настройка сохранена");
  };

  const updateSetting = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
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
          <h2 className="text-3xl font-bold tracking-tight">Настройки сайта</h2>
          <p className="text-muted-foreground">Управляйте текстами и контактами на сайте</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>Название сайта и основные тексты</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Название сайта</Label>
                <Input
                  id="site_title"
                  value={settings.site_title || ""}
                  onChange={(e) => updateSetting("site_title", e.target.value)}
                  onBlur={(e) => handleSave("site_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_subtitle">Подзаголовок</Label>
                <Input
                  id="site_subtitle"
                  value={settings.site_subtitle || ""}
                  onChange={(e) => updateSetting("site_subtitle", e.target.value)}
                  onBlur={(e) => handleSave("site_subtitle", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Главная страница</CardTitle>
              <CardDescription>Тексты на главной странице</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Заголовок Hero</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title || ""}
                  onChange={(e) => updateSetting("hero_title", e.target.value)}
                  onBlur={(e) => handleSave("hero_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_description">Описание Hero</Label>
                <Textarea
                  id="hero_description"
                  value={settings.hero_description || ""}
                  onChange={(e) => updateSetting("hero_description", e.target.value)}
                  onBlur={(e) => handleSave("hero_description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Секция "О нас"</CardTitle>
              <CardDescription>Информация об отеле</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_title">Заголовок</Label>
                <Input
                  id="about_title"
                  value={settings.about_title || ""}
                  onChange={(e) => updateSetting("about_title", e.target.value)}
                  onBlur={(e) => handleSave("about_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_description">Описание</Label>
                <Textarea
                  id="about_description"
                  value={settings.about_description || ""}
                  onChange={(e) => updateSetting("about_description", e.target.value)}
                  onBlur={(e) => handleSave("about_description", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
              <CardDescription>Телефон, email и адрес</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Телефон</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone || ""}
                  onChange={(e) => updateSetting("contact_phone", e.target.value)}
                  onBlur={(e) => handleSave("contact_phone", e.target.value)}
                  placeholder="+375 29 123-45-67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email || ""}
                  onChange={(e) => updateSetting("contact_email", e.target.value)}
                  onBlur={(e) => handleSave("contact_email", e.target.value)}
                  placeholder="info@villaroza.by"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_address">Адрес</Label>
                <Input
                  id="contact_address"
                  value={settings.contact_address || ""}
                  onChange={(e) => updateSetting("contact_address", e.target.value)}
                  onBlur={(e) => handleSave("contact_address", e.target.value)}
                  placeholder="Беларусь, г. Минск"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_phone">Номер WhatsApp (без +)</Label>
                <Input
                  id="whatsapp_phone"
                  value={settings.whatsapp_phone || ""}
                  onChange={(e) => updateSetting("whatsapp_phone", e.target.value)}
                  onBlur={(e) => handleSave("whatsapp_phone", e.target.value)}
                  placeholder="375291234567"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
