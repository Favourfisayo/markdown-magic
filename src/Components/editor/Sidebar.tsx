import React, { useEffect, useState } from "react";
import Modal from "../layout/Modal";
import useRoomActions from "../../hooks/useRoomActions";
import { BeatLoader } from "react-spinners";
import { supabase } from "../../lib/SupabaseClient";
import { useMarkdownContext } from "../../Context/context";
import { Plus, LogIn } from "lucide-react"
import useRealtimeListener from "../../hooks/useRealtimeListener";
import RoomButtons from "../layout/RoomButtons";
import SidebarRoomMembers from "../layout/SidebarRoomMembers";
import SidebarClosedRooms from "../layout/SidebarClosedRooms";
import SidebarHeader from "../layout/SidebarHeader";

type SidebarProps = {
  roomId?: string | undefined;
};

const Sidebar: React.FC<SidebarProps> = ({ roomId }) => {
  const [showJoinField, setShowJoinField] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState<any[] | undefined>([]);
  const [isCreator, setIsCreator] = useState(false);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const {isOpen, toggleSidebar, userId} = useMarkdownContext() 

  // Room states
  const [closedRooms, setClosedRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const {
  listenToRoomUsersChange,
} = useRealtimeListener();

  const {
    createRoomLoading,
    joinRoomLoading,
    usersInRoomLoading,
    leavingRoomLoading,
    closeRoomLoading,
    reopenRoomLoading,
    joinRoomId,
    showModal,
    setJoinRoomId,
    createRoom,
    joinRoom,
    leaveRoom,
    handleModalChoice,
    viewUsersInRoom,
    closeRoom,
    reopenRoom,
  } = useRoomActions();

  useEffect(() => {
    const fetchClosedRooms = async () => {
      setLoadingRooms(true);
      if (userId) {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("is_closed", true)
          .eq("created_by", userId);
        if (!error) setClosedRooms(data || []);
      } else {
        setClosedRooms([]);
      }
      setLoadingRooms(false);
    };
    fetchClosedRooms();
  }, [userId]);

  useEffect(() => {
    viewUsersInRoom(roomId).then((user) => {
      setUsersInRoom(user);
    });
  }, [roomId]);


  useEffect(() => {
    if (!roomId) return
    const checkIsCreator = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("rooms")
        .select("created_by")
        .eq("id", roomId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching room creator:", error.message);
        return;
      }

      if (data && data.created_by) {
        setCreatorId(data.created_by === userId && data.created_by);
        setIsCreator(data.created_by === userId);
      }
    };

    checkIsCreator();
  }, [roomId, userId]);


useEffect(() => {
  if (!roomId) return;

  const unsubscribe = listenToRoomUsersChange(roomId, async () => {
    const updatedUsers = await viewUsersInRoom(roomId);
    setUsersInRoom(updatedUsers);
  });

  return () => {
    unsubscribe?.();
  };
}, [roomId]);

  return (
    <>
    {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-[55] transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl transform overflow-hidden z-[60]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
         transition-transform duration-300 ease-in-out w-96 border-r border-gray-200`}
      >
        {/* Header */}

        <SidebarHeader toggleSidebar = {toggleSidebar}/>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Current Room */}
              {roomId && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">Current Room</span>
                  </div>
                  <p className="text-xs text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded">
                    {roomId}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {!roomId && (
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  onClick={() => createRoom(roomId)}
                  disabled={createRoomLoading}
                >
                  {createRoomLoading ? (
                    <BeatLoader color="white" size={8} />
                  ) : (
                    <>
                      
                      <Plus className="w-4 h-4" />
                      Create Room
                    </>
                  )}
                </button>
                )}

                {/* Join Room Section */}
                <div className="space-y-3">
                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    onClick={() => setShowJoinField((prev) => !prev)}
                  >
                    <LogIn className="w-4 h-4" />
                    Join Room
                  </button>
                  
                  {showJoinField && (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                      <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={joinRoomId}
                        onChange={(e) => setJoinRoomId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                      <button
                        onClick={() => joinRoom(joinRoomId, false)}
                        className="w-full bg-green-600 text-white py-2.5 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={joinRoomLoading || !joinRoomId.trim()}
                      >
                        {joinRoomLoading ? (
                          <BeatLoader color="white" size={8} />
                        ) : (
                          "Join"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Leave or Close Room Button */}
                {roomId && (
                <RoomButtons
                  key={roomId}
                  roomId = {roomId}
                  isCreator = {isCreator}
                  closeRoom = {closeRoom}
                  leaveRoom = {leaveRoom}
                  closeRoomLoading = {closeRoomLoading}
                  leaveRoomLoading = {leavingRoomLoading}
                  />
                )}
              </div>

              <hr className="border-gray-200" />

              {/* Users in Room Section */}
              {roomId && (
                <SidebarRoomMembers 
                usersInRoom = {usersInRoom} 
                usersInRoomLoading = {usersInRoomLoading} 
                creatorId = {creatorId}
                isCreator = {isCreator}
                />
              )}

              <hr className="border-gray-200" />

              {/* Closed Rooms Section*/}
              <SidebarClosedRooms 
              closedRooms = {closedRooms} 
              reopenRoomLoading = {reopenRoomLoading}
              reopenRoom = {reopenRoom}
              loadingRooms = {loadingRooms}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title="Unsaved Changes"
          message="You have unsaved changes. What would you like to do?"
          onChoice={handleModalChoice}
        />
      )}
    </>
  );
  
};

export default Sidebar;