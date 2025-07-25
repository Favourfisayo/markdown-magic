import { supabase } from "../lib/SupabaseClient"
import { useMarkdownContext } from "../Context/context"
import { toast } from "react-hot-toast"
const useRealtimeListener = () => {
     const {channelRef, setMarkdown} = useMarkdownContext()

  const listenToRoomUsersChange = (
    roomId: string,
    onUsersUpdate: () => void
  ) => {
    const channel = supabase
      .channel(`room-users-list-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          onUsersUpdate();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

    const listenToCollabDocs = (roomId: string | undefined) => {
       channelRef.current = supabase
        .channel(`room-${roomId}`)
        .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "collab_docs",
              filter: `room_id=eq.${roomId}`,
            },
            (payload) => {
                const newMarkdown = payload.new.content
                setMarkdown(newMarkdown)
            }
        ).subscribe()

        return (() => {
            if(channelRef.current) {
            supabase.removeChannel(channelRef.current)
            }
        })
    }


  const listenToRoomUserStatus = (roomId: string | undefined, userId: string | null) => {
    if (!roomId || !userId) return;

    const currentUserId = userId;

    const channel = supabase
      .channel(`room-users-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const status = payload.new.status;
          const changedUserId = payload.new.user_id;

          if (changedUserId === currentUserId) return;

          if (status !== "joined" && status !== "left") return;

          const { data, error } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", changedUserId)
            .maybeSingle();

          if (error) {
            console.error("Error fetching user email:", error.message);
            return;
          }

          const email = data?.email ?? "Unknown user";
          const action = status === "joined" ? "joined" : "left";

          toast.success(`${email} ${action} the room`);
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  };

  const listenToRoomClosure = async (roomId: string | undefined, currentUserId: string | null,  navigate: (path: string) => void) => {
  if (!roomId || !currentUserId) return;
  
    const { data: room, error } = await supabase
    .from("rooms")
    .select("created_by")
    .eq("id", roomId)
    .single();

  if (error || !room) {
    console.error("Failed to fetch room creator.");
    return;
  }

  const creatorId = room.created_by;

  const channel = supabase
    .channel(`room-closure-${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        const isClosed = payload.new?.is_closed;
        if (isClosed  && currentUserId !== creatorId) {
          toast.error("Room was closed.");
          navigate("/");
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};



    return {
        listenToCollabDocs,
        listenToRoomClosure,
        listenToRoomUserStatus,
        listenToRoomUsersChange,
    }

}

export default useRealtimeListener