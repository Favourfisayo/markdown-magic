import { useState } from "react";
import { supabase } from "../lib/SupabaseClient";
import { useMarkdownContext } from "../Context/context";
import { useNavigate } from "react-router";
import saveMarkdown from "../utils/saveMarkdown";
import { toast } from "react-hot-toast";
import { handleError } from "../utils/handleError";
import { useDebouncedCallback } from "use-debounce";

const useRoomActions = () => {
  const [createRoomLoading, setCreateRoomLoading] = useState(false);
  const [joinRoomLoading, setJoinRoomLoading] = useState(false); 
  const [usersInRoomLoading, setUsersInRoomLoading] = useState(false)
  const [closeRoomLoading, setCloseRoomLoading] = useState(false);
  const [reopenRoomLoading, setReopenRoomLoading] = useState(false);
  const [leavingRoomLoading, setLeavingRoomLoading] = useState(false)

  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState<string>(""); 
  const [showModal, setShowModal] = useState(false); 
  const saveToLocalStorage = saveMarkdown();

  const navigate = useNavigate();
  const { markdown, channelRef, setMarkdown, isOpen, setIsOpen, userId } = useMarkdownContext();

  const fetchRoomContent  = async (roomId: string | undefined) => {
        const {data, error} = await supabase
        .from("collab_docs")
        .select("*")
        .eq("room_id", roomId)
        .single()

        if(error) {
            console.log("Error fetching markdown: ", error)
            return
        }

        if(data) {
            setMarkdown(data?.content)
        }
    
    }
    const updateRoomContent = useDebouncedCallback(async (newMarkdown: string, roomId: string | undefined) => {
        if(!roomId) return
        const { error } = await supabase
          .from("collab_docs")
          .update({ content: newMarkdown })
          .eq("room_id", roomId);
  
        if (error) console.error("Failed to update:", error);
    }, 800)
  
  const createRoom = async (roomId: string | undefined) => {
    setCreateRoomLoading(true);
    try {
      let roomIdToUse = roomId
      if (!roomId) {
        roomIdToUse = crypto.randomUUID();
      }

      const { error: roomError } = await supabase.from("rooms").insert([
        { id: roomIdToUse, created_by: userId }
      ]);
      if (roomError) handleError(roomError, "Error creating room");

      // 2. Join the Room
      const { error: joinError } = await supabase.from("room_users").insert([
        { room_id: roomIdToUse, user_id: userId }
      ]);
      if (joinError) handleError(joinError, "Error joining room");

      // 3. Create Collab Doc
      const { error: docError } = await supabase.from("collab_docs").insert([
        { room_id: roomIdToUse, content: markdown }
      ]);
      if (docError) handleError(docError, "Error creating collaborative document");

      toast.success("Room created!");
      navigate(`/room/${roomIdToUse}`);

    } catch (err) {
      handleError(err, "Unexpected error during room creation");
    } finally {
      setCreateRoomLoading(false);
    }
  };

const joinRoom = async (roomId: string | undefined, skipUnsavedCheck = false) => {
  const trimmedRoomId = roomId?.trim();
    // Check if input is empty
    if (!trimmedRoomId) {
      handleError(new Error("RoomId cannot be empty!"), "Join Room Error");
      return;
    }
    // If there's unsaved markdown, show modal first
    if (!skipUnsavedCheck && markdown.length > 0) {
      setPendingRoomId(trimmedRoomId);
      setIsOpen(false)
      setShowModal(true);
      return;
    }
    setJoinRoomLoading(true);
  try {
    if (!userId) {
      handleError(new Error("User not authenticated"), "Error fetching user");
      return;
    }
    //Check from DB if user is already in a room
    const { data: existingRoom } = await supabase
      .from("room_users")
      .select("room_id")
      .eq("user_id", userId)
      .eq("status", "joined")
      .maybeSingle();

    if (existingRoom) {
      handleError(new Error("You are already in a room!"), "Join Room Error");
      return;
    }

    // Check if the room exists
    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", trimmedRoomId)
      .maybeSingle();

    if (roomError || !roomData) {
      handleError(new Error("Room not found"), "Join Room Error");
      return;
    }

    if (roomData.is_closed) {
      handleError(new Error("Room is closed"), "Join Room Error");
      return;
    }

    // Check if user already exists in room
    const { data: existingUser, error: checkError } = await supabase
      .from("room_users")
      .select("*")
      .eq("room_id", trimmedRoomId)
      .eq("user_id", userId)
      .single();

    if (existingUser) {
      // Update status to 'joined'
      const { error: updateError } = await supabase
        .from("room_users")
        .update({ status: "joined", joined_at: new Date() })
        .eq("room_id", trimmedRoomId)
        .eq("user_id", userId);

      if (updateError) {
        handleError(updateError, "Error updating user status");
        return;
      }
    } else if (checkError?.code === "PGRST116") {
      // Insert new room_user entry
      const { error: insertError } = await supabase
        .from("room_users")
        .insert([
          {
            room_id: trimmedRoomId,
            user_id: userId,
            status: "joined",
          },
        ]);

      if (insertError) {
        handleError(insertError, "Error inserting user into room");
        return;
      }
    } else if (checkError) {
      handleError(checkError, "Error checking user status");
      return;
    }

    // Navigate to the room and reset UI
    toast.success("Joined room successfully!");
    navigate(`/room/${trimmedRoomId}`);
    setJoinRoomId("");
    setIsOpen(false);

  } catch (err) {
    handleError(err, "An Unexpected error occured while joining room");
  } finally {
    setJoinRoomLoading(false);
  }
};

const handleModalChoice = async (choice: "Append" | "Discard" | "Cancel") => {
  setIsOpen(false)
  setShowModal(false);
  if (choice === "Cancel") return;
  if (!pendingRoomId) return;
  
  if (choice === "Discard") {
    setMarkdown("");
    await joinRoom(pendingRoomId, true);
  }

  if (choice === "Append") {
    try {
      const { data, error } = await supabase
        .from("collab_docs")
        .select("content")
        .eq("room_id", pendingRoomId)
        .single();

      if (error) {
        handleError(error, "Error fetching room content");
        return;
      }

      if (data) {
        const newContent = markdown + "\n" + data.content;

        const { error: updateError } = await supabase
          .from("collab_docs")
          .update({ content: newContent })
          .eq("room_id", pendingRoomId);

        if (!updateError) {
          setMarkdown(newContent);
          toast.success("Content appended successfully.");
          await joinRoom(pendingRoomId, true);
        } else {
          handleError(updateError, "Error updating room content");
        }
      }
    } catch (err) {
      handleError(err, "An Unexpected Error occurred updating room content");
    }
  }
  setJoinRoomId("");
  setPendingRoomId(null);
  setIsOpen(false);
};


  const leaveRoom = async (roomId: string | undefined) => {
    setLeavingRoomLoading(true)
    try {
    const {error} = await supabase
    .from("room_users")
    .update({status: "left"})
    .eq("room_id", roomId)
    .eq("user_id", userId)

    if(error) {
      handleError(error, "Error leaving room")
      return
    }

    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    navigate("/");
    saveToLocalStorage(null, markdown);
    toast.success("You have left the room!");
  }catch(error){
    handleError(error, "An unexpected error occurred while leaving room")
  } finally {
    setLeavingRoomLoading(false)
  }
  };


 const viewUsersInRoom = async (roomId: string | undefined) => {
  setUsersInRoomLoading(true)
  try {
  if (!roomId) return;

  //Get users in the room first of all
  const { data: roomUsers, error: roomError } = await supabase
    .from("room_users")
    .select("user_id, joined_at, status")
    .eq("status", "joined")
    .eq("room_id", roomId);

  if (roomError) {
    handleError(roomError, "Error fetching room users");
    return;
  }

  if (!roomUsers || roomUsers.length === 0) return [];

  // Get user profile (email) from profiles table
  const userIds = roomUsers.map((user) => user.user_id);

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, email")
    .in("id", userIds);

  if (profileError) {
    handleError(profileError, "Error fetching user profile from DB");
    return;
  }

  // Step 3: Merge data cleanly
  const combined = roomUsers.map((roomUser) => {
    const profile = profiles.find((u) => u.id === roomUser.user_id);

    return {
      user_id: roomUser.user_id,
      email: profile?.email ?? "Unknown",
      joined_at: roomUser.joined_at,
      status: roomUser.status,
    };
  });

  return combined;
}catch(error) {
  handleError(error, "An unexpected error occurred while fetching users in roo ")
} finally {
  setUsersInRoomLoading(false)
}
};


  const closeRoom = async (roomId: string | undefined) => {
    setCloseRoomLoading(true)
      if (!roomId) return;
      try {
      const { error } = await supabase
        .from("rooms")
        .update({ is_closed: true, created_at: new Date() })
        .eq("id", roomId);

      if (error) {
        handleError(error, "Failed to close room");
        return;
      }

      const { error: usersError } = await supabase
      .from("room_users")
      .update({ status: "left" })
      .eq("room_id", roomId)
      .eq("status", "joined")

      if (usersError) {
        handleError(error, "Room closed, but failed to update room users status.");
        return;
  }

      toast.success("Room closed successfully");
      navigate("/");
}catch(error) {
  handleError(error, "An unexpected error occurred while closing room")
}
  }

  const reopenRoom = async (roomId: string | undefined) => {
    setReopenRoomLoading(true);
    try{
    const {data: roomData, error: roomError} = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .maybeSingle();

    if(roomError) {
      handleError(roomError, "Error fetching room");
      return;
    }

    if(roomData && roomData.is_closed) {
      if(roomData.created_by === userId) {
        const {error: reopenError} = await supabase
        .from("rooms")
        .update({ is_closed: false})
        .eq("id", roomId)

        if(reopenError) {
          handleError(reopenError, "Failed to reopen room");
          return;
        }

          const { data: existingUser, error: userCheckError } = await supabase
          .from("room_users")
          .select("*")
          .eq("room_id", roomId)
          .eq("user_id", userId)
          .maybeSingle();

        if (userCheckError) {
          handleError(userCheckError, "Failed to check room users membership");
          return;
        }

        if (existingUser) {
          await supabase
            .from("room_users")
            .update({ status: "joined" })
            .eq("room_id", roomId)
            .eq("user_id", userId);
        } else {
          await supabase
            .from("room_users")
            .insert([{ room_id: roomId, user_id: userId, status: "joined" }]);
        }

        toast.success("Room reopened successfully")
        navigate(`/room/${roomId}`)
      }
    }
  }catch(error) {
    handleError(error, "An unexpected error occurred while reopening room")
  } finally{
    setReopenRoomLoading(false)
  }
  }

  return {
    createRoomLoading,
    joinRoomLoading, 
    usersInRoomLoading,
    leavingRoomLoading,
    closeRoomLoading,
    reopenRoomLoading,
    joinRoomId,
    showModal,
    isOpen,
    setJoinRoomId,
    setIsOpen,
    createRoom,
    joinRoom,
    leaveRoom,
    handleModalChoice,
    viewUsersInRoom,
    closeRoom,
    reopenRoom,
    fetchRoomContent,
    updateRoomContent
  };
};

export default useRoomActions;
