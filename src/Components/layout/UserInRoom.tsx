import { Calendar, Crown, UserMinus } from "lucide-react"

const UserInRoom = ({user, creatorId, isCreator}: {user: any, creatorId: string | null, isCreator: boolean}) => {
  return (
    <>
    <div
    key={user.user_id}
    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
    >
    <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-gray-900 truncate">
        {user.email}
        </span>
        {user.user_id === creatorId && (
        <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0"  />
        )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
        <Calendar className="w-3 h-3" />
        Joined: {new Date(user.joined_at).toLocaleDateString()}
        </div>
        </div>
        
        {/* Only show Remove button if current user is creator and this user is not the creator */}
        {isCreator && user.user_id !== creatorId && (
        <button
            className="ml-3 bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg transition-colors duration-200 flex-shrink-0"
            onClick={() => console.log(`Remove user: ${user.user_id}`)}
            title="Remove user"
        >
            <UserMinus className="w-4 h-4" />
        </button>
        )}
    </div>
    </div>
</>
  )
}

export default UserInRoom