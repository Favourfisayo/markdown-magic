import { Settings } from "lucide-react"
const SidebarButton = ({toggleSidebar, isOpen}: {toggleSidebar:any, isOpen: boolean}) => {
  return (
    <button
        onClick={() => toggleSidebar()}
        className=" bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 z-[58] group"
        aria-label="Open settings sidebar"
      >
        <Settings 
          strokeWidth={1.5} 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'group-hover:rotate-12'}`}
        />
      </button>
  )
}

export default SidebarButton