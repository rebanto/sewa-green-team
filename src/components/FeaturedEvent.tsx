import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const FeaturedEvent = () => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      setLoading(true);
      setError(null);
      // 1. Get featured_event_id from website_details
      const { data: websiteDetails } = await supabase
        .from("website_details")
        .select("featured_event_id")
        .single();
      let eventData = null;
      let eventError = null;
      if (websiteDetails?.featured_event_id) {
        // 2. Fetch the event with that ID
        const { data, error } = await supabase
          .from("events")
          .select("id,title,description,date")
          .eq("id", websiteDetails.featured_event_id)
          .single();
        eventData = data;
        eventError = error;
      } else {
        // 3. Fallback: fetch latest event
        const { data, error } = await supabase
          .from("events")
          .select("id,title,description,date")
          .order("date", { ascending: false })
          .limit(1)
          .single();
        eventData = data;
        eventError = error;
      }
      if (eventError) {
        setError("Failed to load event.");
      } else {
        setEvent(eventData);
      }
      setLoading(false);
    };
    fetchFeaturedEvent();
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
