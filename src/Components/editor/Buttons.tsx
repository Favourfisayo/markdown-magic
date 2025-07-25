import { useMarkdownContext } from "../../Context/context";
import remarkHtml from "remark-html";
import { remark } from "remark";
import { JSX } from "react";

const Buttons = () => {
    const {textareaRef, markdown, setMarkdown} = useMarkdownContext()
    const buttons: string[] = ["Bold", "Italic", "Heading", "Link", "Image", "List", "Code", "Clear", "Copy HTML"];
    
    const handleSelectedText = (e: any) => {
        const start:number | undefined = textareaRef.current?.selectionStart
        const end: number | undefined = textareaRef.current?.selectionEnd
        let selectedText = markdown.slice(start, end)
        const beforeText = markdown.slice(0, start)
        const afterText = markdown.slice(end)

        const copyHTMLToClipboard = () => {
            const htmlContent = markdownToHTML(markdown)
            navigator.clipboard.writeText(htmlContent)
            .then(() => alert("HTML Copied Successfully"))
            .catch((err) => console.error("Failed to copy: ", err))
        }

        const markdownToHTML = (markdown: string) => {
            const markdownParser = remark().use(remarkHtml)
            return markdownParser.processSync(markdown).toString() 
        }

        switch(e?.target?.getAttribute("id")) {
            case "Bold":
                if(!selectedText) return
                if(selectedText.trim().startsWith("**") && selectedText.trim().endsWith("**")) {
                    selectedText = selectedText.trim().slice(2,  -2)
                } else {
                    selectedText  = "**".concat(selectedText.trim()).concat("**")
                }
                break
            case "Italic":
                if(!selectedText) return
                if(selectedText.trim().startsWith("*") && selectedText.trim().endsWith("*") && !selectedText.trim().startsWith("**") && !selectedText.trim().endsWith("**")) {
                    selectedText = selectedText.trim().slice(1, -1)
                } else {
                    selectedText = "*".concat(selectedText.trim()).concat("*").replace(/\n/g, ' ').trim()
                }
                break
            case "Heading":
                if(!selectedText) return
                if(selectedText.trim().startsWith("#")) {
                    selectedText = selectedText.trim().slice(1)
                } else {
                    selectedText = "# ".concat(selectedText.trim()).replace(/\n/g, ' ').trim()
                }
                break

            case "Code":
                if(!selectedText) return
                const language:string | null = prompt("Enter a language: ")
                if(!language) return
                selectedText = "```".concat(language).concat("\n").concat(selectedText).concat("\n```")
                break
            case "List":
                if(!selectedText) return
                selectedText = selectedText.split("\n").map((line) => {
                    if(line !== "" && !(line.startsWith("-"))) {
                        return `- ${line}`
                    } else {
                        return line.slice(1)
                    }
                }).join("\n")
                break
            case "Clear":
                if (!selectedText) return
                selectedText = ""
                textareaRef.current?.focus()
                break
            case "Copy HTML":
                if(markdown === "") return
                copyHTMLToClipboard()
                break
            case "Link":
                let linkURL: string | null = prompt("Enter the URL:")
                if (!linkURL) return
                if (!linkURL.startsWith("http://") && !linkURL.startsWith("https://")) {
                    linkURL = "https://" + linkURL
                }
                if (!selectedText) {
                    selectedText = `[Link Text](${linkURL})` // Default text if no selection
                } else {
                    selectedText = `[${selectedText.trim()}](${linkURL})`
                }
                break    
        }
        const newMarkdownText = beforeText.concat(selectedText).concat(afterText)
        setMarkdown(newMarkdownText)
    }

    const saveAsMD = () => {
        if(markdown !== "") {
        const blob = new Blob([markdown], {type: "text/markdown"})
        const url  = URL.createObjectURL(blob)
        const downloadLink = document.createElement("a")
        downloadLink.href = url
        downloadLink.download = "markdown-file.md"
        downloadLink.click()
        
        URL.revokeObjectURL(url)
        }
    }

    const handleUpload = (file:File | null) => {
        if(!file) return
        const reader = new FileReader()
        reader.readAsText(file)
        reader.addEventListener("load", () => {
            const content =  reader.result as string
           setMarkdown(content as string)
        })
    }

    // Helper function to get button icons
    const getButtonIcon = (buttonName: string) => {
        const iconMap: { [key: string]: JSX.Element } = {
            Bold: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>,
            Italic: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4l4 16m-4-8h8" /></svg>,
            Heading: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>,
            Link: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
            Image: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
            List: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
            Code: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
            Clear: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
            "Copy HTML": <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        };
        return iconMap[buttonName] || null;
    };

    return ( 
        <>
            <div className="bg-white  rounded-2xl border border-gray-200 p-4 mb-4">
                {/* Toolbar Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-xl">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1 2 2 0 012-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Formatting Tools</h2>
                        <p className="text-xs text-gray-500">Select text and click to format</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {buttons.map((button, index) => (
                        <button 
                            onClick={(e) => handleSelectedText(e)} 
                            key={index} 
                            id={button} 
                            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-500 hover:to-blue-600 text-blue-700 hover:text-white font-medium text-sm rounded-xl px-4 py-2.5 h-auto transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105 border border-blue-200 hover:border-blue-500"
                        >
                            {getButtonIcon(button)}
                            {button}
                        </button>
                    ))}

                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    {/* File Operations */}
                    <button 
                        onClick={saveAsMD} 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium text-sm rounded-xl px-4 py-2.5 h-auto transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Save as MD
                    </button>

                    <label 
                        htmlFor="md-file" 
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium text-sm rounded-xl px-4 py-2.5 h-auto cursor-pointer transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload MD File
                    </label>
                    <input 
                        onChange={(e:any) => handleUpload(e.target.files[0])} 
                        id="md-file" 
                        type="file" 
                        accept=".md" 
                        className="hidden"
                    />
                </div>
            </div>
        </>
    )
}

export default Buttons