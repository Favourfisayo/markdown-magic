
import { supabase } from "../lib/SupabaseClient";

export const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error.message);
    return;
  }
  return {data, error};
};
