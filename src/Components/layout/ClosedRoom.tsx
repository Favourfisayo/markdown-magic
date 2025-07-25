import { Calendar } from "lucide-react"
import { BeatLoader } from "react-spinners"

const ClosedRoom = ({room, reopenRoom, reopenRoomLoading}: {
    room: any
    reopenRoom: (roomId: string | undefined) => void
    reopenRoomLoading: boolean
}) => {
  return (
    <>
    <div
        key={room.id}
        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
    >
        <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 text-sm mb-1 font-mono">
        {room.id}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
        <Calendar className="w-3 h-3" />
        Closed: {new Date(room.updated_at || room.created_at).toLocaleDateString()}
        </div>
        </div>
        <button
        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => reopenRoom(room.id)}
        disabled={reopenRoomLoading}
        >
        {reopenRoomLoading ? (
        <BeatLoader color="#16a34a" size={6} />
        ) : (
        "Reopen"
        )}
        </button>
        </div>
    </div>
</>
  )
}

export default ClosedRoom