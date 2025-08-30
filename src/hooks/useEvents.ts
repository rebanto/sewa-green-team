import type { StorageError } from "@supabase/storage-js";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import type { Event } from "~/types";

type Error = PostgrestError | StorageError;

export default function useEvents() {
  const [events, setEvents] = useState<Event[] | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>();

  useEffect(() => {
    (async () => {
      try {
        // Get all events
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (eventError) {
          setError(eventError);
          return;
        }

        if (!eventData || eventData.length === 0) {
          setEvents([]);
          return;
        }

        // Get all images from storage
        const { data: allImages, error: imageError } = await supabase.storage
          .from("events")
          .list("images", { limit: 1000 });

        if (imageError) {
          setError(imageError);
          return;
        }

        const { data: allWaivers, error: waiverError } = await supabase.storage
          .from("events")
          .list("waivers", { limit: 1000 });

        if (waiverError) {
          setError(waiverError);
          return;
        }

        // Create image map for efficient lookup
        const imageMap = new Map(allImages.map((image) => [image.id, image]));
        const waiverMap = new Map(
          allWaivers.map((waiver) => [waiver.id, waiver]),
        );

        // Merge events with their corresponding images
        const eventsWithUrls = eventData.map((event) => {
          const tmp: Event = {
            ...event,
            image: null,
            image_url: null,
            waiver_url: null,
          };

          if (event.image_id && imageMap.has(event.image_id)) {
            const image = imageMap.get(event.image_id) || null;
            const {
              data: { publicUrl: image_url },
            } = supabase.storage.from("events/images").getPublicUrl(
              image!.name,
            );
            if (image_url) tmp.image_url = image_url;
          }

          if (event.waiver_id && imageMap.has(event.waiver_id)) {
            const waiver = waiverMap.get(event.waiver_id) || null;
            const {
              data: { publicUrl: image_url },
            } = supabase.storage.from("events/images").getPublicUrl(
              waiver!.name,
            );
            if (image_url) tmp.image_url = image_url;
          }

          return tmp;
        });

        // console.log("Events with images:", eventsWithImages);
        setEvents(eventsWithUrls || []);
      } catch (error) {
        console.error("Error fetching events with images:", error);
        setEvents([]);
      }
    })();

    setLoading(false);
  }, []);

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    setEvents((prev) => prev?.filter((ev) => ev.id !== id));
    return { error };
  };

  if (loading) {
    return {
      loading: true,
      error: false,
      events: null,
    };
  } else if (error) {
    return {
      loading: false,
      error: true,
      events: null,
    };
  } else {
    return {
      loading: false,
      error: false,
      events,
      deleteEvent,
    };
  }
}
