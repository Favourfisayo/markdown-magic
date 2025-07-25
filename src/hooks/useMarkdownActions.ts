import { RefObject } from "react";
import { useMarkdownContext } from "../Context/context";
export interface UseMarkdownActionsParams {
  markdown: string;
  setMarkdown: (md: string) => void;
  isFocused: boolean;
  setIsFocused: (val: boolean) => void;
  inputTypeRef: RefObject<string | null>;
  inputDataRef: RefObject<string | null>;
};

export function useMarkdownActions({
  markdown,
  setMarkdown,
  isFocused,
  setIsFocused,
  inputTypeRef,
  inputDataRef,
}: UseMarkdownActionsParams) {
const {textareaRef} = useMarkdownContext()
  const calculateCursorPosition = (lines: string[]): number => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("```") && lines[i + 2]?.trim() === "```") {
        return lines.slice(0, i + 1).join("\n").length + 1;
      }
    }
    return markdown.length;
  };

  const focusCursorPosition = () => {
    if (isFocused && textareaRef.current) {
      const lines = markdown.split("\n");
      const position = calculateCursorPosition(lines);

      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(position, position);
      setIsFocused(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    let pastedText = e.clipboardData.getData("text");
    const { selectionStart, selectionEnd } = e.currentTarget;

    if (!pastedText) return;

    const updatedText = handleCodeBlockInsertion(pastedText);
    const before = markdown.slice(0, selectionStart);
    const after = markdown.slice(selectionEnd);
    const newMarkdown = before + updatedText + after;

    setMarkdown(newMarkdown);
  };

  const handleCodeBlockInsertion = (pastedText: string): string => {
    const backtickMatches = pastedText.match(/^```/gm);
    const backtickCount = backtickMatches ? backtickMatches.length : 0;
    const needsClosing = backtickCount % 2 !== 0;

    if (needsClosing) {
      const pastedTextArray = pastedText.split("\n");
      let codeStartIndex = -1;
      let codeEndIndex = -1;

      for (let i = 0; i < pastedTextArray.length; i++) {
        const line = pastedTextArray[i].trim();
        if (line.startsWith("```")) {
          codeStartIndex = i;
          continue;
        }
        if (codeStartIndex !== -1 && codeEndIndex === -1) {
          if (
            line.startsWith("#") ||
            line.startsWith("-") ||
            line.startsWith("**") ||
            line.startsWith("*") ||
            /^[A-Z]/.test(line)
          ) {
            codeEndIndex = i;
            break;
          }
        }
      }

      if (codeEndIndex === -1) codeEndIndex = pastedTextArray.length;
      if (codeStartIndex !== -1 && codeEndIndex !== -1) {
        pastedTextArray.splice(codeEndIndex, 0, "```");
        return pastedTextArray.join("\n");
      }
    }

    return pastedText;
  };

  const handleBacktickInsertion = () => {
    let backTicksCount = 0;
    let lastTickLine = -1;
    const lines = markdown.split("\n");

    lines.forEach((line: string, index: number) => {
      if (line.trim().startsWith("```")) {
        backTicksCount += 1;
        lastTickLine = index;
      }
    });

    if (backTicksCount % 2 !== 0) {
      if (inputTypeRef.current === "insertText" && inputDataRef.current === "`") {
        lines.splice(lastTickLine + 1, 0, "", "```");
        setMarkdown(lines.join("\n"));
        setIsFocused(true);
      }
    }
  };

  return {
    focusCursorPosition,
    handlePaste,
    handleBacktickInsertion,
  };
}