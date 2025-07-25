const saveMarkdown = () => {
    const saveToLocalStorage = (roomId: string | undefined | null, markdown: string) => {
        if(!roomId) {
        localStorage.setItem("markdown", markdown);
        }
    };

    return saveToLocalStorage
}

export default saveMarkdown 