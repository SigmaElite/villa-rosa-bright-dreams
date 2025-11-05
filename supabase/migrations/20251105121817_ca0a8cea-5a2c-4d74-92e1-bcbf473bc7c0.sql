-- Create storage bucket for room images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Storage policies for room images
CREATE POLICY "Anyone can view room images"
ON storage.objects FOR SELECT
USING (bucket_id = 'room-images');

CREATE POLICY "Admins can upload room images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'room-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update room images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'room-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete room images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'room-images' AND
  public.has_role(auth.uid(), 'admin')
);