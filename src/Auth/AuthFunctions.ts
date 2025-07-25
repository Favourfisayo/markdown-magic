import { supabase } from "../lib/SupabaseClient";
import toast from "react-hot-toast";
import { handleError } from "../utils/handleError";

const AuthFunctions = () => {
const handleMagicLinkLogin = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email
    });

    if (error) {
      handleError(error, "Error sending magic link");
      return;
    }

    toast.success("Magic link sent! Check your inbox.");
    return data
  } catch (err) {
    handleError(err, "Unexpected error sending magic link");
  }
};

  return {
    handleMagicLinkLogin
  };
};

export default AuthFunctions;