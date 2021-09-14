import useLocalStorage from "@/customHook/useLocalStorage";

interface Data {
    noReadNormalMessageNum: number
    noReadImportantMessageNum: number
    noReadNormalMessageDetails: { [key: string]: number }
    noReadImportantMessageDetails: { [key: string]: number }
}

export const NO_READ_MESSAGE = {
    UPDATE_NO_READ_MESSAGE: "UPDATE_NO_READ_MESSAGE"
}

const [getLocalStorage] = useLocalStorage()

export const noReadMessageReducer = (
    state: Data = {
        noReadNormalMessageNum: getLocalStorage("noReadNormalMessageNum"),
        noReadImportantMessageNum: getLocalStorage("noReadImportantMessageNum"),
        noReadNormalMessageDetails: getLocalStorage("noReadNormalMessageDetails"),
        noReadImportantMessageDetails: getLocalStorage("noReadImportantMessageDetails"),
    },
    action: { type: string, data: Data }
) => {
    const {data, type} = action
    switch (type) {
        case NO_READ_MESSAGE.UPDATE_NO_READ_MESSAGE:
            return {...state, ...data}
        default:
            return state
    }
}

export const updateNoReadNormalMessageNum = (num: number) => ({
    type: NO_READ_MESSAGE.UPDATE_NO_READ_MESSAGE,
    data: {
        noReadNormalMessageNum: num
    }
})

export const updateNoReadImportantMessageNum = (num: number) => ({
    type: NO_READ_MESSAGE.UPDATE_NO_READ_MESSAGE,
    data: {
        noReadImportantMessageNum: num
    }
})

export const updateNoReadNormalMessageDetails = (data: Data["noReadNormalMessageDetails"]) => ({
    type: NO_READ_MESSAGE.UPDATE_NO_READ_MESSAGE,
    data: {
        noReadNormalMessageDetails: data
    }
})

export const updateNoReadImportantMessageDetails = (data: Data["noReadImportantMessageDetails"]) => ({
    type: NO_READ_MESSAGE.UPDATE_NO_READ_MESSAGE,
    data: {
        noReadImportantMessageDetails: data
    }
})