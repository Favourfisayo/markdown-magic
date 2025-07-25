import UserInRoom from "./UserInRoom"
import { Users } from "lucide-react"
import { BeatLoader } from "react-spinners"
const SidebarRoomMembers = ({
    usersInRoom,
    usersInRoomLoading,
    creatorId,
    isCreator
}: {
    usersInRoom: any[] | undefined,
    usersInRoomLoading: boolean,
    creatorId: string | null,
    isCreator: boolean
}) => {
  return (
    <>
    <div className="space-y-4">
        <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Room Members</h3>
        </div>
        
        {usersInRoomLoading ? (
        <div className="flex justify-center py-8">
            <BeatLoader color="#3b82f6" size={8} />
        </div>
        ) : usersInRoom && usersInRoom.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto">
            {usersInRoom.map((user, i) => (
            <UserInRoom key={i} user = {user} creatorId = {creatorId} isCreator = {isCreator}/>
            ))}
        </div>
        ) : (
        <div className="text-center text-gray-500 py-8">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users in this room</p>
        </div>
        )}
    </div>
    </>
  )
}

export default SidebarRoomMembers