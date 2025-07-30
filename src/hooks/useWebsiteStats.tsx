import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";

export const useWebsiteStats = () => {
  const [stats, setStats] = useState({ volunteers: 0, trash: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { data } = await supabase.from("website_details").select("*").single();
      if (data) setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return { stats, loading };
};
