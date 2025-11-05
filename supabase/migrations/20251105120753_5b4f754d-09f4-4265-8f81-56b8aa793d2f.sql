-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create rooms table for managing hotel rooms
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create site_settings table for general site content
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms (anyone can view, only admins can modify)
CREATE POLICY "Anyone can view active rooms"
ON public.rooms FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert rooms"
ON public.rooms FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update rooms"
ON public.rooms FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rooms"
ON public.rooms FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for site_settings (anyone can view, only admins can modify)
CREATE POLICY "Anyone can view site settings"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can insert site settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings"
ON public.site_settings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (only admins can manage)
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default room data
INSERT INTO public.rooms (title, description, price, image_url, amenities, display_order) VALUES
('Стандартный номер', 'Уютный номер с видом на сад, оборудованный всем необходимым для комфортного проживания.', 100, '/placeholder.svg', ARRAY['Wi-Fi', 'Кондиционер', 'Ванная комната', 'Холодильник'], 1),
('Номер Делюкс', 'Просторный номер с панорамным видом на море, современным дизайном и дополнительными удобствами.', 150, '/placeholder.svg', ARRAY['Wi-Fi', 'Кондиционер', 'Ванная комната', 'Холодильник', 'Балкон', 'Мини-бар'], 2);

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('site_title', 'Вилла Роза', 'Название сайта'),
('site_subtitle', 'Отдых на берегу моря', 'Подзаголовок сайта'),
('hero_title', 'Добро пожаловать в Виллу Роза', 'Заголовок на главной странице'),
('hero_description', 'Насладитесь незабываемым отдыхом в нашем уютном отеле на берегу моря', 'Описание на главной странице'),
('about_title', 'О нас', 'Заголовок секции "О нас"'),
('about_description', 'Вилла Роза - это идеальное место для отдыха и релаксации. Мы предлагаем комфортабельные номера, отличный сервис и незабываемые виды на море.', 'Описание в секции "О нас"'),
('contact_phone', '+375 29 123-45-67', 'Контактный телефон'),
('contact_email', 'info@villaroza.by', 'Контактный email'),
('contact_address', 'Беларусь, г. Минск', 'Адрес'),
('whatsapp_phone', '375291234567', 'Номер WhatsApp (без +)');

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();