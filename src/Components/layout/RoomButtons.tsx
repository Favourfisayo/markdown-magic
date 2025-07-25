import { BeatLoader } from "react-spinners"
import { UserMinus } from "lucide-react"
const RoomButtons = ({
    roomId, 
    isCreator, 
    closeRoom, 
    leaveRoom,
    closeRoomLoading,
    leaveRoomLoading
} : {
    roomId: string,
    isCreator: boolean,
    closeRoom: (roomId: string) => void
    leaveRoom: (roomId: string) => void
    closeRoomLoading: boolean
    leaveRoomLoading: boolean
}) => {
  return (
    <>
        <button
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        onClick={isCreator ? () => closeRoom(roomId) : () => leaveRoom(roomId)}
        disabled={closeRoomLoading || leaveRoomLoading}
        >
        {closeRoomLoading || leaveRoomLoading ? (
        <BeatLoader color="white" size={8} />
        ) : (
        <>
            <UserMinus className="w-4 h-4" />
            {isCreator ? "Close Room" : "Leave Room"}
        </>
        )}
      </button>
    </>
  )
}

export default RoomButtons