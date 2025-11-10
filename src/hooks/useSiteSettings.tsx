import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*");

      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((setting) => {
          settingsMap[setting.key] = setting.value;
        });
        setSettings(settingsMap);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};
