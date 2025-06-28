import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const FeaturedEvent = () => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestEvent = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("events")
        .select("id,title,description,date")
        .order("date", { ascending: false })
        .limit(1)
        .single();
      if (error) {
        setError("Failed to load event.");
      } else {
        setEvent(data);
      }
      setLoading(false);
    };
    fetchLatestEvent();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto text-center">
        Loading featured event...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-green-700 mb-2">{event.title}</h3>
      <p className="text-gray-700 mb-2">{event.description}</p>
      <p className="text-sm text-gray-500">
        {event.date
          ? new Date(event.date).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
          : null}
      </p>
    </div>
  );
};

export default FeaturedEvent;
