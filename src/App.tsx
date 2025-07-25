import EditorPage from "./pages/EditorPage";
import 'highlight.js/styles/github.css';
import React, { createContext, useState, useRef} from "react"
import { Routes, Route } from "react-router"
import { Toaster } from "react-hot-toast";
import AuthPage from "./pages/AuthPage";
import NotFound from "./Components/layout/NotFound";
import ProtectedLayout from "./Components/layout/ProtectedLayout";
import RoomEditor from "./pages/RoomEditor";
import ErrorFallback from "./Components/layout/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

export type MarkdownContextType = {
  markdown: string
  setMarkdown: React.Dispatch<React.SetStateAction<string>>
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  channelRef: React.RefObject<any>
  isOpen: boolean
  userId: string | null
  setUserId: React.Dispatch<React.SetStateAction<string | null>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
}

export const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined)

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(localStorage.getItem("markdown") || "")
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const channelRef = useRef<any>(null)

  const toggleSidebar = () => {
  setIsOpen((prev) => !prev);
};

  const contextValue: MarkdownContextType = {
    markdown,
    setMarkdown,
    textareaRef,
    channelRef,
    isOpen,
    setIsOpen,
    userId,
    setUserId,
    toggleSidebar,
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
      />
      <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      >
      <MarkdownContext.Provider value={contextValue}>
      <Routes>
      <Route path="/login" element={<AuthPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<EditorPage />} />
        <Route path="/room/:roomId" element={<RoomEditor />} />
      </Route>

      <Route path="*" element={<NotFound isRoom={false} />} />
    </Routes>
      </MarkdownContext.Provider>
      </ErrorBoundary>
    </>
  )
}

export default App