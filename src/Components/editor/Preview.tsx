import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkGfm from "remark-gfm"; 
import rehypeHighlight from "rehype-highlight";
import { useMarkdownContext } from "../../Context/context";

type PreviewProps = { hidden?: boolean };
const Preview: React.FC<PreviewProps> = ({ hidden }) => {
  const {markdown} = useMarkdownContext()
  
  return (
    <>
      <div
        className={`bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl group
          w-full md:w-[50%]
          ${hidden ? 'hidden' : 'block'} md:block`
        }
      >
        <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200 flex items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-200">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="flex gap-3 items-center">
              <h1 className="text-lg font-bold text-gray-800">Live Preview</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Updates in real-time</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative bg-white">
          <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none overflow-y-auto w-full  min-h-[400px] h-96 p-6 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors">
            {markdown ? (
              <ReactMarkdown 
                children={markdown} 
                remarkPlugins={[RemarkGfm]} 
                rehypePlugins={[rehypeHighlight]}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Start Writing</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Your markdown content will appear here as you type. Try writing some headers, lists, or code blocks!
                </p>
              </div>
            )}
          </div>

          {markdown && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l4-4 4 4m0 6l-4-4-4 4" />
              </svg>
              Scroll to explore
            </div>
          )}
        </div>

        <div className="w-full bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-xs text-gray-600 font-medium">
              Rendered with GitHub Flavored Markdown
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs text-green-600 font-medium">Live preview</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;