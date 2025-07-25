import ClosedRoom from "./ClosedRoom"
import { Settings } from "lucide-react"
import { BeatLoader } from "react-spinners"
const SidebarClosedRooms = ({
    closedRooms,
    reopenRoomLoading,
    reopenRoom,
    loadingRooms
}: {
    closedRooms: any[]
    reopenRoomLoading: boolean
    reopenRoom: (roomId: string | undefined) => void
    loadingRooms: boolean
}) => {
  return (
    <>
    <div className="space-y-4 pb-6">
    <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Your Closed Rooms</h2>
    </div>
    
    {loadingRooms ? (
        <div className="flex justify-center py-8">
        <BeatLoader color="#3b82f6" size={8} />
        </div>
    ) : closedRooms.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Settings className="w-6 h-6 opacity-50" />
        </div>
        <p className="text-sm">No closed rooms found</p>
        </div>
    ) : (
        <div className="space-y-3">
        {closedRooms.map((room, i) => (
            <ClosedRoom key={i} room = {room} reopenRoomLoading = {reopenRoomLoading} reopenRoom = {reopenRoom}/>
        ))}
        </div>
    )}
    </div>
    </>
  )
}

export default SidebarClosedRooms