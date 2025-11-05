-- Изменяем image_url на массив изображений
ALTER TABLE public.rooms 
  DROP COLUMN image_url,
  ADD COLUMN images text[] NOT NULL DEFAULT '{}';

-- Добавляем комментарий для ясности
COMMENT ON COLUMN public.rooms.images IS 'Массив URL изображений номера';