import { X } from "lucide-react"
const SidebarHeader = ({toggleSidebar}: {toggleSidebar: () => void}) => {
  return (
    <>
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Room Settings</h1>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-white hover:text-black hover:bg-opacity-20 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <X strokeWidth={1.5} className="w-5 h-5"/>
            </button>
          </div>
    </div>
    </>
  )
}

export default SidebarHeader