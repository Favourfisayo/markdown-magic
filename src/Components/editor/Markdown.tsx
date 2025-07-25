import React, { useEffect, useRef, useState } from "react";
import { useMarkdownContext } from "../../Context/context";
import saveMarkdown from "../../utils/saveMarkdown";
import useRealtimeListener from "../../hooks/useRealtimeListener";
import useRoomActions from "../../hooks/useRoomActions";
import { useMarkdownActions } from "../../hooks/useMarkdownActions";
type MarkdownProps = {
  roomId?: string ;
  hidden?: boolean;
};

const Markdown: React.FC<MarkdownProps> = ({ roomId, hidden }) => {
  const { markdown, setMarkdown, textareaRef, userId } = useMarkdownContext();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const inputTypeRef = useRef<string | null>(null);
  const inputDataRef = useRef<string | null>(null);

  const {listenToCollabDocs, listenToRoomUserStatus } = useRealtimeListener();
  const {fetchRoomContent, updateRoomContent} = useRoomActions()
  const { handlePaste, handleBacktickInsertion, focusCursorPosition } = useMarkdownActions({
  markdown,
  setMarkdown,
  isFocused,
  setIsFocused,
  inputTypeRef,
  inputDataRef,
  }
  )
  const saveToLocalStorage = saveMarkdown()

  const updateMarkdown = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputEvent = e.nativeEvent as InputEvent;
    inputTypeRef.current = inputEvent.inputType;
    inputDataRef.current = inputEvent.data;
    const value = e.target.value;
    setMarkdown(value);

    if (roomId) {
      updateRoomContent(value, roomId);
    }
  };

  // const calculateCursorPosition = (lines: string[]): number => {
  //   for (let i = 0; i < lines.length; i++) {
  //     if (lines[i].trim().startsWith("```") && lines[i + 2]?.trim() === "```") {
  //       return lines.slice(0, i + 1).join("\n").length + 1;
  //     }
  //   }
  //   return markdown.length;
  // };

  // const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
  //   e.preventDefault();
  //   let pastedText = e.clipboardData.getData("text");
  //   const { selectionStart, selectionEnd } = e.currentTarget;

  //   if (!pastedText) return;

  //   const updatedText = handleCodeBlockInsertion(pastedText);
  //   const before = markdown.slice(0, selectionStart);
  //   const after = markdown.slice(selectionEnd);
  //   const newMarkdown = before + updatedText + after;

  //   setMarkdown(newMarkdown);
  // };

  // const handleCodeBlockInsertion = (pastedText: string): string => {
  //   const backtickMatches = pastedText.match(/^```/gm);
  //   const backtickCount = backtickMatches ? backtickMatches.length : 0;
  //   const needsClosing = backtickCount % 2 !== 0;

  //   if (needsClosing) {
  //     const pastedTextArray = pastedText.split("\n");
  //     let codeStartIndex = -1;
  //     let codeEndIndex = -1;

  //     for (let i = 0; i < pastedTextArray.length; i++) {
  //       const line = pastedTextArray[i].trim();
  //       if (line.startsWith("```")) {
  //         codeStartIndex = i;
  //         continue;
  //       }
  //       if (codeStartIndex !== -1 && codeEndIndex === -1) {
  //         if (
  //           line.startsWith("#") ||
  //           line.startsWith("-") ||
  //           line.startsWith("**") ||
  //           line.startsWith("*") ||
  //           /^[A-Z]/.test(line)
  //         ) {
  //           codeEndIndex = i;
  //           break;
  //         }
  //       }
  //     }

  //     if (codeEndIndex === -1) codeEndIndex = pastedTextArray.length;
  //     if (codeStartIndex !== -1 && codeEndIndex !== -1) {
  //       pastedTextArray.splice(codeEndIndex, 0, "```");
  //       return pastedTextArray.join("\n");
  //     }
  //   }

  //   return pastedText;
  // };

  // const handleBacktickInsertion = () => {
  //   let backTicksCount = 0;
  //   let lastTickLine = -1;
  //   const lines = markdown.split("\n");

  //   lines.forEach((line: string, index: number) => {
  //     if (line.trim().startsWith("```")) {
  //       backTicksCount += 1;
  //       lastTickLine = index;
  //     }
  //   });

  //   if (backTicksCount % 2 !== 0) {
  //     if (inputTypeRef.current === "insertText" && inputDataRef.current === "`") {
  //       lines.splice(lastTickLine + 1, 0, "", "```");
  //       setMarkdown(lines.join("\n"));
  //       setIsFocused(true);
  //     }
  //   }
  // };


  // const focusCursorPosition = () => {
  //   if (isFocused && textareaRef.current) {
  //     const lines = markdown.split("\n");
  //     const position = calculateCursorPosition(lines);

  //     textareaRef.current.focus();
  //     textareaRef.current.setSelectionRange(position, position);
  //     setIsFocused(false);
  //   }
  // };


  useEffect(() => saveToLocalStorage(roomId, markdown), [markdown]);
  useEffect(() => setCharacterCount(markdown.length), [markdown])
  useEffect(focusCursorPosition, [isFocused, markdown]);
  useEffect(handleBacktickInsertion, [markdown]);

  useEffect(() => {
  if (roomId) fetchRoomContent(roomId);
  }, [roomId]);

  useEffect(() => {
    if (roomId) listenToCollabDocs(roomId);
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = listenToRoomUserStatus(roomId, userId);
    return unsubscribe
  }, [roomId, userId]);

return (
  <div
    className={`bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl group
      w-full md:w-[50%]
      ${hidden ? 'hidden' : 'block'} md:block`
    }
  >
    {/* Header */}
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Markdown Editor</h1>
          {roomId && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 font-mono">Room: {roomId.slice(0, 8)}...</span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="flex-1 min-h-0 relative ">
      <textarea
        ref={textareaRef}
        className="w-full  min-h-[400px] h-96 bg-white p-6 border-none resize-none outline-none text-gray-800 leading-relaxed font-mono text-sm placeholder-gray-400 focus:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:ring-inset"
        placeholder="Start writing your markdown here...
          # Welcome to Markdown Editor
          - Write **bold** and *italic* text  
          - Create [links](https://example.com)
          - Add `code blocks` and more!

          ```javascript
          console.log('Hello, World!');
          ```"
        onChange={updateMarkdown}
        value={markdown}
        onPaste={handlePaste}
      />
      
      {markdown && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {Math.ceil(markdown.split(' ').length / 250)} min read
        </div>
      )}
    </div>

    <div className="w-full bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 flex justify-between items-center px-4 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
          </svg>
          <p className="text-xs text-gray-600 font-medium">
            {characterCount.toLocaleString()} characters
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7z" />
          </svg>
          <p className="text-xs text-gray-600 font-medium">
            {markdown.trim().split(/\s+/).filter(word => word.length > 0).length} words
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <p className="text-xs text-emerald-600 font-medium">Auto-saved</p>
      </div>
    </div>
  </div>
);
};

export default Markdown;