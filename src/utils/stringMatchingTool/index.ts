export const matchSpecialSymbol = (str: string) => {
    return str.match(/((?=[\x21-\x7e]+)[^A-Za-z0-9\x40\x2E\x20\x2c])/g)?.length
}

export const getMarkDownContent = (content: string) => {
    const result = content.replace(/<.+?>/g, "")
        .match(/[\u4e00-\u9fa5,.，A-Za-z]+/g)
    return (result && result.length > 0) ? result.join(",") + "..." : content
}