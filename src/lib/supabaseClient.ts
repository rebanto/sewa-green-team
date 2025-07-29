import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase.types";

const supabaseUrl = "https://mkrvorkertmhgtsnougw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnZvcmtlcnRtaGd0c25vdWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Mjg1NDUsImV4cCI6MjA2NjAwNDU0NX0.apzPaLSKxlaxBqIh1z2zZRkr0TX-Ig3J6Ins7u7dlmc";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
