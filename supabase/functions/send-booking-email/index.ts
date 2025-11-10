import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, name, email, phone, roomType, checkIn, checkOut, totalPrice }: BookingEmailRequest = await req.json();

    // Get admin email from site_settings
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settingsData, error: settingsError } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'booking_email')
      .single();

    if (settingsError) {
      console.error('Error fetching booking email:', settingsError);
      throw new Error('Не удалось получить адрес для отправки');
    }

    const adminEmail = settingsData?.value;
    if (!adminEmail) {
      throw new Error('Email для бронирований не настроен');
    }

    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "Вилла Роза <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `Новое бронирование #${bookingId.slice(0, 8)}`,
      html: `
        <h1>Новое бронирование</h1>
        <h2>Детали бронирования:</h2>
        <p><strong>ID бронирования:</strong> ${bookingId}</p>
        <p><strong>Имя гостя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Тип номера:</strong> ${roomType}</p>
        <p><strong>Дата заезда:</strong> ${checkIn}</p>
        <p><strong>Дата выезда:</strong> ${checkOut}</p>
        <p><strong>Общая стоимость:</strong> ${totalPrice} BYN</p>
        <hr>
        <p>Для управления бронированиями войдите в админ-панель.</p>
      `,
    });

    console.log("Booking email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
