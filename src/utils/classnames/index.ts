type booleanObject = { [key: string]: boolean }
type Arguments = Array<string | booleanObject | Arguments>

const classnames = (...arg: Arguments): string => {
    const length = arg.length

    const innerArray = []

    if (length > 0) {
        for (let i = 0; i < length; i++) {
            const item = arg[i]
            if (typeof item === "string") {
                innerArray.push(item)
            }
            if (typeof item === "object") {
                if (Array.isArray(item) && item.length) {
                    innerArray.push(classnames.apply(null, item))
                } else {
                    Object.keys(item).forEach((key) => {
                        if ((item as booleanObject)[key]) {
                            innerArray.push(key)
                        }
                    })
                }
            }
        }
    }

    return innerArray.join(" ")
}

export default classnames