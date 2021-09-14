import useLocalStorage from "@/customHook/useLocalStorage";

const [getLocalStorage] = useLocalStorage()

interface Data {
    skinStatus: boolean
}

export const SKIN_CHANGE = {
    UPDATE_SKIN_STATUS: "UPDATE_SKIN_STATUS"
}

export const skinChangeReducer = (
    state: Data = {skinStatus: getLocalStorage("skinStatus")},
    action: { type: string, data: Data }
) => {
    const {data, type} = action
    switch (type) {
        case SKIN_CHANGE.UPDATE_SKIN_STATUS:
            return data
        default:
            return state
    }
}

export const updateSkinStatus = (data: Data) => ({
    type: SKIN_CHANGE.UPDATE_SKIN_STATUS,
    data: data
})