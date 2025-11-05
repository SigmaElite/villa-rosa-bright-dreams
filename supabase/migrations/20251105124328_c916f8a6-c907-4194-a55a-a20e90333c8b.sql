-- Add user_id column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);

-- Add database constraints for data validation
ALTER TABLE public.bookings
  ADD CONSTRAINT check_dates CHECK (check_out > check_in),
  ADD CONSTRAINT check_price CHECK (total_price > 0),
  ADD CONSTRAINT check_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  ADD CONSTRAINT check_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT check_phone_length CHECK (char_length(phone) <= 20);

-- Drop old insecure policy
DROP POLICY IF EXISTS "Users can view bookings by email" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create new secure RLS policies
-- Users can view only their own bookings
CREATE POLICY "Users can view own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Authenticated users can create bookings for themselves
CREATE POLICY "Users can create own bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can update any booking
CREATE POLICY "Admins can update any booking"
ON public.bookings FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));