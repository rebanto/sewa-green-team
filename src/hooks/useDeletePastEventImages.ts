import { supabase } from "~/lib/supabaseClient";
import type { Event } from "~/types";

/**
 * Hook to delete images for past events from the Supabase 'events' bucket.
 * @param bucketName The Supabase storage bucket name (should be 'events')
 * @param getPastEvents Function that returns an array of past event objects
 * @param getImagePath Function that takes an event and returns the image path relative to the bucket
 */
export function useDeletePastEventImages(
  bucketName: string,
  getPastEvents: () => Event[],
  getImagePath: (event: Event) => string | null
) {
  return async function deletePastEventImages() {
    const pastEvents = getPastEvents();
    for (const event of pastEvents) {
      const imagePath = getImagePath(event);
      if (!imagePath) continue;
      const { error } = await supabase.storage.from(bucketName).remove([imagePath]);
      if (error) {
        console.error(`Failed to delete image for event ${event.id}:`, error.message);
      }
    }
  };
}