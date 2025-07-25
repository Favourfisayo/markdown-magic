import Buttons from "../Components/editor/Buttons";
import Markdown from "../Components/editor/Markdown";
import Preview from "../Components/editor/Preview";
import Sidebar from "../Components/editor/Sidebar";
import { useParams, useNavigate } from "react-router";
import { useMarkdownContext } from "../Context/context";
import FullPageLoader from "../Components/layout/FullPageLoader";
import NotFound from "../Components/layout/NotFound";
import { supabase } from "../lib/SupabaseClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useRealtimeListener from "../hooks/useRealtimeListener";

const RoomEditor = () => {
  const { roomId } = useParams();
  const [roomExists, setRoomExists] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'markdown' | 'preview'>("markdown");
  const {userId} = useMarkdownContext()
  const navigate = useNavigate()
  const {listenToRoomClosure} = useRealtimeListener()

useEffect(() => {
  let unsubscribe: (() => void) | undefined;

  const setupListener = async () => {
    unsubscribe = await listenToRoomClosure(roomId, userId, navigate);
  };

  setupListener();

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [roomId, userId]); 


useEffect(() => {
  const checkRoom = async () => {
    if (!roomId) return;

    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("id, is_closed")
        .eq("id", roomId)
        .maybeSingle();

      if (error || !data) {
        setRoomExists(false);
      } else if (data.is_closed) {
        toast.error("Room is closed");
        navigate("/");
      } else {
        setRoomExists(true);
      }
    } catch (err) {
      console.error("Failed to check room:", err);
      setRoomExists(false);
    } finally {
      setChecking(false);
    }
  };

  checkRoom();
}, [roomId]);


if (checking || roomExists === null) return <FullPageLoader />;
if (!roomExists) return <NotFound isRoom={true} />;
  return (
    <>
      <div className="flex flex-col gap-4">
        <Sidebar roomId={roomId}/>
        <Buttons />
        <div className="flex md:hidden justify-center gap-2 px-4">
          <button
            className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${activeTab === 'markdown' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setActiveTab('markdown')}
          >
            Markdown
          </button>
          <button
            className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${activeTab === 'preview' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-2 px-4 min-h-[70vh]">
          <Markdown hidden={activeTab !== 'markdown'} />
          <Preview hidden={activeTab !== 'preview'} />
        </div>
      </div>
    </>
  );
};

export default RoomEditor;