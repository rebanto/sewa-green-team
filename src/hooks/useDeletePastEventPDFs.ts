import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Deletes PDFs for past events from the specified Supabase storage bucket.
 * @param bucketName The name of the storage bucket containing event PDFs.
 * @param getPastEvents A function that returns a Promise of an array of event objects with a unique identifier and event date.
 * @param getPDFPath A function that takes an event and returns the storage path(s) of its PDF(s).
 * @returns A function to trigger the deletion process.
 */
export function useDeletePastEventPDFs<T extends { id: string; date: string }>(
  bucketName: string,
  getPastEvents: () => Promise<T[]>,
  getPDFPath: (event: T) => string | string[]
) {
  return useCallback(async () => {
    const now = new Date();
    const pastEvents = (await getPastEvents()).filter(event => new Date(event.date) < now);
    for (const event of pastEvents) {
      const pdfPaths = getPDFPath(event);
      const paths = Array.isArray(pdfPaths) ? pdfPaths : [pdfPaths];
      for (const path of paths) {
        if (!path) continue;
        await supabase.storage.from(bucketName).remove([path]);
      }
    }
  }, [bucketName, getPastEvents, getPDFPath]);
}
