import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/SupabaseClient";
import { useMarkdownContext } from "../Context/context";
import FullPageLoader from "../Components/layout/FullPageLoader";
import { fetchUser } from "../utils/fetchUser";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userId, setUserId } = useMarkdownContext();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const result =  await fetchUser();
        const user = result?.data.user
        const error = result?.error

        if (!result) return
        if (error || !user) {
          setUserId(null);
          return;
        }

        setUserId(user.id);

        if (!window.location.pathname.startsWith("/room/")) {
          const { data: roomData } = await supabase
            .from("room_users")
            .select("room_id")
            .eq("user_id", user.id)
            .eq("status", "joined")
            .maybeSingle();

          if (roomData?.room_id) {
            setRedirecting(true);
            navigate(`/room/${roomData.room_id}`);
          }
        }
      } catch (err) {
        console.error("Error checking protected route:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRedirect();
  }, []);

  if (loading || redirecting) return <FullPageLoader />;

  if (!userId) {
    navigate("/login");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
