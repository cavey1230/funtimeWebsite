export const getMarkDownContent = (content: string) => {
    const result = content.replace(/<.+?>/g, "")
        .match(/[\u4e00-\u9fa5,.，A-Za-z]+/g)
    return (result && result.length > 0) ? result.join(",") + "..." : content
}