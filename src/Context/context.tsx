import { useContext } from "react";
import { MarkdownContext, MarkdownContextType } from "../App";
export const useMarkdownContext = (): MarkdownContextType => {
    const context = useContext(MarkdownContext);
    if (!context) {
      throw new Error('useMarkdownContext must be used within a MarkdownProvider');
    }
    return context;
  };
  